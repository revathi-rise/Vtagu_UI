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
  layout?: 'grid' | 'carousel';
  gridCols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
  };
}

export default function ResponsiveGrid({ children, title, layout = 'grid', gridCols }: ResponsiveGridProps) {
  // If explicitly requested carousel mode on mobile
  if (layout === 'carousel') {
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

  // Default: Native App-style Vertical Grid across all viewports
  // 2 columns on mobile (touch friendly), 3 on tablets, 4-6 on desktop
  return (
    <div className={cn(
      "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6 w-full",
      gridCols?.desktop === 4 ? "lg:grid-cols-4" : 
      gridCols?.desktop === 5 ? "lg:grid-cols-5" : "lg:grid-cols-6"
    )}>
      {children}
    </div>
  );
}
