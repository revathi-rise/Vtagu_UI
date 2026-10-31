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

    const CATEGORIES = ['All', 'Action', 'Sci-Fi', 'Interactive', 'Shorts', 'Drama', 'Comedy'];
    const [selectedCategory, setSelectedCategory] = useState('All');

    const filteredResults = MOCK_RESULTS.filter((item) => {
        const matchesQuery = !query || item.title.toLowerCase().includes(query.toLowerCase()) || item.type.toLowerCase().includes(query.toLowerCase());
        const matchesCategory = selectedCategory === 'All' || item.type.toLowerCase().includes(selectedCategory.toLowerCase());
        return matchesQuery && matchesCategory;
    });

    return (
        <div className="w-full">
            {/* Search Bar - Native Mobile App Feel */}
            <div className="relative group mb-4 sm:mb-8">
               <div className="absolute inset-y-0 left-3.5 sm:left-6 flex items-center pointer-events-none">
                  <SearchIcon size={20} className="sm:w-7 sm:h-7 text-gray-500 group-focus-within:text-[#9248FF] transition-colors" />
               </div>
                <input 
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Titles, people, genres..."
                  className="w-full bg-[#1a1329]/90 border border-white/10 focus:border-[#9248FF] rounded-2xl sm:rounded-3xl pl-11 sm:pl-16 pr-10 sm:pr-14 py-3 sm:py-5 text-sm sm:text-xl font-semibold text-white shadow-xl transition-all outline-none placeholder:text-gray-500 focus:bg-[#1a1329]"
                  autoFocus
               />
               {query && (
                  <button 
                    onClick={() => setQuery('')}
                    className="absolute inset-y-0 right-3 sm:right-5 flex items-center text-gray-400 hover:text-white p-1"
                    aria-label="Clear search"
                  >
                     <X size={20} className="sm:w-6 sm:h-6" />
                  </button>
               )}
            </div>

            {/* Quick Filter Categories Chips - Horizontal swipeable on mobile */}
            <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-6">
                {CATEGORIES.map((cat) => (
                    <button
                        key={cat}
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all ${
                            selectedCategory === cat
                                ? 'bg-gradient-to-r from-[#9248FF] to-[#3299FF] text-white shadow-md shadow-[#9248FF]/25'
                                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                        }`}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Content Area */}
            {query.length > 0 || selectedCategory !== 'All' ? (
               <div>
                  <h2 className="text-sm sm:text-lg font-bold text-gray-300 mb-4 sm:mb-6 tracking-wide flex items-center justify-between">
                     <span>Results {query && `for "${query}"`}</span>
                     <span className="text-xs text-gray-500 font-normal">{filteredResults.length} found</span>
                  </h2>
                  {filteredResults.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                       {filteredResults.map((item) => (
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
                    </div>
                  ) : (
                    <div className="py-20 text-center text-gray-400">
                       <p className="text-base font-semibold">No results found matching your query.</p>
                       <p className="text-xs text-gray-500 mt-1">Try searching with a different keyword or category.</p>
                    </div>
                  )}
               </div>
            ) : (
               <div className="py-6 sm:py-12">
                  <div className="mb-6">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Trending Searches</h3>
                     <div className="flex flex-wrap gap-2">
                        {['Obsidian', 'Sci-Fi Action', 'Shorts Series', 'Interactive Thriller', 'Desert Explorers'].map((item) => (
                           <button
                              key={item}
                              onClick={() => setQuery(item)}
                              className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs sm:text-sm text-gray-300 transition-colors border border-white/5 flex items-center gap-1.5"
                           >
                              <SearchIcon size={12} className="text-gray-500" />
                              {item}
                           </button>
                        ))}
                     </div>
                  </div>

                  <div className="mt-8">
                     <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Recommended For You</h3>
                     <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                        {MOCK_RESULTS.slice(0, 4).map((item) => (
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
                     </div>
                  </div>
               </div>
            )}
            
        </div>
    );
}
