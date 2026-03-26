"use client";
import React from 'react';
import { Network, Focus } from 'lucide-react';

export default function DecisionsMapPage() {
    return (
        <main className="p-8 pt-28 lg:p-12 lg:pt-32 flex flex-col gap-12 max-w-[1400px] mx-auto w-full">
            <div className="flex flex-col gap-3">
              <h1 className="text-4xl font-extrabold text-white tracking-tight drop-shadow-md flex items-center gap-4">
                 <Network className="text-[#9248FF]" size={40} />
                 Decisions Map
              </h1>
              <p className="text-gray-400">Track the timeline of choices you've made in The Choice.</p>
            </div>

            {/* Simulated Node Graph UI */}
            <div className="bg-[#1a1329]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-8 relative overflow-hidden min-h-[500px] flex items-center justify-center shadow-2xl">
               <div className="absolute inset-0 transition-all opacity-[0.03] bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
               
               <div className="relative z-10 flex flex-col items-center gap-8">
                  {/* Start Node */}
                  <div className="bg-[#2a1b4a] border-2 border-[#9248FF] rounded-xl px-6 py-3 shadow-[0_0_20px_rgba(146,72,255,0.4)]">
                     <p className="text-white font-bold text-sm">The Awakening</p>
                  </div>
                  
                  <div className="w-1 h-8 bg-[#9248FF]" />

                  {/* Split Node */}
                  <div className="flex flex-col sm:flex-row items-center sm:gap-16 gap-8 relative">
                     {/* Horizontal Connector (Desktop) */}
                     <div className="hidden sm:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-1 bg-[#9248FF]/50" />
                     {/* Vertical Connector (Desktop Ghost path) */}
                     <div className="hidden sm:block absolute top-1/2 left-[calc(50%+4rem)] w-1 h-8 bg-white/10 translate-y-1/2" />
                     
                     <div className="bg-[#25183d] hover:bg-[#b28cff] text-white hover:text-black transition-colors cursor-pointer border border-[#9248FF]/50 hover:border-[#b28cff] rounded-xl px-6 py-3 relative z-10 shadow-[0_5px_15px_rgba(146,72,255,0.2)]">
                        <p className="font-bold text-sm">Take the Red Pill</p>
                        <p className="text-[#b28cff] hover:text-black/70 text-[10px] uppercase font-bold mt-1 text-center tracking-widest">Selected</p>
                     </div>
                     <div className="bg-black/50 border border-white/10 rounded-xl px-6 py-3 relative z-10 opacity-50 cursor-not-allowed">
                        <p className="text-white font-bold text-sm">Take the Blue Pill</p>
                        <p className="text-gray-500 text-[10px] uppercase font-bold mt-1 text-center tracking-widest">Locked</p>
                     </div>
                  </div>

                  {/* Connecting path back to center */}
                  <div className="w-1 h-8 bg-[#9248FF] relative hidden sm:block -ml-32" />

                  {/* End Node */}
                  <div className="bg-[#2a1b4a] border-2 border-[#9248FF] rounded-xl px-6 py-3 shadow-[0_0_20px_rgba(146,72,255,0.4)] flex items-center gap-3 sm:-ml-32">
                     <Focus size={16} className="text-[#b28cff]" />
                     <p className="text-white font-bold text-sm">Neon City Arrival</p>
                  </div>
               </div>
            </div>
            
            {/* Footer Spacer */}
            <div className="h-24" />
        </main>
    );
}
