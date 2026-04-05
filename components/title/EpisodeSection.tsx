"use client";
import React, { useState } from 'react';
import Image from 'next/image';

interface Episode {
  id: number;
  number: number;
  title: string;
  duration: string;
  description: string;
  thumbnail: string;
}

const MOCK_EPISODES: Record<number, Episode[]> = {
  1: [
    { id: 1, number: 1, title: "The Discovery", duration: "42:00", description: "As the truth begins to surface, Ashwin must face his greatest fear...", thumbnail: "https://images.unsplash.com/photo-1542831371-29b0f74f9713?auto=format&fit=crop&q=80&w=600" },
    { id: 2, number: 2, title: "Mirror Network", duration: "45:15", description: "The encrypted messages lead to a hidden terminal deep within the restricted zone.", thumbnail: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=600" },
    { id: 3, number: 3, title: "Phantom Pulse", duration: "38:40", description: "A surge in the power grid reveals a presence that shouldn't exist in the network.", thumbnail: "https://images.unsplash.com/photo-1531297484001-80022131f1a1?auto=format&fit=crop&q=80&w=600" },
    { id: 4, number: 4, title: "Final Handshake", duration: "48:20", description: "The connection is established, but the price of entry is higher than Ashwin ever imagined.", thumbnail: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&q=80&w=600" },
  ],
  2: [
    { id: 5, number: 1, title: "Reboot Protocol", duration: "44:00", description: "After the fallout, a new system emerges from the ashes of the old world.", thumbnail: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&q=80&w=600" },
  ]
};

export default function EpisodeSection() {
  const [activeSeason, setActiveSeason] = useState(1);
  const episodes = MOCK_EPISODES[activeSeason] || [];

  return (
    <section className="py-20 tv-container px-6 md:px-12 lg:px-20">
      <div className="skeuo-surface-high p-8 lg:p-16 relative overflow-visible">
        {/* Header with Season Selector */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-16 gap-8">
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d">
            EPISODE EXPLORER
          </h2>
          
          <div className="skeuo-surface-low p-2 flex items-center gap-4 bg-gradient-to-b from-white/5 to-transparent">
            <span className="hidden sm:inline-block px-4 text-[10px] font-black uppercase text-white/30 tracking-widest">Select Sequence</span>
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className={`
                  transition-all duration-300 active:skeuo-pressed
                  ${activeSeason === s ? "skeuo-tab-active" : "skeuo-tab-inactive px-6 py-2.5"}
                `}
              >
                S-0{s}
              </button>
            ))}
          </div>
        </div>

        {/* Episode Grid with Premium Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {episodes.map((episode) => (
            <div 
              key={episode.id} 
              className="skeuo-episode-card flex flex-col sm:flex-row group cursor-pointer active:skeuo-pressed hover:bg-[#1a1329] hover:scale-[1.02] transition-all duration-500 ease-out border-white/5 hover:border-cyan-500/30"
            >
              {/* Thumbnail Container with Specular Highlights */}
              <div className="relative w-full sm:w-[280px] aspect-video skeuo-glass-specular overflow-hidden border-r border-white/5">
                <Image 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale-[0.3] group-hover:grayscale-0"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-3 left-3 bg-[#00E5FF] w-1.5 h-1.5 rounded-full shadow-[0_0_8px_#00E5FF] animate-pulse-soft" />
                <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3 py-1 rounded-lg text-[10px] font-black text-[#00E5FF] tracking-widest uppercase border border-[#00E5FF]/30 shadow-lg">
                  {episode.duration}
                </div>
              </div>
              
              {/* Meta Content */}
              <div className="p-8 flex-1 flex flex-col justify-center gap-3 relative overflow-hidden">
                {/* Micro background gradient for card depth */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none opacity-50" />
                
                <h3 className="text-white font-black uppercase tracking-tight text-xl leading-tight group-hover:text-[#00E5FF] transition-colors relative z-10">
                  <span className="text-cyan-500/50 mr-2 font-black italic">0{episode.number}</span>
                  {episode.title}
                </h3>
                <p className="text-white/40 text-sm line-clamp-2 leading-relaxed font-medium relative z-10">
                  {episode.description}
                </p>
                
                {/* Hover indicator line */}
                <div className="absolute bottom-0 left-0 h-0.5 w-0 bg-[#00E5FF] transition-all duration-700 group-hover:w-full opacity-40 shadow-[0_0_10px_#00E5FF]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
