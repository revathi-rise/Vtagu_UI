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
            <div className="relative aspect-auto min-h-[460px] sm:min-h-0 sm:aspect-video rounded-2xl sm:rounded-[32px] overflow-hidden border border-white/5 shadow-2xl">
                <img 
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?q=80&w=1600&auto=format&fit=crop" 
                    className="w-full h-full object-cover" 
                    alt="Rooftop Stand-off" 
                />
                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" />
                
                {/* Decision Header */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 sm:p-8 md:p-12 text-center pb-16 sm:pb-20">
                    <div className="mb-2 sm:mb-4 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded text-[9px] sm:text-[10px] font-bold text-white uppercase tracking-widest">
                        Decision #04
                    </div>
                    
                    <h4 className="text-white text-base sm:text-2xl md:text-3xl font-black mb-4 sm:mb-8 md:mb-12 max-w-2xl leading-snug sm:leading-tight">
                        The guard is looking for his flashlight. Do you make a run for it or wait for him to move?
                    </h4>

                    {/* Choice Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4 md:gap-6 w-full max-w-3xl">
                        {/* Choice 1 */}
                        <button className="group relative flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-4 p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-[#3299FF] hover:border-[#3299FF] transition-all duration-300 transform active:scale-95 sm:hover:scale-105 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-white/20 transition-all shrink-0">
                                <Zap size={20} className="text-white sm:w-7 sm:h-7" />
                            </div>
                            <div className="text-left sm:text-center min-w-0">
                                <span className="block text-white font-black text-sm sm:text-lg md:text-xl uppercase tracking-wider">Run Now</span>
                                <span className="text-white/60 text-[10px] sm:text-xs italic font-medium group-hover:text-white/80 transition-all">High risk, high reward</span>
                            </div>
                        </button>

                        {/* Choice 2 */}
                        <button className="group relative flex flex-row sm:flex-col items-center justify-center gap-3 sm:gap-4 p-3.5 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all duration-300 transform active:scale-95 sm:hover:scale-105 cursor-pointer">
                            <div className="w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center shrink-0">
                                <EyeOff size={20} className="text-white sm:w-7 sm:h-7" />
                            </div>
                            <div className="text-left sm:text-center min-w-0">
                                <span className="block text-white font-black text-sm sm:text-lg md:text-xl uppercase tracking-wider">Stay Hidden</span>
                                <span className="text-white/60 text-[10px] sm:text-xs italic font-medium group-hover:text-white/80 transition-all">Play it safe, find another way</span>
                            </div>
                        </button>
                    </div>

                    {/* Timer Bar */}
                    <div className="absolute bottom-3 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8 md:bottom-10 md:left-12 md:right-12">
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden mb-1.5 sm:mb-2">
                            <div className="h-full w-[65%] bg-gradient-to-r from-[#9248FF] to-[#3299FF]" />
                        </div>
                        <div className="flex justify-between items-center text-[9px] sm:text-[10px] font-bold text-white/60 uppercase tracking-widest">
                            <span>Decision Time Remaining</span>
                            <span>07:24 Sec</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Community Insight Bar */}
            <div className="p-3.5 sm:p-4 rounded-2xl bg-white/5 border border-white/5 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
                <span className="text-[#9248FF] text-[10px] font-bold uppercase tracking-widest shrink-0">Community Insight:</span>
                <div className="w-full sm:flex-grow h-2 bg-white/10 rounded-full flex overflow-hidden">
                    <div className="h-full w-[62%] bg-[#9248FF]" />
                    <div className="h-full w-[38%] bg-white/20" />
                </div>
                <div className="flex items-center justify-between sm:justify-start gap-4 shrink-0 w-full sm:w-auto">
                    <span className="text-white text-xs font-bold">62% / 38%</span>
                    <span className="text-white/40 text-[10px] italic">Updated every 24h</span>
                </div>
            </div>
        </section>
    );
}