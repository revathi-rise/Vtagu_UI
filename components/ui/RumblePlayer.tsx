'use client';

import React, { forwardRef, useImperativeHandle, useRef, useState, useEffect } from 'react';
import { fetchRumbleEmbedUrl, getRumbleEmbedUrl } from '@/lib/video-utils';

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
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
}

const RumblePlayer = forwardRef<RumblePlayerHandle, RumblePlayerProps>(
  ({ videoId, src, className = '', autoPlay = true, title = 'Rumble Video' }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
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

    useImperativeHandle(ref, () => ({
      play: () => {},
      pause: () => {},
      requestFullScreen: () => {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen();
        }
      },
    }));

    const finalSrc = embedUrl || (videoId ? `https://rumble.com/embed/${videoId}/?pub=4` : '');

    return (
      <div ref={containerRef} className={`relative w-full h-full min-h-[200px] overflow-hidden rounded-lg shadow-lg bg-black ${className}`}>
        <iframe
          className="absolute top-0 left-0 w-full h-full border-0 pointer-events-auto object-cover"
          src={`${finalSrc}${finalSrc.includes('?') ? '&' : '?'}autoplay=${autoPlay ? '1' : '0'}`}
          allowFullScreen
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          title={title}
        />
      </div>
    );
  }
);

RumblePlayer.displayName = 'RumblePlayer';

export default RumblePlayer;
