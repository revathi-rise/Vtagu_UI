'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon, ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  Icon: LucideIcon;
  gradientText?: string;
  viewAllHref?: string; // Added for the "View All" functionality
}

export default function SectionTitle({ title, subtitle, Icon, gradientText, viewAllHref }: SectionTitleProps) {
  const parts = gradientText ? title.split(gradientText) : [title, ""];

  return (
    <div className="flex flex-col gap-1 select-none overflow-visible w-full group">

      {/* 1. Sub-Header Row */}
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-[#3299FF]/30 blur-md rounded-full animate-pulse" />
          <Icon
            className="text-[#3299FF] relative z-10 
                       w-[14px] h-[14px] 
                       tablet:w-[16px] tablet:h-[16px] 
                       desktop:w-[18px] desktop:h-[18px]"
          />
        </div>

        <span className="font-bold uppercase tracking-[0.3em] text-gray-400/80 italic text-[9px] tablet:text-[11px]">
          {subtitle}
        </span>

        {/* The thin line from your reference image */}
        <div className="h-[1px] flex-1 max-w-[40px] tablet:max-w-[60px] bg-gray-700" />
      </div>

      {/* 2. Main Header & "View All" Row */}
      <div className="flex items-end justify-between overflow-visible">
        <div className="relative block overflow-visible">
          <h2 className="
            font-black tracking-tighter text-white uppercase italic leading-[1] overflow-visible
            text-[22px] 
            tablet:text-[28px] 
            laptop:text-[36px] 
            desktop:text-[44px]
            tv:text-[56px]
          ">
            {parts[0]}
            {gradientText && (
              <span
                className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#3299FF] to-[#9248FF] pr-2 -mr-2"
                style={{ WebkitBackgroundClip: 'text', WebkitBoxDecorationBreak: 'clone' }}
              >
                {gradientText}
              </span>
            )}
            {parts[1]}
          </h2>
        </div>

        {/* "View All" Action Group */}
        <Link
          href={viewAllHref || '#'}
          className="flex items-center gap-2 tablet:gap-3 group/btn cursor-pointer no-underline transition-transform hover:translate-x-1"
        >
          {/* Text Label */}
          <div className="flex items-baseline gap-1">
            <span className="
      text-white font-medium 
      text-[14px] 
      tablet:text-[16px] 
      desktop:text-[18px] 
      tv:text-[22px]
    ">
              View
            </span>
            <span className="
      text-[#3299FF] font-black italic uppercase
      text-[12px] 
      tablet:text-[14px] 
      desktop:text-[16px] 
      tv:text-[20px]
    ">
              All
            </span>
          </div>

          {/* Circle Icon */}
          <div className="
    relative flex items-center justify-center rounded-full border border-white/10 bg-white/5 
    transition-all duration-300 group-hover/btn:border-[#3299FF]/50 group-hover/btn:bg-[#3299FF]/10
    w-[28px] h-[28px]
    tablet:w-[34px] tablet:h-[34px]
    desktop:w-[40px] desktop:h-[40px]
  ">
            <ChevronRight
              className="
        text-gray-400 transition-colors group-hover/btn:text-white
        w-[14px] h-[14px]
        tablet:w-[18px] tablet:h-[18px]
      "
            />
          </div>
        </Link>
      </div>

      {/* 3. Bottom Gradient Glow Line */}
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        whileInView={{ width: "60px", opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "circOut" }}
        className="h-[3px] mt-2 bg-gradient-to-r from-[#3299FF] to-transparent rounded-full shadow-[0_0_15px_rgba(50,153,255,0.5)]"
      />
    </div>
  );
}