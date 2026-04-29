"use client";

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface ResponsiveGridProps {
  children: React.ReactNode[];
  title?: string;
  gridCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export default function ResponsiveGrid({ children, title, gridCols }: ResponsiveGridProps) {
  return (
    <div className="relative group/grid overflow-visible w-full">
      {/* Mobile/Tablet View: Swiper Slider */}
      <div className="block lg:hidden overflow-visible">
        <Swiper
          modules={[Navigation, FreeMode]}
          spaceBetween={16}
          slidesPerView={1.3}
          freeMode={true}
          breakpoints={{
            480: { slidesPerView: 2.2 },
            768: { slidesPerView: 3.2 },
          }}
          className="!overflow-visible !px-1"
        >
          {children.map((child, index) => (
            <SwiperSlide key={index} className="!overflow-visible">
              {child}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {/* Desktop View: Static Grid */}
      <div className={cn(
        "hidden lg:grid gap-6",
        gridCols?.desktop === 4 ? "lg:grid-cols-4" : 
        gridCols?.desktop === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6"
      )}>
        {children}
      </div>
    </div>
  );
}
