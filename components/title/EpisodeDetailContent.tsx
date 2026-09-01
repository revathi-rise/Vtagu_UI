'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Layers, Film, Maximize2 } from 'lucide-react';
import { Episode, incrementEpisodeView } from '@/lib/vtagu.api';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';

interface EpisodeDetailContentProps {
  episode: Episode;
  iframeSrc: string | null;
}

export default function EpisodeDetailContent({ episode, iframeSrc }: EpisodeDetailContentProps) {
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    const epId = episode.id || episode.episodeId;
    if (epId) {
      incrementEpisodeView(epId);
    }
  }, [episode.id, episode.episodeId]);

  const epImage = episode.media?.poster_image?.url || episode.image;
 
  return (
    <>
      {iframeSrc && (
        <VideoPlayerModal
          isOpen={playerOpen}
          onClose={() => setPlayerOpen(false)}
          videoUrl={iframeSrc}
          title={episode.title}
          contentId={(episode.id || episode.episodeId || "").toString()}
          contentType="episode"
        />
      )}

      <section className="py-20 tv-container px-6 md:px-12 lg:px-20">
        <div className="skeuo-surface-high p-8 lg:p-16 relative overflow-visible space-y-12">

          {/* ── Inline Preview Player (if iframeSrc available) ── */}
          {iframeSrc && (
            <div id="episode-player" className="relative w-full rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10">
              {/* 16:9 aspect ratio container */}
              <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                <iframe
                  src={iframeSrc}
                  loading="lazy"
                  style={{
                    border: 'none',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    height: '100%',
                    width: '100%',
                  }}
                  allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  title={episode.title}
                />
              </div>

              {/* Fullscreen button overlay */}
              <button
                onClick={() => setPlayerOpen(true)}
                className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 hover:bg-black/90 backdrop-blur-md text-white text-[10px] font-black uppercase tracking-widest px-3 py-2 rounded-xl border border-white/10 transition-all hover:border-cyan-400/40 hover:text-cyan-400"
              >
                <Maximize2 size={14} />
                Full Screen
              </button>
            </div>
          )}

          {/* ── Episode Info ── */}
          <div className="flex flex-col lg:flex-row gap-12">

            {/* Poster */}
            <div className="relative w-full lg:w-[330px] flex-shrink-0 aspect-[4/3] rounded-[2rem] overflow-hidden skeuo-glass-specular shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              <Image
                src={episode.media?.card_image?.url || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800"}
                alt={episode.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /> */}
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col justify-center gap-6">

              {/* Season Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
                Season {episode.season_id || episode.seasonId}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d leading-tight">
                {episode.title}
              </h1>

              {/* Meta Chips */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Layers size={14} className="text-cyan-400" />
                  Episode #{episode.episode_number || episode.id || episode.episodeId}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Film size={14} className="text-cyan-400" />
                  Season {episode.season_id || episode.seasonId}
                </div>
                {episode.duration && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-cyan-400 text-[10px] font-black">MIN</span>
                    {episode.duration}
                  </div>
                )}
                {episode.rating && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10 text-yellow-400">
                    ★ {episode.rating}
                  </div>
                )}
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <span className="text-primary text-[10px] font-black">4K</span>
                  HDR
                </div>
              </div>

              {/* Description */}
              <div 
                className="text-base md:text-lg text-white/60 leading-relaxed max-w-[90%] font-medium [&_p]:inline [&_p]:m-0 [&_p]:p-0"
                dangerouslySetInnerHTML={{ __html: episode.longDescription || episode.shortDescription || "An unmissable episode in the series. Dive into the latest chapter of this gripping story — exclusive premium content delivered in stunning high definition." }}
              />

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {iframeSrc ? (
                  <button
                    onClick={() => setPlayerOpen(true)}
                    className="bg-primary text-black px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(50,153,255,0.4)] transition-all duration-300 group relative overflow-hidden active:scale-95 shadow-xl"
                  >
                    <Play size={20} fill="black" className="group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Watch Fullscreen</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                  >
                    <Play size={20} />
                    Coming Soon
                  </button>
                )}
                {episode.media?.trailer?.url && (
                  <button
                    onClick={() => {
                       window.open(episode.media?.trailer?.url, "_blank");
                    }}
                    className="px-8 py-4 rounded-full text-sm font-black uppercase tracking-widest flex items-center gap-3 bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 active:scale-95"
                  >
                    <Play size={20} />
                    Watch Trailer
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
