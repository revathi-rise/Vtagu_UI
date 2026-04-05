'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Play, History, Plus, Clock } from 'lucide-react';
import SectionTitle from './SectionTitle';

const CONTINUE_MOVIES = [
    { id: 1, title: "The Cosmic Voyager", genre: "Sci-Fi", quality: "8K", progress: 65, remaining: "45m left" },
    { id: 2, title: "Midnight Echoes", genre: "Thriller", quality: "4K", progress: 20, remaining: "1h 20m left" },
    { id: 3, title: "Neon Jungle", genre: "Action", quality: "4K", progress: 90, remaining: "12m left" },
    { id: 4, title: "Desert Mirage", genre: "Adventure", quality: "8K", progress: 45, remaining: "1h 10m left" },
];

const mockImages = [
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
];

export default function ContinueWatching() {
    return (
        <section className="w-full py-16 bg-[#0f0a19] overflow-hidden">
            <div className="max-w-[94%] mx-auto">
                
                <div className="flex items-center justify-between mb-10">
                    <SectionTitle
                        title="Resume Transmission"
                        subtitle="CONTINUE"
                        Icon={History}
                        gradientText="Transmission"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {CONTINUE_MOVIES.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative"
                        >
                            {/* Premium Skeuomorphic Transmission Card */}
                            <div 
                                className="skeuo-card relative aspect-[16/10] overflow-hidden group-hover:scale-110 group-hover:z-50 transition-all duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] group-hover:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.25)] border-[#1a1329] group-hover:border-cyan-400/40"
                                suppressHydrationWarning
                            >
                                
                                {/* Image with Cinematic Refinement */}
                                <Image
                                    src={mockImages[index % mockImages.length]}
                                    alt={movie.title}
                                    fill
                                    className="object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100"
                                    sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 22vw"
                                    unoptimized
                                />

                                {/* Sophisticated Cinematic Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-[#050208]/20 to-transparent opacity-90" />
                                
                                {/* Rotating Glow Effect on Hover */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none">
                                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.1),transparent_70%)]" />
                                </div>

                                {/* Floating Progress Pill: Inter Medium */}
                                <div className="absolute top-5 left-5 glass-panel px-4 py-1.5 rounded-full flex items-center gap-2 group-hover:border-cyan-400/30 transition-all duration-500 shadow-2xl">
                                    <Clock size={12} className="text-cyan-400 animate-pulse" />
                                    <span className="text-[12px] font-medium text-white tracking-wide uppercase" style={{ fontFamily: 'var(--font-inter)' }}>{movie.remaining}</span>
                                </div>

                                {/* Center Play Action: Magnific Popup Style */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-75 group-hover:scale-100">
                                    <motion.div 
                                        whileHover={{ scale: 1.15, rotate: 5 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-cyan-400 flex items-center justify-center text-black shadow-[0_0_40px_rgba(34,211,238,0.6)] cursor-pointer border-4 border-black/20"
                                    >
                                        <Play fill="black" size={32} className="ml-1" />
                                    </motion.div>
                                </div>

                                {/* Bottom Info Bar: Upgraded Typography */}
                                <div className="absolute bottom-0 left-0 w-full p-6 translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex justify-between items-end mb-4">
                                        <div className="space-y-1">
                                            {/* Genre: Inter Regular 12-14px */}
                                            <span className="text-[12px] text-cyan-400 font-normal uppercase tracking-widest block" style={{ fontFamily: 'var(--font-inter)' }}>{movie.genre}</span>
                                            {/* Title: Poppins SemiBold 22-28px */}
                                            <h3 
                                              className="text-white font-semibold text-[22px] md:text-[24px] uppercase tracking-tight leading-none mt-1.5"
                                              style={{ fontFamily: 'var(--font-poppins)' }}
                                            >
                                              {movie.title}
                                            </h3>
                                        </div>
                                        <span className="text-[12px] text-white/60 font-medium font-mono" style={{ fontFamily: 'var(--font-inter)' }}>{movie.progress}%</span>
                                    </div>
                                    
                                    {/* Advanced Progress Track */}
                                    <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5 relative">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${movie.progress}%` }}
                                            transition={{ duration: 1.5, ease: "circOut" }}
                                            className="h-full bg-cyan-400 shadow-[0_0_20px_#22d3ee] relative"
                                        >
                                            <div className="absolute right-0 top-0 h-full w-20 bg-white/20 blur-md animate-shimmer" />
                                        </motion.div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}