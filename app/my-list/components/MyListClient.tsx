"use client";
import React from 'react';
import { Bookmark, Play, Plus, Heart } from 'lucide-react';
import Link from 'next/link';

const SAVED_ITEMS = [
  { id: 1, title: 'The Obsidian Horizon', type: 'Movie', year: '2024', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop', match: "98% Match" },
  { id: 2, title: 'Neon Protocol', type: 'Series', year: '2023', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=500&auto=format&fit=crop', match: "94% Match" },
  { id: 4, title: 'Echoes of Time', type: 'Movie', year: '2025', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=500&auto=format&fit=crop', match: "89% Match" },
];

export default function MyListClient() {
    return (
        <div className="max-w-7xl mx-auto w-full">
            <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My List</h1>
            <p className="text-gray-400 mb-10">Titles you have saved to watch later.</p>

            {SAVED_ITEMS.length > 0 ? (
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
                  {SAVED_ITEMS.map((item) => (
                     <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-[#1a1329] border border-white/5 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(146,72,255,0.3)] hover:-translate-y-2 transition-all duration-300">
                        <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={item.title} />
                        
                        {/* Hover Overlay Actions */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                           <div className="flex justify-end gap-2 translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                              <button className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                                 <Plus size={16} />
                              </button>
                              <button className="w-8 h-8 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors">
                                 <Heart size={14} />
                              </button>
                           </div>
                           
                           <div className="flex items-center justify-center flex-1">
                              <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all text-white">
                                 <Play size={24} className="ml-1" fill="currentColor" />
                              </div>
                           </div>
                        </div>

                        {/* Persistent Metadata Layer */}
                        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f0a19] via-[#0f0a19]/90 to-transparent group-hover:translate-y-full transition-transform duration-300 flex flex-col justify-end">
                           <h3 className="text-white font-bold tracking-wide break-words leading-tight">{item.title}</h3>
                           <div className="flex items-center gap-2 mt-2 font-bold uppercase tracking-wider text-[10px]">
                              <span className="text-[#34A853]">{item.match}</span>
                              <span className="text-gray-500 border border-gray-600 px-1 rounded">{item.year}</span>
                           </div>
                        </div>
                     </div>
                  ))}
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-32 opacity-50 text-center px-4">
                  <Bookmark size={64} className="text-gray-600 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-400 mb-2">Your list is empty</h2>
                  <p className="text-gray-500 max-w-md mb-8">Add shows and movies to your list to keep track of what you want to watch.</p>
                  <Link href="/movies" className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-full transition-colors">
                     Browse Content
                  </Link>
               </div>
            )}
        </div>
    );
}
