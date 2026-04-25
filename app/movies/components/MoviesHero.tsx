"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Play, Info, Volume2, VolumeX } from "lucide-react";
import VideoPlayer from "@/components/ui/VideoPlayer";

export default function MoviesHero() {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section className="relative h-[85vh] min-h-[600px] w-full pt-[90px] overflow-hidden flex items-end pb-24">
      {/* Background Video */}
      <div className="absolute inset-0 w-full h-full">
        <VideoPlayer 
          className="w-full h-full object-cover scale-105"
          autoPlay 
          loop 
          muted={isMuted}
          src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4"
          poster="https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=2000&auto=format&fit=crop"
          showControls={false}
        />
      </div>

      {/* Cinematic Gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/70 to-transparent w-[85%]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] xl:via-[#0f0a19]/40 via-[#0f0a19]/70 to-transparent" />
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
            <span className="bg-cyan-400 text-black text-[10px] font-black uppercase px-2 py-1 tracking-widest rounded-sm shadow-[0_0_15px_rgba(34,211,238,0.5)]">
              Top 1
            </span>
            <span className="text-xs md:text-sm font-black tracking-[0.2em] text-white uppercase shadow-black drop-shadow-md">
              Movies Today
            </span>
          </div>
          
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Sintel_title_logo.png/800px-Sintel_title_logo.png" 
            alt="Sintel" 
            className="w-[280px] md:w-[450px] mb-6 object-contain drop-shadow-2xl filter brightness-0 invert" 
          />

          {/* Metadata */}
          <div className="flex items-center gap-4 text-[10px] font-black tracking-widest text-gray-400 uppercase mb-8 drop-shadow-md">
            <span className="text-cyan-400 font-black">99% Match</span>
            <span>2010</span>
            <span className="border border-white/20 px-2 py-0.5 rounded-full text-[9px] text-white bg-white/5 backdrop-blur-md">PG-13</span>
            <span>1h 52m</span>
            <span className="flex items-center gap-1 border border-white/10 px-2 py-0.5 rounded-full bg-black/40 backdrop-blur-md">
              HD <span className="text-cyan-400 font-bold uppercase">Atmos</span>
            </span>
          </div>
          
          <p className="max-w-xl text-sm md:text-base text-gray-300/90 leading-relaxed drop-shadow-xl mb-10 font-medium">
            Alone, a young woman embarks on a perilous journey across a dangerous land to find a stolen dragon. An epic tale of courage, loss, and the unyielding bond between two souls.
          </p>
          
          <div className="flex flex-wrap items-center gap-6">
            <button className="bg-cyan-400 hover:bg-cyan-300 text-black px-8 md:px-10 py-3.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all scale-100 hover:scale-105 shadow-[0_15px_30px_rgba(34,211,238,0.2)]">
              <Play size={20} className="fill-current" /> Watch Now
            </button>
            <button className="bg-white/5 hover:bg-white/10 backdrop-blur-xl text-white px-8 md:px-10 py-3.5 rounded-full text-xs font-black tracking-widest uppercase flex items-center gap-3 transition-all border border-white/10 scale-100 hover:scale-105 shadow-2xl">
              <Info size={20} /> More Info
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
          <div className="bg-black/50 border-l-[3px] border-white text-gray-200 text-sm font-bold py-2 px-3 pr-10 backdrop-blur-md shadow-2xl">
            PG-13
          </div>
        </motion.div>
      </div>
    </section>
  );
}
