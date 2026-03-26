'use client';

import React from 'react';
import { ChevronRight, Play, Star, Plus, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
        >
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
                                <div
                                    className={`
            absolute top-0 left-0 w-full rounded-[1.5rem] p-[3px]
            transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)]
            ${isHovered
                                            ? "scale-110 z-50 bg-[#251b3a] shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.3)] -translate-y-[5%]"
                                            : "scale-100 z-10 bg-[#1a1329]"
                                        }
        `}
                                    style={{ transformOrigin }}
                                >
                                    {/* INNER CARD: This acts as the clipping container */}
                                    <div className="relative w-full aspect-[2/3] bg-[#0c0816] rounded-[1.3rem] overflow-hidden border-[1px] border-white/10">

                                        {/* IMAGE & PREVIEW LAYER */}
                                        <div className="absolute inset-0 w-full h-full">
                                            <img
                                                src={`https://picsum.photos/seed/${movie.id + 20}/600/900`}
                                                alt={movie.title}
                                                className={`w-full h-full object-cover transition-opacity duration-500 ${isHovered ? 'opacity-40' : 'opacity-100'}`}
                                            />

                                            {isHovered && (
                                                <img
                                                    src="https://media.giphy.com/media/3o7TKMGpxxcaeqpI0o/giphy.gif"
                                                    className="absolute inset-0 w-full h-full object-cover opacity-60"
                                                    alt="preview"
                                                />
                                            )}

                                            {/* Skeuomorphic Inner Shadow */}
                                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.9)] pointer-events-none" />

                                            {/* GRADIENT: Higher z-index to stay behind text but over images */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0816] via-[#0c0816]/60 to-transparent z-10" />
                                        </div>

                                        {/* BADGE */}
                                        <div className="absolute top-3 right-3 z-30">
                                            <div className="px-2 py-0.5 rounded-sm bg-cyan-400 text-[9px] font-black text-black tracking-widest uppercase">
                                                NEW
                                            </div>
                                        </div>

                                        {/* CONTENT: Bottom Aligned */}
                                        <div className="absolute bottom-0 left-0 w-full p-4 z-20 flex flex-col justify-end">
                                            <h4 className="text-white font-black text-[12px] uppercase tracking-wider truncate mb-1">
                                                {movie.title}
                                            </h4>

                                            <div className="flex items-center gap-2 text-[9px] font-bold text-gray-400 uppercase">
                                                <span className="text-cyan-400 flex items-center gap-1">★ {movie.rating}</span>
                                                <span>{movie.year}</span>
                                                <span className="border border-white/20 px-1 text-[7px]">4K</span>
                                            </div>

                                            {/* EXPANDABLE AREA */}
                                            <div className={`
                    grid transition-all duration-500 ease-in-out
                    ${isHovered ? "grid-rows-[1fr] opacity-100 mt-3" : "grid-rows-[0fr] opacity-0"}
                `}>
                                                <div className="overflow-hidden">
                                                    <p className="text-[10px] text-gray-400 mb-4 line-clamp-2 leading-relaxed">
                                                        {movie.desc}
                                                    </p>

                                                    <div className="flex gap-2 pb-1">
                                                        <button className="flex-1 bg-cyan-400 text-black py-2 rounded-lg text-[10px] font-black uppercase tracking-tighter flex items-center justify-center gap-1 hover:scale-105 transition-transform">
                                                            <Play size={12} fill="black" /> Play
                                                        </button>
                                                        <button className="w-9 h-9 flex items-center justify-center bg-white/10 rounded-lg border border-white/10 hover:bg-white/20 transition-all text-white">
                                                            <Plus size={14} />
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </motion.div>

            </div>
        </section>
    );
}