"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Plus, Star, Calendar, Clock, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ListingHeroItem {
  id: string | number;
  title: string;
  description: string;
  image: string;
  rating?: string | number;
  year?: string | number;
  duration?: string;
  slug?: string;
  link?: string;
  badge?: string;
  languages?: string;
  trailerUrl?: string;
}

interface ListingHeroProps {
  items: ListingHeroItem[];
  basePath: string;
}

export default function ListingHero({ items, basePath }: ListingHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
    setVideoError(false);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
    setVideoError(false);
  }, [items.length]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    const currentItem = items[activeIndex];
    if (!currentItem?.trailerUrl || videoError) {
      timer = setInterval(nextSlide, 10000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [nextSlide, activeIndex, items, videoError]);

  if (!items || items.length === 0) return null;

  const currentItem = items[activeIndex];

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden bg-[#0f0a10]">
      {/* Background Image Layer */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0 z-0"
        >
          {currentItem.trailerUrl ? (
            <video
              src={currentItem.trailerUrl}
              autoPlay
              muted={isMuted}
              playsInline
              onEnded={nextSlide}
              onError={() => setVideoError(true)}
              className="absolute inset-0 w-full h-full object-cover"
              poster={currentItem.image}
            />
          ) : (
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              className="object-cover"
              priority
              unoptimized
            />
          )}
          {/* Multi-layered Gradients from HeroSection */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a10] via-[#0f0a10]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a10] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer (Draggable for Swipe Navigation) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset }) => {
          const swipeThreshold = 50;
          if (offset.x > swipeThreshold) {
            prevSlide();
          } else if (offset.x < -swipeThreshold) {
            nextSlide();
          }
        }}
        className="relative z-20 h-full w-full max-w-[90%] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 flex flex-col justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Badge System */}
              {(currentItem.badge || currentItem.rating) && (
                <div className="flex items-center gap-4">
                  {currentItem.badge && (
                    <div className="glass-panel px-4 py-1.5 rounded-full border-white/20 flex items-center gap-2 bg-white/5 backdrop-blur-md">
                      <span className="text-[10px] md:text-[12px] font-bold text-primary tracking-[0.2em] uppercase">
                        {currentItem.badge}
                      </span>
                    </div>
                  )}
                  {currentItem.rating && (
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/10">
                      <Star className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
                      <span className="font-bold text-white text-[12px] md:text-[14px]">{currentItem.rating}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              <h1 className="text-[20px] md:text-[40px] lg:text-[60px] font-black tracking-tighter uppercase leading-[0.9] text-white italic skeuo-title-3d drop-shadow-2xl">
                {currentItem.title}
              </h1>

              {/* Metadata */}
              <div className="flex items-center gap-4 text-xs font-bold text-white/60 uppercase tracking-widest">
                {currentItem.year && (
                  <span className="flex items-center gap-1">
                    <Calendar size={14} className="text-primary" /> {currentItem.year}
                  </span>
                )}
                {currentItem.duration && (
                  <span className="flex items-center gap-1">
                    <Clock size={14} className="text-primary" /> {currentItem.duration}
                  </span>
                )}
                <span className="border border-white/20 px-2 py-0.5 rounded text-[10px]">4K HDR</span>
              </div>

              {/* Description */}
              <div 
                className="text-[11px] sm:text-sm md:text-base text-white/70 line-clamp-3 leading-relaxed max-w-xl font-medium [&_p]:inline [&_p]:m-0 [&_p]:p-0"
                dangerouslySetInnerHTML={{ __html: currentItem.description || '' }}
              />

              {/* Languages Row */}
              {currentItem.languages && currentItem.languages.trim() !== "" && (
                <div className="flex flex-wrap items-center gap-2 text-white/70 text-xs md:text-sm font-medium">
                  <span className="text-white/40 uppercase tracking-[0.15em] text-[10px] md:text-[11px] font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" /> Languages:
                  </span>
                  {currentItem.languages.split(',').map((lang) => (
                    <span 
                      key={lang} 
                      className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-bold border border-white/5 shadow-sm uppercase tracking-wider"
                    >
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-row items-center gap-3 pt-4">
                <Link
                  href={currentItem.link || `${basePath}/${currentItem.slug || ""}`}
                  className="flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-primary text-black font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_10px_20px_rgba(50,153,255,0.4)] active:scale-95 text-sm sm:text-base"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                  Watch Now
                </Link>
                <button className="flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full glass-panel text-white font-bold uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 border-white/20 text-sm sm:text-base bg-white/5 backdrop-blur-md">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watchlist
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* Navigation Controls */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-4 sm:gap-6">
        <div className="flex gap-2 sm:gap-3 items-center">
          {currentItem.trailerUrl && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl mr-2"
              title={isMuted ? "Unmute Trailer" : "Mute Trailer"}
            >
              {isMuted ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
              )}
            </button>
          )}
          <button 
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl"
          >
            <ChevronRight size={20} />
          </button>
        </div>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === activeIndex ? "w-8 bg-primary shadow-[0_0_10px_rgba(50,153,255,0.8)]" : "w-1.5 bg-white/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
