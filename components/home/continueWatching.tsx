'use client';

import React from 'react';
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
                            {/* Skeuomorphic Transmission Card */}
                            <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden bg-[#0c0816] border-[8px] border-[#1a1329] transition-all duration-500 group-hover:bg-[#161121] group-hover:border-[#251b3a] group-hover:shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.15)]">
                                
                                {/* Image with refined Overlay */}
                                <img
                                    src={mockImages[index % mockImages.length]}
                                    alt={movie.title}
                                    className="w-full h-full object-cover grayscale-[40%] group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105 opacity-60 group-hover:opacity-100"
                                />

                                {/* Skeuomorphic Inner Shadow */}
                                <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />
                                
                                {/* Sophisticated Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#050208] via-transparent to-transparent opacity-90" />

                                {/* Floating Progress Pill - Tactical Style with Hover Blur */}
                                <div className="absolute top-5 left-5 bg-black/60 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/10 flex items-center gap-2 group-hover:backdrop-blur-[24px] transition-all duration-500 shadow-xl">
                                    <Clock size={12} className="text-cyan-400" />
                                    <span className="text-[10px] font-black text-white tracking-[0.1em] uppercase">{movie.remaining}</span>
                                </div>

                                {/* Center Play Action - Minimalist Tactical */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                    <motion.div 
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        className="w-20 h-20 rounded-full bg-cyan-400 border-4 border-black/20 flex items-center justify-center text-black shadow-[0_0_30px_rgba(34,211,238,0.5)] cursor-pointer"
                                    >
                                        <Play fill="black" size={32} className="ml-1" />
                                    </motion.div>
                                </div>

                                {/* Bottom Info Bar */}
                                <div className="absolute bottom-0 left-0 w-full p-6">
                                    <div className="flex justify-between items-end mb-4">
                                        <div>
                                            <span className="text-[11px] text-cyan-400 font-black uppercase tracking-[0.2em]">{movie.genre}</span>
                                            <h3 className="text-white font-black text-xl uppercase tracking-tighter leading-none mt-1.5">{movie.title}</h3>
                                        </div>
                                        <span className="text-[10px] text-white/40 font-black font-mono tracking-widest">{movie.progress}%</span>
                                    </div>
                                    
                                    {/* Recessed Progress Track */}
                                    <div className="h-1.5 w-full bg-black/60 rounded-full overflow-hidden border border-white/5">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            whileInView={{ width: `${movie.progress}%` }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-cyan-400 shadow-[0_0_15px_#22d3ee] relative"
                                        >
                                            <div className="absolute right-0 top-0 h-full w-4 bg-white/30 blur-[2px]" />
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