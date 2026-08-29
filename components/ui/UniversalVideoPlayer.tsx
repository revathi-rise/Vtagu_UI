'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { getVideoType, getYouTubeVideoId, getRumbleEmbedUrl, fetchRumbleEmbedUrl, getFallbackVideoUrl } from '@/lib/video-utils';
import VideoPlayer, { VideoPlayerHandle, VideoPlayerProps } from './VideoPlayer';
import YouTubePlayer, { YouTubePlayerHandle } from './YouTubePlayer';
import RumblePlayer, { RumblePlayerHandle } from './RumblePlayer';

export interface UniversalVideoPlayerHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  requestFullScreen: () => void;
  videoElement?: HTMLVideoElement | null;
}

interface UniversalVideoPlayerProps extends Omit<VideoPlayerProps, 'src'> {
  src: string;
  contentId?: string;
  contentType?: 'movie' | 'episode';
  userId?: string;
  onProgressUpdate?: (progress: number, currentTime: number) => void;
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
          youtubePlayerRef.current?.play?.();
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
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          {...rest}
        />
      );
    }

    if (videoType === 'rumble') {
      return (
        <RumblePlayer
          ref={rumblePlayerRef}
          src={src}
          title={contentId}
          onTimeUpdate={handleTimeUpdate}
          onEnded={onEnded}
          {...rest}
        />
      );
    }

    if (videoType === 'iframe') {
      return (
        <iframe
          src={src}
          className="w-full h-full border-none"
          allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
          allowFullScreen
          title={contentId}
        />
      );
    }

    // Native video player
    return (
      <VideoPlayer
        ref={nativePlayerRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={onEnded}
        {...rest}
      />
    );
  }
);

UniversalVideoPlayer.displayName = 'UniversalVideoPlayer';

export default UniversalVideoPlayer;
