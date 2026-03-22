"use client";
import React from 'react';
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import HoverVideoCard from "../../../components/ui/HoverVideoCard";
import { useDelayedHover } from "../../../hooks/useDelayedHover";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryRowProps {
  title: string;
  items: { title: string; image: string; videoSrc: string; description?: string }[];
}

export default function CategoryRow({ title, items }: CategoryRowProps) {
  const { hoveredId, handleMouseEnter, handleMouseLeave } = useDelayedHover(400);

  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mb-8 relative z-10 w-full">
      <h2 className="text-xl md:text-2xl font-bold tracking-tight text-white mb-2 drop-shadow-md">
        {title}
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
          spaceBetween={12}
          slidesPerView={1.2}
          breakpoints={{
            481: { slidesPerView: 2.2, spaceBetween: 16 },
            768: { slidesPerView: 3.2, spaceBetween: 16 },
            1025: { slidesPerView: 4.2, spaceBetween: 20 },
            1441: { slidesPerView: 5.2, spaceBetween: 24 },
            1921: { slidesPerView: 7.2, spaceBetween: 30 },
            2560: { slidesPerView: 9.2, spaceBetween: 32 },
          }}
          className="pb-16 pt-6 !px-6 -mx-6 !overflow-visible"
        >
          {items.map((item, index) => {
            return (
              <SwiperSlide key={item.title} className="!overflow-visible">
                <div className="w-full transition-all duration-300">
                    <HoverVideoCard
                      title={item.title}
                      description={item.description}
                      image={item.image}
                      videoSrc={item.videoSrc}
                      isHovered={hoveredId === index}
                      onMouseEnter={() => handleMouseEnter(index)}
                      onMouseLeave={handleMouseLeave}
                      layout="row"
                      transformOrigin="center"
                    />
                </div>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {/* Custom Next Arrow */}
        <button className="swiper-custom-next absolute right-0 md:-right-4 top-1/2 -translate-y-1/2 z-20 w-9 h-9 md:w-11 md:h-11 flex items-center justify-center bg-black/60 border border-white/20 backdrop-blur-md rounded-full text-white shadow-[0_0_15px_rgba(146,72,255,0.15)] opacity-0 group-hover/swiper:opacity-100 transition-all duration-300 hover:bg-[#9248FF] hover:border-[#9248FF] hover:scale-110 disabled:opacity-0 disabled:cursor-default">
          <ChevronRight size={22} strokeWidth={2.5} className="ml-0.5" />
        </button>
      </div>
    </section>
  );
}
