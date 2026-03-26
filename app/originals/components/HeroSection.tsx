"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Info, Plus, Volume2, VolumeX } from "lucide-react";

export default function HeroSection() {
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
          poster="https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=2000&auto=format&fit=crop"
        />
      </div>

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/60 to-transparent w-[80%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-[#0f0a19]/20 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-b from-[#0f0a19]/60 via-transparent to-transparent" />

      {/* Content */}
      <div className="relative tv-container mx-auto px-5 tablet:px-10 w-full z-10 flex justify-between items-end">
        <motion.div 
          initial={{ y: 30, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }} 
          className="max-w-2xl text-white"
        >
          {/* Logo / Title treatment */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg bg-cyan-400 flex items-center justify-center shadow-[0_4px_10px_rgba(34,211,238,0.4)]">
               <span className="text-black font-black text-xl tracking-tighter">P</span>
            </div>
            <p className="text-[10px] font-black tracking-[0.2em] text-cyan-400 uppercase drop-shadow-md">Original Series</p>
          </div>
          
          <h1 className="text-6xl md:text-8xl font-black leading-[0.9] tracking-tighter mb-4 drop-shadow-2xl">
            CHRONOS<br/>
            <span className="text-3xl md:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 tracking-tight uppercase">
              The Beginning
            </span>
          </h1>

          {/* Metadata */}
          <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-gray-400 uppercase mb-8 drop-shadow-md">
            <span className="text-cyan-400">98% Match</span>
            <span>2024</span>
            <span className="border border-white/20 px-2 py-0.5 rounded-full text-[9px] text-white bg-white/5 backdrop-blur-md">TV-MA</span>
            <span>1 Season</span>
            <span className="flex items-center gap-1 border border-white/10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
              HD <span className="text-cyan-400">4K</span>
            </span>
          </div>
          
          <p className="max-w-xl text-sm md:text-base text-gray-300/90 leading-relaxed drop-shadow-lg mb-10 font-medium">
            In a world where time is the only currency left, one man must journey to the edge of the galaxy to find the source of eternity before his clock runs out.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 md:px-10 py-3.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all scale-100 hover:scale-105 shadow-[0_15px_30px_rgba(34,211,238,0.2)]">
              <Play size={20} className="fill-current" /> Watch Now
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-8 md:px-10 py-3.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all border border-white/10 scale-100 hover:scale-105 shadow-2xl">
              <Plus size={20} /> Add to List
            </button>
          </div>
        </motion.div>

        {/* Volume Control */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="hidden md:flex items-center absolute right-0 bottom-10"
        >
          <button 
            onClick={() => setIsMuted(!isMuted)}
            className="p-3 rounded-full border border-white/40 text-white hover:bg-white/10 transition backdrop-blur-md mr-4 shadow-xl"
          >
            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
          </button>
          <div className="bg-white/10 border-l-[3px] border-white text-white text-sm font-bold py-2 px-3 pr-10 backdrop-blur-md shadow-xl">
            TV-MA
          </div>
        </motion.div>
      </div>
    </section>
  );
}