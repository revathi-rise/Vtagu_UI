'use client';

import React from 'react';
import { Zap, EyeOff, MousePointer2 } from 'lucide-react';

export default function InteractivePreview() {
    return (
        <section className="flex flex-col gap-6">
            <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-bold tracking-tight">
                    Interactive Preview: <span className="text-[#9248FF] italic">"The Rooftop Stand-off"</span>
                </h3>
                <div className="flex items-center gap-2 px-3 py-1 bg-purple-900/40 border border-purple-500/30 rounded-full text-[10px] font-bold text-[#9248FF] uppercase tracking-wider">
                    <MousePointer2 size={12} /> Mouse Interaction Active
                </div>
            </div>

            {/* Main Preview Card */}
            <div className="relative aspect-video rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="Rooftop Stand-off" 
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />
                
                {/* Decision Header */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-12 text-center">
                    <div className="mb-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[10px] font-bold text-white uppercase tracking-widest">
                        Decision #04
                    </div>
                    
                    <h4 className="text-white text-3xl font-black mb-12 max-w-2xl leading-tight">
                        The guard is looking for his flashlight. Do you make a run for it or wait for him to move?
                    </h4>

                    {/* Choice Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 w-full max-w-3xl">
                        {/* Choice 1 */}
                        <button className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#3299FF] hover:border-[#3299FF] transition-all duration-500 transform hover:scale-105">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all">
                                <Zap size={28} className="text-white" />
                            </div>
                            <div className="text-center">
                                <span className="block text-white font-black text-xl uppercase tracking-wider">Run Now</span>
                                <span className="text-white/60 text-[10px] italic font-medium group-hover:text-white/80 transition-all">High risk, high reward</span>
                            </div>
                        </button>

                        {/* Choice 2 */}
                        <button className="group relative flex flex-col items-center justify-center gap-4 p-8 rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-500 transform hover:scale-105">
                            <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center">
                                <EyeOff size={28} className="text-white" />
                            </div>
                            <div className="text-center">
                                <span className="block text-white font-black text-xl uppercase tracking-wider">Stay Hidden</span>
                                <span className="text-white/60 text-[10px] italic font-medium group-hover:text-white/80 transition-all">Play it safe, find another way</span>
                            </div>
                        </button>
                    </div>

                    {/* Timer Bar */}
                    <div className="absolute bottom-10 left-12 right-12">
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-2">
                            <div className="h-full w-[65%] bg-gradient-to-r from-[#9248FF] to-[#3299FF]" />
                        </div>
                        <div className="flex justify-between items-center text-[10px] font-bold text-white/60 uppercase tracking-widest">
                            <span>Decision Time Remaining</span>
                            <span>07:24 Sec</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Insight Bar */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/5 flex items-center gap-6">
                <span className="text-[#9248FF] text-[10px] font-bold uppercase tracking-widest flex-shrink-0">Community Insight:</span>
                <div className="flex-grow h-2 bg-white/10 rounded-full flex overflow-hidden">
                    <div className="h-full w-[62%] bg-[#9248FF]" />
                    <div className="h-full w-[38%] bg-white/20" />
                </div>
                <div className="flex items-center gap-4 flex-shrink-0">
                    <span className="text-white text-xs font-bold">62% / 38%</span>
                    <span className="text-white/20 text-[10px] italic">Global player choices update every 24 hours</span>
                </div>
            </div>
        </section>
    );
}
