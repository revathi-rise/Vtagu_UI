'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Layers, Film, X, Maximize2 } from 'lucide-react';
import { Episode } from '@/lib/vtagu.api';

interface EpisodeDetailContentProps {
  episode: Episode;
  iframeSrc: string | null;
}

export default function EpisodeDetailContent({ episode, iframeSrc }: EpisodeDetailContentProps) {
  const [playerOpen, setPlayerOpen] = useState(false);

  const posterSrc =
    episode.image && typeof episode.image === 'string'
      ? episode.image
      : `https://picsum.photos/seed/${episode.episodeId}/600/900`;

  return (
    <>
      {/* ─── Fullscreen iframe Modal ─── */}
      {playerOpen && iframeSrc && (
        <div className="fixed inset-0 z-[999] bg-black flex flex-col">
          {/* Close bar */}
          <div className="flex items-center justify-between px-6 py-4 bg-black/80 backdrop-blur-md border-b border-white/10 flex-shrink-0">
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-cyan-400">Now Playing</p>
              <h2 className="text-white font-black text-lg uppercase tracking-tight truncate">{episode.title}</h2>
            </div>
            <button
              onClick={() => setPlayerOpen(false)}
              className="flex items-center gap-2 text-white/60 hover:text-white transition-colors text-sm font-black uppercase tracking-widest px-4 py-2 rounded-xl border border-white/10 hover:border-white/30 bg-white/5"
            >
              <X size={18} />
              Close
            </button>
          </div>

          {/* Player */}
          <div className="flex-1 relative bg-black">
            <iframe
              src={iframeSrc}
              loading="lazy"
              className="absolute inset-0 w-full h-full border-none"
              allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              title={episode.title}
            />
          </div>
        </div>
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
            <div className="relative w-full lg:w-[220px] flex-shrink-0 aspect-[2/3] rounded-[2rem] overflow-hidden skeuo-glass-specular shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              <Image
                src={posterSrc}
                alt={episode.title}
                fill
                className="object-cover"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col justify-center gap-6">

              {/* Season Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
                Season {episode.seasonId}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d leading-tight">
                {episode.title}
              </h1>

              {/* Meta Chips */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Layers size={14} className="text-cyan-400" />
                  Episode #{episode.episodeId}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Film size={14} className="text-cyan-400" />
                  Season {episode.seasonId}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <span className="text-cyan-400 text-[10px] font-black">4K</span>
                  HDR
                </div>
              </div>

              {/* Description */}
              <p className="text-base md:text-lg text-white/60 leading-relaxed max-w-2xl font-medium">
                An unmissable episode in the series. Dive into the latest chapter of this gripping story — exclusive premium content delivered in stunning high definition.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                {iframeSrc ? (
                  <button
                    onClick={() => setPlayerOpen(true)}
                    className="skeuo-button-cyan px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest flex items-center gap-3 active:skeuo-pressed transition-all duration-300 group relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Play size={20} fill="black" className="group-hover:scale-110 transition-transform relative z-10" />
                    <span className="relative z-10">Watch Fullscreen</span>
                  </button>
                ) : (
                  <button
                    disabled
                    className="px-8 py-4 rounded-[1.5rem] text-sm font-black uppercase tracking-widest flex items-center gap-3 bg-white/5 text-white/30 border border-white/10 cursor-not-allowed"
                  >
                    <Play size={20} />
                    Coming Soon
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
