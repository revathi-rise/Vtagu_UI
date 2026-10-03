'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { isRumbleUrl, getRumbleEmbedUrl } from '@/lib/video-utils';

interface BackgroundVideoProps {
  videoUrl: string;
  posterImage: string;
  posterAlt: string;
}

export default function BackgroundVideo({ videoUrl, posterImage, posterAlt }: BackgroundVideoProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const { scrollY } = useScroll();
  const playerRef = useRef<any>(null);
  const html5VideoRef = useRef<HTMLVideoElement | null>(null);

  const isRumble = isRumbleUrl(videoUrl);
  const rumbleEmbedUrl = isRumble ? getRumbleEmbedUrl(videoUrl) : null;

  // Safety check for posterImage to avoid 'Invalid URL' errors
  const safePosterImage = (posterImage && (posterImage.startsWith('http') || posterImage.startsWith('/') || posterImage.startsWith('data:')))
    ? posterImage
    : "https://picsum.photos/seed/movie/1920/1080";

  // Extract YouTube Video ID
  const getYTId = (url: string) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    if (match && match[2].length === 11) return match[2];
    if (url.length === 11 && !url.includes('/') && !url.includes('.')) return url;
    return null;
  };

  const videoId = getYTId(videoUrl);
  const isDirectVideo = !videoId && !isRumble && videoUrl && videoUrl.trim() !== '';

  // Toggle audio mute / unmute for background trailer
  const toggleMute = (e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);

    // 1. YouTube API Instance
    if (playerRef.current) {
      try {
        if (nextMuted) {
          playerRef.current.mute?.();
        } else {
          playerRef.current.unMute?.();
          playerRef.current.setVolume?.(100);
          playerRef.current.playVideo?.();
        }
      } catch (err) {
        console.warn('YouTube API mute toggle error:', err);
      }
    }

    // 2. Direct postMessage fallback
    if (videoId) {
      try {
        const iframe = document.querySelector(`#bg-youtube-player-${videoId} iframe`) as HTMLIFrameElement;
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            JSON.stringify({
              event: 'command',
              func: nextMuted ? 'mute' : 'unMute',
              args: [],
            }),
            '*'
          );
          if (!nextMuted) {
            iframe.contentWindow.postMessage(
              JSON.stringify({
                event: 'command',
                func: 'setVolume',
                args: [100],
              }),
              '*'
            );
          }
        }
      } catch (err) {
        console.warn('postMessage error:', err);
      }
    }

    // 3. HTML5 Video Element
    if (html5VideoRef.current) {
      html5VideoRef.current.muted = nextMuted;
      html5VideoRef.current.volume = 1.0;
      if (!nextMuted) {
        html5VideoRef.current.play().catch(() => {});
      }
    }
  };

  // Progressively dim the video as we scroll down (0 to 600px)
  const videoOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const videoBlur = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(10px)"]);

  // Initialize YouTube API player on div target
  useEffect(() => {
    if (typeof window === 'undefined' || !videoId) return;

    let player: any = null;
    let checkInterval: NodeJS.Timeout | null = null;

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      const container = document.getElementById(`bg-youtube-player-${videoId}`);
      if (!container) return;

      try {
        player = new YT.Player(`bg-youtube-player-${videoId}`, {
          videoId: videoId,
          playerVars: {
            autoplay: 1,
            mute: 1,
            controls: 0,
            modestbranding: 1,
            rel: 0,
            showinfo: 0,
            iv_load_policy: 3,
            playsinline: 1,
            disablekb: 1,
            enablejsapi: 1,
            origin: typeof window !== 'undefined' ? window.location.origin : '',
          },
          events: {
            onReady: (event: any) => {
              const p = event.target || player;
              playerRef.current = p;
              p?.mute?.();
              p?.playVideo?.();
            },
            onStateChange: (event: any) => {
              const p = event.target || player;
              if (p) playerRef.current = p;
              const YTState = (window as any).YT?.PlayerState;
              if (event.data === YTState?.PLAYING) {
                setVideoPlaying(true);
              } else if (event.data === YTState?.ENDED) {
                p?.playVideo?.();
              }
            },
            onError: () => {
              setVideoPlaying(false);
            },
          },
        });
        playerRef.current = player;
      } catch (e) {
        console.warn('YT Player init error:', e);
      }
    };

    if ((window as any).YT && (window as any).YT.Player) {
      const timer = setTimeout(initPlayer, 100);
      return () => {
        clearTimeout(timer);
        if (player && player.destroy) player.destroy();
      };
    } else {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      checkInterval = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          if (checkInterval) clearInterval(checkInterval);
          initPlayer();
        }
      }, 150);

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        if (checkInterval) clearInterval(checkInterval);
        initPlayer();
      };
    }

    return () => {
      if (checkInterval) clearInterval(checkInterval);
      if (player && player.destroy) {
        try { player.destroy(); } catch (e) {}
      }
    };
  }, [videoId]);

  const hasVideoSource = !!(videoId || isRumble || isDirectVideo);

  return (
    <div className="absolute inset-0 z-10 bg-[#0B0A10]">
      {/* Fallback/Initial Poster */}
      <Image
        src={safePosterImage}
        alt={posterAlt}
        fill
        className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${videoPlaying ? 'opacity-0' : 'opacity-40'}`}
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />

      {/* Rumble Player */}
      {isRumble && rumbleEmbedUrl && (
        <motion.div
          style={{ opacity: videoOpacity, filter: videoBlur }}
          className="absolute inset-0 overflow-hidden pointer-events-none z-[5]"
        >
          <iframe
            key={isMuted ? 'rumble-muted' : 'rumble-unmuted'}
            src={`${rumbleEmbedUrl}?pub=4&autoplay=2&muted=${isMuted ? 1 : 0}`}
            className="absolute top-1/2 left-1/2 w-[125%] h-[125%] -translate-x-1/2 -translate-y-1/2 scale-[1.3] pointer-events-none border-none"
            allow="autoplay; encrypted-media"
            onLoad={() => setVideoPlaying(true)}
          />
        </motion.div>
      )}

      {/* YouTube Player Container (Managed by YouTube API) */}
      {videoId && (
        <motion.div
          style={{ opacity: videoOpacity, filter: videoBlur }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoPlaying ? 1 : 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 scale-[1.3] pointer-events-none"
          >
            <div
              id={`bg-youtube-player-${videoId}`}
              className="w-full h-full pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Direct HTML5 Video Player */}
      {isDirectVideo && (
        <motion.div
          style={{ opacity: videoOpacity, filter: videoBlur }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <video
            ref={html5VideoRef}
            src={videoUrl}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            onCanPlay={() => setVideoPlaying(true)}
            onPlay={() => setVideoPlaying(true)}
            className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 object-cover pointer-events-none"
          />
        </motion.div>
      )}

      {/* Volume Control Button */}
      {hasVideoSource && (
        <div className="absolute bottom-12 right-24 sm:right-28 z-[100] pointer-events-auto">
          <button
            onClick={toggleMute}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-[0_10px_30px_rgba(0,0,0,0.5)] transition-all hover:scale-110 active:scale-95 group cursor-pointer"
            title={isMuted ? "Unmute Trailer Sound" : "Mute Trailer Sound"}
          >
            {isMuted ? (
              <VolumeX size={20} className="text-white/70 group-hover:text-white transition-colors" />
            ) : (
              <Volume2 size={20} className="text-cyan-400 group-hover:text-cyan-300 transition-colors animate-pulse" />
            )}
          </button>
        </div>
      )}

      {/* Luxury Masking & Gradients */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0B0A10_90%)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-transparent to-transparent opacity-90" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A10] via-transparent to-[#0B0A10] opacity-40" />
      </div>
    </div>
  );
}
