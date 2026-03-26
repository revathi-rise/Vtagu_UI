'use client';

import React, { useState, useRef } from 'react';
import { Zap, Play, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const TRENDING_MOVIES = [
  { id: 1, title: "The Cosmic Voyager", duration: "2h 15m", quality: "8K", desc: "A journey beyond the stars to find a new home for humanity." },
  { id: 2, title: "Midnight Echoes", duration: "1h 45m", quality: "4K", desc: "A sound engineer discovers a frequency that shouldn't exist." },
  { id: 3, title: "Neon Jungle", duration: "2h 05m", quality: "4K", desc: "In a futuristic city, a mercenary takes one last job." },
  { id: 4, title: "Desert Mirage", duration: "2h 30m", quality: "8K", desc: "Exploring the secrets hidden beneath the shifting sands." },
];

export default function TrendingLandscape() {
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

  return (
    <section className="w-full py-12 bg-[#0f0a19]">
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <SectionTitle
            title="Trending Now"
            subtitle="What's Hot"
            Icon={Zap}
            gradientText="Trending"
            viewAllHref="/trending"
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

          {TRENDING_MOVIES.map((movie) => {
            const isHovered = hoveredId === movie.id;

            return (
              <div
                key={movie.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(movie.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Card */}
                <div
                  className={`
                    bg-[#0c0816] rounded-[2rem] overflow-hidden
                    transition-all duration-500 border-[8px]
                    ${isHovered
                      ? "scale-[1.05] -translate-y-2 border-[#251b3a] shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.3)]"
                      : "border-[#1a1329] shadow-lg"}
                  `}
                >

                  {/* Media */}
                  <div className="relative aspect-video overflow-hidden rounded-[1.5rem]">

                    {/* Thumbnail */}
                    <img
                      src={`https://picsum.photos/seed/${movie.id + 22}/800/450`}
                      alt={movie.title}
                      className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-all duration-500
                          ${isHovered ? "opacity-30 scale-110" : "opacity-100 brightness-75"}
                        `}
                    />

                    {/* Skeuomorphic Inner Shadow */}
                    <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] pointer-events-none" />

                    {/* Play Button Overlay (Cyan) */}
                    <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                      <div className="w-12 h-12 rounded-full bg-cyan-400/20 backdrop-blur-md flex items-center justify-center border border-cyan-400/40 shadow-[0_0_20px_rgba(34,211,238,0.3)]">
                        <Play size={20} className="text-cyan-400 fill-cyan-400 ml-1" />
                      </div>
                    </div>

                    {/* Preview Image/Gif */}
                    <img
                      src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMGpxxcaeqpI0o/giphy.gif"
                      className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-opacity duration-700
                          ${isHovered ? "opacity-60" : "opacity-0"}
                        `}
                      alt="Preview"
                    />

                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </div>

                  {/* Info Section */}
                  <div className="p-5 flex flex-col justify-between min-h-[140px]">

                    {/* Title */}
                    <div>
                      <h4 className="text-sm font-black text-white uppercase tracking-widest truncate">
                        {movie.title}
                      </h4>

                      <div className="flex items-center gap-2 mt-2 text-[10px] font-black tracking-widest text-gray-400 uppercase">
                        <span className="text-cyan-400">98% Match</span>
                        <span className="px-1.5 border border-white/10 rounded-sm text-[9px] text-white bg-white/5">
                          {movie.quality}
                        </span>
                        <span>{movie.duration}</span>
                      </div>
                    </div>

                    {/* Description (hover only) */}
                    <div
                      className={`
                          transition-all duration-500 ease-in-out overflow-hidden
                          ${isHovered ? "max-h-[60px] opacity-100 mt-3" : "max-h-0 opacity-0"}
                        `}
                    >
                      <p className="text-[11px] text-gray-400 leading-relaxed font-medium line-clamp-2">
                        {movie.desc}
                      </p>
                    </div>

                    {/* Buttons (ALWAYS visible in new style) */}
                    <div className="flex items-center gap-3 mt-4">
                      <button className="flex-1 bg-cyan-400 text-black font-black uppercase tracking-widest py-2 rounded-full text-[10px] flex items-center justify-center gap-1.5 hover:bg-cyan-300 transition-all shadow-[0_4px_10px_rgba(34,211,238,0.2)]">
                        <Play size={14} fill="currentColor" />
                        Watch
                      </button>

                      <button className="w-8 h-8 flex items-center justify-center bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-all text-white">
                        <Plus size={14} />
                      </button>
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