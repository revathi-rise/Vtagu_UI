"use client";
import React from "react";
import { useDelayedHover } from "../../../hooks/useDelayedHover";
import HoverVideoCard from "../../../components/ui/HoverVideoCard";

const cards = [
  { title: "The Silent Echo", description: "A gripping psychological thriller that swept international film festivals with its haunting atmosphere.", image: "https://images.unsplash.com/photo-1535016120720-40c746a6580c?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" },
  { title: "Internal Affairs", description: "The most decorated documentary series exploring the intricate depths of human consciousness and corporate espionage.", image: "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" },
  { title: "Neon Genesis", description: "In a world ruled by rogue AI, a small band of human resistance fighters plot the ultimate cyber heist.", image: "https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4" },
  { title: "Midnight Velocity", description: "A high-octane racing saga where the stakes are life, death, and absolute supremacy on the asphalt.", image: "https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop", videoSrc: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4" },
];

export default function FeaturedCard() {
  const { hoveredId, handleMouseEnter, handleMouseLeave } = useDelayedHover(300);

  return (
    <section className="tv-container mx-auto px-5 tablet:px-10 mb-16 relative z-10">
      <h2 className="text-3xl font-black tracking-tight text-white drop-shadow-md mb-6">Trending Now</h2>
      <div className="grid gap-6 laptop:grid-cols-2">
        {cards.map((item, index) => (
           <HoverVideoCard
              key={item.title}
              title={item.title}
              description={item.description}
              image={item.image}
              videoSrc={item.videoSrc}
              isHovered={hoveredId === index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
              layout="featured"
              transformOrigin={index % 2 === 0 ? 'left' : 'right'}
           />
        ))}
      </div>
    </section>
  );
}