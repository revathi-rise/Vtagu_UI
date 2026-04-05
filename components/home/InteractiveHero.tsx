'use client';

import React, { useState, useRef } from 'react';
import { Play, Plus, Zap, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { InteractiveMovie } from '@/lib/vtagu.api';

interface InteractiveHeroProps {
    interactiveMovies: InteractiveMovie[];
}

export default function InteractiveGridHero({ interactiveMovies }: InteractiveHeroProps) {
    const [hoveredId, setHoveredId] = useState<number | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    const handleMouseEnter = (id: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            setHoveredId(id);
        }, 150); // Faster response for interactive
    };

    const handleMouseLeave = () => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        setHoveredId(null);
    };

    return (
        <section className="w-full py-16 bg-[#0f0a19] overflow-visible">
            <div className="max-w-[90%] mx-auto overflow-visible">

                {/* Section Header */}
                <div className="mb-12">
                    <SectionTitle
                        title="Interactive Spotlight"
                        subtitle="SELECT TO EXPLORE"
                        Icon={LayoutGrid}
                        gradientText="Spotlight"
                        viewAllHref="/inter-active"
                    />
                </div>

                {/* Interactive Container: Upgraded Skeuomorphism */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="relative bg-[#0c0816] rounded-[3rem] p-10 md:p-14 border-[12px] border-[#1a1329] shadow-[0_50px_100px_rgba(0,0,0,0.9)] overflow-hidden"
                >
                    {/* Background Visual Interest */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(50,153,255,0.05),transparent_50%)]" />
                    <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-transparent opacity-30" />

                    {/* Content Header: Upgraded with Neon Focus */}
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16">
                        <div className="space-y-6 max-w-2xl">
                            {/* Specialized USB Badge: Inter Bold */}
                            <div className="inline-flex items-center gap-3 bg-cyan-400 text-black px-5 py-2 rounded-full font-bold text-[11px] uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(34,211,238,0.5)]" style={{ fontFamily: 'var(--font-inter)' }}>
                                <Zap size={16} fill="black" className="animate-pulse" />
                                Unique Story Branching (USB)
                            </div>

                            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white uppercase tracking-tighter leading-none" style={{ fontFamily: 'var(--font-poppins)' }}>
                                Interactive Core: <span className="text-gradient-neon">Narrative Hub</span>
                            </h2>
                            <p className="text-gray-400 text-lg leading-relaxed max-w-xl font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
                                Take control of the story. Your choices define the outcome in our latest interactive prototypes.
                            </p>
                        </div>

                        <button className="flex items-center gap-3 text-cyan-400 font-bold text-sm uppercase tracking-widest hover:text-white transition-all group/btn" style={{ fontFamily: 'var(--font-inter)' }}>
                            <span className="relative">
                                Live Narratives
                                <div className="absolute -bottom-1 left-0 w-0 h-[2px] bg-cyan-400 transition-all duration-300 group-hover/btn:w-full" />
                            </span>
                            <ChevronRight size={20} className="group-hover/btn:translate-x-2 transition-transform" />
                        </button>
                    </div>

                    {/* Interactive Cards Grid */}
                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {(interactiveMovies && interactiveMovies.length > 0 ? interactiveMovies : [
                            { interactive_movie_id: 1, title: "Fractured Choice", description: "Every decision leads to a new reality." },
                            { interactive_movie_id: 2, title: "Neural Engine", description: "The first experiment in AI-driven narrative." },
                            { interactive_movie_id: 3, title: "Ghost Protocol", description: "Navigate the shadows of a digital city." },
                            { interactive_movie_id: 4, title: "Primal Fear", description: "Survival is the only objective." },
                        ]).map((movie) => {
                            const isHovered = hoveredId === movie.interactive_movie_id;

                            return (
                                <div
                                    key={movie.interactive_movie_id}
                                    className="relative group/inter"
                                    onMouseEnter={() => handleMouseEnter(movie.interactive_movie_id)}
                                    onMouseLeave={handleMouseLeave}
                                >
                                    {/* Card Wrapper: Magnific Popup Style */}
                                    <div
                                        className={`
                                            skeuo-card relative w-full overflow-hidden
                                            transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)]
                                            ${isHovered
                                                ? "scale-110 -translate-y-4 z-50 shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.25)] border-cyan-400/50"
                                                : "scale-100 z-10 border-[#1a1329]"}
                                        `}
                                    >
                                        <div className="relative aspect-[3/4.5] overflow-hidden bg-[#0c0816]">
                                            <img
                                                src="/fractured_choice_poster.png"
                                                className={`w-full h-full object-cover transition-all duration-1000 ${isHovered ? "opacity-20 scale-125 blur-sm" : "opacity-80 brightness-90"}`}
                                                alt={movie.title}
                                            />

                                            {/* Play/Interact Overlay */}
                                            <div className={`absolute inset-0 flex items-center justify-center transition-all duration-500 ${isHovered ? 'scale-100 opacity-100' : 'scale-75 opacity-0'}`}>
                                                <div className="w-16 h-16 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.6)]">
                                                    <Zap size={28} className="fill-black" />
                                                </div>
                                            </div>

                                            {/* Cinematic Content Fade */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-[#0c0816] via-[#0c0816]/40 to-transparent p-6 flex flex-col justify-end">
                                                <div className="space-y-4 translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                                    <h3 className="text-xl md:text-2xl font-bold text-white uppercase tracking-tight leading-tight group-hover:text-cyan-400 transition-colors" style={{ fontFamily: 'var(--font-poppins)' }}>
                                                        {movie.title}
                                                    </h3>
                                                    
                                                    <div className={`grid transition-all duration-500 ${isHovered ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                                                        <p className="text-[14px] text-gray-400 font-normal line-clamp-2 overflow-hidden leading-relaxed" style={{ fontFamily: 'var(--font-inter)' }}>
                                                            {movie.description}
                                                        </p>
                                                    </div>

                                                    <div className="flex gap-3 pt-2">
                                                        <button className="flex-1 bg-cyan-400 text-black text-[10px] font-bold uppercase tracking-widest py-3 rounded-xl hover:bg-cyan-300 transition-all shadow-[0_10px_20px_rgba(34,211,238,0.3)] active:scale-95">
                                                            Interact
                                                        </button>
                                                        <button className="w-11 h-11 flex items-center justify-center glass-panel rounded-xl hover:bg-white/10 transition-all text-white active:scale-90 shadow-xl">
                                                            <Plus size={20} />
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

                    {/* Kinetic Bottom Glow */}
                    <div className="absolute bottom-0 left-0 w-full h-[150px] bg-gradient-to-t from-cyan-400/10 to-transparent pointer-events-none" />
                </motion.div>
            </div>
        </section>
    );
}