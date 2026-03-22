"use client";
import React from 'react';
import { Play, Plus, ThumbsUp, Volume2, Info } from 'lucide-react';

export default function TitleDetailClient({ id }: { id: string }) {
    
    // In actual implementation, `id` would fetch the correct movie data.
    return (
        <div className="w-full">
            {/* Cinematic Hero */}
            <div className="relative w-full h-[80vh] min-h-[600px] border-b border-white/5">
               <div className="absolute inset-0 overflow-hidden">
                  <video 
                    src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                    className="w-full h-full object-cover scale-105 pointer-events-none"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a19] via-[#0f0a19]/60 to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a19] via-transparent to-transparent" />
               </div>

               {/* Meta Action Layer */}
               <div className="relative z-10 w-full h-full max-w-7xl mx-auto px-6 md:px-12 lg:px-20 flex flex-col justify-end pb-24">
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-4 tracking-tighter drop-shadow-xl max-w-3xl">Neon Protocol</h1>
                  
                  <div className="flex items-center gap-4 text-sm font-bold text-gray-300 uppercase tracking-widest mb-6">
                     <span className="text-[#34A853]">94% Match</span>
                     <span>2024</span>
                     <span className="border border-gray-600 px-1.5 rounded text-xs py-0.5">TV-MA</span>
                     <span>2h 14m</span>
                     <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] text-white">4K HDR</span>
                  </div>

                  <p className="text-xl text-gray-300 max-w-2xl leading-relaxed mb-10 drop-shadow-md">
                     In a dystopian future where memories are currency, a rogue detective uncovers a conspiracy that threatens to erase the existence of billions. Watch the visually stunning award-winning masterpiece.
                  </p>

                  <div className="flex flex-wrap items-center gap-4">
                     <button className="bg-white hover:bg-gray-200 text-black font-bold py-3.5 px-8 rounded-xl transition-all flex items-center gap-3 text-lg hover:scale-105 active:scale-95 shadow-[0_0_30px_rgba(255,255,255,0.3)]">
                        <Play fill="currentColor" size={24} /> Play Now
                     </button>
                     <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95">
                        <Plus size={24} />
                     </button>
                     <button className="bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 text-white font-bold py-3.5 px-6 rounded-xl transition-all flex items-center justify-center hover:scale-105 active:scale-95">
                        <ThumbsUp size={24} />
                     </button>
                  </div>
               </div>

               {/* Audio Context Badge */}
               <div className="absolute bottom-24 right-0 bg-[#0f0a19]/80 backdrop-blur-md border-l border-y border-white/10 px-4 py-2 flex items-center gap-3 rounded-l-full text-white font-bold text-sm tracking-widest uppercase">
                  <Volume2 size={16} /> Atmos
               </div>
            </div>

            {/* Sub-Details Container */}
            <div className="max-w-7xl mx-auto px-6 md:px-12 lg:px-20 py-16 grid grid-cols-1 md:grid-cols-3 gap-12 text-gray-400 text-sm">
               <div className="md:col-span-2">
                 <h3 className="text-xl text-white font-bold mb-4 flex items-center gap-2"><Info size={20} className="text-[#9248FF]" /> Synopsis</h3>
                 <p className="leading-loose">
                   "Neon Protocol" explores the darkest corners of human existence and technological dependence. Following highly decorated agent Sarah Jenkins as she descends into an illegal underground memory-running operation. As lines blur between reality and artificial constructs, she has to make decisions that will compromise her humanity to save what's left of the world.
                   <br/><br/>
                   Directed by critically acclaimed visionary Alex Vance, the film acts as a breathtaking technical achievement in lighting and VFX rendering.
                 </p>
               </div>
               <div className="flex flex-col gap-6">
                 <div>
                    <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Cast</span>
                    <p className="text-gray-300 mt-1">Sarah Jenkins, Marcus Thorne, Elena Vance, David Cho</p>
                 </div>
                 <div>
                    <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Genres</span>
                    <p className="text-gray-300 mt-1">Cyberpunk, Thriller, Action, Sci-Fi</p>
                 </div>
                 <div>
                    <span className="text-gray-500 font-bold tracking-widest uppercase text-[10px]">Director</span>
                    <p className="text-gray-300 mt-1">Alex Vance</p>
                 </div>
               </div>
            </div>
        </div>
    );
}
