'use client';

import React from 'react';

export default function ProgressWidget() {
    return (
        <div className="fixed bottom-8 left-8 z-50 p-6 rounded-3xl bg-[#1a1329]/80 backdrop-blur-xl border border-white/10 shadow-2xl shadow-purple-900/40 w-64 transform transition-all duration-500 hover:scale-105 hover:bg-[#1a1329]">
            <div className="flex flex-col gap-3">
                <div className="flex justify-between items-center">
                    <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Current Progress</span>
                    <span className="text-white text-[10px] font-black tracking-widest">65%</span>
                </div>
                
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[65%] bg-gradient-to-r from-[#9248FF] to-[#3299FF]" />
                </div>
                
                <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#9248FF] animate-pulse" />
                    <span className="text-white text-xs font-bold tracking-tight">Path: <span className="text-[#9248FF]">The Diplomat</span></span>
                </div>
            </div>
        </div>
    );
}
