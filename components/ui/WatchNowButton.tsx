'use client';

import React, { useState, useEffect } from 'react';
import { Play, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayerModal from './VideoPlayerModal';
import { getVideoUrl } from '@/lib/video-utils';
import { getUserId } from '@/lib/api-client';
import Link from 'next/link';

interface WatchNowButtonProps {
  url?: string | null;
  title?: string;
  contentId?: string;
  contentType?: 'movie' | 'episode' | 'interactive_movie' | 'short';
  internal?: boolean; // If true, use internal player; if false, open external URL
  onLockedClick?: () => void;
  subtitles?: {
    language: string;
    label: string;
    url: string;
  }[];
  audioTracks?: {
    language: string;
    label: string;
    url?: string;
    isDefault?: boolean;
  }[];
}

export default function WatchNowButton({
  url,
  title = 'Video',
  contentId = 'video',
  contentType = 'movie',
  internal = true,
  onLockedClick,
  subtitles,
  audioTracks,
}: WatchNowButtonProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [videoUrl, setVideoUrl] = useState<string>('');

  useEffect(() => {
    // Get userId reliably for progress tracking
    const id = getUserId();
    if (id) {
      setUserId(id);
    }
    
    // Get valid video URL without forcing sample fallbacks for restricted videos
    const validUrl = getVideoUrl(url, contentId, false);
    setVideoUrl(validUrl);
  }, [url, contentId]);

  const handleClick = (e: React.MouseEvent) => {
    if (!videoUrl) {
      e.preventDefault();
      if (onLockedClick) {
        onLockedClick();
      } else {
        window.location.href = '/pricing';
      }
      return;
    }
    if (internal) {
      e.preventDefault();
      setIsPlayerOpen(true);
    }
  };

  if (!videoUrl) {
    return (
      <Link href="/pricing" onClick={handleClick}>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.98 }}
          className="relative flex items-center justify-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white h-11 sm:h-14 px-5 sm:px-8 rounded-full sm:rounded-2xl font-bold text-xs sm:text-base tracking-wider uppercase transition-all duration-300 overflow-hidden group shadow-[0_10px_25px_rgba(59,130,246,0.3)] active:scale-95"
        >
          <Lock size={18} className="transition-transform group-hover:scale-110 shrink-0" />
          <span className="font-bold tracking-wider uppercase text-xs sm:text-base whitespace-nowrap">Subscribe to Watch</span>
        </motion.button>
      </Link>
    );
  }

  if (!internal && url) {
    return (
      <motion.a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex items-center justify-center gap-2 sm:gap-3 bg-white text-black h-11 sm:h-14 px-5 sm:px-8 rounded-full sm:rounded-2xl font-bold text-xs sm:text-base tracking-wider uppercase transition-all duration-300 overflow-hidden group shadow-[0_10px_25px_rgba(255,255,255,0.15)] active:scale-95"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />
        <Play size={18} className="fill-current transition-transform group-hover:scale-110 shrink-0" />
        <span className="font-bold tracking-wider uppercase text-xs sm:text-base whitespace-nowrap">WATCH NOW</span>
      </motion.a>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex items-center justify-center gap-2 sm:gap-3 bg-white text-black h-11 sm:h-14 px-5 sm:px-8 rounded-full sm:rounded-2xl font-bold text-xs sm:text-base tracking-wider uppercase transition-all duration-300 overflow-hidden group shadow-[0_10px_25px_rgba(255,255,255,0.15)] active:scale-95"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />

        <Play size={18} className="fill-current transition-transform group-hover:scale-110 shrink-0" />
        <span className="font-bold tracking-wider uppercase text-xs sm:text-base whitespace-nowrap">WATCH NOW</span>
      </motion.button>

      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={videoUrl}
        title={title}
        contentId={contentId}
        contentType={contentType}
        userId={userId}
        subtitles={subtitles}
        audioTracks={audioTracks}
      />
    </>
  );
}

