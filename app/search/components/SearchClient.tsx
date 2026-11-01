"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Search as SearchIcon, X, Loader2, Sparkles, Film, Tv, PlaySquare, Compass } from 'lucide-react';
import Link from 'next/link';
import { MediaCard } from '@/components/shared/MediaCard';
import { searchGlobal, SearchResultItem, SearchResponseData } from '@/lib/vtagu.api';

const IMAGE_BASE_URL = "https://www.vtagu.in/";
const FALLBACK_POSTER = "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop";

function resolveImageUrl(path?: string): string {
  if (!path) return FALLBACK_POSTER;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return `${IMAGE_BASE_URL}${cleanPath}`;
}

export default function SearchClient() {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [categories, setCategories] = useState<string[]>([
    'All', 'Action', 'Sci-Fi', 'Interactive', 'Shorts', 'Drama', 'Comedy'
  ]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recommended, setRecommended] = useState<SearchResultItem[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([
    'Obsidian', 'Sci-Fi Action', 'Shorts Series', 'Interactive Thriller', 'Desert Explorers'
  ]);
  const [counts, setCounts] = useState<{ all: number; movie: number; series: number; interactive: number; short: number }>({
    all: 0, movie: 0, series: 0, interactive: 0, short: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce query typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Load initial recommendations, trending searches and categories
  useEffect(() => {
    let isMounted = true;
    async function loadInitial() {
      try {
        const data: SearchResponseData = await searchGlobal();
        if (isMounted && data) {
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
          if (data.trendingSearches && data.trendingSearches.length > 0) {
            setTrendingSearches(data.trendingSearches);
          }
          if (data.recommended && data.recommended.length > 0) {
            setRecommended(data.recommended);
          }
        }
      } catch (err) {
        console.error('Failed to load initial search data:', err);
      }
    }
    loadInitial();
    return () => {
      isMounted = false;
    };
  }, []);

  // Fetch search results whenever debouncedQuery or selectedCategory changes
  useEffect(() => {
    let isMounted = true;
    const isSearchActive = debouncedQuery.length > 0 || selectedCategory !== 'All';

    if (!isSearchActive) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      return;
    }

    async function executeSearch() {
      setIsLoading(true);
      setHasSearched(true);
      try {
        const data: SearchResponseData = await searchGlobal({
          q: debouncedQuery,
          category: selectedCategory,
        });

        if (isMounted) {
          setResults(data.results || []);
          if (data.meta?.counts) {
            setCounts(data.meta.counts);
          }
          if (data.trendingSearches && data.trendingSearches.length > 0) {
            setTrendingSearches(data.trendingSearches);
          }
          if (data.recommended && data.recommended.length > 0) {
            setRecommended(data.recommended);
          }
          if (data.categories && data.categories.length > 0) {
            setCategories(data.categories);
          }
        }
      } catch (err) {
        console.error('Search execution failed:', err);
        if (isMounted) {
          setResults([]);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    }

    executeSearch();

    return () => {
      isMounted = false;
    };
  }, [debouncedQuery, selectedCategory]);

  const handleClear = () => {
    setQuery('');
    setDebouncedQuery('');
    setSelectedCategory('All');
    setResults([]);
    setHasSearched(false);
  };

  const handleTrendingClick = (term: string) => {
    setQuery(term);
    setDebouncedQuery(term);
  };

  const isSearchActive = query.length > 0 || selectedCategory !== 'All' || hasSearched;

  return (
    <div className="w-full">
      {/* Search Bar - Native Mobile App Feel */}
      <div className="relative group mb-4 sm:mb-8">
        <div className="absolute inset-y-0 left-3.5 sm:left-6 flex items-center pointer-events-none">
          {isLoading ? (
            <Loader2 size={20} className="sm:w-7 sm:h-7 text-[#9248FF] animate-spin" />
          ) : (
            <SearchIcon size={20} className="sm:w-7 sm:h-7 text-gray-500 group-focus-within:text-[#9248FF] transition-colors" />
          )}
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
            onClick={handleClear}
            className="absolute inset-y-0 right-3 sm:right-5 flex items-center text-gray-400 hover:text-white p-1 transition-colors"
            aria-label="Clear search"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Quick Filter Categories Chips - Horizontal swipeable on mobile */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-6">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all ${
              selectedCategory === cat
                ? 'bg-gradient-to-r from-[#9248FF] to-[#3299FF] text-white shadow-md shadow-[#9248FF]/25 scale-105'
                : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content Area */}
      {isSearchActive ? (
        <div>
          {/* Header with stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-lg font-bold text-gray-200 tracking-wide flex items-center gap-2">
              <span>Results {query && `for "${query}"`}</span>
              {selectedCategory !== 'All' && (
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#9248FF]/20 text-[#c084fc] border border-[#9248FF]/30">
                  {selectedCategory}
                </span>
              )}
            </h2>

            {!isLoading && (
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span>{results.length} found</span>
                {counts.all > 0 && (
                  <div className="hidden md:flex items-center gap-2 text-[11px] text-gray-500">
                    {counts.movie > 0 && <span>• {counts.movie} Movies</span>}
                    {counts.series > 0 && <span>• {counts.series} Series</span>}
                    {counts.interactive > 0 && <span>• {counts.interactive} Interactive</span>}
                    {counts.short > 0 && <span>• {counts.short} Shorts</span>}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Loading Skeletons */}
          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {[...Array(10)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="aspect-[2/3] w-full rounded-xl bg-white/5 border border-white/5" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
              {results.map((item) => (
                <Link key={`${item.type}-${item.id}`} href={item.href} className="block transition-transform hover:scale-[1.02]">
                  <MediaCard
                    variant="portrait"
                    title={item.title}
                    image={resolveImageUrl(item.card_image || item.image)}
                    year={item.year ? Number(item.year) : undefined}
                    subtitle={item.type ? item.type.toUpperCase() : undefined}
                    rating={item.rating ?? 9.0}
                    badge={item.certificate?.code}
                    badgeColor={(item.certificate?.badge_color as any) || 'purple'}
                    quality={item.quality || undefined}
                    isFree={item.isFree}
                    isComingSoon={item.isComingSoon}
                    description={item.description || `Experience ${item.title} on VtagU PrimeTime.`}
                  />
                </Link>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400 bg-white/[0.02] rounded-3xl border border-white/5 p-8">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-white/5 flex items-center justify-center text-gray-500">
                <SearchIcon size={26} />
              </div>
              <p className="text-base font-semibold text-gray-300">No results found matching your query.</p>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                Try searching with a different title, actor, director, genre, or reset your filters.
              </p>
              <button
                onClick={handleClear}
                className="mt-5 px-4 py-2 rounded-xl bg-[#9248FF]/20 hover:bg-[#9248FF]/30 text-xs font-semibold text-[#c084fc] border border-[#9248FF]/30 transition-colors"
              >
                Reset Search & Filters
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="py-6 sm:py-12">
          {/* Trending Searches */}
          {trendingSearches.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={14} className="text-[#9248FF]" />
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 text-xs sm:text-sm text-gray-300 transition-all border border-white/5 flex items-center gap-2 active:scale-95"
                  >
                    <SearchIcon size={12} className="text-gray-500" />
                    <span>{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recommended For You */}
          {recommended.length > 0 && (
            <div className="mt-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                  <Compass size={14} className="text-[#3299FF]" />
                  <span>Recommended For You</span>
                </h3>
                <span className="text-xs text-gray-500">Curated picks</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6">
                {recommended.map((item) => (
                  <Link key={`rec-${item.type}-${item.id}`} href={item.href} className="block transition-transform hover:scale-[1.02]">
                    <MediaCard
                      variant="portrait"
                      title={item.title}
                      image={resolveImageUrl(item.card_image || item.image)}
                      year={item.year ? Number(item.year) : undefined}
                      subtitle={item.type ? item.type.toUpperCase() : undefined}
                      rating={item.rating ?? 9.0}
                      badge={item.certificate?.code}
                      badgeColor={(item.certificate?.badge_color as any) || 'purple'}
                      quality={item.quality || undefined}
                      isFree={item.isFree}
                      isComingSoon={item.isComingSoon}
                      description={item.description || `Experience ${item.title} on VtagU PrimeTime.`}
                    />
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
