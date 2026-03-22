"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

const topShows = [
  { rank: 1, image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop", title: "Neon Pulse" },
  { rank: 2, image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=600&auto=format&fit=crop", title: "The Last Dawn" },
  { rank: 3, image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=600&auto=format&fit=crop", title: "Echoes of Time" },
  { rank: 4, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop", title: "Nightfall Stream" },
  { rank: 5, image: "https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=600&auto=format&fit=crop", title: "Solar Flares" },
  { rank: 6, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop", title: "Cyber Rift" },
  { rank: 7, image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop", title: "Overdrive" },
  { rank: 8, image: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop", title: "Bulletstorm" },
  { rank: 9, image: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=600&auto=format&fit=crop", title: "The Vault" },
  { rank: 10, image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop", title: "Stellar Void" },
];

export default function Top10Series() {
  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mb-12 relative z-10 w-full overflow-hidden">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-6 drop-shadow-md">
        Top 10 Series Today
      </h2>

      <div className="relative group/swiper">
        {/* Custom Prev Arrow */}
        <button className="swiper-custom-prev absolute left-0 md:-left-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(146,72,255,0.15)] opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-[#9248FF] hover:border-[#9248FF] hover:scale-110 disabled:opacity-0 disabled:cursor-default">
          <ChevronLeft size={22} strokeWidth={2.5} className="mr-0.5" />
        </button>

        <Swiper
          navigation={{
            nextEl: '.swiper-custom-next',
            prevEl: '.swiper-custom-prev',
          }}
          modules={[Navigation]}
          spaceBetween={16}
          slidesPerView={1.5}
          breakpoints={{
            481: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 20 },
            1025: { slidesPerView: 4.2, spaceBetween: 24 },
            1441: { slidesPerView: 5.2, spaceBetween: 28 },
            1921: { slidesPerView: 7.2, spaceBetween: 32 },
            2560: { slidesPerView: 9.2, spaceBetween: 32 },
          }}
          className="pb-12 pt-6 !px-6 -mx-6 !overflow-visible"
        >
          {topShows.map((show) => (
            <SwiperSlide key={show.rank} className="group cursor-pointer">
              <div className="relative flex items-end h-[180px] md:h-[240px] w-[95%] mx-auto mt-4 transition-transform duration-300 group-hover:-translate-y-4">
                
                {/* Netflix-style Ranked Number */}
                <span className="absolute -left-1 md:-left-4 -bottom-4 md:-bottom-5 text-[80px] md:text-[110px] font-black leading-none text-[#0f0a19] z-20 pointer-events-none drop-shadow-2xl select-none tracking-tighter"
                      style={{
                        WebkitTextStroke: "2px #7a7a7a",
                        fontFamily: "Impact, Haettenschweiler, 'Arial Narrow Bold', sans-serif"
                      }}>
                  {show.rank}
                </span>

                {/* Vertical Poster Container */}
                <div className="relative w-[65%] md:w-[70%] h-full ml-auto rounded-md overflow-hidden shadow-[0_15px_30px_rgba(0,0,0,0.8)] z-10 transition-transform duration-300 group-hover:scale-[1.05] border border-white/10 group-hover:border-white/30">
                  <img src={show.image} alt={show.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />
                  <span className="absolute top-2 right-2 bg-[#9248FF] text-[8px] font-black tracking-widest px-1.5 py-0.5 rounded-sm shadow-md text-white">TOP 10</span>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Next Arrow */}
        <button className="swiper-custom-next absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(146,72,255,0.15)] opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-[#9248FF] hover:border-[#9248FF] hover:scale-110 disabled:opacity-0 disabled:cursor-default">
          <ChevronRight size={22} strokeWidth={2.5} className="ml-0.5" />
        </button>
      </div>
    </section>
  );
}
