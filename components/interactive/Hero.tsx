'use client';

import React from 'react';
import { Play, Plus } from 'lucide-react';

export default function Hero() {
    return (
        <section className="relative w-full h-[380px] rounded-3xl overflow-hidden shadow-2xl shadow-purple-900/10">
            {/* Banner Image */}
            <div className="absolute inset-0">
                <img 
                    src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?q=80&w=1600&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="The Choice Banner" 
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-transparent to-transparent" />
            </div>

            {/* Content */}
            <div className="relative h-full flex flex-col justify-center p-6 md:p-10 max-w-2xl">
                <div className="mb-2 md:mb-4 inline-flex self-start items-center px-2 py-1 bg-purple-600/20 backdrop-blur-md border border-purple-500/30 rounded text-[10px] font-bold text-[#9248FF] uppercase tracking-widest">
                    Interactive Original
                </div>
                
                <h2 className="text-white text-4xl md:text-6xl font-black mb-2 md:mb-4 tracking-tighter">
                    The Choice
                </h2>
                
                <p className="text-gray-300 text-xs md:text-sm leading-relaxed mb-6 md:mb-8 max-w-md line-clamp-3 md:line-clamp-none">
                    In a world where every word carries weight, your survival depends on the split-second decisions you make. Will you trust the stranger or follow the law?
                </p>
                
                <div className="flex items-center gap-4">
                    <button className="flex items-center gap-2 bg-white text-black px-8 py-3 rounded-xl font-bold hover:bg-[#3299FF] hover:text-white transition-all transform hover:scale-105 active:scale-95 shadow-xl shadow-white/5">
                        <Play size={18} fill="currentColor" /> Resume Experience
                    </button>
                    <button className="p-3 bg-white/10 backdrop-blur-md rounded-xl text-white border border-white/20 hover:bg-white/20 transition-all hover:scale-105 active:scale-95">
                        <Plus size={22} />
                    </button>
                </div>
            </div>
        </section>
    );
}
