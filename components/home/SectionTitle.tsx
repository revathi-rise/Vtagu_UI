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
  viewAllHref?: string;
}

export default function SectionTitle({ title, subtitle, Icon, gradientText, viewAllHref }: SectionTitleProps) {
  const parts = gradientText ? title.split(gradientText) : [title, ""];

  return (
    <div className="flex flex-col gap-2 select-none overflow-visible w-full group/title">

      {/* 1. Sub-Header Row: Cinematic Reveal */}
      <div className="flex items-center gap-3">
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 bg-accent/40 blur-lg rounded-full animate-pulse" />
          <Icon
            className="text-accent relative z-10 
                       w-[16px] h-[16px] 
                       tablet:w-[18px] tablet:h-[18px] 
                       desktop:w-[20px] desktop:h-[20px]
                       transition-transform duration-700 group-hover/title:rotate-[360deg] group-hover/title:scale-125"
          />
        </div>

        <span 
          className="font-bold uppercase tracking-[0.4em] text-gray-500 italic text-[10px] tablet:text-[12px] group-hover/title:text-accent transition-colors duration-500" 
          style={{ fontFamily: 'var(--font-inter)' }}
        >
          {subtitle}
        </span>

        {/* The thin line: Animated growth */}
        <div className="h-[1px] flex-1 max-w-[60px] tablet:max-w-[100px] bg-gradient-to-r from-gray-700 to-transparent group-hover/title:from-accent group-hover/title:max-w-[150px] transition-all duration-700" />
      </div>

      {/* 2. Main Header & "View All" Row */}
      <div className="flex items-end justify-between overflow-visible mt-1">
        <div className="relative block overflow-visible">
          <h3 
            className="title-h2"
            style={{ fontFamily: 'var(--font-montserrat)' }}
          >
            {parts[0]}
            {gradientText && (
              <span
                className="relative inline-block text-gradient pr-3 -mr-3 drop-shadow-[0_0_15px_rgba(167,139,250,0.3)]"
                style={{ WebkitBackgroundClip: 'text', WebkitBoxDecorationBreak: 'clone' }}
              >
                {gradientText}
              </span>
            )}
            {parts[1]}
          </h3>
        </div>

        {/* "View All" Action Group: Premium Skeuomorphic Action */}
        <Link
          href={viewAllHref || '#'}
          className="flex items-center gap-3 tablet:gap-5 group/btn cursor-pointer no-underline transition-all hover:translate-x-2"
        >
          {/* Text Labels */}
          <div className="hidden sm:flex items-baseline gap-1.5" style={{ fontFamily: 'var(--font-inter)' }}>
            <span className="text-white/60 font-medium text-[16px] tablet:text-[18px] group-hover/btn:text-white transition-colors duration-300">
              View
            </span>
            <span className="text-accent font-black italic uppercase text-[14px] tablet:text-[16px] group-hover/btn:text-accent/80 transition-all duration-300 tracking-widest">
              Catalog
            </span>
          </div>

          {/* Button Bezel */}
          <div className="
            relative flex items-center justify-center rounded-2xl glass-panel
            transition-all duration-500 group-hover/btn:border-accent/50 group-hover/btn:bg-accent/10 group-hover/btn:shadow-[0_0_20px_rgba(146,72,255,0.3)]
            w-[40px] h-[40px]
            tablet:w-[48px] tablet:h-[48px]
            desktop:w-[54px] desktop:h-[54px]
          ">
            <ChevronRight
              className="
                text-gray-400 transition-all duration-500 group-hover/btn:text-white group-hover/btn:scale-125
                w-[18px] h-[18px]
                tablet:w-[22px] tablet:h-[22px]
              "
            />
          </div>
        </Link>
      </div>

      {/* 3. Bottom Kinetic Glow Line */}
      <div
        className="h-[4px] mt-2 bg-gradient-to-r from-accent via-brand-gradient to-transparent rounded-full shadow-[0_0_20px_rgba(146,72,255,0.4)] group-hover/title:w-[200px] transition-all duration-1000 w-[100px]"
      />
    </div>
  );
}