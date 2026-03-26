"use client";
import React from "react";
import { useDelayedHover } from "../../../hooks/useDelayedHover";
import HoverVideoCard from "../../../components/ui/HoverVideoCard";

const upcoming = [
  { date: "March 15", title: "Velocity: Zero", image: "https://images.unsplash.com/photo-1504253163759-c23fccaebb55?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4" },
  { date: "April 02", title: "Beyond the Grid", image: "https://images.unsplash.com/photo-1485282271306-3bc5562d98ef?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4" },
  { date: "May 10", title: "Dark Horizon", image: "https://images.unsplash.com/photo-1518791841217-8f162f1e1131?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4" },
];

export default function ComingSoonCard() {
  const { hoveredId, handleMouseEnter, handleMouseLeave } = useDelayedHover(300);

  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mb-20 z-10 relative">
      <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md mb-6">Coming Soon to Originals</h2>
      <div className="grid gap-6 mobile-lg:grid-cols-3">
        {upcoming.map((item, index) => {
          const transformOrigin = index % 3 === 0 ? 'left' : index % 3 === 2 ? 'right' : 'center';
          return (
             <HoverVideoCard
                key={item.title}
                title={item.title}
                image={item.image}
                date={item.date}
                videoSrc={item.videoSrc}
                isHovered={hoveredId === index}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
                layout="coming-soon"
                transformOrigin={transformOrigin}
             />
          );
        })}
      </div>
    </section>
  );
}