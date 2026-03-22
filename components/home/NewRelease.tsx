'use client';

import React from 'react';
import { ChevronRight, Play, Star, Plus, Zap } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { useDelayedHover } from '../../hooks/useDelayedHover';

const NEW_RELEASES = [
    { id: 1, title: "Cyberpunk Rising", year: "2024", genre: "Action", rating: "4.8", desc: "A rebel hacker discovers a corporate conspiracy that threatens the city's neon future." },
    { id: 2, title: "Stellar Void", year: "2023", genre: "Sci-Fi", rating: "4.5", desc: "Deep space explorers find an ancient relic that defies the laws of physics." },
    { id: 3, title: "Pulse Echo", year: "2024", genre: "Thriller", rating: "4.9", desc: "A sound engineer hears a heartbeat coming from a digital recording." },
    { id: 4, title: "The Singularity", year: "2024", genre: "Documentary", rating: "4.2", desc: "Tracing the rapid evolution of AI and its impact on humanity." },
    { id: 5, title: "Visionary", year: "2024", genre: "Drama", rating: "4.7", desc: "An artist loses her sight but gains a terrifying new way to see." },
    { id: 6, title: "Night Crawler", year: "2023", genre: "Action", rating: "4.6", desc: "The city streets come alive at night as a mysterious driver takes on jobs." },
];

export default function NewReleases() {
    const { hoveredId, handleMouseEnter, handleMouseLeave } = useDelayedHover(400);

    return (
        <section className="w-full py-16 bg-[#0f0a19] overflow-hidden">
            <div className="max-w-[90%] mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-10">
                    <SectionTitle
                        title="New Releases"
                        subtitle="Freshly Added"
                        Icon={Zap}
                        gradientText="Releases"
                        viewAllHref="/new-releases"
                    />
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                    {NEW_RELEASES.map((movie, index) => {
                        const isHovered = hoveredId === movie.id;

                        const isFirst = index % 6 === 0;
                        const isLast = (index + 1) % 6 === 0;
                        const transformOrigin = isFirst ? 'left' : isLast ? 'right' : 'center';

                        return (
                            <div
                                key={movie.id}
                                className="relative aspect-[2/3] w-full"
                                onMouseEnter={() => handleMouseEnter(movie.id)}
                                onMouseLeave={handleMouseLeave}
                            >
                                {/* OUTER WRAPPER (EXPAND EFFECT) */}
                                <div
                                    className={`
                    absolute top-0 left-0 w-full rounded-2xl p-[2px]
                    transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
                    ${isHovered
                                            ? "scale-110 z-50 bg-gradient-to-r from-[#3299FF] to-[#9248FF] shadow-[0_0_30px_rgba(50,153,255,0.3)] -translate-y-[10%]"
                                            : "scale-100 z-10 bg-transparent"
                                        }
                  `}
                                    style={{ transformOrigin }}
                                >
                                    {/* INNER CARD */}
                                    <div className="w-full h-full bg-[#1a1329] rounded-[14px] overflow-hidden">

                                        {/* IMAGE */}
                                        <div className="relative w-full h-full">
                                            <img
                                                src={`https://picsum.photos/seed/${movie.id + 20}/600/900`}
                                                alt={movie.title}
                                                className="w-full h-full object-cover"
                                            />

                                            {/* PREVIEW (like Trending) */}
                                            <div className={`absolute inset-0 transition-opacity duration-500 ${isHovered ? "opacity-100" : "opacity-0"}`}>
                                                {isHovered && (
                                                    <img
                                                        src="https://media.giphy.com/media/3o7TKMGpxxcaeqpI0o/giphy.gif"
                                                        className="w-full h-full object-cover opacity-70"
                                                    />
                                                )}
                                            </div>

                                            {/* BADGE */}
                                            <div className="absolute top-3 right-3 z-20">
                                                <div className="px-2 py-1 rounded-md bg-black/40 backdrop-blur-md border border-white/10 text-[10px] font-bold text-white">
                                                    NEW
                                                </div>
                                            </div>

                                            {/* GRADIENT */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                                        </div>

                                        {/* CONTENT */}
                                        <div className="absolute bottom-0 p-4 w-full">
                                            <h4 className="text-white font-bold text-sm">
                                                {movie.title}
                                            </h4>

                                            <div className="flex items-center gap-2 text-[10px] text-gray-300 mt-1">
                                                <span className="text-yellow-400 flex items-center gap-1">
                                                    <Star size={10} fill="currentColor" /> {movie.rating}
                                                </span>
                                                <span>{movie.year}</span>
                                                <span className="border px-1 text-[8px]">4K</span>
                                            </div>

                                            {/* EXPANDABLE */}
                                            <div className={`
                        transition-all duration-500 overflow-hidden
                        ${isHovered ? "max-h-[200px] opacity-100 mt-3" : "max-h-0 opacity-0"}
                      `}>
                                                <p className="text-[11px] text-gray-300 mb-3 line-clamp-2">
                                                    {movie.desc}
                                                </p>

                                                <div className="flex gap-2">
                                                    <button className="flex-1 bg-white text-black py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-1 hover:bg-purple-400 transition">
                                                        <Play size={14} /> Play
                                                    </button>
                                                    <button className="p-2 bg-white/10 rounded-lg hover:bg-white/20 transition">
                                                        <Plus size={14} />
                                                    </button>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

            </div>
        </section>
    );
}