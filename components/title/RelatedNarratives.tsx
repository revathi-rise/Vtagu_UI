"use client";
import React, { useState, useRef } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, Plus, Zap } from 'lucide-react';

interface RelatedItem {
  id: number;
  title: string;
  image: string;
  type: string;
  description: string;
}

const MOCK_RELATED: RelatedItem[] = [
  { 
    id: 101, 
    title: "Lost Legends: Alchemy of Gold", 
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=600",
    type: "CINEMA",
    description: "An ancient secret buried for centuries. A quest that will redefine reality."
  },
  { 
    id: 102, 
    title: "Velocity Point", 
    image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=600",
    type: "ORIGINAL",
    description: "In a world where speed is survival, one pilot faces the ultimate limit."
  },
  { 
    id: 103, 
    title: "Cyber Nights", 
    image: "https://images.unsplash.com/photo-1514467950401-6d8a0116a84c?auto=format&fit=crop&q=80&w=600",
    type: "VANGUARD",
    description: "The neon lights hide a darkness more profound than the digital void."
  },
  { 
    id: 104, 
    title: "The Last Watcher", 
    image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=600",
    type: "PREMIUM",
    description: "He sees the things others choose to ignore. His silence is the only protection."
  },
  { 
    id: 105, 
    title: "Neon Drifters", 
    image: "https://images.unsplash.com/photo-1514474776145-18310344caad?auto=format&fit=crop&q=80&w=600",
    type: "CINEMA",
    description: "Beyond the horizon lies a city built on the echoes of forgotten memories."
  },
];

export default function RelatedNarratives() {
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (id: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredId(id);
    }, 200);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setHoveredId(null);
  };

  const previewGif = `https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp9m8vG6P6M/giphy.gif`;

  return (
    <section className="py-20 tv-container px-6 md:px-12 lg:px-20 overflow-visible">
      <div className="flex items-center gap-4 mb-14 overflow-visible">
        <div className="w-12 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d">
          RELATED NARRATIVES
        </h2>
      </div>

      <div className="flex gap-10 overflow-x-auto pb-16 scrollbar-hide snap-x !overflow-visible">
        {MOCK_RELATED.map((item) => {
          const isHovered = hoveredId === item.id;
          
          return (
            <div 
              key={item.id} 
              className="min-w-[280px] w-[300px] flex-shrink-0 snap-start group cursor-pointer !overflow-visible"
              onMouseEnter={() => handleMouseEnter(item.id)}
              onMouseLeave={handleMouseLeave}
            >
              {/* Premium Card Container with Lifting Transitioin */}
              <div 
                className="skeuo-moving-border-container transition-transform duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]"
                style={{ transform: isHovered ? 'scale(1.05) translateY(-1rem)' : 'scale(1) translateY(0)' }}
              >
                <div className="skeuo-moving-border-inner h-full">
                  <div
                    className={`
                      relative aspect-[2/3.2] rounded-[2.5rem] overflow-hidden
                      transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                      ${isHovered 
                        ? "shadow-[0_45px_90px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.3)] border-cyan-400/30" 
                        : "border border-white/5"}
                    `}
                  >
                    {/* Media Layer */}
                    <div className="absolute inset-0 bg-[#0c0816]">
                      <Image 
                        src={item.image} 
                        alt={item.title}
                        fill
                        className={`
                          object-cover transition-all duration-1000
                          ${isHovered ? "opacity-0 scale-110" : "opacity-100 brightness-90"}
                        `}
                      />
                      
                      {/* Animated Preview on Hover */}
                      {isHovered && (
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.8 }}
                          className="absolute inset-0 w-full h-full z-0"
                        >
                          <img
                            src={previewGif}
                            alt="Preview"
                            className="w-full h-full object-cover brightness-75 scale-105"
                          />
                        </motion.div>
                      )}
                    </div>

                    {/* Hud Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10 pointer-events-none" />

                    {/* HUD Content Layer */}
                    <div className="absolute inset-0 p-6 flex flex-col justify-end z-20">
                      
                      {/* Badge & Actions Row */}
                      <div className="flex items-center gap-3 mb-6">
                        <div className="bg-[#00E5FF] text-black text-[10px] font-black uppercase px-4 py-1.5 rounded-full tracking-wider shadow-[0_5px_15px_rgba(0,229,255,0.4)]">
                          {item.type}
                        </div>
                        
                        <div className="flex items-center gap-2 ml-auto">
                          <motion.button 
                            whileHover={{ scale: 1.1 }}
                            className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white border border-white/10"
                          >
                            <Plus size={18} />
                          </motion.button>
                        </div>
                      </div>

                      {/* Title & Cinematic Metadata */}
                      <div className="space-y-2">
                        <h4 className="text-[20px] md:text-[22px] font-bold text-white tracking-tight leading-tight uppercase italic">
                          {item.title}
                        </h4>
                        
                        <div className="flex items-center gap-2 text-[10px] font-black tracking-widest text-[#00E5FF] uppercase opacity-70">
                          <span>MOVIE</span>
                          <span className="text-white">/</span>
                          <span>4K</span>
                          <span className="text-white">/</span>
                          <span>HDR</span>
                        </div>
                      </div>

                      {/* Animated Reveal Description */}
                      <motion.div
                        initial={false}
                        animate={isHovered ? { height: 'auto', opacity: 1, marginTop: 16 } : { height: 0, opacity: 0, marginTop: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="text-[12px] text-gray-300 leading-relaxed font-medium line-clamp-2">
                          {item.description}
                        </p>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
