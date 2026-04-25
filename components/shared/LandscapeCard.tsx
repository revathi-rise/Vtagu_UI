'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, LayoutGrid, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LandscapeCardProps {
  title: string;
  image: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  rating?: number | string;
  duration?: string;
  year?: string | number;
  progress?: number;
  infoLabel?: string;
  onClick?: () => void;
  className?: string;
}

export const LandscapeCard = ({
  title,
  image,
  subtitle,
  description,
  badge,
  rating,
  duration,
  year,
  progress,
  infoLabel,
  onClick,
  className,
}: LandscapeCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "relative w-full group isolate h-[220px] md:h-[260px]",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* 1. Neon Glow Layer */}
      <div className={cn(
        "absolute -inset-1 bg-brand-gradient rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-md z-0",
        isHovered ? "scale-105 -translate-y-2" : "scale-100"
      )} />

      {/* 2. Main Card Container */}
      <div
        className={cn(
          "relative z-10 flex flex-col w-full h-full bg-[#0a0a0c] border border-white/5 rounded-2xl overflow-hidden transition-all duration-500 ease-out cursor-pointer",
          isHovered ? "scale-105 -translate-y-4 shadow-2xl z-50 ring-1 ring-white/20" : "scale-100 z-10"
        )}
        onClick={onClick}
      >
        {/* Poster Section (16:9) */}
        <div className={cn(
          "relative w-full overflow-hidden shrink-0 transition-all duration-500 h-[140px] md:h-[180px]",
          isHovered ? "brightness-110" : "brightness-90"
        )}>
          <Image
            src={image || "https://picsum.photos/seed/landscape/800/450"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20 z-10" />
          
          {/* Top Badges */}
          <div className="absolute top-2 left-2 right-2 flex items-start justify-between z-20">
            {badge && (
              <span className={cn(
                "text-[9px] font-black uppercase px-2 py-0.5 rounded text-white tracking-widest shadow-lg",
                badge.includes('%') ? "bg-primary" : "bg-primary/80"
              )}>
                {badge}
              </span>
            )}
            {rating && (
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-1.5 py-0.5 rounded text-[9px] font-bold text-yellow-400 border border-white/10 shadow-lg">
                <Star size={8} className="fill-yellow-400" />
                {rating}
              </div>
            )}
          </div>

          {/* Play Button Overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 z-30",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl">
              <Play size={20} fill="white" className="ml-0.5" />
            </div>
          </div>

          {/* Progress Bar for Landscape (Resume) */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/10 z-40">
              <div 
                className="h-full bg-primary shadow-[0_0_10px_rgba(50,153,255,0.8)]" 
                style={{ width: `${progress}%` }} 
              />
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-4 flex flex-col flex-grow bg-[#0a0a0c] transition-all duration-500",
          isHovered ? "gap-2.5" : "gap-1"
        )}>
          <div className="flex items-center justify-between">
            <h3 className={cn(
              "text-white font-bold leading-tight line-clamp-1 transition-colors group-hover:text-primary text-[15px]",
            )}>
              {title}
            </h3>
          </div>

          {/* Metadata Row */}
          <div className="flex items-center gap-2">
            {year && (
              <span className="text-[11px] text-primary font-bold">{year}</span>
            )}
            {subtitle && (
              <span className="text-[9px] text-white/40 font-black uppercase tracking-[0.1em]">• {subtitle}</span>
            )}
          </div>

          {/* Expanded Info on Hover */}
          <div className={cn(
            "overflow-hidden transition-all duration-500",
            isHovered ? "max-h-[60px] opacity-100 mt-1" : "max-h-0 opacity-0"
          )}>
            <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
              {description || "Continue your journey with the latest episode. Watch now on PrimeTime."}
            </p>
          </div>

          {/* Mini Meta Bar */}
          <div className={cn(
            "mt-auto pt-2 flex items-center gap-3 border-t border-white/5 transition-all duration-500",
            isHovered ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1"
          )}>
            {duration && (
              <span className="flex items-center gap-1.5 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                <Clock size={12} className="text-primary" />
                {duration}
              </span>
            )}
             {infoLabel && (
              <span className="flex items-center gap-1.5 text-[10px] text-white/60 font-bold uppercase tracking-wider">
                <LayoutGrid size={12} className="text-primary" />
                {infoLabel}
              </span>
            )}
            <div className="ml-auto">
              <button className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/20 border border-white/10">
                <Plus size={12} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
