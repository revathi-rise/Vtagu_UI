'use client';

import React, { useRef, useState } from 'react';
import { X } from 'lucide-react';
import WatchTrackingVideoPlayer, { VideoPlayerHandle } from './WatchTrackingVideoPlayer';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  contentId: string;
  contentType?: 'movie' | 'episode';
  userId?: string;
}

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  contentId,
  contentType = 'movie',
  userId,
}: VideoPlayerModalProps) {
  const playerRef = useRef<VideoPlayerHandle>(null);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[999] bg-black flex flex-col">
      {/* Top Bar */}
      <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10 flex-shrink-0">
        <div>
          <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Now Playing</p>
          <h2 className="text-white font-black text-lg uppercase tracking-tight truncate">{title}</h2>
        </div>
        <button
          onClick={onClose}
          className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
        >
          <X size={18} />
          Close
        </button>
      </div>

      {/* Player Area */}
      <div className="flex-1 relative bg-black overflow-hidden">
        <WatchTrackingVideoPlayer
          ref={playerRef}
          src={videoUrl}
          contentId={contentId}
          contentType={contentType}
          userId={userId}
          autoResume={true}
          showControls={true}
          autoPlay={true}
          className="w-full h-full"
        />
      </div>
    </div>
  );
}
