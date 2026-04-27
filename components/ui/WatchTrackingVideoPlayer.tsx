'use client';

import React, { useEffect, useState, useRef } from 'react';
import UniversalVideoPlayer, { UniversalVideoPlayerHandle } from './UniversalVideoPlayer';
import { useWatchProgress } from '@/hooks/useWatchProgress';

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
  onProgressUpdate?: (progress: number, currentTime: number) => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  onSkip?: () => void;
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

    // Get userId from localStorage if not provided
    useEffect(() => {
      if (!userId) {
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
          setLocalUserId(storedUserId);
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
    );
  }
);

WatchTrackingVideoPlayer.displayName = 'WatchTrackingVideoPlayer';

export default WatchTrackingVideoPlayer;
