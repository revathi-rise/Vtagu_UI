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
      <div className="skeuo-card p-12 lg:p-16 relative overflow-visible">
        {/* Header with Season Selector */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
          <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
            EPISODES
          </h2>
          
          <div className="flex items-center gap-4 bg-black/40 p-1.5 rounded-xl border border-white/5 shadow-inner">
            {[1, 2].map((s) => (
              <button
                key={s}
                onClick={() => setActiveSeason(s)}
                className={activeSeason === s ? "skeuo-tab-active" : "skeuo-tab-inactive px-4 py-1.5"}
              >
                SEASON {s}
              </button>
            ))}
          </div>
        </div>

        {/* Episode Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {episodes.map((episode) => (
            <div key={episode.id} className="skeuo-episode-card flex flex-col sm:flex-row group cursor-pointer hover:bg-white/5 transition-colors">
              <div className="relative w-full sm:w-[240px] aspect-video">
                <Image 
                  src={episode.thumbnail} 
                  alt={episode.title}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                <div className="absolute bottom-3 right-3 bg-black/80 px-2 py-0.5 rounded text-[10px] font-bold text-[#00E5FF] tracking-widest uppercase border border-[#00E5FF]/30">
                  {episode.duration}
                </div>
              </div>
              
              <div className="p-6 flex-1 flex flex-col justify-center gap-2">
                <h3 className="text-white font-bold uppercase tracking-tight text-lg leading-tight group-hover:text-[#00E5FF] transition-colors">
                  EPISODE {episode.number}: {episode.title}
                </h3>
                <p className="text-white/40 text-sm line-clamp-2 leading-relaxed">
                  {episode.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
