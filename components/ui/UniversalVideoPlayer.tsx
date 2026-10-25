'use client';

import React, { useRef, useImperativeHandle, forwardRef } from 'react';
import { Play, X } from 'lucide-react';
import { getVideoType, getYouTubeVideoId, getRumbleEmbedUrl } from '@/lib/video-utils';
import VideoPlayer, { VideoPlayerHandle, VideoPlayerProps } from './VideoPlayer';
import YouTubePlayer, { YouTubePlayerHandle } from './YouTubePlayer';
import RumblePlayer, { RumblePlayerHandle } from './RumblePlayer';

export interface UniversalVideoPlayerHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  requestFullScreen: () => void;
  seek?: (time: number) => void;
  restartPlayback?: () => void;
  videoElement?: HTMLVideoElement | null;
}

interface UniversalVideoPlayerProps extends Omit<VideoPlayerProps, 'src'> {
  src: string;
  contentId?: string;
  contentType?: 'movie' | 'episode' | 'interactive_movie' | 'short';
  userId?: string;
  onProgressUpdate?: (progress: number, currentTime: number) => void;
  maxQualityHeight?: number;
}

const UniversalVideoPlayer = forwardRef<UniversalVideoPlayerHandle, UniversalVideoPlayerProps>(
  (
    {
      src,
      contentId = 'video',
      contentType = 'movie',
      userId,
      onProgressUpdate,
      onTimeUpdate,
      onEnded,
      ...rest
    },
    ref
  ) => {
    const nativePlayerRef = useRef<VideoPlayerHandle>(null);
    const youtubePlayerRef = useRef<YouTubePlayerHandle>(null);
    const rumblePlayerRef = useRef<RumblePlayerHandle>(null);
    const videoType = getVideoType(src);

    const handleTimeUpdate = (currentTime: number, duration: number) => {
      const progress = duration ? (currentTime / duration) * 100 : 0;
      onProgressUpdate?.(progress, currentTime);
      onTimeUpdate?.(currentTime, duration);
    };

    useImperativeHandle(ref, () => ({
      play: () => {
        if (videoType === 'youtube') {
          youtubePlayerRef.current?.play?.();
        } else if (videoType === 'rumble') {
          rumblePlayerRef.current?.play?.();
        } else {
          nativePlayerRef.current?.play?.();
        }
      },
      pause: () => {
        if (videoType === 'youtube') {
          youtubePlayerRef.current?.pause?.();
        } else if (videoType === 'rumble') {
          rumblePlayerRef.current?.pause?.();
        } else {
          nativePlayerRef.current?.pause?.();
        }
      },
      togglePlay: () => {
        if (videoType === 'youtube') {
          youtubePlayerRef.current?.togglePlay?.();
        } else {
          nativePlayerRef.current?.togglePlay?.();
        }
      },
      requestFullScreen: () => {
        if (videoType === 'youtube') {
          youtubePlayerRef.current?.requestFullScreen?.();
        } else if (videoType === 'rumble') {
          rumblePlayerRef.current?.requestFullScreen?.();
        } else {
          nativePlayerRef.current?.requestFullScreen?.();
        }
      },
      seek: (time: number) => {
        if (videoType === 'native' && nativePlayerRef.current?.videoElement) {
          nativePlayerRef.current.videoElement.currentTime = time;
        } else if (videoType === 'youtube') {
          (youtubePlayerRef.current as any)?.seek?.(time);
        }
      },
      restartPlayback: () => {
        if (videoType === 'native' && nativePlayerRef.current?.videoElement) {
          nativePlayerRef.current.videoElement.currentTime = 0;
          nativePlayerRef.current.videoElement.play().catch(() => {});
        } else if (videoType === 'youtube') {
          (youtubePlayerRef.current as any)?.seek?.(0);
          youtubePlayerRef.current?.play?.();
        } else {
          nativePlayerRef.current?.play?.();
        }
      },
      videoElement: videoType === 'native' ? nativePlayerRef.current?.videoElement : null,
    }));

    if (videoType === 'youtube') {
      const videoId = getYouTubeVideoId(src);
      if (!videoId) {
        return (
          <div className="w-full h-full flex items-center justify-center bg-black text-red-500">
            <p>Invalid YouTube URL</p>
          </div>
        );
      }

      return (
        <YouTubePlayer
          ref={youtubePlayerRef}
          videoId={videoId}
          title={rest.title}
          metadata={rest.metadata}
          contentType={contentType}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          maxQualityHeight={rest.maxQualityHeight}
          {...rest}
        />
      );
    }

    if (videoType === 'rumble') {
      return (
        <RumblePlayer
          ref={rumblePlayerRef}
          src={src}
          title={rest.title || contentId}
          metadata={rest.metadata}
          onClose={rest.onClose}
          showControls={rest.showControls}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          {...rest}
        />
      );
    }

    if (videoType === 'iframe') {
      return (
        <div className="relative w-full h-full bg-black group select-none overflow-hidden">
          <iframe
            src={src}
            className="w-full h-full border-none"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
            allowFullScreen
            title={rest.title || contentId}
          />
          {rest.showControls !== false && (rest.title || rest.onClose) && (
            <div className="absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-auto">
              <div className="bg-black/60 backdrop-blur-md border border-white/15 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl max-w-[70%] sm:max-w-md">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                  <Play size={13} fill="white" className="ml-0.5 text-white" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight truncate">
                    {rest.title || contentId}
                  </h3>
                  <p className="text-white/60 text-[10px] sm:text-[11px] font-medium leading-tight truncate mt-0.5">
                    {rest.metadata || 'Streaming Video'}
                  </p>
                </div>
              </div>

              {rest.onClose && (
                <button
                  onClick={rest.onClose}
                  className="bg-black/60 hover:bg-rose-500/20 backdrop-blur-md border border-white/15 hover:border-rose-500/40 p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-rose-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
                  title="Close Player"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          )}
        </div>
      );
    }

    // Native video player
    return (
      <VideoPlayer
        ref={nativePlayerRef}
        src={src}
        contentType={contentType}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        maxQualityHeight={rest.maxQualityHeight}
        {...rest}
      />
    );
  }
);

UniversalVideoPlayer.displayName = 'UniversalVideoPlayer';

export default UniversalVideoPlayer;
