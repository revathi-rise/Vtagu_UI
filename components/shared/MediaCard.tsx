'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MediaCardProps {
  title: string;
  image: string;
  previewGif?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'orange' | 'purple';
  rating?: number | string;
  duration?: string;
  year?: string | number;
  progress?: number;
  infoLabel?: string; // New prop to handle dynamic labels like "EPISODE", "GENRE", etc.
  trailerUrl?: string;
  onClick?: () => void;
  className?: string;
  variant?: 'portrait' | 'landscape';
}

export const MediaCard = ({
  title,
  image,
  previewGif,
  subtitle,
  description,
  badge,
  badgeColor = 'orange',
  rating,
  duration,
  year,
  progress,
  infoLabel,
  onClick,
  className,
  variant = 'portrait',
  trailerUrl,
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const badgeColors = {
    blue: 'bg-primary shadow-[0_0_15px_rgba(50,153,255,0.5)]',
    green: 'bg-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)]',
    orange: 'bg-orange-500 shadow-[0_0_15px_rgba(255,153,0,0.5)]',
    purple: 'bg-accent shadow-[0_0_15px_rgba(146,72,255,0.5)]',
  };

  const isPortrait = variant === 'portrait';

  const getYoutubeEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = '';
    if (url.includes('v=')) {
      videoId = url.split('v=')[1]?.split('&')[0];
    } else if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    }
    return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${videoId}&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3` : null;
  };

  const embedUrl = trailerUrl ? getYoutubeEmbedUrl(trailerUrl) : null;

  return (
    <div
      className="relative group isolate"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Neon Glow Layer */}
      <div className={cn(
        "absolute -inset-0.5 bg-brand-gradient rounded-[1.5rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur z-0",
      )} />

      {/* 2. Main Card Container */}
      <div
        className={cn(
          "media-card relative z-10 flex flex-col h-full group/card transition-all duration-300",
          className
        )}
        onClick={onClick}
      >
        {/* Image Section / Auto-play Preview */}
        <div className={cn(
          "relative w-full overflow-hidden",
          isPortrait ? "aspect-[4/5]" : "aspect-[3/2]"
        )}>
          {/* Static Image */}
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isHovered && previewGif ? "opacity-0" : "opacity-100"
          )}>
            <Image
              src={image || "https://picsum.photos/seed/media/600/900"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover/card:scale-110"
              unoptimized
            />
          </div>

          {/* Preview GIF or Full-Screen Background Trailer */}
          {(previewGif || embedUrl) && (
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              {isHovered && embedUrl ? (
                <div className="absolute inset-0 w-full h-full">
                  <iframe
                    src={embedUrl}
                    className="w-full h-full object-cover scale-[1.5] pointer-events-none"
                    allow="autoplay; encrypted-media"
                    frameBorder="0"
                  />
                </div>
              ) : previewGif ? (
                <Image
                  src={previewGif}
                  alt={`${title} preview`}
                  fill
                  className="object-cover scale-110"
                  unoptimized
                />
              ) : null}
            </div>
          )}

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a10] via-transparent to-black/20 z-10" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
            {badge && (
              <span className={cn(
                "text-[9px] font-black uppercase px-2.5 py-1 rounded-md text-white tracking-widest",
                badgeColors[badgeColor]
              )}>
                {badge}
              </span>
            )}
            {rating && (
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-400 border border-white/10">
                <Star size={10} className="fill-yellow-400" />
                {rating}
              </div>
            )}
          </div>

          {/* Hover Play Interaction */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 z-30">
            <div className="w-14 h-14 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-[0_0_30px_rgba(146,72,255,0.6)] scale-75 group-hover/card:scale-100 transition-transform duration-500">
              <Play size={28} fill="white" className="ml-1" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-4 flex flex-col flex-grow bg-card",
          isPortrait ? "gap-2" : "gap-1"
        )}>
          {/* Metadata Row */}
          <div className="flex items-center justify-between">
            {subtitle && (
              <span className="text-[10px] text-accent font-bold uppercase tracking-[0.15em] line-clamp-1">
                {subtitle}
              </span>
            )}
            {year && (
              <span className="text-[10px] text-white/30 font-bold">{year}</span>
            )}
          </div>

          <h3 className={cn(
            "text-white font-bold leading-tight line-clamp-1 transition-colors group-hover/card:text-primary",
            isPortrait ? "text-lg" : "text-base"
          )}>
            {title}
          </h3>

          {/* Short Description (Conditional) */}
          {description && (
            <div className="overflow-hidden transition-all duration-300 max-h-0 group-hover/card:max-h-[80px] group-hover/card:mt-2">
              <p className="text-[11px] text-white/40 line-clamp-2 leading-relaxed font-medium">
                {description}
              </p>
            </div>
          )}

          {/* Bottom Info Bar (Conditional) */}
          {(duration || year || infoLabel) && (
            <div className="mt-auto pt-2 flex items-center gap-3 border-t border-white/5">
              {duration && (
                <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
                  <Clock size={12} className="text-primary" />
                  {duration}
                </span>
              )}
              {isPortrait && year && (
                <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
                  <Calendar size={12} className="text-primary" />
                  {year}
                </span>
              )}
              {infoLabel && (
                <span className="flex items-center gap-1.5 text-[9px] text-white/50 font-bold uppercase tracking-wider">
                  <LayoutGrid size={12} className="text-primary" />
                  {infoLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* High-Quality Progress Bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-40 overflow-hidden">
            <div
              className="h-full bg-brand-gradient shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
