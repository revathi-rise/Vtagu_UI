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
  videoUrl?: string;
}

export default function TitleHero({ title, year, rating, seasons, description, backdropUrl, videoUrl }: TitleHeroProps) {
  
  // Logic to separate Title from Episode if it's concatenated
  const isEpisode = title.toUpperCase().includes("EPISODE");
  const mainTitle = isEpisode ? title.split(/EPISODE/i)[0].trim() : title;
  const episodeNumber = isEpisode ? title.match(/EPISODE\s*(\d+)/i)?.[0] : null;

  return (
    <section className="relative w-full h-[80vh] md:h-[90vh] min-h-[500px] md:min-h-[800px] overflow-hidden bg-[#0B0A10]">
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
      <div className="relative z-20 h-full tv-container px-6 md:px-12 lg:px-20 pt-32 md:pt-44 pb-12 md:pb-20 flex flex-col justify-start md:justify-center">
        <div className="max-w-4xl space-y-8 reveal-visible">
          
          {/* Subtitle / Episode Badge */}
          {episodeNumber && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-[0.2em] uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(50,153,255,1)]" />
              {episodeNumber}
            </div>
          )}

          {/* Main Title - Skeuomorphic 3D Look */}
          <div className="space-y-2">
            <h1 className="text-[24px] sm:text-[28px] md:text-[35px] font-black text-white leading-[0.9] tracking-tighter uppercase italic skeuo-title-3d">
              {mainTitle}
            </h1>
          </div>

          {/* Metadata Badges - Tactile Labels */}
          <div className="flex flex-wrap items-center gap-4 text-sm font-bold text-white/90">
            <div className="flex items-center gap-1.5 text-primary uppercase tracking-widest bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_4px_10px_rgba(0,0,0,0.5)] bg-gradient-to-tr from-white/5 to-transparent">
              <Star size={16} fill="currentColor" />
              <span>New Release</span>
            </div>
            <span className="text-white/40">•</span>
            <span className="bg-white/5 px-2.5 py-1.5 rounded-xl border border-white/10 shadow-[inner_0_1px_1px_rgba(255,255,255,0.05)]">{year}</span>
            {rating && (
              <>
                <span className="text-white/40">•</span>
                <span className="border border-primary/40 text-primary px-2.5 py-1.5 rounded-xl text-xs bg-primary/5 font-black shadow-[inset_0_1px_1px_rgba(50,153,255,0.1)]">{rating}</span>
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
          <div 
            className="text-base sm:text-lg md:text-[24px] text-white/70 max-w-2xl leading-relaxed font-semibold drop-shadow-lg [&_p]:inline [&_p]:m-0 [&_p]:p-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Action Buttons - Premium Tactile Design */}
          <div className="flex items-center gap-6 pt-6">
            <button
              onClick={() => {
                const player = document.getElementById('episode-player');
                if (player) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-primary text-black h-14 sm:h-16 px-8 rounded-full font-black text-sm sm:text-base hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(50,153,255,0.5)] transition-all duration-300 group flex items-center gap-3 active:scale-95 shadow-xl"
            >
              <Play size={20} fill="black" className="group-hover:scale-110 transition-transform" />
              <span>WATCH NOW</span>
            </button>

            
            <button className="skeuo-icon-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent flex justify-center items-center">
              <Plus size={20} className="sm:w-6 sm:h-6" />
            </button>
            
            <button className="skeuo-icon-btn w-14 h-14 sm:w-16 sm:h-16 rounded-full active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent flex justify-center items-center">
              <Share2 size={20} className="sm:w-6 sm:h-6" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
