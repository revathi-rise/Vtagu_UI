"use client";
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Episode } from '@/lib/vtagu.api';

interface EpisodeSectionProps {
  episodes?: Episode[];
  currentEpisodeId?: number;
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

const resolveImageUrl = (path: any) => {
  if (!path || typeof path !== 'string') return null;
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
};

export default function EpisodeSection({ episodes = [], currentEpisodeId }: EpisodeSectionProps) {
  if (!episodes || episodes.length === 0) return null;

  return (
    <section className="py-20 tv-container px-6 md:px-12 lg:px-20" id="episode-explorer">
      <div className="skeuo-surface-high p-8 lg:p-16 relative overflow-visible rounded-[2rem] border border-white/5 bg-gradient-to-b from-white/5 to-transparent">
        {/* Header */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-16 gap-8">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d">
              EPISODE EXPLORER
            </h2>
            <div className="w-20 h-1 bg-brand-gradient rounded-full" />
          </div>
          <span className="text-[10px] font-black uppercase text-white/40 tracking-[0.25em]">
            Select an episode to begin streaming
          </span>
        </div>

        {/* Episode Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {episodes
            .filter((episode): episode is NonNullable<typeof episode> => episode !== null && episode !== undefined)
            .map((episode, index) => {
              const epId = episode.id || episode.episodeId || index;
              const epSlug = epId.toString();
              const isCurrent = epId === currentEpisodeId;
              
              // Use card_image for grid cards
              const rawImage = episode.media?.poster_image?.url || episode.image;
              const epImage = resolveImageUrl(rawImage) || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop";

              return (
                <Link key={epId} href={`/episodes/${epSlug}`} className="block">
                  <div 
                    className={`skeuo-episode-card flex flex-col sm:flex-row group cursor-pointer active:scale-98 hover:bg-[#1a1329]/40 hover:scale-[1.02] transition-all duration-500 ease-out border rounded-2xl overflow-hidden ${
                      isCurrent 
                        ? 'border-primary/50 bg-[#1a1329]/80 shadow-[0_0_25px_rgba(50,153,255,0.25)]' 
                        : 'border-white/5 hover:border-primary/30'
                    }`}
                  >
                    {/* Thumbnail Container */}
                    <div className="relative w-full sm:w-[260px] aspect-video overflow-hidden border-r border-white/5 flex-shrink-0">
                      <Image 
                        src={epImage} 
                        alt={episode.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-700 brightness-95 group-hover:brightness-100"
                        unoptimized
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-80" />
                      
                      {/* Active / Current indicator dot */}
                      <div className={`absolute top-3 left-3 w-2 h-2 rounded-full animate-pulse ${
                        isCurrent ? 'bg-primary shadow-[0_0_8px_rgba(50,153,255,1)]' : 'bg-white/30'
                      }`} />

                      {/* Featured/Upcoming Badge */}
                      {episode.isFeatured && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-black text-[8px] font-black uppercase px-2 py-0.5 rounded shadow-lg tracking-widest">
                          Upcoming
                        </div>
                      )}

                      {/* Duration / Upcoming label */}
                      <div className={`absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black tracking-widest uppercase border shadow-lg ${
                        episode.isFeatured 
                          ? 'text-emerald-400 border-emerald-500/30' 
                          : 'text-primary border-primary/30'
                      }`}>
                        {episode.isFeatured ? "UPCOMING" : episode.duration || "45m"}
                      </div>
                    </div>
                    
                    {/* Meta Content */}
                    <div className="p-6 flex-1 flex flex-col justify-center gap-3 relative overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-40" />
                      
                      <h3 className={`font-black uppercase tracking-tight text-lg leading-tight transition-colors relative z-10 flex items-center gap-2 ${
                        isCurrent ? 'text-primary' : 'text-white group-hover:text-primary'
                      }`}>
                        <span className="text-primary/70 font-black italic">
                          {isCurrent ? "▶" : `0${episode.episode_number || index + 1}`}
                        </span>
                        {episode.title}
                      </h3>
                      
                      <div 
                        className="text-white/40 text-xs line-clamp-2 leading-relaxed font-medium relative z-10 [&_p]:inline [&_p]:m-0 [&_p]:p-0"
                        dangerouslySetInnerHTML={{ __html: episode.shortDescription || "Watch the next installment in this premium web series." }}
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
        </div>
      </div>
    </section>
  );
}
