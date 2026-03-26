'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, ChevronRight, Zap, Heart, Smile, Sparkles } from 'lucide-react';
import SectionTitle from './SectionTitle';

const GENRES = [
    {
        id: 1,
        name: "Action",
        count: "120+ Titles",
        icon: <Zap className="text-cyan-400" size={32} />,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
        accent: "#ef4444", // Red
        gradient: "from-red-600/20 to-transparent"
    },
    {
        id: 2,
        name: "Romance",
        count: "85 Titles",
        icon: <Heart className="text-cyan-400" size={32} />,
        image: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=1000&auto=format&fit=crop",
        accent: "#ec4899", // Pink
        gradient: "from-pink-600/20 to-transparent"
    },
    {
        id: 3,
        name: "Comedy",
        count: "210 Titles",
        icon: <Smile className="text-cyan-400" size={32} />,
        image: "https://images.unsplash.com/photo-1527224857830-43a7acc85260?q=80&w=1000&auto=format&fit=crop",
        accent: "#f59e0b", // Amber
        gradient: "from-amber-600/20 to-transparent"
    }
];

export default function MovieGenres() {
    return (
        <section className="w-full py-12 bg-[#0f0a19] overflow-hidden">
            <div className="max-w-[90%] mx-auto">

                {/* Section Header */}
                <div className="flex items-center justify-between mb-12">
                    <SectionTitle
                        title="Browse by Genre"
                        subtitle="Explore Categories"
                        Icon={LayoutGrid}
                        gradientText="Genre"
                        viewAllHref="/genres"
                    />

                </div>

                {/* Genre Grid */}
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                >
                    {GENRES.map((genre) => (
                        <motion.div
                            key={genre.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="relative h-[300px] rounded-[2.5rem] overflow-hidden cursor-pointer group border-[8px] border-[#1a1329] bg-[#0c0816] transition-all duration-500 hover:border-[#251b3a] hover:shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.3)]"
                        >
                            {/* Main Artwork */}
                            <img
                                src={genre.image}
                                alt={genre.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                            />

                            {/* Skeuomorphic Inner Shadow */}
                            <div className="absolute inset-0 shadow-[inset_0_0_40px_rgba(0,0,0,0.8)] pointer-events-none" />

                            {/* Overlay System */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90`} />
                            {/* Accent Glow on Hover */}
                            <div className={`absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Content Box */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30">
                                {/* Top: Icon pop */}
                                <motion.div
                                    className="w-14 h-14 rounded-2xl bg-cyan-400/10 backdrop-blur-xl border border-cyan-400/20 flex items-center justify-center shadow-2xl group-hover:bg-cyan-400/20 transition-all"
                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                >
                                    {genre.icon}
                                </motion.div>

                                {/* Bottom: Info */}
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-[10px] font-black uppercase tracking-[0.2em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {genre.count}
                                    </p>
                                    <h4 className="text-3xl font-black text-white uppercase tracking-tighter group-hover:text-cyan-400 transition-colors">
                                        {genre.name}
                                    </h4>

                                    {/* Underline Animation (Cyan) */}
                                    <div className="h-1 w-0 bg-cyan-400 group-hover:w-full transition-all duration-500 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                                </div>
                            </div>

                            {/* Large Watermark Text */}
                            <span className="absolute -bottom-6 -right-6 text-9xl font-black text-white/5 select-none pointer-events-none group-hover:text-cyan-400/5 transition-colors uppercase italic">
                                {genre.name.substring(0, 1)}
                            </span>
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}