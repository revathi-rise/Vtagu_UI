'use client';

import React from 'react';
import { Play, Plus, BellRing } from 'lucide-react';

interface HoverVideoCardProps {
  title: string;
  description?: string;
  image: string;
  videoSrc?: string;
  date?: string;
  isHovered: boolean;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  transformOrigin?: 'left' | 'center' | 'right';
  layout?: 'featured' | 'coming-soon' | 'row';
}

export default function HoverVideoCard({
  title, description, image, videoSrc, date,
  isHovered, onMouseEnter, onMouseLeave,
  transformOrigin = 'center', layout = 'featured'
}: HoverVideoCardProps) {
  const isComingSoon = layout === 'coming-soon';
  const isRow = layout === 'row';

  return (
    <article 
      className={`
        relative rounded-xl border border-white/10 bg-[#1a1329] shadow-xl
        transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        ${isHovered 
          ? `z-50 shadow-[0_30px_60px_rgba(0,0,0,0.8)] border-white/30 ${isRow ? 'scale-110 -translate-y-[10%]' : 'scale-105 -translate-y-2'}` 
          : 'scale-100 z-10'}
      `}
      style={{ transformOrigin }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`relative w-full overflow-hidden transition-all duration-500 ${isRow && !isHovered ? 'rounded-xl' : 'rounded-t-xl'} ${isComingSoon ? 'h-48' : isRow ? 'aspect-video' : 'h-64'}`}>
        <img 
          src={image} 
          alt={title} 
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${isHovered ? 'opacity-0' : 'opacity-100 brightness-90'}`} 
        />
        
        {/* Video Overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isHovered && (
             <video 
               src={videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"} 
               autoPlay
               loop
               muted
               playsInline
               className="w-full h-full object-cover opacity-80"
             />
          )}
          {/* Subtle gradient at bottom for seamless blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1a1329] via-[#1a1329]/40 to-transparent" />
        </div>
      </div>

      <div className={`relative bg-[#1a1329] rounded-b-xl z-20 transition-all duration-500 overflow-hidden ${
        isRow 
          ? (isHovered ? 'max-h-[300px] opacity-100 p-4 md:p-5' : 'max-h-0 opacity-0 p-0 m-0 border-none')
          : 'p-5 md:p-6'
      }`}>
        {date && (
          <small className="text-[10px] md:text-xs uppercase text-purple-400 tracking-wider font-bold mb-1 block">
            {date}
          </small>
        )}
        <h3 className="text-lg md:text-2xl font-extrabold tracking-tight text-white">{title}</h3>
        
        {description && (
          <p className="mt-2 text-xs md:text-sm text-gray-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        )}
        
        <div className={`mt-5 flex items-center gap-3 transition-all duration-500`}>
          {isComingSoon ? (
            <button className="flex-1 bg-white/10 hover:bg-white/20 text-white py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors border border-white/10 hover:border-white/30">
              <BellRing size={16} /> Remind Me
            </button>
          ) : (
            <>
              <button className="flex-1 bg-white hover:bg-gray-200 text-black py-2 md:py-2.5 rounded-lg text-xs md:text-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-lg">
                <Play size={16} className="fill-current" /> Watch Now
              </button>
              <button className="h-9 w-9 md:h-10 md:w-10 flex items-center justify-center rounded-full border border-white/30 text-white hover:bg-white/20 flex-shrink-0 transition-colors">
                <Plus size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
