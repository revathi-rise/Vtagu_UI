'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minimize2, Maximize2 } from 'lucide-react';
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
  const [mounted, setMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Reset minimized state whenever modal is re-opened with a new video
  useEffect(() => {
    if (isOpen) {
      setIsMinimized(false);
    }
  }, [isOpen, videoUrl]);

  if (!isOpen || !mounted) return null;

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  // ── Floating Mini Player (Minimized State) ─────────────────────────────
  if (isMinimized) {
    return createPortal(
      <div 
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999999] w-[calc(100vw-32px)] sm:w-[360px] md:w-[400px] aspect-video rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.25)] overflow-hidden border border-cyan-500/40 bg-black flex flex-col group animate-in slide-in-from-bottom-5 duration-300"
      >
        {/* Floating Mini Overlay Bar */}
        <div className="absolute top-0 left-0 right-0 z-30 p-2.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex items-center gap-2 truncate pr-2">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <p className="text-white text-xs font-black uppercase tracking-tight truncate drop-shadow">{title}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <button
              onClick={handleMaximize}
              title="Expand / Full Player"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 transition-all"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={onClose}
              title="Close Player"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-500/20 text-white/80 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 transition-all"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Video Player */}
        <div className="w-full h-full relative bg-black">
          <WatchTrackingVideoPlayer
            ref={playerRef}
            src={videoUrl}
            contentId={contentId}
            contentType={contentType}
            userId={userId}
            autoResume={true}
            showControls={true}
            autoPlay={true}
            showMinimize={true}
            onMinimize={handleMaximize}
            className="w-full h-full"
          />
        </div>
      </div>,
      document.body
    );
  }

  // ── Full Modal Player (Standard View) ──────────────────────────────────
  return createPortal(
    <div className="fixed inset-0 z-[99999] bg-black flex flex-col animate-in fade-in duration-200">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3 sm:py-4 bg-black/90 backdrop-blur-md border-b border-white/10 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleMinimize}
            title="Minimize to Floating Player"
            className="p-2 text-cyan-400 hover:text-white bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 rounded-xl transition-all flex items-center gap-1.5 text-xs font-black uppercase tracking-wider shadow-sm"
          >
            <Minimize2 size={16} />
            <span className="hidden sm:inline">Minimize</span>
          </button>
          <div className="truncate">
            <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Now Playing</p>
            <h2 className="text-white font-black text-sm sm:text-lg uppercase tracking-tight truncate max-w-[180px] sm:max-w-[400px] md:max-w-[600px]">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleMinimize}
            className="sm:hidden p-2 text-cyan-400 hover:text-white bg-cyan-500/10 border border-cyan-500/30 rounded-xl transition-all"
            title="Minimize"
          >
            <Minimize2 size={16} />
          </button>
          <button
            onClick={onClose}
            className="flex items-center gap-1.5 sm:gap-2 text-white/60 hover:text-white transition-colors text-xs sm:text-sm font-black uppercase tracking-widest px-3 sm:px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/5 hover:bg-white/10"
          >
            <X size={16} className="sm:w-[18px] sm:h-[18px]" />
            <span>Close</span>
          </button>
        </div>
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
          showMinimize={true}
          onMinimize={handleMinimize}
          className="w-full h-full"
        />
      </div>
    </div>,
    document.body
  );
}
