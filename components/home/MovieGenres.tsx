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
        icon: <Zap className="text-yellow-400" size={32} />,
        image: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop",
        accent: "#ef4444", // Red
        gradient: "from-red-600/20 to-transparent"
    },
    {
        id: 2,
        name: "Romance",
        count: "85 Titles",
        icon: <Heart className="text-pink-400" size={32} />,
        image: "https://images.unsplash.com/photo-1518133835878-5a93cc3f89e5?q=80&w=1000&auto=format&fit=crop",
        accent: "#ec4899", // Pink
        gradient: "from-pink-600/20 to-transparent"
    },
    {
        id: 3,
        name: "Comedy",
        count: "210 Titles",
        icon: <Smile className="text-orange-400" size={32} />,
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {GENRES.map((genre) => (
                        <motion.div
                            key={genre.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ y: -10 }}
                            className="relative h-[300px] rounded-3xl overflow-hidden cursor-pointer group"
                        >
                            {/* Main Artwork */}
                            <img
                                src={genre.image}
                                alt={genre.name}
                                className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[0.3] group-hover:grayscale-0"
                            />

                            {/* Overlay System */}
                            <div className={`absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-transparent opacity-90`} />
                            <div className={`absolute inset-0 bg-gradient-to-br ${genre.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

                            {/* Animated Border Glow */}
                            <div className="absolute inset-0 border border-white/10 group-hover:border-white/30 rounded-3xl transition-colors z-20" />

                            {/* Content Box */}
                            <div className="absolute inset-0 p-8 flex flex-col justify-between z-30">
                                {/* Top: Icon pop */}
                                <motion.div
                                    className="w-14 h-14 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 flex items-center justify-center shadow-2xl group-hover:bg-white/10 transition-colors"
                                    whileHover={{ rotate: 12, scale: 1.1 }}
                                >
                                    {genre.icon}
                                </motion.div>

                                {/* Bottom: Info */}
                                <div className="space-y-1">
                                    <p className="text-gray-400 text-sm font-medium tracking-wide translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                                        {genre.count}
                                    </p>
                                    <h4 className="text-4xl font-black text-white uppercase italic tracking-tighter">
                                        {genre.name}
                                    </h4>

                                    {/* Underline Animation */}
                                    <div className="h-1 w-0 bg-gradient-to-r from-purple-500 to-transparent group-hover:w-full transition-all duration-500" />
                                </div>
                            </div>

                            {/* Large Watermark Text */}
                            <span className="absolute -bottom-4 -right-4 text-8xl font-black text-white/5 select-none pointer-events-none group-hover:text-white/10 transition-colors">
                                {genre.id}
                            </span>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}