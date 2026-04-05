"use client";
import React from 'react';
import { Play, Plus, Share2, Star } from 'lucide-react';
import Image from 'next/image';

interface TitleHeroProps {
  title: string;
  year: string;
  rating?: string;
  seasons?: string;
  description: string;
  backdropUrl: string;
}

export default function TitleHero({ title, year, rating, seasons, description, backdropUrl }: TitleHeroProps) {
  
  // Logic to separate Title from Episode if it's concatenated
  const isEpisode = title.toUpperCase().includes("EPISODE");
  const mainTitle = isEpisode ? title.split(/EPISODE/i)[0].trim() : title;
  const episodeNumber = isEpisode ? title.match(/EPISODE\s*(\d+)/i)?.[0] : null;

  return (
    <section className="relative w-full h-[90vh] min-h-[800px] overflow-hidden bg-[#0B0A10]">
      {/* Background with Ken Burns & Enhanced Gradients */}
      <div className="absolute inset-0">
        <Image 
          src={backdropUrl} 
          alt={title}
          fill
          className="object-cover animate-kenburns scale-105"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A10] via-[#0B0A10]/80 via-40% to-transparent z-10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-transparent to-transparent z-10" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full tv-container px-6 md:px-12 lg:px-20 pt-44 pb-20 flex flex-col justify-start">
        <div className="max-w-4xl space-y-8 reveal-visible">
          
          {/* Subtitle / Episode Badge */}
          {episodeNumber && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase skeuo-neon-glow-refined animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
              {episodeNumber}
            </div>
          )}

          {/* Main Title - Skeuomorphic 3D Look */}
          <div className="space-y-2">
            <h1 className="text-[28px] md:text-[35px] font-black text-white leading-[0.9] tracking-tighter uppercase italic skeuo-title-3d">
              {mainTitle}
            </h1>
          </div>

          {/* Metadata Badges - Tactile Labels */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/90">
            <div className="flex items-center gap-1.5 text-[#00E5FF] uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] bg-gradient-to-tr from-white/5 to-transparent">
              <Star size={16} fill="currentColor" />
              <span>New Release</span>
            </div>
            <span className="text-white/40">•</span>
            <span className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05)]">{year}</span>
            {rating && (
              <>
                <span className="text-white/40">•</span>
                <span className="border border-[#00E5FF]/40 text-[#00E5FF] px-2.5 py-1.5 rounded-xl text-xs bg-[#00E5FF]/5 font-black shadow-[inset_0_1px_1px_rgba(0,229,255,0.1)]">{rating}</span>
              </>
            )}
            {seasons && (
              <>
                <span className="text-white/40">•</span>
                <span className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]">{seasons}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xl md:text-[24px] text-white/70 max-w-2xl leading-relaxed font-semibold drop-shadow-lg">
            {description}
          </p>

          {/* Action Buttons - Premium Tactile Design */}
          <div className="flex items-center gap-6 pt-6">
            <button className="skeuo-button-cyan h-18 px-[2rem] rounded-[2rem] text-[18px] active:skeuo-pressed transition-all duration-300 group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              <Play size={24} fill="black" className="group-hover:scale-110 transition-transform relative z-10" />
              <span className="relative z-10">EXECUTE PLAY</span>
            </button>
            
            <button className="skeuo-icon-btn w-18 h-18 rounded-[2.5rem] active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent">
              <Plus size={24} />
            </button>
            
            <button className="skeuo-icon-btn w-18 h-18 rounded-[2.5rem] active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent">
              <Share2 size={24} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
