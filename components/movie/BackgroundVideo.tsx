'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';

interface BackgroundVideoProps {
  videoUrl: string;
  posterImage: string;
  posterAlt: string;
}

export default function BackgroundVideo({ videoUrl, posterImage, posterAlt }: BackgroundVideoProps) {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [timerFinished, setTimerFinished] = useState(false);
  const { scrollY } = useScroll();

  // 10-second timer to delay the video transition (Premium Feel)
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimerFinished(true);
    }, 400000);
    return () => clearTimeout(timer);
  }, []);

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

  return (
    <div className="absolute inset-0 z-0 bg-[#0B0A10]">
      {/* Fallback/Initial Poster */}
      <Image
        src={safePosterImage}
        alt={posterAlt}
        fill
        className={`object-cover transition-opacity duration-[2000ms] ease-in-out ${(videoLoaded && timerFinished) ? 'opacity-0' : 'opacity-40'}`}
        priority
        placeholder="blur"
        blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg=="
      />

      {/* YouTube Player */}
      {videoId && (
        <motion.div
          style={{ opacity: videoOpacity, filter: videoBlur }}
          initial={{ opacity: 0 }}
          animate={{ opacity: (videoLoaded && timerFinished) ? 1 : 0 }}
          transition={{ duration: 3, ease: "easeInOut" }}
          className="absolute inset-0 overflow-hidden pointer-events-none"
        >
          <iframe
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3&enablejsapi=1`}
            className="absolute top-1/2 left-1/2 w-[115%] h-[115%] -translate-x-1/2 -translate-y-1/2 object-cover scale-[1.3]"
            allow="autoplay; encrypted-media"
            onLoad={() => setVideoLoaded(true)}
          />
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
