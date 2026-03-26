"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { Play, Plus, Star } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, EffectFade } from "swiper/modules";
import type { Swiper as SwiperType } from 'swiper';

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

export const featuredMovies = [
  {
    id: 1,
    title: "The Last Hunt",
    rating: 4.9,
    category: "Trending Now",
    description: "In a world where survival is the only law, one man must face his past to protect his future.",
    image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=3840&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Dark Horizon",
    rating: 4.8,
    category: "New Releases",
    description: "A mysterious force threatens the universe and only one crew can stop it. An epic journey into the unknown.",
    image: "https://images.unsplash.com/photo-1505686994434-e3cc5abf1330?q=80&w=3840&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Neon Jungle",
    rating: 4.7,
    category: "Sci-Fi",
    description: "The neon lights hide a dark secret. Follow K-0 as they navigate corporate wars in 2099.",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=3840&auto=format&fit=crop",
  }
];

export default function HeroSection() {
  const [activeIndex, setActiveIndex] = useState(0);
  const swiperRef = useRef<SwiperType | null>(null);

  const handleThumbnailClick = (index: number) => {
    swiperRef.current?.slideToLoop(index);
  };

  return (
    <section className="hero-container relative w-full h-screen overflow-hidden bg-[#0f0a19]">
      <Swiper
        modules={[Autoplay, Pagination, EffectFade]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        loop
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="h-full"
      >
        {featuredMovies.map((movie, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full flex items-center">
              
              {/* Cinematic Background */}
              <div
                className="absolute inset-0 transition-transform duration-[10s]"
                style={{
                  animation: activeIndex === index ? 'kenburns 20s infinite alternate' : 'none'
                }}
              >
                <Image 
                  src={movie.image} 
                  alt={movie.title} 
                  fill 
                  priority={index === 0}
                  className="object-cover"
                  sizes="100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/70 md:via-[#0f0a19]/30 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-transparent to-transparent" />
              </div>

              {/* Content Wrapper */}
              <div className="content-container relative z-10 w-full mx-auto px-[5%]">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="max-w-full lg:max-w-[70%] xl:max-w-[60%] 2xl:max-w-[50%]"
                >
                  
                  {/* Badge Row */}
                  <div className="flex items-center gap-4 mb-4 md:mb-6">
                    <span className="badge px-4 py-1.5 rounded-sm bg-gradient-to-r from-[#3299FF] to-[#9248FF] text-white font-black uppercase tracking-widest shadow-lg shadow-blue-500/20">
                      {movie.category}
                    </span>
                    <div className="flex items-center gap-2 text-white bg-black/40 backdrop-blur-xl py-1.5 px-4 rounded-full border border-white/10">
                      <Star className="w-4 h-4 md:w-5 md:h-5 text-[#FACC15] fill-[#FACC15]" />
                      <span className="font-bold text-sm md:text-base">{movie.rating}</span>
                    </div>
                  </div>

                  {/* Fluid Title */}
                  <h1 className="hero-title text-white font-black leading-[1] tracking-tighter mb-6 md:mb-8 drop-shadow-2xl">
                    {movie.title}
                  </h1>

                  {/* Responsive Description */}
                  <p className="hero-description text-gray-300 leading-relaxed mb-8 md:mb-12 max-w-[95%] md:max-w-[85%]">
                    {movie.description}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-4 md:gap-6 mb-12">
                    <button className="h-[56px] px-10 flex items-center justify-center gap-3 rounded-full bg-cyan-400 text-black font-black uppercase tracking-widest transition-all hover:scale-105 hover:bg-cyan-300 active:scale-95 shadow-[0_10px_25px_rgba(34,211,238,0.3)]">
                      <Play className="w-5 h-5 fill-black" />
                      Watch Now
                    </button>
                    <button className="h-[56px] px-10 flex items-center justify-center gap-3 rounded-full bg-white/5 backdrop-blur-md text-white font-black uppercase tracking-widest transition-all hover:bg-white/10 border border-white/10 active:scale-95">
                      <Plus className="w-5 h-5" />
                      Add to List
                    </button>
                  </div>

                  {/* Interactive Thumbnails (Laptop and above) */}
                  <div className="hidden lg:flex gap-4 mt-8">
                    {featuredMovies.map((item, idx) => (
                      <button
                        key={item.id}
                        onClick={() => handleThumbnailClick(idx)}
                        className={`group relative w-40 xl:w-48 aspect-video rounded-2xl overflow-hidden transition-all duration-300 border-[4px] shadow-lg ${
                          activeIndex === idx 
                            ? "border-cyan-400 scale-105 shadow-[0_0_25px_rgba(34,211,238,0.4)]" 
                            : "border-[#1a1329] opacity-40 hover:opacity-100 hover:border-white/20"
                        }`}
                      >
                        <Image src={item.image} alt={item.title} fill sizes="(max-width: 1024px) 0vw, 20vw" className="object-cover" />
                        {activeIndex === idx && (
                          <div className="absolute bottom-0 left-0 h-1 bg-cyan-400 w-full animate-progress shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                        )}
                      </button>
                    ))}
                  </div>

                </motion.div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <style jsx global>{`
        /* 1. Fluid Typography & Sizing using your Breakpoints */
        :root {
          --fs-title: clamp(2.5rem, 8vw, 4.5rem);
          --fs-desc: clamp(1rem, 2vw, 1.25rem);
          --btn-h: 3.5rem;
          --btn-px: 2rem;
        }

        /* Desktop (1441px+) */
        @media (min-width: 1441px) {
          :root {
            --fs-title: 6rem;
            --fs-desc: 1.5rem;
            --btn-h: 4rem;
          }
        }

        /* TV (1921px+) */
        @media (min-width: 1921px) {
          :root {
            --fs-title: 8rem;
            --fs-desc: 2rem;
            --btn-h: 5rem;
            --btn-px: 3.5rem;
          }
          .content-container { max-width: 1800px; }
        }

        /* 4K TV (2560px+) */
        @media (min-width: 2560px) {
          :root {
            --fs-title: 10rem;
            --fs-desc: 2.5rem;
            --btn-h: 6rem;
          }
          .content-container { max-width: 2400px; }
        }

        .hero-title { font-size: var(--fs-title); }
        .hero-description { font-size: var(--fs-desc); }
        .btn-primary, .btn-secondary { 
          height: var(--btn-h); 
          padding-left: var(--btn-px); 
          padding-right: var(--btn-px);
          font-size: calc(var(--fs-desc) * 0.9);
        }

        .badge { font-size: clamp(0.6rem, 1vw, 0.85rem); }

        @keyframes kenburns {
          0% { transform: scale(1); }
          100% { transform: scale(1.15); }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
        .animate-progress { animation: progress 6s linear forwards; }
        
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </section>
  );
}