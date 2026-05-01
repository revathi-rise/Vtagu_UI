'use client';

import React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { ChevronRight } from 'lucide-react';

interface GenreCardProps {
  title: string;
  image: string;
  onClick?: () => void;
  className?: string;
  color?: string; // Optional custom glow color
}

export const GenreCard = ({
  title,
  image,
  onClick,
  className,
  color = "rgba(168, 85, 247, 0.4)" // Default purple glow
}: GenreCardProps) => {
  return (
    <div 
      className={cn(
        "relative group cursor-pointer overflow-visible isolate",
        className
      )}
      onClick={onClick}
    >
      {/* 1. Dynamic Glow Layer */}
      <div 
        className="absolute -inset-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl z-0 rounded-3xl"
        style={{ background: `radial-gradient(circle, ${color} 0%, transparent 70%)` }}
      />

      {/* 2. Card Container */}
      <div className="relative z-10 aspect-[16/10] w-full rounded-2xl overflow-hidden bg-[#15131c] border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:-translate-y-2">
        
        {/* Background Image with Darkening Overlay */}
        <Image
          src={image || "https://picsum.photos/seed/genre/800/500"}
          alt={title || "Genre Image"}
          fill
          className="object-cover transition-transform duration-1000 group-hover:scale-110 group-hover:rotate-1"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-60" />

        {/* Content Layer */}
        <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
          
          {/* Decorative Icon or Element (The "Something Special") */}
          <div className="mb-2 opacity-0 -translate-y-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-y-0">
             <div className="w-10 h-10 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20">
                <ChevronRight className="text-white w-6 h-6" />
             </div>
          </div>

          <h3 className="text-2xl md:text-3xl font-black uppercase tracking-[0.2em] text-white drop-shadow-[0_5px_15px_rgba(0,0,0,0.8)] transition-all duration-500 group-hover:scale-110 group-hover:tracking-[0.3em]">
            {title}
          </h3>
          
          <div className="mt-4 h-[2px] w-0 bg-brand-gradient transition-all duration-700 group-hover:w-24" />
          
          <span className="mt-4 text-[10px] font-bold text-white/40 uppercase tracking-widest opacity-0 transition-opacity duration-500 group-hover:opacity-100">
            View Collection
          </span>
        </div>

        {/* Bottom Shimmer Effect */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/5 to-transparent -rotate-45 transition-transform duration-1000 translate-x-[-100%] group-hover:translate-x-[100%]" />
        </div>
      </div>
    </div>
  );
};
