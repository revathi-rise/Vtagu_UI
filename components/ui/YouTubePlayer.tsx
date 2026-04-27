'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef } from 'react';
import { AlertCircle, Maximize } from 'lucide-react';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  requestFullScreen: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoPlay?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({
    videoId,
    title = 'Video',
    autoPlay = false,
    className = '',
    onTimeUpdate,
    onEnded,
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const iframeRef = useRef<HTMLIFramElement>(null);
    const playerRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);

    // Initialize YouTube API
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      // Load YouTube API
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);

      // Define global onYouTubeIframeAPIReady
      (window as any).onYouTubeIframeAPIReady = () => {
        if (!iframeRef.current) return;

        const YT = (window as any).YT;
        playerRef.current = new YT.Player(iframeRef.current, {
          events: {
            'onReady': () => {
              setIsReady(true);
              if (autoPlay) {
                playerRef.current?.playVideo();
              }
            },
            'onError': (event: any) => {
              const errorCodes: { [key: number]: string } = {
                2: 'Invalid parameter',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video not allowed to be played embedded',
                150: 'Video not allowed to be played embedded',
              };
              setError(errorCodes[event.data] || 'YouTube player error');
            },
            'onStateChange': (event: any) => {
              const YT = (window as any).YT;
              if (event.data === YT.PlayerState.PLAYING && onTimeUpdate) {
                // Update progress periodically during playback
                const interval = setInterval(() => {
                  if (playerRef.current) {
                    const current = playerRef.current.getCurrentTime();
                    const duration = playerRef.current.getDuration();
                    onTimeUpdate(current, duration);
                  }
                }, 1000);

                // Clean up interval when not playing
                const checkPlayback = setInterval(() => {
                  if (playerRef.current?.getPlayerState?.() !== YT.PlayerState.PLAYING) {
                    clearInterval(interval);
                    clearInterval(checkPlayback);
                  }
                }, 1000);
              }

              if (event.data === YT.PlayerState.ENDED && onEnded) {
                onEnded();
              }
            },
          },
        });
      };
    }, [autoPlay, onTimeUpdate, onEnded]);

    useImperativeHandle(ref, () => ({
      play: () => playerRef.current?.playVideo?.(),
      pause: () => playerRef.current?.pauseVideo?.(),
      requestFullScreen: () => {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        }
      },
    }));

    if (error) {
      return (
        <div className={`relative w-full bg-black flex items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 bg-black/40 backdrop-blur-md z-50">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-center px-4">
              {error}
            </p>
            <p className="text-xs text-white/40 mt-2">This video may not be available for embedding</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        className={`relative w-full bg-black overflow-hidden group ${className}`}
        style={{ aspectRatio: '16/9' }}
      >
        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </div>
        )}

        {/* YouTube Iframe */}
        <div className="w-full h-full">
          <iframe
            ref={iframeRef}
            id={`youtube-player-${videoId}`}
            className="w-full h-full"
            src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=${autoPlay ? 1 : 0}&controls=1&modestbranding=1&rel=0&fs=1&iv_load_policy=3&playsinline=1`}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
          />
        </div>

        {/* Fullscreen Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            const ref = containerRef.current;
            if (ref?.requestFullscreen) {
              ref.requestFullscreen();
            } else if ((ref as any).webkitRequestFullscreen) {
              (ref as any).webkitRequestFullscreen();
            }
          }}
          className="absolute top-4 right-4 z-20 p-2 bg-black/60 hover:bg-black/80 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity"
          title="Fullscreen"
        >
          <Maximize size={18} />
        </button>
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
