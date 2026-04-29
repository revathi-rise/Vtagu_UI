"use client";

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { Play, Info, Star, Calendar, Clock, ChevronLeft, ChevronRight } from "lucide-react";
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
  slug: string;
  badge?: string;
}

interface ListingHeroProps {
  items: ListingHeroItem[];
  basePath: string;
}

export default function ListingHero({ items, basePath }: ListingHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  const nextSlide = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  if (!items || items.length === 0) return null;

  const currentItem = items[activeIndex];

  return (
    <section className="relative h-[60vh] sm:h-[65vh] md:h-[75vh] w-full overflow-hidden flex items-end group/hero">
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
          <Image
            src={currentItem.image}
            alt={currentItem.title}
            fill
            className="object-cover brightness-[0.4]"
            priority
            unoptimized
          />
          {/* Cinematic Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#050505] via-[#050505]/40 to-transparent z-10" />
        </motion.div>
      </AnimatePresence>

      {/* Content Layer */}
      <div className="relative z-20 max-w-[90%] mx-auto pb-10 sm:pb-16 w-full">
        <div className="flex flex-col gap-6 max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-col gap-6"
            >
              {/* Badge */}
              <div className="flex items-center gap-3">
                <span className="bg-primary text-black text-[10px] font-black uppercase px-2 py-1 rounded shadow-[0_0_15px_rgba(50,153,255,0.5)] tracking-widest">
                  {currentItem.badge || "#1 Trending"}
                </span>
                {currentItem.rating && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-400">
                    <Star size={14} fill="currentColor" />
                    {currentItem.rating}
                  </div>
                )}
              </div>

              <h1 className="text-3xl sm:text-5xl md:text-7xl font-bold tracking-tighter text-white uppercase drop-shadow-2xl">
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

              <p className="text-[11px] sm:text-sm md:text-base text-white/50 line-clamp-3 leading-relaxed max-w-2xl font-medium">
                {currentItem.description}
              </p>

              <div className="flex items-center gap-4 pt-4">
                <Link
                  href={`${basePath}/${currentItem.slug}`}
                  className="bg-primary hover:bg-primary/80 text-black px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95"
                >
                  <Play size={16} fill="currentColor" /> Watch Now
                </Link>
                <button className="bg-white/5 hover:bg-white/10 backdrop-blur-md border border-white/10 text-white px-5 sm:px-8 py-3 sm:py-4 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all flex items-center gap-2 active:scale-95">
                  <Info size={16} /> Info
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-10 bottom-16 z-30 flex items-center gap-4">
        <button
          onClick={prevSlide}
          className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all active:scale-90"
        >
          <ChevronLeft size={20} />
        </button>
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
        <button
          onClick={nextSlide}
          className="p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white hover:bg-primary hover:border-primary transition-all active:scale-90"
        >
          <ChevronRight size={20} />
        </button>
      </div>
    </section>
  );
}
