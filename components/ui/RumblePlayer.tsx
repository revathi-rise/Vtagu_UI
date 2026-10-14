'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { Play, X, Maximize, Minimize } from 'lucide-react';
import { fetchRumbleEmbedUrl, getRumbleEmbedUrl } from '@/lib/video-utils';
import {
  requestElementFullscreen,
  exitDocumentFullscreen,
  isElementFullscreen,
  addFullscreenChangeListener,
} from '@/lib/fullscreen-utils';

export interface RumblePlayerHandle {
  play: () => void;
  pause: () => void;
  requestFullScreen: () => void;
}

interface RumblePlayerProps {
  videoId?: string;
  src?: string;
  className?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  title?: string;
  metadata?: string;
  onClose?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const RumblePlayer = forwardRef<RumblePlayerHandle, RumblePlayerProps>(
  (
    {
      videoId,
      src,
      className = '',
      autoPlay = true,
      showControls = true,
      title = 'Rumble Video',
      metadata = 'Streaming in HD • Premium',
      onClose,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [showUI, setShowUI] = useState(true);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [embedUrl, setEmbedUrl] = useState<string>(() => {
      if (videoId) return `https://rumble.com/embed/${videoId.replace(/^\//, '')}/?pub=4`;
      if (src) return getRumbleEmbedUrl(src) || src;
      return '';
    });

    useEffect(() => {
      const target = src || (videoId ? `https://rumble.com/shorts/${videoId}` : '');
      if (!target) return;

      let isMounted = true;
      fetchRumbleEmbedUrl(target).then((url) => {
        if (isMounted && url) {
          setEmbedUrl(url);
        }
      });
      return () => {
        isMounted = false;
      };
    }, [videoId, src]);

    const updateFullscreenState = () => {
      setIsFullscreen(isElementFullscreen(containerRef.current));
    };

    useEffect(() => {
      const cleanup = addFullscreenChangeListener(updateFullscreenState);
      updateFullscreenState();
      return cleanup;
    }, []);

    const resetTimeout = () => {
      setShowUI(true);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setShowUI(false);
      }, 3500);
    };

    const toggleFullscreen = async () => {
      if (isElementFullscreen(containerRef.current)) {
        await exitDocumentFullscreen();
      } else {
        await requestElementFullscreen(containerRef.current);
      }
      updateFullscreenState();
    };

    useImperativeHandle(ref, () => ({
      play: () => {},
      pause: () => {},
      requestFullScreen: async () => {
        await requestElementFullscreen(containerRef.current);
        updateFullscreenState();
      },
    }));

    const finalSrc = embedUrl || (videoId ? `https://rumble.com/embed/${videoId}/?pub=4` : '');

    return (
      <div
        ref={containerRef}
        onMouseMove={resetTimeout}
        className={`relative w-full h-full min-h-[200px] overflow-hidden rounded-lg shadow-lg bg-black group select-none ${className}`}
      >
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto object-cover"
          src={`${finalSrc}${finalSrc.includes('?') ? '&' : '?'}autoplay=${autoPlay ? '1' : '0'}`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
        />

        {/* Top Overlay Bar matching VideoPlayer (Reference Image 2) */}
        {showControls && (
          <div
            className={`absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 transition-opacity duration-300 pointer-events-auto ${
              showUI ? 'opacity-100' : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Left: Glassmorphic Capsule Card */}
            <div className="bg-black/60 backdrop-blur-md border border-white/15 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl max-w-[70%] sm:max-w-md">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Play size={13} fill="white" className="ml-0.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight truncate">
                  {title}
                </h3>
                <p className="text-white/60 text-[10px] sm:text-[11px] font-medium leading-tight truncate mt-0.5">
                  {metadata}
                </p>
              </div>
            </div>

            {/* Top Right: Pills (Fullscreen + Close) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              <button
                onClick={toggleFullscreen}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-cyan-500/40 p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-cyan-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
              >
                {isFullscreen ? <Minimize size={17} /> : <Maximize size={17} />}
              </button>

              {onClose && (
                <button
                  onClick={onClose}
                  className="bg-black/60 hover:bg-rose-500/20 backdrop-blur-md border border-white/15 hover:border-rose-500/40 p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-rose-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
                  title="Close Player"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    );
  }
);

RumblePlayer.displayName = 'RumblePlayer';

export default RumblePlayer;
