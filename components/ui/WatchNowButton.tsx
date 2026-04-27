'use client';

import React, { useState, useEffect } from 'react';
import { Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import VideoPlayerModal from './VideoPlayerModal';
import { getVideoUrl } from '@/lib/video-utils';

interface WatchNowButtonProps {
  url?: string | null;
  title?: string;
  contentId?: string;
  contentType?: 'movie' | 'episode';
  internal?: boolean; // If true, use internal player; if false, open external URL
}

export default function WatchNowButton({
  url,
  title = 'Video',
  contentId = 'video',
  contentType = 'movie',
  internal = true,
}: WatchNowButtonProps) {
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const [userId, setUserId] = useState<string | undefined>();
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    // Get userId from localStorage for progress tracking
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
    }
    
    // Get valid video URL with fallback
    const validUrl = getVideoUrl(url, contentId, true);
    setVideoUrl(validUrl);
    
    if (!validUrl) {
      console.error('No valid video URL available for:', contentId);
      setShowError(true);
    }
  }, [url, contentId]);

  const handleClick = (e: React.MouseEvent) => {
    if (!videoUrl) {
      e.preventDefault();
      setShowError(true);
      return;
    }
    if (internal) {
      e.preventDefault();
      setIsPlayerOpen(true);
    }
  };

  if (showError && internal) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex items-center gap-3 bg-red-500/20 text-red-400 px-6 py-4 rounded-xl border border-red-500/30 text-sm font-semibold"
      >
        <AlertCircle size={20} />
        <span>Video unavailable. Using sample video...</span>
      </motion.div>
    );
  }

  if (!videoUrl && !internal) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex items-center gap-2 text-gray-400 text-sm"
      >
        <AlertCircle size={18} />
        <span>Video not available</span>
      </motion.div>
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
        className="relative flex items-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black text-lg transition-colors overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />

        <Play size={24} className="fill-current transition-transform group-hover:scale-110" />
        <span className="tracking-tight uppercase">WATCH NOW</span>
      </motion.a>
    );
  }

  return (
    <>
      <motion.button
        onClick={handleClick}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
        className="relative flex items-center gap-3 bg-white text-black px-8 py-5 rounded-2xl font-black text-lg transition-colors overflow-hidden group shadow-[0_20px_50px_rgba(255,255,255,0.15)]"
      >
        {/* Shimmer Effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-black/5 to-transparent pointer-events-none" />

        <Play size={24} className="fill-current transition-transform group-hover:scale-110" />
        <span className="tracking-tight uppercase">WATCH NOW</span>
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

