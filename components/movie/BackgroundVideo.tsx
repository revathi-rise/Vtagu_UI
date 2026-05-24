'use client';

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BackgroundVideoProps {
  videoUrl: string;
  posterImage: string;
  posterAlt: string;
}

export default function BackgroundVideo({ videoUrl, posterImage, posterAlt }: BackgroundVideoProps) {
  const [videoPlaying, setVideoPlaying] = useState(false);
  const { scrollY } = useScroll();
  const playerRef = useRef<any>(null);
  const fadeTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Safety check for posterImage to avoid 'Invalid URL' errors
  const safePosterImage = (posterImage && (posterImage.startsWith('http') || posterImage.startsWith('/') || posterImage.startsWith('data:')))
    ? posterImage
    : "https://picsum.photos/seed/movie/1920/1080";

  // Progressively dim the video as we scroll down (0 to 600px)
  const videoOpacity = useTransform(scrollY, [0, 600], [1, 0.2]);
  const videoBlur = useTransform(scrollY, [0, 600], ["blur(0px)", "blur(10px)"]);

  // Extract YouTube Video ID
  const getYTId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url?.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYTId(videoUrl);

  // Initialize YouTube API and player
  useEffect(() => {
    if (typeof window === 'undefined' || !videoId) return;

    let player: any = null;
    let checkYTInterval: NodeJS.Timeout | null = null;

    const initPlayer = () => {
      const YT = (window as any).YT;
      if (!YT || !YT.Player) return;

      const container = document.getElementById(`bg-youtube-player-${videoId}`);
      if (!container) return;

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
        },
        events: {
          onReady: (event: any) => {
            const p = event?.target || player || playerRef.current;
            p?.mute?.();
            p?.playVideo?.();
          },
          onStateChange: (event: any) => {
            const YT = (window as any).YT;
            
            // Clear any existing fade timer first
            if (fadeTimerRef.current) {
              clearTimeout(fadeTimerRef.current);
              fadeTimerRef.current = null;
            }

            if (event.data === YT.PlayerState.PLAYING) {
              // Delay fading in the video by 2.5 seconds so that YouTube's initial
              // play/pause controls overlay has time to auto-hide.
              fadeTimerRef.current = setTimeout(() => {
                setVideoPlaying(true);
              }, 2500);
            } else if (event.data === YT.PlayerState.ENDED) {
              // Loop the video programmatically without playlist parameters
              const p = event?.target || player || playerRef.current;
              p?.playVideo?.();
            } else if (event.data === YT.PlayerState.BUFFERING) {
              // Keep showing or fade out during buffering (optional)
              // If it was already playing, we keep showing it to prevent flickers
              // otherwise we keep it hidden.
            } else {
              setVideoPlaying(false);
            }
          },
          onError: () => {
            setVideoPlaying(false);
          }
        }
      });
      playerRef.current = player;
    };

    if ((window as any).YT && (window as any).YT.Player) {
      const timer = setTimeout(initPlayer, 100);
      return () => {
        clearTimeout(timer);
        if (player && player.destroy) {
          player.destroy();
        }
      };
    } else {
      if (!document.getElementById('youtube-iframe-api-script')) {
        const tag = document.createElement('script');
        tag.id = 'youtube-iframe-api-script';
        tag.src = 'https://www.youtube.com/iframe_api';
        const firstScriptTag = document.getElementsByTagName('script')[0];
        firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
      }

      checkYTInterval = setInterval(() => {
        if ((window as any).YT && (window as any).YT.Player) {
          if (checkYTInterval) clearInterval(checkYTInterval);
          initPlayer();
        }
      }, 100);

      const previousCallback = (window as any).onYouTubeIframeAPIReady;
      (window as any).onYouTubeIframeAPIReady = () => {
        if (previousCallback) previousCallback();
        if (checkYTInterval) clearInterval(checkYTInterval);
        initPlayer();
      };
    }

    return () => {
      if (checkYTInterval) clearInterval(checkYTInterval);
      if (fadeTimerRef.current) {
        clearTimeout(fadeTimerRef.current);
      }
      if (player && player.destroy) {
        player.destroy();
      }
    };
  }, [videoId]);

  return (
    <div className="absolute inset-0 z-0 bg-[#0B0A10]">
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

      {/* YouTube Player */}
      {videoId && (
        <motion.div
          style={{ opacity: videoOpacity, filter: videoBlur }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: videoPlaying ? 1 : 0 }}
            transition={{ duration: 2, ease: "easeInOut" }}
            className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 scale-[1.3] pointer-events-none"
          >
            <div
              id={`bg-youtube-player-${videoId}`}
              className="w-full h-full pointer-events-none"
            />
          </motion.div>
        </motion.div>
      )}

      {/* Luxury Masking & Gradients */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        {/* Radial Edge Mask - Blends video into page background */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,#0B0A10_90%)]" />

        {/* Bottom Fade - Safe zone for content */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-transparent to-transparent opacity-90" />

        {/* Left/Right Fade - Netflix/Apple TV Style Vignette */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A10] via-transparent to-[#0B0A10] opacity-40" />
      </div>
    </div>
  );
}
