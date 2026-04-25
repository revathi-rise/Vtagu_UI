'use client';

import React from 'react';
import { Play, Plus, BellRing } from 'lucide-react';
import VideoPlayer from './VideoPlayer';

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
        relative rounded-[2.5rem] bg-[#0c0816] transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
        border-[10px] border-[#1a1329] shadow-[0_15px_35px_rgba(0,0,0,0.6),inset_0_1px_2px_rgba(255,255,255,0.1)]
        ${isHovered 
          ? `z-50 shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.3)] border-[#251b3a] ${isRow ? 'scale-110 -translate-y-[5%]' : 'scale-105 -translate-y-2'}` 
          : 'scale-100 z-10'}
      `}
      style={{ transformOrigin }}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className={`relative w-full overflow-hidden rounded-[1.8rem] transition-all duration-500 ${isComingSoon ? 'h-48' : isRow ? 'aspect-video' : 'h-72'}`}>
        <img 
          src={image} 
          alt={title} 
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ${isHovered ? 'opacity-40 scale-110' : 'opacity-100 brightness-75'}`} 
        />
        
        {/* Skeuomorphic Inner Shadow */}
        <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />

        {/* Play Button Overlay (Cyan) */}
        <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-110 opacity-100' : 'scale-90 opacity-0'}`}>
           <div className="w-16 h-16 rounded-full bg-cyan-400/20 backdrop-blur-md flex items-center justify-center border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
              <Play className="w-8 h-8 text-cyan-400 fill-cyan-400 ml-1" />
           </div>
        </div>

        {/* Video Overlay */}
        <div className={`absolute inset-0 bg-black transition-opacity duration-700 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
          {isHovered && (
             <VideoPlayer 
               src={videoSrc || "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"} 
               autoPlay
               loop
               muted
               showControls={false}
               className="w-full h-full object-cover opacity-60"
             />
          )}
          {/* Subtle gradient at bottom for seamless blend */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
          
          {/* Re-add Play button over video if needed, but the image shows it persistent/on hover */}
          <div className="absolute inset-0 flex items-center justify-center">
             <div className="w-14 h-14 rounded-full bg-cyan-400/20 backdrop-blur-md flex items-center justify-center border border-cyan-400/40">
                <Play className="w-6 h-6 text-cyan-400 fill-cyan-400 ml-1" />
             </div>
          </div>
        </div>
      </div>

      <div className={`relative bg-[#0c0816] rounded-b-[2.5rem] z-20 transition-all duration-500 overflow-hidden ${
        isRow 
          ? (isHovered ? 'max-h-[300px] opacity-100 p-5' : 'max-h-0 opacity-0 p-0 m-0 border-none')
          : 'p-6'
      }`}>
        {date && (
          <small className="text-[10px] md:text-xs uppercase text-cyan-400 tracking-widest font-black mb-1 block">
            {date}
          </small>
        )}
        <h3 className="text-[16px] font-black tracking-tight text-white uppercase">{title}</h3>
        
        {description && (
          <p className="mt-2 text-xs text-gray-400/80 line-clamp-2 leading-relaxed font-medium">
            {description}
          </p>
        )}
        
        <div className={`mt-5 flex items-center gap-3 transition-all duration-500`}>
          {isComingSoon ? (
            <button className="flex-1 bg-white/5 hover:bg-white/10 text-white py-2.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all border border-white/10">
              <BellRing size={16} /> Remind Me
            </button>
          ) : (
            <>
              <button className="flex-1 bg-cyan-400 hover:bg-cyan-300 text-black py-2.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center justify-center gap-2 transition-all shadow-[0_10px_20px_rgba(34,211,238,0.2)]">
                <Play size={16} className="fill-current" /> Watch
              </button>
              <button className="h-10 w-10 flex items-center justify-center rounded-full border border-white/10 text-white hover:bg-white/10 flex-shrink-0 transition-all shadow-inner">
                <Plus size={18} />
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
