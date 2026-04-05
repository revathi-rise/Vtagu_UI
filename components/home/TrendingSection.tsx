'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Zap, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { Series } from '@/lib/vtagu.api';

interface TrendingSectionProps {
  seriesData: Series[];
}

export default function TrendingLandscape({ seriesData }: TrendingSectionProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: number) => {
    timeoutRef.current = setTimeout(() => {
      setHoveredId(id);
    }, 300);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredId(null);
  };

  if (!seriesData || seriesData.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-12 bg-[#0f0a19]">
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <SectionTitle
            title="SOON TO "
            subtitle="Coming Soon"
            Icon={Zap}
            gradientText="STREAM"
            viewAllHref="#"
          />
        </div>

        {/* Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >

          {seriesData.map((movie) => {
            const isHovered = hoveredId === movie.series_id;

            return (
              <div
                key={movie.series_id}
                className="relative group/trending"
                onMouseEnter={() => handleMouseEnter(movie.series_id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Premium Skeuomorphic Card with Magnific Focus */}
                <div
                  className={`
                    skeuo-card relative w-full overflow-hidden
                    transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isHovered
                      ? "scale-110 -translate-y-4 z-50 shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.3)] border-cyan-400/50"
                      : "scale-100 z-10 border-[#1a1329]"}
                  `}
                >
                  {/* Rotating Cinematic Border (Only on Hover) */}
                  {isHovered && (
                      <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none transition-opacity duration-500">
                          <div 
                              className="absolute top-1/2 left-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 animate-spin mix-blend-screen opacity-40" 
                              style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 60%, rgba(139,92,246,0.5) 75%, #22d3ee 100%)', animationDuration: '3s' }}
                          />
                      </div>
                  )}

                  {/* Inner Card Content */}
                  <div className="relative bg-[#0c0816] rounded-[calc(2rem-4px)] overflow-hidden z-10 w-full h-full flex flex-col shadow-[inset_0_2px_20px_rgba(0,0,0,0.9)]">

                  {/* Media Layer */}
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`https://picsum.photos/seed/${movie.series_id + 22}/800/450`}
                      alt={movie.title}
                      className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-all duration-1000
                          ${isHovered ? "opacity-20 scale-125 blur-[2px]" : "opacity-100 brightness-75"}
                        `}
                    />

                    {/* Play Button Overlay: Magnific Popup Style */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <motion.div 
                        whileHover={{ scale: 1.1 }}
                        className="w-14 h-14 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.6)]"
                      >
                        <Play size={24} className="fill-black ml-1" />
                      </motion.div>
                    </div>

                    {/* Preview GIF Layer */}
                    {isHovered && (
                      <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMGpxxcaeqpI0o/giphy.gif"
                        className="absolute inset-0 w-full h-full object-cover opacity-60 mix-blend-screen transition-opacity duration-700"
                        alt="Preview"
                      />
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0816] via-transparent to-transparent opacity-90" />
                  </div>

                  {/* Info Section: Dynamic Revealing */}
                  <div className="p-5 flex flex-col justify-between min-h-[150px]">
                    <div className="space-y-2">
                       {/* Title: Poppins SemiBold */}
                      <h4 
                        className="text-[20px] md:text-[24px] font-semibold text-white uppercase tracking-tight leading-tight group-hover:text-cyan-400 transition-colors"
                        style={{ fontFamily: 'var(--font-poppins)' }}
                      >
                        {movie.title}
                      </h4>

                      <div className="flex items-center gap-3 text-[12px] md:text-[14px] font-normal tracking-wide text-gray-400 uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
                        <span className="text-cyan-400 font-medium">{movie.rating ? `${movie.rating * 20}% Match` : '98% Match'}</span>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span className="glass-panel px-2 py-0.5 rounded text-[10px] text-white">4K UHD</span>
                        <div className="w-1 h-1 rounded-full bg-gray-600" />
                        <span>{movie.year || '2024'}</span>
                      </div>
                    </div>

                    {/* Cinematic Description Reveal */}
                    <div
                      className={`
                          transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] overflow-hidden
                          ${isHovered ? "max-h-[80px] opacity-100 mt-4 translate-y-0" : "max-h-0 opacity-0 translate-y-4"}
                        `}
                    >
                      <p className="text-[14px] text-gray-400 leading-relaxed font-normal line-clamp-3" style={{ fontFamily: 'var(--font-inter)' }}>
                        {movie.description_short || 'Experience a world of mystery and intrigue in this exclusive new series. Stream every episode now.'}
                      </p>
                    </div>

                    {/* Action Group: Animated Slide-Up */}
                    <div className={`flex items-center gap-3 transition-all duration-500 delay-100 ${isHovered ? "mt-5 opacity-100 translate-y-0" : "mt-0 opacity-0 translate-y-10"}`}>
                      <button className="flex-1 bg-cyan-400 text-black font-bold uppercase tracking-widest py-2.5 rounded-full text-[11px] flex items-center justify-center gap-2 hover:bg-cyan-300 transition-all shadow-[0_10px_20px_rgba(34,211,238,0.3)] active:scale-95">
                        <Play size={16} fill="currentColor" />
                        Resume
                      </button>

                      <button className="w-10 h-10 flex items-center justify-center glass-panel rounded-full hover:bg-white/10 transition-all text-white active:scale-90">
                        <Plus size={18} />
                      </button>
                    </div>

                  </div>
                  </div>
                </div>
              </div>
            );
          })}

        </motion.div>
      </div>
    </section>
  );
}