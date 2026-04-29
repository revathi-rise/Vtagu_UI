"use client";

import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { HeroItem } from "./HeroSection";

interface HeroThumbnailSliderProps {
  items: HeroItem[];
  activeIndex: number;
  onThumbClick: (index: number) => void;
}

export default function HeroThumbnailSlider({ items, activeIndex, onThumbClick }: HeroThumbnailSliderProps) {
  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar max-w-[90vw] md:max-w-none px-4 hidden md:block">
      {items.map((item, index) => (
        <button
          key={item.id}
          onClick={() => onThumbClick(index)}
          className={cn(
            "relative flex-shrink-0 w-[120px] md:w-[160px] aspect-video rounded-xl transition-all duration-300 group p-[2px]",
            activeIndex === index 
              ? "scale-105 bg-brand-gradient shadow-[0_0_20px_rgba(50,153,255,0.3)]" 
              : "bg-transparent opacity-60 hover:opacity-100 hover:scale-105"
          )}
        >
          <div className="relative w-full h-full rounded-[10px] overflow-hidden bg-[#0f0a10]">
            <Image
              src={item.image}
              alt={item.title}
              fill
              className={cn(
                "object-cover transition-transform duration-500",
                activeIndex === index ? "scale-110" : "group-hover:scale-110"
              )}
              sizes="(max-width: 768px) 120px, 160px"
            />
            {activeIndex !== index && (
               <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] group-hover:bg-transparent group-hover:backdrop-blur-none transition-all duration-300" />
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
