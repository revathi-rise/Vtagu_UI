'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, Play, History, Info, Plus } from 'lucide-react';
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
        <section className="w-full py-12 bg-[#0f0a19]">
            <div className="max-w-[90%] mx-auto">

                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <SectionTitle
                        title="Continue Watching"
                        subtitle="Your Progress"
                        Icon={History}
                        gradientText="Watching"
                    />
                    <button className="text-gray-400 hover:text-white flex items-center gap-1 text-sm font-medium transition-colors">
                        View All <ChevronRight size={16} />
                    </button>
                </div>

                {/* Grid with specialized hover behavior */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {CONTINUE_MOVIES.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="group relative cursor-pointer"
                        >
                            {/* Card Body */}
                            <div className="relative aspect-video rounded-[8px] overflow-hidden border border-white/5 bg-[#1a1329] shadow-lg transition-all duration-300 group-hover:shadow-purple-500/20 group-hover:-translate-y-2">

                                <img
                                    src={mockImages[index % mockImages.length]}
                                    alt={movie.title}
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />

                                {/* Dark Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-40" />

                                {/* Interactive Resume Layer */}
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-[2px] bg-black/20">
                                    <div className="flex gap-3 scale-75 group-hover:scale-100 transition-transform duration-300">
                                        <div className="bg-white p-3 rounded-full hover:bg-purple-500 hover:text-white transition-colors">
                                            <Play fill="currentColor" size={20} className="ml-0.5 text-black hover:text-white" />
                                        </div>
                                        <div className="bg-white/10 backdrop-blur-md p-3 rounded-full border border-white/20 hover:bg-white/20 transition-colors text-white">
                                            <Plus size={20} />
                                        </div>
                                    </div>
                                </div>

                                {/* Progress Bar - Matches Screenshot style */}
                                <div className="absolute bottom-0 left-0 w-full h-1.5 bg-white/20">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${movie.progress}%` }}
                                        className="h-full bg-gradient-to-r from-purple-600 to-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.6)]"
                                    />
                                </div>
                            </div>

                            {/* Meta Info */}
                            <div className="mt-4 flex flex-col gap-1">
                                <h3 className="text-white font-bold text-lg group-hover:text-purple-400 transition-colors truncate">
                                    {movie.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <span className="bg-white/10 text-[10px] text-gray-300 px-1.5 py-0.5 rounded font-bold border border-white/5">
                                        {movie.quality}
                                    </span>
                                    <span className="text-xs text-gray-500 font-medium">
                                        {movie.remaining}
                                    </span>
                                    <span className="text-xs text-purple-400 font-semibold ml-auto opacity-0 group-hover:opacity-100 transition-opacity">
                                        Resume
                                    </span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}