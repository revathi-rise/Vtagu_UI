"use client";
import React from 'react';
import Image from 'next/image';

interface RelatedItem {
  id: number;
  title: string;
  image: string;
}

const MOCK_RELATED: RelatedItem[] = [
  { id: 101, title: "Lost Legends: Alchemy of Gold", image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&q=80&w=400" },
  { id: 102, title: "Velocity Point", image: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=400" },
  { id: 103, title: "Cyber Nights", image: "https://images.unsplash.com/photo-1514467950401-6d8a0116a84c?auto=format&fit=crop&q=80&w=400" },
  { id: 104, title: "The Last Watcher", image: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&q=80&w=400" },
  { id: 105, title: "Neon Drifters", image: "https://images.unsplash.com/photo-1514474776145-18310344caad?auto=format&fit=crop&q=80&w=400" },
];

export default function RelatedNarratives() {
  return (
    <section className="py-20 tv-container px-6 md:px-12 lg:px-20">
      <div className="flex items-center gap-4 mb-10">
        <div className="w-12 h-1.5 bg-[#00E5FF] rounded-full shadow-[0_0_15px_rgba(0,229,255,0.6)]" />
        <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter">
          RELATED NARRATIVES
        </h2>
      </div>

      <div className="flex gap-8 overflow-x-auto pb-10 scrollbar-hide snap-x">
        {MOCK_RELATED.map((item) => (
          <div key={item.id} className="min-w-[280px] w-[300px] flex-shrink-0 snap-start group cursor-pointer">
            <div className="relative aspect-[2/3] rounded-3xl overflow-hidden border border-white/5 transition-all duration-500 group-hover:border-white/20 group-hover:shadow-[0_20px_40px_rgba(0,0,0,0.6)] group-hover:-translate-y-2">
              <Image 
                src={item.image} 
                alt={item.title}
                fill
                className="object-cover group-hover:scale-110 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <h3 className="mt-6 text-lg font-black text-white/50 uppercase italic tracking-tighter group-hover:text-white transition-colors">
              {item.title}
            </h3>
          </div>
        ))}
      </div>
    </section>
  );
}
