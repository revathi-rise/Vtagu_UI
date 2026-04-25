'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, LayoutGrid, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PortraitCardProps {
  title: string;
  image: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  rating?: number | string;
  duration?: string;
  year?: string | number;
  infoLabel?: string;
  onClick?: () => void;
  className?: string;
}

export const PortraitCard = ({
  title,
  image,
  subtitle,
  description,
  badge,
  rating,
  duration,
  year,
  infoLabel,
  onClick,
  className,
}: PortraitCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={cn(
        "relative w-full group isolate h-[380px] md:h-[420px]",
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
        {/* Poster Section */}
        <div className={cn(
          "relative w-full overflow-hidden shrink-0 transition-all duration-500 h-[280px] md:h-[320px]",
          isHovered ? "brightness-110" : "brightness-90"
        )}>
          <Image
            src={image || "https://picsum.photos/seed/portrait/600/900"}
            alt={title}
            fill
            className="object-cover transition-transform duration-700 group-hover:scale-110"
            unoptimized
          />

          {/* Cinematic Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-transparent to-black/20 z-10" />
          
          {/* Top Badges */}
          <div className="absolute top-3 left-3 right-3 flex items-start justify-between z-20">
            {badge && (
              <span className={cn(
                "text-[10px] font-black uppercase px-2.5 py-1 rounded-md text-white tracking-widest shadow-lg",
                badge === 'FREE' ? "bg-green-500" : "bg-primary"
              )}>
                {badge}
              </span>
            )}
            {rating && (
              <div className="flex items-center gap-1 bg-black/80 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-400 border border-white/10 shadow-lg">
                <Star size={10} className="fill-yellow-400" />
                {rating}
              </div>
            )}
          </div>

          {/* Play Button Overlay */}
          <div className={cn(
            "absolute inset-0 flex items-center justify-center transition-all duration-500 z-30",
            isHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
          )}>
            <div className="w-14 h-14 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white shadow-2xl">
              <Play size={28} fill="white" className="ml-1" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className={cn(
          "p-5 flex flex-col flex-grow bg-[#0a0a0c] transition-all duration-500",
          isHovered ? "gap-4" : "gap-1.5"
        )}>
          {/* Metadata Row */}
          <div className="flex items-center gap-2">
            {year && (
              <span className="text-[12px] text-primary font-bold">{year}</span>
            )}
            {subtitle && (
              <span className="text-[10px] text-white/40 font-black uppercase tracking-[0.1em]">• {subtitle}</span>
            )}
          </div>

          <h3 className={cn(
            "text-white font-bold leading-tight line-clamp-1 transition-colors group-hover:text-primary text-[19px]",
          )}>
            {title}
          </h3>

          {/* Expanded Info on Hover */}
          <div className={cn(
            "overflow-hidden transition-all duration-500",
            isHovered ? "max-h-[100px] opacity-100 mt-1" : "max-h-0 opacity-0"
          )}>
            <p className="text-[12px] text-white/50 line-clamp-3 leading-relaxed">
              {description || "Experience the next level of immersive storytelling. Watch this original production in stunning quality."}
            </p>
          </div>

          {/* Bottom Meta Bar */}
          <div className={cn(
            "mt-auto pt-3 flex items-center gap-4 border-t border-white/5 transition-all duration-500",
            isHovered ? "opacity-100 translate-y-0" : "opacity-50 translate-y-1"
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
            <div className="ml-auto flex items-center gap-2">
               <button className="w-7 h-7 rounded-full bg-white/5 flex items-center justify-center text-white hover:bg-white/20 transition-all border border-white/10">
                <Plus size={14} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
