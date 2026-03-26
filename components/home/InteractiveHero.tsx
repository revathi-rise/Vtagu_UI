'use client';

import React, { useState } from 'react';
import { Play, Plus, Star, Zap, Info, ChevronRight, LayoutGrid } from 'lucide-react';
import { motion } from 'framer-motion';
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
                <section className="w-full bg-[#0f0a19] overflow-hidden">

                        {/* Reference Style Container */}
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.8 }}
                            className="relative bg-[#0c0816] rounded-[3rem] p-8 md:p-12 border-[10px] border-[#1a1329] shadow-2xl overflow-hidden"
                        >
                            {/* Background Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-cyan-900/10 via-transparent to-transparent opacity-40" />

                            {/* Header Row */}
                            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                                <div className="space-y-4">
                                    {/* Specialized USB Badge */}
                                    <div className="inline-flex items-center gap-2 bg-cyan-400 text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                        <Zap size={14} fill="black" />
                                        USB: Unique Story Branching
                                    </div>

                                    <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tighter leading-none">
                                        Interactive Core: <span className="text-cyan-400">USB Prototypes</span>
                                    </h2>
                                </div>

                                <button className="flex items-center gap-2 text-cyan-400 font-black text-xs uppercase tracking-widest hover:text-cyan-300 transition-colors group">
                                    Live Narratives
                                    <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>

                            {/* Main Content Area */}
                            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-3 gap-12">

                                {/* THE INTERACTIVE CARD (Left) */}
                                <div className="lg:col-span-1">
                                    <motion.div
                                        whileHover={{ y: -10, scale: 1.02 }}
                                        className="relative aspect-[3/4] rounded-[2.5rem] border-[8px] border-[#251b3a] bg-[#0c0816] overflow-hidden shadow-[0_30px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.2)] group"
                                    >
                                        {/* Poster Image */}
                                        <img
                                            src="/fractured_choice_poster.png"
                                            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                            alt="Fractured Choice"
                                        />

                                        {/* Skeuomorphic Inner Shadow */}
                                        <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,1)] pointer-events-none" />

                                        {/* Poster UI Overlays */}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent p-8 flex flex-col justify-end">
                                            <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4 drop-shadow-2xl">
                                                Fractured Choice
                                            </h3>

                                            <div className="flex gap-3">
                                                <button className="flex-1 bg-cyan-400/20 backdrop-blur-xl border border-cyan-400/40 text-cyan-400 text-[10px] font-black uppercase py-3 rounded-xl shadow-lg hover:bg-cyan-400 hover:text-black transition-all">
                                                    Decide Now
                                                </button>
                                                <button className="flex-1 bg-magenta-500/20 backdrop-blur-xl border border-magenta-500/40 text-[#ff00ff] text-[10px] font-black uppercase py-3 rounded-xl shadow-lg hover:bg-[#ff00ff] hover:text-black transition-all" style={{ borderColor: '#ff00ff66', color: '#ff00ff' }}>
                                                    Take a Chance
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                </div>

                                {/* DESCRIPTIVE CONTENT (Right) */}
                                <div className="lg:col-span-2 flex flex-col justify-center space-y-8">
                                    <div className="p-8 rounded-[2.5rem] bg-white/5 border border-white/10 backdrop-blur-md shadow-2xl">
                                        <h4 className="text-xl font-bold text-white mb-4 flex items-center gap-3">
                                            <div className="w-2 h-8 bg-cyan-400 rounded-full" />
                                            The Future of Interactive Storytelling
                                        </h4>
                                        <p className="text-gray-400 leading-relaxed font-medium">
                                            USB (Unique Story Branching) is our experimental prototype core for
                                            non-linear cinematic experiences. Unlike traditional movies,
                                            USB-enabled titles adapt in real-time to your subconscious choices
                                            and tactical decisions.
                                        </p>

                                        <div className="grid grid-cols-2 gap-6 mt-8">
                                            <div className="space-y-1">
                                                <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Tech</span>
                                                <p className="text-white font-bold">Neural Engine 2.0</p>
                                            </div>
                                            <div className="space-y-1">
                                                <span className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Status</span>
                                                <p className="text-white font-bold text-green-400">Live Beta</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-6 items-center">
                                        <button className="h-[56px] px-10 rounded-full bg-cyan-400 text-black font-black uppercase tracking-widest hover:bg-cyan-300 transition-all shadow-[0_10px_20px_rgba(34,211,238,0.2)]">
                                            Enter Prototype Core
                                        </button>
                                        <button className="h-[56px] w-[56px] flex items-center justify-center rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all">
                                            <Plus size={20} />
                                        </button>
                                    </div>
                                </div>

                            </div>

                            {/* Bottom Glow */}
                            <div className="absolute bottom-0 left-0 w-full h-[100px] bg-gradient-to-t from-cyan-400/5 to-transparent pointer-events-none" />
                        </motion.div>

                </section>
            </div>

            <style jsx global>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
        </section>
    );
}