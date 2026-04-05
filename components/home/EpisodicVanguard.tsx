'use client';

import React, { useState, useRef } from 'react';
import { Zap, Play, Plus, Film, ArrowLeft, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { Episode } from '@/lib/vtagu.api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';

import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

interface EpisodicVanguardProps {
  episodes: Episode[];
}

export default function EpisodicVanguard({ episodes }: EpisodicVanguardProps) {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredId(id);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredId(null);
  };

  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-16 bg-[#0f0a19] overflow-visible">
      <div className="max-w-[95%] lg:max-w-[90%] mx-auto overflow-visible">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-4">
          <SectionTitle
            title="EPISODIC "
            subtitle="Premium Collection"
            Icon={Film}
            gradientText="VANGUARD"
            viewAllHref="#"
          />
        </div>

        {/* Carousel Container */}
        <div className="relative group/slider overflow-visible">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            spaceBetween={20}
            slidesPerView={1.4}
            freeMode={true}
            navigation={{
              prevEl: '.episodic-prev',
              nextEl: '.episodic-next',
            }}
            breakpoints={{
              640: { slidesPerView: 2.5 },
              1024: { slidesPerView: 3.8 },
              1440: { slidesPerView: 4.8 },
              1800: { slidesPerView: 5.5 },
            }}
            className="!overflow-visible !px-4"
          >
            {episodes.map((episode) => {
              const isHovered = hoveredId === episode.episode_id;
              
              // Determine preview source: Use a placeholder GIF or a potential gif field if it existed
              const previewGif = `https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp9m8vG6P6M/giphy.gif`; // Cinematic abstract GIF

              return (
                <SwiperSlide key={episode.episode_id} className="!overflow-visible">
                  <Link
                    href={`/episodes/${slugify(episode.title)}`}
                    className="relative cursor-pointer block"
                    onMouseEnter={() => handleMouseEnter(episode.episode_id)}
                    onMouseLeave={handleMouseLeave}
                  >
                    {/* Full-Cover Premium Card */}
                    <div
                      className={`
                        skeuo-card relative w-full aspect-[2/3.2] overflow-hidden
                        transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                        ${isHovered
                          ? "scale-105 -translate-y-4 z-50 shadow-[0_45px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.3)] border-cyan-400/30"
                          : "scale-100 z-10 border-[#1a1329]"}
                      `}
                    >
                      {/* Rotating Cinematic Border (Reduced opacity for subtlety) */}
                      {isHovered && (
                          <div className="absolute inset-0 rounded-[2rem] overflow-hidden pointer-events-none transition-opacity duration-500 z-20">
                              <div 
                                  className="absolute top-1/2 left-1/2 aspect-square w-[250%] -translate-x-1/2 -translate-y-1/2 animate-spin mix-blend-screen opacity-20" 
                                  style={{ backgroundImage: 'conic-gradient(from 0deg, transparent 60%, rgba(139,92,246,0.4) 75%, #22d3ee 100%)', animationDuration: '4s' }}
                              />
                          </div>
                      )}

                      {/* Main Media Background */}
                      <div className="absolute inset-0 w-full h-full bg-[#0c0816]">
                          {/* Thumbnail */}
                          <img
                            src={episode.image && typeof episode.image === 'string' && episode.image !== '0' 
                              ? episode.image 
                              : `https://picsum.photos/seed/${episode.episode_id + 500}/600/900`}
                            alt={episode.title}
                            className={`
                                absolute inset-0 w-full h-full object-cover
                                transition-all duration-1000
                                ${isHovered ? "opacity-0 scale-110" : "opacity-100 brightness-90"}
                              `}
                          />

                          {/* GIF/Video Preview Layer */}
                          {isHovered && (
                            <motion.div 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ duration: 0.8 }}
                              className="absolute inset-0 w-full h-full z-0"
                            >
                              <img
                                src={previewGif}
                                alt="Preview"
                                className="w-full h-full object-cover brightness-75 scale-105"
                              />
                            </motion.div>
                          )}
                      </div>

                      {/* Content Overlay (Bottom-to-Top Gradient) */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

                      {/* Info & Actions Layer */}
                      <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                        
                        {/* Premium Badge & Icons Row */}
                        <div className={`flex items-center gap-3 mb-6 transition-all duration-500 ${isHovered ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-100'}`}>
                          {/* Premium Pill */}
                          <div className="bg-[#ff9900] text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-[0_5px_15px_rgba(255,153,0,0.4)]">
                            PREMIUM
                          </div>
                          
                          {/* Action Group */}
                          <div className="flex items-center gap-2 ml-auto pointer-events-auto">
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 rounded-xl bg-cyan-400 flex items-center justify-center text-black shadow-lg"
                            >
                              <Play size={20} className="fill-black ml-0.5" />
                            </motion.button>
                            <motion.button 
                              whileHover={{ scale: 1.1 }}
                              className="w-10 h-10 rounded-xl bg-[#1a1329]/80 backdrop-blur-md flex items-center justify-center text-cyan-400 border border-white/10"
                            >
                              <Zap size={18} />
                            </motion.button>
                          </div>
                        </div>

                        {/* Title & Metadata */}
                        <div className="space-y-2">
                           <h4 
                            className="text-[20px] md:text-[24px] font-bold text-white tracking-tight leading-tight"
                            style={{ fontFamily: 'var(--font-poppins)' }}
                          >
                            {episode.title}
                          </h4>

                          <div className="flex items-center gap-2 text-[12px] font-bold tracking-widest text-cyan-400 uppercase" style={{ fontFamily: 'var(--font-inter)' }}>
                            <span className="opacity-80">EPISODE</span>
                            <span className="text-white">/</span>
                            <span className="text-white">S{episode.season_id}</span>
                            <span className="text-white">/</span>
                            <span className="text-white">UHD</span>
                          </div>
                        </div>

                        {/* Reveal Description (Only on Hover) */}
                        <motion.div
                          initial={false}
                          animate={isHovered ? { height: 'auto', opacity: 1, marginTop: 16 } : { height: 0, opacity: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <p className="text-[13px] text-gray-300 leading-relaxed font-medium line-clamp-2" style={{ fontFamily: 'var(--font-inter)' }}>
                            Stream this exclusive production in stunning 4K Dolby Vision. Part of the Vanguard Originals collection.
                          </p>
                        </motion.div>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              );
            })}
          </Swiper>

          {/* Premium Carousel Navigation */}
          <button className="episodic-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-cyan-400 hover:text-black hover:scale-110 disabled:hidden shadow-2xl">
            <ArrowLeft size={24} />
          </button>
          <button className="episodic-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-cyan-400 hover:text-black hover:scale-110 disabled:hidden shadow-2xl">
            <ArrowRight size={24} />
          </button>

        </div>
      </div>
    </section>
  );
}
