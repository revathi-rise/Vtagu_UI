"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Play, Plus, Star, ChevronLeft, ChevronRight, Globe, Volume2, VolumeX } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Poster, Movie, Episode } from "@/lib/vtagu.api";
import HeroThumbnailSlider from "./HeroThumbnailSlider";

export interface HeroItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: string;
  link: string;
  languages?: string;
  trailerUrl?: string;
}

interface HeroSectionProps {
  posters: Poster[];
  movies?: Movie[];
  episodes?: Episode[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

export default function HeroSection({ posters = [], movies = [], episodes = [] }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  // Map API posters to HeroItem format
  const items: HeroItem[] = posters.map((poster) => {
    let rating = "";
    let link = poster.link || "";

    if (poster.reference_type === "movie" && poster.reference_id) {
      const movie = movies.find((m) => m.id === poster.reference_id);
      if (movie) {
        rating = movie.rating ? movie.rating.toString() : "";
        if (!link) {
          link = `/movies/${movie.slug}`;
        }
      }
    } else if ((poster.reference_type === "series" || poster.reference_type === "episode") && poster.reference_id) {
      const episode = episodes.find((e) => e.id === poster.reference_id || e.episodeId === poster.reference_id);
      if (episode) {
        rating = episode.rating ? episode.rating.toString() : "";
        if (!link) {
          link = `/episodes/${episode.slug || episode.id}`;
        }
      }
    }

    return {
      id: poster.poster_id,
      title: poster.poster_title || "",
      description: poster.description || "",
      image: poster.path.startsWith('http') ? poster.path : `${IMAGE_BASE_URL}${poster.path}`,
      category: poster.genres_list || "",
      rating,
      link: link || "#",
      languages: poster.languages || "",
      trailerUrl: poster.trailer_url || ""
    };
  });

  const currentItem = items[activeIndex];

  if (items.length === 0) return null;

  const nextSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = React.useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  React.useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden bg-[#0f0a10]">
      {/* 1. Background Image/Video with Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="absolute inset-0"
        >
          {currentItem.trailerUrl ? (
            <video
              src={currentItem.trailerUrl}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 w-full h-full object-cover"
              poster={currentItem.image}
            />
          ) : (
            <Image
              src={currentItem.image}
              alt={currentItem.title}
              fill
              priority
              className="object-cover"
              sizes="100vw"
            />
          )}
          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a10] via-[#0f0a10]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a10] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Content Layer (Draggable for Swipe Navigation) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(e, { offset, velocity }) => {
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
              {(currentItem.category || currentItem.rating) && (
                <div className="flex items-center gap-4">
                  {currentItem.category && (
                    <div className="glass-panel px-4 py-1.5 rounded-full border-white/20 flex items-center gap-2">
                      <span className="text-[10px] md:text-[12px] font-bold text-primary tracking-[0.2em] uppercase">
                        {currentItem.category}
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
              {currentItem.title && (
                <h1 className="title-h2 lg:text-[64px] xl:text-[80px] drop-shadow-2xl">
                  {currentItem.title}
                </h1>
              )}

              {/* Description */}
              {currentItem.description && (
                <p className="title-desc max-w-xl text-white/70">
                  {currentItem.description}
                </p>
              )}

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
                  href={currentItem.link}
                  className="flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-primary text-black font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_10px_20px_rgba(50,153,255,0.4)] active:scale-95 text-sm sm:text-base"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                  Watch Now
                </Link>
                <button className="flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full glass-panel text-white font-bold uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 border-white/20 text-sm sm:text-base">
                  <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                  Watchlist
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 3. Navigation Controls & Thumbnails */}
      {/* Mobile: bottom-center dots/arrows, Desktop: bottom-right with thumbnails */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-4 sm:gap-6">
        {/* Navigation Arrows & Volume */}
        <div className="flex gap-2 sm:gap-3 items-center">
          {currentItem.trailerUrl && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl mr-2"
              title={isMuted ? "Unmute Trailer" : "Mute Trailer"}
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
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

        <HeroThumbnailSlider 
          items={items} 
          activeIndex={activeIndex} 
          onThumbClick={handleThumbClick} 
        />
      </div>
    </section>
  );
}