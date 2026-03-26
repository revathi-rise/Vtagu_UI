"use client";
import React, { useState } from 'react';
import { Search as SearchIcon, X, Play } from 'lucide-react';
import Link from 'next/link';

const MOCK_RESULTS = [
  { id: 1, title: 'The Obsidian Horizon', type: 'Movie', year: '2024', image: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop' },
  { id: 2, title: 'Neon Protocol', type: 'Series', year: '2023', image: 'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=500&auto=format&fit=crop' },
  { id: 3, title: 'Desert Wanderers', type: 'Documentary', year: '2022', image: 'https://images.unsplash.com/photo-1478479405421-ce83c92fb3ba?q=80&w=500&auto=format&fit=crop' },
  { id: 4, title: 'Echoes of Time', type: 'Movie', year: '2025', image: 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=500&auto=format&fit=crop' },
];

export default function SearchClient() {
    const [query, setQuery] = useState('');

    return (
        <div className="max-w-7xl mx-auto w-full">
            
            {/* Massive Search Bar */}
            <div className="relative group mb-12">
               <div className="absolute inset-y-0 left-6 flex items-center pointer-events-none">
                  <SearchIcon size={32} className="text-gray-500 group-focus-within:text-[#9248FF] transition-colors" />
               </div>
               <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="w-full bg-[#1a1329]/80 border-2 border-white/5 focus:border-[#9248FF] rounded-3xl pl-20 pr-16 py-8 text-3xl font-bold text-white shadow-2xl transition-all outline-none placeholder:text-gray-600 focus:bg-[#1a1329]"
                  autoFocus
               />
               {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-6 flex items-center text-gray-500 hover:text-white transition-colors"
                  >
                     <X size={32} />
                  </button>
               )}
            </div>

            {/* Content Area */}
            {query.length > 0 ? (
               <div>
                  <h2 className="text-xl font-bold text-gray-400 mb-6 tracking-wide">
                     Top Results for "{query}"
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                     {MOCK_RESULTS.map((item) => (
                        <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-[#1a1329] border border-white/5 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(146,72,255,0.3)] hover:-translate-y-2 transition-all duration-300">
                           <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-70 group-hover:opacity-100" alt={item.title} />
                           
                           {/* Hover Play Button */}
                           <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                              <div className="w-14 h-14 rounded-full bg-[#b28cff] flex items-center justify-center shadow-[0_0_20px_rgba(146,72,255,0.6)] translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                 <Play size={24} className="text-[#0f0a19] ml-1" fill="currentColor" />
                              </div>
                           </div>

                           <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black via-black/80 to-transparent">
                              <h3 className="text-white font-bold tracking-wide truncate">{item.title}</h3>
                              <p className="text-xs text-[#b28cff] font-semibold mt-1 uppercase tracking-wider">{item.year} • {item.type}</p>
                           </div>
                        </div>
                     ))}
                  </div>
               </div>
            ) : (
               <div className="flex flex-col items-center justify-center py-32 opacity-50 text-center px-4">
                  <SearchIcon size={64} className="text-gray-600 mb-6" />
                  <h2 className="text-2xl font-bold text-gray-400 mb-2">Find your next favorite story</h2>
                  <p className="text-gray-500 max-w-md">Search across thousands of movies, exclusive original series, and interactive cinematic experiences.</p>
               </div>
            )}
            
        </div>
    );
}
