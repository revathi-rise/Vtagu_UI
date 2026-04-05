"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, Plus, Star, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';
import { Poster } from "@/lib/vtagu.api";
import Link from "next/link";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

interface HeroSectionProps {
  posters: Poster[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

export default function HeroSection({ posters = [] }: HeroSectionProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const videoSlide = {
    poster_id: -1,
    title: "VTAGU ORIGINALS",
    category: "FEATURED",
    rating: 5.0,
    description: "Experience the next level of immersive storytelling. Watch our latest original series and movies in stunning 4K HDR.",
    type: "video" as const,
    videoUrl: "https://vjs.zencdn.net/v/oceans.mp4",
    image: "/assets/dashboard/thumb1.png",
    link: "#"
  };

  const movieSlides = posters.map((poster: Poster) => ({
    ...poster,
    title: poster.poster_id === 28 ? "THE RISE OF VTAGU" : `PRIME EXCLUSIVE ${poster.poster_id}`,
    category: "EXCLUSIVE",
    rating: 4.8,
    description: "Discover a curated selection of premium content tailored for your entertainment. High-quality streaming across all your devices.",
    type: "image" as const,
    image: `${IMAGE_BASE_URL}${poster.path}`,
  }));

  const allSlides = [videoSlide, ...movieSlides];

  const handleThumbnailClick = (index: number) => {
    swiperRef.current?.slideToLoop(index);
  };

  if (allSlides.length === 0) {
    return (
      <section className="relative w-full h-[60vh] md:h-screen flex items-center justify-center bg-[#0f0a19]">
        <div className="text-white/20 text-sm font-bold tracking-[0.3em] uppercase animate-pulse">
          Premium Content Loading...
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#0f0a19]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 10000, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {allSlides.map((item: any, index: number) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center">

              {/* Cinematic Background Layer */}
              <div
                className={`absolute inset-0 transition-transform duration-[10s] ${activeIndex === index ? 'animate-kenburns scale-110' : ''}`}
              >
                {item.type === "video" && activeIndex === index ? (
                  <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-black">
                    <video
                      key={item.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="absolute inset-0 w-full h-full object-cover"
                      poster={item.image}
                    >
                      <source src={item.videoUrl} type="video/mp4" />
                    </video>
                  </div>
                ) : (
                  <Image
                    src={item.image || "/assets/placeholder.png"}
                    alt={item.title || "PrimeTime Title"}
                    fill
                    priority={index === 0}
                    className="object-cover"
                    sizes="100vw"
                  />
                )}
                
                {/* Multi-layered Gradients for Cinematic Depth */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/60 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-transparent to-transparent z-10" />
                <div className="absolute inset-0 bg-black/20 z-10" />
              </div>

              {/* Content Layer: Slide Up Intersection */}
              <div className="relative z-20 w-full mx-auto px-[5%] md:px-[8%] lg:px-[10%]">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  animate={activeIndex === index ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
                  transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
                  className="max-w-4xl"
                >
                  <div className="flex flex-col gap-8">
                    {/* Badge System */}
                    <div className="flex items-center gap-4">
                      <div className="glass-panel px-5 py-2 rounded-full shadow-2xl border-white/20 flex items-center gap-2">
                        <Zap size={14} className="text-cyan-400 fill-cyan-400 animate-pulse" />
                        <span className="text-[10px] md:text-[12px] font-bold text-white tracking-[0.2em] uppercase">
                          {item.category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 bg-black/60 backdrop-blur-xl py-2 px-5 rounded-full border border-white/10 shadow-2xl">
                        <Star className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
                        <span className="font-bold text-white text-[12px] md:text-[14px]">{item.rating}</span>
                      </div>
                    </div>

                    {/* Main Responsive Title: Poppins Bold */}
                    <h1 
                      className="text-[40px] md:text-[64px] lg:text-[80px] font-bold text-white leading-[0.95] tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]"
                      style={{ fontFamily: 'var(--font-poppins)' }}
                    >
                      {item.title}
                    </h1>

                    {/* Cinematic Description: Inter Regular */}
                    <p className="text-[16px] md:text-[18px] lg:text-[20px] text-white/70 leading-relaxed max-w-2xl font-normal drop-shadow-lg" style={{ fontFamily: 'var(--font-inter)' }}>
                      {item.description}
                    </p>

                    {/* Primary Actions: Skeuomorphic Buttons */}
                    <div className="flex flex-wrap items-center gap-6 mt-4">
                      <Link
                        href={item.link || "#"}
                        className="h-14 md:h-16 px-10 md:px-12 flex items-center justify-center gap-4 rounded-full bg-cyan-400 text-black font-bold uppercase tracking-widest transition-all hover:scale-110 hover:bg-cyan-300 hover:shadow-[0_20px_40px_rgba(34,211,238,0.4)] active:scale-95 shadow-2xl"
                      >
                        <Play className="w-6 h-6 fill-black" />
                        Watch Now
                      </Link>
                      <button className="h-14 md:h-16 px-10 md:px-12 flex items-center justify-center gap-4 rounded-full glass-panel text-white font-bold uppercase tracking-widest transition-all hover:bg-white/10 active:scale-95 border-white/20 shadow-2xl">
                        <Plus className="w-6 h-6" />
                        Watchlist
                      </button>
                    </div>

                    {/* Dynamic Interactive Thumbnails (Laptop+) */}
                    <div className="hidden lg:flex gap-6 mt-12 overflow-visible">
                      {allSlides.slice(0, 4).map((thumbItem, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleThumbnailClick(idx)}
                          className={`
                            relative w-48 xl:w-56 aspect-video rounded-3xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] skeuo-card border-[3px] 
                            ${activeIndex === idx
                              ? "scale-110 -translate-y-2 border-cyan-400 z-30 shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.3)]"
                              : "border-[#1a1329] opacity-40 hover:opacity-100 hover:scale-105 hover:border-white/20"
                            }
                          `}
                        >
                          <Image src={thumbItem.image} alt={thumbItem.title} fill sizes="20vw" className="object-cover" />
                          {activeIndex === idx && (
                            <div className="absolute bottom-0 left-0 h-1.5 bg-cyan-400 w-full animate-progress" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      
      {/* Cinematic Vignette Overlay */}
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)] z-10" />
    </section>
  );
}