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
  contentType?: 'movie' | 'episode';
  internal?: boolean; // If true, use internal player; if false, open external URL
  onLockedClick?: () => void;
}

export default function WatchNowButton({
  url,
  title = 'Video',
  contentId = 'video',
  contentType = 'movie',
  internal = true,
  onLockedClick,
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
          className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter tracking-tight uppercase transition-all duration-300 overflow-hidden group shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95"
        >
          <Lock size={22} className="transition-transform group-hover:scale-110" />
          <span className="font-inter font-black text-[18px] tracking-tight uppercase">Subscribe to Watch</span>
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
        className="relative flex items-center justify-center gap-3 bg-white text-black px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter tracking-tight uppercase transition-all duration-300 overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.15)] active:scale-95"
      >
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />
        <Play size={22} className="fill-current transition-transform group-hover:scale-110" />
        <span className="font-inter font-black text-[18px] tracking-tight uppercase">WATCH NOW</span>
      </motion.a>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex items-center justify-center gap-3 bg-white text-black px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter tracking-tight uppercase transition-all duration-300 overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.15)] active:scale-95"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />

        <Play size={22} className="fill-current transition-transform group-hover:scale-110" />
        <span className="font-inter font-black text-[18px] tracking-tight uppercase">WATCH NOW</span>
      </motion.button>

      <VideoPlayerModal
        isOpen={isPlayerOpen}
        onClose={() => setIsPlayerOpen(false)}
        videoUrl={videoUrl}
        title={title}
        contentId={contentId}
        contentType={contentType}
        userId={userId}
      />
    </>
  );
}

