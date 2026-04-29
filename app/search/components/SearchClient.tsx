"use client";
import React, { useState } from 'react';
import { Search as SearchIcon, X, Play } from 'lucide-react';
import Link from 'next/link';
import ResponsiveGrid from '@/components/shared/ResponsiveGrid';
import { MediaCard } from '@/components/shared/MediaCard';

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
               <div className="absolute inset-y-0 left-4 sm:left-6 flex items-center pointer-events-none">
                  <SearchIcon size={24} className="sm:w-8 sm:h-8 text-gray-500 group-focus-within:text-[#9248FF] transition-colors" />
               </div>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Titles, people, genres"
                  className="w-full bg-[#1a1329]/80 border-2 border-white/5 focus:border-[#9248FF] rounded-3xl pl-12 sm:pl-20 pr-12 sm:pr-16 py-4 sm:py-8 text-lg sm:text-3xl font-bold text-white shadow-2xl transition-all outline-none placeholder:text-gray-600 focus:bg-[#1a1329]"
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
                  <ResponsiveGrid gridCols={{ desktop: 5 }}>
                     {MOCK_RESULTS.map((item) => (
                        <Link key={item.id} href={`/movie/${item.id}`} className="block">
                           <MediaCard
                              variant="portrait"
                              title={item.title}
                              image={item.image}
                              year={parseInt(item.year)}
                              subtitle={item.type}
                              rating={9.0}
                              description={`Experience the thrill of ${item.title}.`}
                           />
                        </Link>
                     ))}
                  </ResponsiveGrid>
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
