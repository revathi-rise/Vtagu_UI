'use client';

import React from 'react';

interface ShimmerProps {
  className?: string;
}

export default function Shimmer({ className }: ShimmerProps) {
  return (
    <div 
      className={`relative overflow-hidden bg-white/5 before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/10 before:to-transparent ${className}`}
    />
  );
}
