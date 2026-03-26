"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { EffectCoverflow, Pagination, Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Play, Star, ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const originals = [
  { title: "Neon Pulse", genre: "Cyberpunk Action", image: "https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=1000&auto=format&fit=crop", desc: "A hacker discovers the ultimate truth in a dystopian mega-city." },
  { title: "The Echo Verge", genre: "Sci-Fi Mystery", image: "https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=1000&auto=format&fit=crop", desc: "Lost in space, researchers find something looking back." },
  { title: "Nightfall Stream", genre: "Neo-Noir Thriller", image: "https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=1000&auto=format&fit=crop", desc: "Every shadow hides a secret. Every road leads nowhere." },
  { title: "Horizon Rift", genre: "Epic Fantasy", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=1000&auto=format&fit=crop", desc: "A new world awaits behind the veil of the dark forest." },
  { title: "Planet of Dawn", genre: "Cinematic Drama", image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop", desc: "The quiet rise of a new civilization observed from afar." },
];

export default function Carousel() {
  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mt-12 mb-16 relative z-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md">Only on PrimeTime</h2>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative group/swiper"
      >
        {/* Custom Prev */}
        <button className="swiper-custom-prev absolute left-2 md:left-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(146,72,255,0.3)] opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-[#9248FF] hover:border-[#9248FF] hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed">
          <ChevronLeft size={24} strokeWidth={2.5} className="mr-0.5" />
        </button>

        <Swiper
          style={{
            "--swiper-pagination-color": "#9248FF",
          } as React.CSSProperties}
          navigation={{
            nextEl: '.swiper-custom-next',
            prevEl: '.swiper-custom-prev',
          }}
          modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
          spaceBetween={40}
          slidesPerView={1}
          loop
          centeredSlides
          pagination={{ clickable: true, dynamicBullets: true }}
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          effect="coverflow"
          coverflowEffect={{
            rotate: 20,
            stretch: 0,
            depth: 200,
            modifier: 1,
            slideShadows: true,
          }}
          breakpoints={{
            640: { slidesPerView: 1.2, spaceBetween: 20 },
            768: { slidesPerView: 1.5, spaceBetween: 30 },
            1024: { slidesPerView: 2.2, spaceBetween: 40 },
            1440: { slidesPerView: 2.8, spaceBetween: 50 },
          }}
          className="pb-12 pt-4"
        >
          {originals.map((item) => (
            <SwiperSlide key={item.title} className="group cursor-pointer">
              <article className="relative rounded-[2.5rem] overflow-hidden border-[8px] border-[#1a1329] shadow-[0_20px_40px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.1)] aspect-video transition-all duration-500 group-hover:border-[#251b3a] group-hover:-translate-y-2 group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.3)]">
                <img src={item.image} alt={item.title} className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" />
                
                {/* Skeuomorphic Inner Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />

                <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-cyan-400 text-[10px] font-black tracking-widest text-black shadow-lg uppercase">
                  <Star size={12} className="fill-black" /> Original
                </div>
                
                {/* Play Button Overlay (Cyan) */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
                  <div className="w-20 h-20 rounded-full bg-cyan-400/20 backdrop-blur-md flex items-center justify-center border border-cyan-400/40 shadow-[0_0_30px_rgba(34,211,238,0.3)] scale-75 group-hover:scale-100 transition-all duration-500">
                    <Play className="text-cyan-400 fill-cyan-400 w-10 h-10 ml-2" />
                  </div>
                </div>

                <div className="absolute bottom-8 left-8 right-8 md:bottom-12 md:left-12 md:right-12 flex flex-col items-start translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <span className="text-xs md:text-sm font-black tracking-[0.2em] text-cyan-400 mb-2 uppercase drop-shadow-md">
                    {item.genre}
                  </span>
                  <h3 className="text-3xl md:text-5xl font-black text-white leading-tight mb-2 md:mb-4 drop-shadow-2xl uppercase">
                    {item.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-300 max-w-2xl font-medium drop-shadow-md hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                    {item.desc}
                  </p>
                </div>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Custom Next */}
        <button className="swiper-custom-next absolute right-2 md:right-6 top-1/2 -translate-y-1/2 z-20 w-10 h-10 md:w-12 md:h-12 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(146,72,255,0.3)] opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-[#9248FF] hover:border-[#9248FF] hover:scale-110 disabled:opacity-0 disabled:cursor-not-allowed">
          <ChevronRight size={24} strokeWidth={2.5} className="ml-0.5" />
        </button>
      </motion.div>
    </section>
  );
}