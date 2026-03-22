"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Volume2, VolumeX, ListVideo } from "lucide-react";

export default function SeriesHero() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full pt-[90px] overflow-hidden flex items-end pb-24">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <video 
          className="w-full h-full object-cover scale-105"
          autoPlay 
          loop 
          muted={isMuted}
          playsInline
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4"
          poster="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=2000&auto=format&fit=crop"
        />
      </div>

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/70 to-transparent w-[85%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] xl:via-[#0f0a19]/40 via-[#0f0a19]/80 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a19]/80 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative tv-container mx-auto px-5 tablet:px-10 w-full z-10 flex justify-between items-end pb-12">
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} 
          className="max-w-2xl text-white flex flex-col justify-end h-full"
        >
          {/* Top Badge */}
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-[#9248FF] text-white text-[10px] md:text-xs font-black uppercase px-2 py-1 tracking-widest rounded-sm shadow-[0_0_15px_rgba(146,72,255,0.5)]">
              PrimeTime Exclusive
            </span>
            <span className="text-xs md:text-sm font-black tracking-[0.2em] text-white uppercase shadow-black drop-shadow-md">
              Season 4 Now Streaming
            </span>
          </div>
          
          <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-4 drop-shadow-2xl">
            THE REALM
          </h1>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-gray-300 mb-6 shadow-black drop-shadow-md">
            <span className="text-green-500 font-black">98% Match</span>
            <span>2024</span>
            <span className="border border-white/40 px-1.5 py-0.5 rounded text-[10px] text-white backdrop-blur-md">TV-MA</span>
            <span>4 Seasons</span>
            <span className="flex items-center gap-1 border border-white/30 px-1.5 rounded text-[10px] bg-black/50 backdrop-blur-md">
              4K <span className="text-[#9248FF] font-bold">Dolby Vision</span>
            </span>
          </div>
          
          <p className="max-w-xl text-sm md:text-base text-gray-200 leading-relaxed shadow-black drop-shadow-xl mb-8 font-medium">
            Betrayal. Power. Survival. In the gripping fourth season, the factions make their final moves as the old world crumbles. The throne remains empty, but not for long. 
          </p>
          
          <div className="flex flex-wrap items-center gap-4">
            <button className="bg-white text-black px-8 md:px-10 py-3.5 rounded-md text-base md:text-lg font-black flex items-center gap-3 hover:bg-gray-200 transition-colors shadow-[0_10px_30px_rgba(255,255,255,0.2)]">
              <Play size={24} className="fill-current" /> Play S4:E1
            </button>
            <button className="bg-[#413955]/70 hover:bg-[#413955] backdrop-blur-xl text-white px-8 md:px-10 py-3.5 rounded-md text-base md:text-lg font-bold flex items-center gap-3 transition-colors border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
              <ListVideo size={24} /> Episodes 
            </button>
          </div>
        </motion.div>

        {/* Volume Control */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden md:flex items-center absolute right-0 bottom-16"
        >
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 shadow-2xl rounded-full border border-white/30 text-white hover:bg-white/10 transition backdrop-blur-md mr-4"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="bg-black/50 border-l-[3px] border-[#9248FF] text-gray-200 text-sm font-bold py-2 px-3 pr-10 backdrop-blur-md shadow-2xl tracking-wider">
            TV-MA
          </div>
        </motion.div>
      </div>
    </section>
  );
}
