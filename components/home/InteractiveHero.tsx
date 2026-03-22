'use client';

import React, { useState } from 'react';
import { Play, Plus, Star, Zap, Info, ChevronRight, LayoutGrid } from 'lucide-react';
import SectionTitle from './SectionTitle';

const MOVIES = [
    {
        id: 1,
        title: "The Last Hunt",
        rating: "4.9",
        category: "Featured Movie",
        quality: "8K",
        duration: "2h 15m",
        desc: "In a world where survival is the only law, one man must face his past to protect his future. An epic journey of redemption and grit.",
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 2,
        title: "Cyberpunk Rising",
        rating: "4.8",
        category: "New Release",
        quality: "4K",
        duration: "1h 55m",
        desc: "The neon lights hide a dark secret. Follow K-0 as they navigate the corporate wars of 2099 in this high-octane thriller.",
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 3,
        title: "Stellar Void",
        rating: "4.7",
        category: "Sci-Fi Epic",
        quality: "8K",
        duration: "2h 30m",
        desc: "Beyond the event horizon lies a truth that will change humanity forever. A visual masterpiece exploring the limits of space.",
        image: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1000&auto=format&fit=crop",
    },
    {
        id: 4,
        title: "Midnight Echoes",
        rating: "4.5",
        category: "Thriller",
        quality: "4K",
        duration: "1h 45m",
        desc: "A sound engineer discovers a frequency that shouldn't exist, leading to a hunt across the city's underbelly.",
        image: "https://images.unsplash.com/photo-1485846234645-a62644f84728?q=80&w=1000&auto=format&fit=crop",
    }
];

export default function InteractiveGridHero() {
    const [selectedId, setSelectedId] = useState(1);
    const activeMovie = MOVIES.find(m => m.id === selectedId) || MOVIES[0];

    return (
        <section className="w-full py-12 bg-[#0f0a19] ">
            <div className="max-w-[90%] mx-auto">

                {/* Section Header */}
                <div className="flex items-end justify-between mb-12">
                    <SectionTitle
                        title="Interactive Spotlight"
                        subtitle="Select a title to explore"
                        Icon={LayoutGrid}
                        gradientText="Spotlight"
                        viewAllHref="/inter-active"
                    />

                </div>

                {/* The Grid Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

                    {/* LARGE DISPLAY CARD (Takes up 2 columns) */}
                    <div className="lg:col-span-2 relative group overflow-hidden rounded-3xl border border-white/10 bg-[#1a1329]">
                        <div className="absolute inset-0">
                            <img
                                src="https://media.giphy.com/media/3o7TKMGpxxcaeqpI0o/giphy.gif"
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                alt={activeMovie.title}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-[#1a1329] via-[#1a1329]/40 to-transparent" />
                        </div>

                        <div className="relative h-[400px] flex flex-col justify-end p-8 min-h-[400px]">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="bg-gradient-to-r from-[#3299FF] to-[#9248FF] text-white text-[10px] font-bold px-2 py-1 rounded uppercase">
                                    {activeMovie.category}
                                </span>
                                <span className="text-gray-300 text-xs font-medium">{activeMovie.duration}</span>
                            </div>

                            <h3 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tighter">
                                {activeMovie.title}
                            </h3>

                            <p className="text-gray-300 text-sm leading-relaxed mb-6 line-clamp-2 max-w-md">
                                {activeMovie.desc}
                            </p>

                            <div className="flex items-center gap-4">
                                <button className="flex items-center gap-2 bg-white text-black px-6 py-3 rounded-xl font-bold hover:bg-[#3299FF] hover:text-white transition-all">
                                    <Play size={18} fill="currentColor" /> Play Now
                                </button>
                                <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/10 hover:bg-white/20 transition-all">
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* INTERACTIVE THUMBNAILS (The Grid Handle) */}
                    <div className="lg:col-span-2 grid grid-cols-2 gap-4">
                        {MOVIES.map((movie) => (
                            <div
                                key={movie.id}
                                onClick={() => setSelectedId(movie.id)}
                                className={`
                  relative cursor-pointer rounded-2xl overflow-hidden transition-all duration-500 p-[2px]
                  ${selectedId === movie.id
                                        ? "bg-gradient-to-r from-[#3299FF] to-[#9248FF] ring-4 ring-[#3299FF]/20"
                                        : "bg-transparent hover:bg-white/10"
                                    }
                `}
                            >
                                <div className="bg-[#1a1329] rounded-[14px] h-full overflow-hidden">
                                    <div className="relative aspect-video">
                                        <img src={movie.image} className="w-full h-full object-cover" alt="" />
                                        <div className={`absolute inset-0 bg-[#3299FF]/20 transition-opacity ${selectedId === movie.id ? 'opacity-100' : 'opacity-0'}`} />
                                    </div>

                                    <div className="p-3">
                                        <h4 className="text-white font-bold text-sm truncate">{movie.title}</h4>
                                        <div className="flex items-center justify-between mt-2">
                                            <div className="flex items-center gap-1 text-[10px] text-yellow-500 font-bold">
                                                <Star size={10} fill="currentColor" /> {movie.rating}
                                            </div>
                                            <span className="text-[10px] text-gray-500 font-bold border border-gray-700 px-1 rounded">
                                                {movie.quality}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}