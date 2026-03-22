'use client';

import React, { useState, useRef } from 'react';
import { Zap, Play, Plus } from 'lucide-react';
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {TRENDING_MOVIES.map((movie) => {
            const isHovered = hoveredId === movie.id;

            return (
              <div
                key={movie.id}
                className="relative"
                onMouseEnter={() => handleMouseEnter(movie.id)}
                onMouseLeave={handleMouseLeave}
              >
                {/* Gradient Border */}
                <div
                  className={`
                    rounded-2xl p-[2px] transition-all duration-300
                    ${isHovered
                      ? "bg-gradient-to-r from-[#3299FF] to-[#9248FF] shadow-lg"
                      : "bg-transparent"}
                  `}
                >
                  {/* Card */}
                  <div
                    className={`
                      bg-[#1a1329] rounded-[14px] overflow-hidden
                      transition-all duration-300
                      ${isHovered ? "scale-[1.04]" : ""}
                    `}
                  >

                    {/* Media */}
                    <div className="relative aspect-video overflow-hidden">

                      {/* Thumbnail */}
                      <img
                        src={`https://picsum.photos/seed/${movie.id + 22}/800/450`}
                        alt={movie.title}
                        className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-opacity duration-500
                          ${isHovered ? "opacity-0" : "opacity-100"}
                        `}
                      />

                      {/* Preview */}
                      <img
                        src="https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExNHJueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueW9ueSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/3o7TKMGpxxcaeqpI0o/giphy.gif"
                        className={`
                          absolute inset-0 w-full h-full object-cover
                          transition-opacity duration-500
                          ${isHovered ? "opacity-70" : "opacity-0"}
                        `}
                        alt="Preview"
                      />

                      {/* Gradient overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1a1329] via-transparent to-transparent" />
                    </div>

                    {/* Info Section */}
                    <div className="p-4 flex flex-col justify-between min-h-[140px]">

                      {/* Title */}
                      <div>
                        <h4 className="text-lg font-bold text-white truncate">
                          {movie.title}
                        </h4>

                        <div className="flex items-center gap-2 mt-1 text-[11px] font-semibold text-gray-400">
                          <span className="text-[#3299FF]">98% Match</span>
                          <span className="px-1 border border-gray-600 rounded text-[9px] text-white">
                            {movie.quality}
                          </span>
                          <span>{movie.duration}</span>
                        </div>
                      </div>

                      {/* Description (hover only) */}
                      <div
                        className={`
                          transition-all duration-300 ease-in-out overflow-hidden
                          ${isHovered ? "max-h-[60px] opacity-100 mt-2" : "max-h-0 opacity-0"}
                        `}
                      >
                        <p className="text-[12px] text-gray-400 line-clamp-2">
                          {movie.desc}
                        </p>
                      </div>

                      {/* Buttons (ALWAYS visible) */}
                      <div className="flex items-center gap-2 mt-3">
                        <button className="flex-1 bg-gradient-to-r from-[#3299FF] to-[#9248FF] text-white font-bold py-2 rounded-lg text-xs flex items-center justify-center gap-1 hover:opacity-90 transition">
                          <Play size={14} fill="currentColor" />
                          Play
                        </button>

                        <button className="p-2 bg-white/10 hover:bg-white/20 rounded-lg border border-white/5">
                          <Plus size={16} className="text-white" />
                        </button>
                      </div>

                    </div>
                  </div>
                </div>
              </div>
            );
          })}

        </div>
      </div>
    </section>
  );
}