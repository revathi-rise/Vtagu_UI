'use client';

import React from 'react';
import { Play } from 'lucide-react';
import { motion } from 'framer-motion';

interface WatchNowButtonProps {
  url: string;
}

export default function WatchNowButton({ url }: WatchNowButtonProps) {
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
