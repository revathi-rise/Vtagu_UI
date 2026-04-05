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
  
  // Logic to separate Title from Episode if it's concatenated (common in the mock)
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
        {/* Left-to-Right deep shadow for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0B0A10] via-[#0B0A10]/80 via-40% to-transparent z-10" />
        {/* Bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0A10] via-transparent to-transparent z-10" />
      </div>

      {/* Content Layer */}
      <div className="relative z-20 h-full tv-container px-6 md:px-12 lg:px-20 pt-44 pb-20 flex flex-col justify-start">
        <div className="max-w-4xl space-y-8 reveal-visible">
          
          {/* Subtitle / Episode Badge */}
          {episodeNumber && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase shadow-[0_0_15px_rgba(34,211,238,0.2)] animate-pulse">
              <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)]" />
              {episodeNumber}
            </div>
          )}

          {/* Main Title - Split logic for better aesthetics */}
          <div className="space-y-2">
            <h1 className="text-[clamp(3.5rem,10vw,7rem)] font-black text-white leading-[0.9] tracking-tighter uppercase italic drop-shadow-[0_15px_30px_rgba(0,0,0,0.8)] [text-shadow:_0_0_40px_rgba(255,255,255,0.1)]">
              {mainTitle}
            </h1>
          </div>

          {/* Metadata Badges */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/90">
            <div className="flex items-center gap-1.5 text-[#00E5FF] uppercase tracking-widest bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">
              <Star size={16} fill="currentColor" />
              <span>New Release</span>
            </div>
            <span className="text-white/40">•</span>
            <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">{year}</span>
            {rating && (
              <>
                <span className="text-white/40">•</span>
                <span className="border border-[#00E5FF]/40 text-[#00E5FF] px-2.5 py-1 rounded-lg text-xs bg-[#00E5FF]/5 font-black">{rating}</span>
              </>
            )}
            {seasons && (
              <>
                <span className="text-white/40">•</span>
                <span className="bg-white/5 px-2.5 py-1 rounded-lg border border-white/10">{seasons}</span>
              </>
            )}
          </div>

          {/* Description - More contrast and better font-weight */}
          <p className="text-xl md:text-2xl text-white/70 max-w-2xl leading-relaxed font-semibold drop-shadow-lg">
            {description}
          </p>

          {/* Action Buttons - Refined sizes */}
          <div className="flex items-center gap-6 pt-6">
            <button className="skeuo-button-cyan h-20 px-12 rounded-[2rem] text-2xl hover:shadow-[0_0_50px_rgba(0,229,255,0.6)] group">
              <Play size={32} fill="black" className="group-hover:scale-110 transition-transform" />
              EXECUTE PLAY
            </button>
            
            <button className="skeuo-icon-btn w-20 h-20 rounded-[2rem]">
              <Plus size={32} />
            </button>
            
            <button className="skeuo-icon-btn w-20 h-20 rounded-[2rem]">
              <Share2 size={28} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
