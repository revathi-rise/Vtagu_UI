"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { Play, ChevronLeft, ChevronRight } from "lucide-react";

const watchHistory = [
  { series: "Mind Hunter", episode: "S2:E3 - The Interrogation", progress: 65, image: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=600&auto=format&fit=crop" },
  { series: "Neon Genesis", episode: "S1:E8 - Awakening", progress: 20, image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop" },
  { series: "Cyber Rift", episode: "S4:E10 - Reboot", progress: 85, image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop" },
  { series: "Dark Matter", episode: "S1:E2 - First Contact", progress: 10, image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=600&auto=format&fit=crop" },
  { series: "The Watcher", episode: "S3:E5 - Paranoia", progress: 45, image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop" },
];

export default function ContinueWatchingRow() {
  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mb-8 relative z-10 w-full">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 drop-shadow-md">
        Continue Watching
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
          slidesPerView={1.2}
          breakpoints={{
            481: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 20 },
            1025: { slidesPerView: 4.2, spaceBetween: 24 },
            1441: { slidesPerView: 5.2, spaceBetween: 30 },
            1921: { slidesPerView: 7.2, spaceBetween: 32 },
            2560: { slidesPerView: 9.2, spaceBetween: 32 },
          }}
          className="pb-8 pt-4 !px-6 -mx-6 !overflow-visible"
        >
          {watchHistory.map((item, index) => (
            <SwiperSlide key={index} className="!overflow-visible">
              <div className="group/card relative w-full aspect-video rounded-xl overflow-hidden cursor-pointer bg-[#1a1329] border border-white/10 transition-all duration-300 hover:-translate-y-2 hover:border-white/30 hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)]">
                {/* Image */}
                <img src={item.image} alt={item.series} className="w-full h-full object-cover opacity-80 group-hover/card:opacity-100 transition-opacity duration-300" />
                
                {/* Central Play Icon on Hover */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover/card:opacity-100 transition-all duration-300 bg-black/20 backdrop-blur-[2px]">
                   <div className="w-12 h-12 rounded-full border border-white/50 text-white flex items-center justify-center bg-black/40 shadow-xl scale-75 group-hover/card:scale-100 transition-all duration-300 hover:bg-white hover:text-black hover:border-white">
                      <Play className="fill-current w-5 h-5 ml-1" />
                   </div>
                </div>

                {/* Info Bar at Bottom */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-3 px-4 pointer-events-none">
                  <h4 className="text-white font-bold text-sm md:text-base leading-tight truncate">{item.series}</h4>
                  <p className="text-gray-300 text-xs md:text-sm truncate drop-shadow-md">{item.episode}</p>
                </div>
                
                {/* Progress Bar overlapping the bottom boundary */}
                <div className="absolute bottom-0 left-0 right-0 h-1 md:h-[5px] bg-white/20">
                   <div className="h-full bg-[#e50914]" style={{ width: `${item.progress}%` }} />
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
