'use client';

import React, { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Minimize2, Maximize2 } from 'lucide-react';
import WatchTrackingVideoPlayer, { VideoPlayerHandle } from './WatchTrackingVideoPlayer';
import { exitDocumentFullscreen } from '@/lib/fullscreen-utils';

interface VideoPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
  contentId: string;
  contentType?: 'movie' | 'episode' | 'interactive_movie' | 'short';
  userId?: string;
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

export default function VideoPlayerModal({
  isOpen,
  onClose,
  videoUrl,
  title,
  contentId,
  contentType = 'movie',
  userId,
  subtitles,
  audioTracks,
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

  // Lock body scroll when modal is open and not minimized
  useEffect(() => {
    if (isOpen && !isMinimized && mounted) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, isMinimized, mounted]);

  if (!isOpen || !mounted) return null;

  const handleMinimize = async () => {
    await exitDocumentFullscreen();
    setIsMinimized(true);
  };

  const handleMaximize = () => {
    setIsMinimized(false);
  };

  const handleClose = async () => {
    await exitDocumentFullscreen();
    onClose();
  };

  return createPortal(
    <div
      className={
        isMinimized
          ? "fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-[999999] w-[calc(100vw-32px)] sm:w-[380px] md:w-[440px] aspect-video rounded-2xl shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.25)] overflow-hidden border border-cyan-500/40 bg-black flex flex-col group animate-in slide-in-from-bottom-5 duration-300"
          : "fixed inset-0 z-[99999] h-[100dvh] w-screen bg-black flex flex-col animate-in fade-in duration-200"
      }
    >
      {/* Floating Mini Overlay Bar (visible on hover when minimized) */}
      {isMinimized && (
        <div className="absolute top-0 left-0 right-0 z-30 p-2.5 bg-gradient-to-b from-black/95 via-black/60 to-transparent flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="flex items-center gap-2 truncate pr-2 pointer-events-auto">
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse flex-shrink-0" />
            <p className="text-white text-xs font-black uppercase tracking-tight truncate drop-shadow">{title}</p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0 pointer-events-auto">
            <button
              onClick={handleMaximize}
              title="Expand / Full Player"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-cyan-500/20 text-white/80 hover:text-cyan-400 border border-white/10 hover:border-cyan-500/40 transition-all cursor-pointer"
            >
              <Maximize2 size={14} />
            </button>
            <button
              onClick={handleClose}
              title="Close Player"
              className="p-1.5 rounded-lg bg-black/60 hover:bg-rose-500/20 text-white/80 hover:text-rose-400 border border-white/10 hover:border-rose-500/40 transition-all cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Video Player Canvas */}
      <div className="relative bg-black w-full h-full flex-1 overflow-hidden">
        <WatchTrackingVideoPlayer
          ref={playerRef}
          src={videoUrl}
          title={title}
          metadata={
            contentType === 'movie'
              ? 'Movie • HD Streaming'
              : contentType === 'episode'
              ? 'Series Episode • HD Streaming'
              : contentType === 'interactive_movie'
              ? 'Interactive Story • HD'
              : 'HD Streaming'
          }
          contentId={contentId}
          contentType={contentType}
          userId={userId}
          autoResume={true}
          showControls={!isMinimized}
          autoPlay={true}
          showMinimize={true}
          isMinimized={isMinimized}
          onMinimize={isMinimized ? handleMaximize : handleMinimize}
          onClose={handleClose}
          subtitles={subtitles}
          audioTracks={audioTracks}
          className="w-full h-full"
        />
      </div>
    </div>,
    document.body
  );
}
