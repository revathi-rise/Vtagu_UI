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
  quality?: string;
  certificate?: {
    code: string;
    name?: string;
    certification_system?: string;
    badge_color?: string;
  } | null;
}

export default function TitleHero({ title, year, rating, seasons, description, backdropUrl, videoUrl, certificate, quality }: TitleHeroProps) {
  
  // Logic to separate Title from Episode if it's concatenated
  const isEpisode = title.toUpperCase().includes("EPISODE");
  const mainTitle = isEpisode ? title.split(/EPISODE/i)[0].trim() : title;
  const episodeNumber = isEpisode ? title.match(/EPISODE\s*(\d+)/i)?.[0] : null;

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-[90vh] min-h-[460px] md:min-h-[700px] overflow-hidden bg-[#0B0A10]">
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
      <div className="relative z-20 h-full tv-container px-4 sm:px-8 md:px-12 lg:px-20 pt-20 sm:pt-32 md:pt-44 pb-8 sm:pb-12 md:pb-20 flex flex-col justify-end md:justify-center">
        <div className="max-w-4xl space-y-4 sm:space-y-8 reveal-visible">
          
          {/* Subtitle / Episode Badge */}
          {episodeNumber && (
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/10 border border-primary/30 text-primary text-xs font-black tracking-[0.2em] uppercase animate-pulse">
              <span className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(50,153,255,1)]" />
              {episodeNumber}
            </div>
          )}

          {/* Main Title - Skeuomorphic 3D Look */}
          <div className="space-y-2">
            <h1 className="text-[22px] sm:text-[28px] md:text-[35px] font-black text-white leading-tight tracking-tighter uppercase italic skeuo-title-3d">
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
            {quality && (
              <>
                <span className="text-white/40">•</span>
                <span className="border border-white/20 text-white/80 px-2.5 py-1.5 rounded-xl text-xs bg-white/5 font-black shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)] tracking-wider uppercase">
                  {quality}
                </span>
              </>
            )}
            {certificate?.code && (
              <>
                <span className="text-white/40">•</span>
                <span 
                  style={
                    certificate.badge_color 
                      ? { 
                          borderColor: `${certificate.badge_color}50`, 
                          backgroundColor: `${certificate.badge_color}20`,
                          color: certificate.badge_color || '#fff'
                        } 
                      : undefined
                  }
                  className="border border-amber-400/40 text-amber-400 px-2.5 py-1.5 rounded-xl text-xs bg-amber-400/10 font-black shadow-[inset_0_1px_1px_rgba(251,191,36,0.15)] tracking-wider uppercase flex items-center gap-1.5"
                >
                  <span>{certificate.code}</span>
                  {certificate.certification_system && (
                    <span className="text-[9px] px-1 py-0.2 rounded font-bold bg-white/15 text-white/80">
                      {certificate.certification_system}
                    </span>
                  )}
                </span>
              </>
            )}
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
            className="text-sm sm:text-base md:text-[20px] text-white/70 max-w-2xl leading-relaxed font-medium drop-shadow-lg [&_p]:inline [&_p]:m-0 [&_p]:p-0"
            dangerouslySetInnerHTML={{ __html: description }}
          />

          {/* Action Buttons - Premium Tactile Design */}
          <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-3 sm:pt-6">
            <button
              onClick={() => {
                const player = document.getElementById('episode-player');
                if (player) player.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }}
              className="bg-primary text-black h-11 sm:h-14 px-5 sm:px-8 rounded-full font-bold text-xs sm:text-base hover:bg-primary/90 hover:shadow-[0_0_30px_rgba(50,153,255,0.5)] transition-all duration-300 group flex items-center gap-2 sm:gap-3 active:scale-95 shadow-xl uppercase tracking-wider"
            >
              <Play size={16} fill="black" className="sm:w-5 sm:h-5 group-hover:scale-110 transition-transform" />
              <span>WATCH NOW</span>
            </button>

            <button aria-label="Add to list" className="skeuo-icon-btn w-11 h-11 sm:w-14 sm:h-14 rounded-full active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent flex justify-center items-center shrink-0">
              <Plus size={18} className="sm:w-6 sm:h-6" />
            </button>
            
            <button aria-label="Share episode" className="skeuo-icon-btn w-11 h-11 sm:w-14 sm:h-14 rounded-full active:skeuo-pressed shadow-[0_15px_30px_rgba(0,0,0,0.5),inset_0_1px_2px_rgba(255,255,255,0.1)] border border-white/10 bg-gradient-to-b from-white/10 to-transparent flex justify-center items-center shrink-0">
              <Share2 size={16} className="sm:w-5 sm:h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
