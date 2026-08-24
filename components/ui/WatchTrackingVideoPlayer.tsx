'use client';

import React, { useEffect, useState, useRef } from 'react';
import UniversalVideoPlayer, { UniversalVideoPlayerHandle } from './UniversalVideoPlayer';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import { getUserId } from '@/lib/api-client';
import { useConcurrentSessions } from '@/hooks/useConcurrentSessions';

// For backward compatibility
export type VideoPlayerHandle = UniversalVideoPlayerHandle;

interface WatchTrackingVideoPlayerProps {
  src: string;
  contentId: string;
  contentType?: 'movie' | 'episode';
  userId?: string;
  autoResume?: boolean;
  poster?: string;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  className?: string;
  crossOrigin?: string;
  showSkip?: boolean;
  showPrevious?: boolean;
  onPrevious?: () => void;
  onProgressUpdate?: (progress: number, currentTime: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onSkip?: () => void;
  onFullscreenRequest?: () => void;
  showMinimize?: boolean;
  onMinimize?: () => void;
  subtitles?: {
      language: string;
      label: string;
      url: string;
  }[];
}

const WatchTrackingVideoPlayer = React.forwardRef<
  UniversalVideoPlayerHandle,
  WatchTrackingVideoPlayerProps
>(
  ({
    contentId,
    contentType = 'movie',
    userId,
    autoResume = true,
    onProgressUpdate,
    src,
    onTimeUpdate,
    onEnded,
    ...videoPlayerProps
  }, ref) => {
    const [localUserId, setLocalUserId] = useState<string | undefined>(userId);
    const videoPlayerRef = useRef<UniversalVideoPlayerHandle>(null);
    const hasResumedRef = useRef(false);

    const { updateProgress, resumeFromSavedProgress, markAsFinished } = useWatchProgress({
      userId: localUserId,
      contentId,
      contentType,
    });

    const { isExceeded, limit } = useConcurrentSessions({
      contentId,
      contentType,
      enabled: !!localUserId,
    });

    // Pause player immediately when screens limit exceeded
    useEffect(() => {
      if (isExceeded) {
        try {
          videoPlayerRef.current?.pause();
        } catch (e) {
          console.error('Failed to pause video on screen limit exceeded:', e);
        }
      }
    }, [isExceeded]);

    // Get userId from localStorage if not provided
    useEffect(() => {
      if (!userId) {
        const id = getUserId();
        if (id) {
          setLocalUserId(id);
        }
      } else {
        setLocalUserId(userId);
      }
    }, [userId]);

    // Auto-resume from saved progress
    useEffect(() => {
      if (autoResume && localUserId && contentId && !hasResumedRef.current) {
        hasResumedRef.current = true;
        
        resumeFromSavedProgress().then((savedTime) => {
          // For native videos only
          if (savedTime > 0 && videoPlayerRef.current?.videoElement) {
            try {
              videoPlayerRef.current.videoElement.currentTime = savedTime;
            } catch (e) {
              console.log('Could not set video time (may be YouTube):', e);
            }
          }
        });
      }
    }, [autoResume, localUserId, contentId, resumeFromSavedProgress]);

    const handleTimeUpdate = (currentTime: number, duration: number) => {
      // Update progress (debounced by the hook)
      updateProgress(currentTime, duration);

      // Call user's callback if provided
      onTimeUpdate?.(currentTime, duration);

      // Calculate and emit progress percentage
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;
      onProgressUpdate?.(progressPercent, currentTime);
    };

    const handleEnded = () => {
      // Mark video as finished (100% progress)
      if (videoPlayerRef.current?.videoElement) {
        const videoElement = videoPlayerRef.current.videoElement;
        if (videoElement.duration) {
          markAsFinished(videoElement.duration);
        }
      }

      // Call user's callback if provided
      onEnded?.();
    };

    // Merge refs - support both internal ref and external ref
    useEffect(() => {
      if (ref) {
        if (typeof ref === 'function') {
          ref(videoPlayerRef.current);
        } else {
          ref.current = videoPlayerRef.current;
        }
      }
    }, [ref]);

    return (
      <div className="relative w-full h-full min-h-[inherit]">
        <UniversalVideoPlayer
          ref={videoPlayerRef}
          src={src}
          contentId={contentId}
          contentType={contentType}
          userId={localUserId}
          {...videoPlayerProps}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleEnded}
        />
        {isExceeded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-6 text-center text-white">
            <div className="max-w-md space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center mx-auto shadow-inner border border-red-500/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 animate-pulse">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m0-10.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.249-8.25-3.286zm0 13.036h.008v.008H12v-.008z" />
                </svg>
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black uppercase tracking-tight text-white">Too Many Active Screens</h2>
                <p className="text-white/60 text-sm leading-relaxed">
                  Your subscription plan supports up to <span className="text-cyan-400 font-bold">{limit} concurrent screens</span>. You are already watching on other devices. Please close other active playback windows or upgrade your plan to continue watching.
                </p>
              </div>
              <div className="flex gap-4 justify-center pt-2">
                <button
                  onClick={() => window.location.href = '/'}
                  className="px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all border border-white/10 active:scale-95"
                >
                  Go Home
                </button>
                <button
                  onClick={() => window.location.href = '/pricing'}
                  className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white rounded-xl font-bold text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                >
                  Upgrade Plan
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }
);

WatchTrackingVideoPlayer.displayName = 'WatchTrackingVideoPlayer';

export default WatchTrackingVideoPlayer;
