"use client";

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Search as SearchIcon, X, Loader2, Sparkles, Film, Tv, PlaySquare, Compass, SlidersHorizontal } from 'lucide-react';
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

// Preset content type tabs
const CONTENT_TYPE_TABS = [
  { label: 'All', value: 'all' },
  { label: 'Movies', value: 'movie' },
  { label: 'Web Series', value: 'series' },
  { label: 'Interactive', value: 'interactive' },
  { label: 'Shorts', value: 'short' },
];

export default function SearchClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Initialize query and category from URL if present
  const initialQ = searchParams?.get('q') || '';
  const initialCategory = searchParams?.get('category') || 'All';

  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ.trim());
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [categories, setCategories] = useState<string[]>([
    'All', 'Action', 'Sci-Fi', 'Interactive', 'Shorts', 'Drama', 'Comedy'
  ]);
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [recommended, setRecommended] = useState<SearchResultItem[]>([]);
  const [trendingSearches, setTrendingSearches] = useState<string[]>([
    'Obsidian', 'Crossroads: Choose Your Destiny', 'Agent Vikram', 'Sci-Fi Action', 'Shorts Series', 'Interactive Thriller'
  ]);
  const [counts, setCounts] = useState<{ all: number; movie: number; series: number; interactive: number; short: number }>({
    all: 0, movie: 0, series: 0, interactive: 0, short: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  // Debounce query typing (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query.trim());
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  // Sync state to URL without full page reload
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedQuery) params.set('q', debouncedQuery);
    if (selectedCategory && selectedCategory !== 'All' && selectedCategory !== 'all') {
      params.set('category', selectedCategory);
    }
    const newQs = params.toString();
    const newUrl = newQs ? `/search?${newQs}` : '/search';
    if (typeof window !== 'undefined' && window.location.pathname + window.location.search !== newUrl) {
      window.history.replaceState(null, '', newUrl);
    }
  }, [debouncedQuery, selectedCategory]);

  // Load initial recommendations, trending searches and dynamic categories from API
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
    const isSearchActive = debouncedQuery.length > 0 || (selectedCategory !== 'All' && selectedCategory !== 'all');

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
          category: selectedCategory === 'All' ? undefined : selectedCategory,
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
    setDebouncedQuery(term.trim());
  };

  const isSearchActive = query.trim().length > 0 || (selectedCategory !== 'All' && selectedCategory !== 'all') || hasSearched;

  // Determine badge colors per media type
  const getTypeBadgeStyles = (type?: string) => {
    switch (type) {
      case 'interactive':
        return 'bg-cyan-500/20 text-cyan-300 border-cyan-400/40 shadow-[0_0_12px_rgba(34,211,238,0.3)]';
      case 'movie':
        return 'bg-blue-500/20 text-blue-300 border-blue-400/40';
      case 'series':
        return 'bg-purple-500/20 text-purple-300 border-purple-400/40';
      case 'short':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40';
      default:
        return 'bg-white/10 text-white/80 border-white/20';
    }
  };

  // Get live count for content type tab
  const getTabCount = (tabVal: string) => {
    if (!hasSearched) return null;
    switch (tabVal) {
      case 'all':
        return counts.all;
      case 'movie':
        return counts.movie;
      case 'series':
        return counts.series;
      case 'interactive':
        return counts.interactive;
      case 'short':
        return counts.short;
      default:
        return null;
    }
  };

  return (
    <div className="w-full">
      {/* Search Input Bar */}
      <div className="relative group mb-5 sm:mb-8">
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
          placeholder="Search movies, web series, interactive originals, genres..."
          className="w-full bg-[#140e24]/90 border border-white/10 focus:border-[#9248FF] focus:ring-4 focus:ring-[#9248FF]/20 rounded-2xl sm:rounded-3xl pl-11 sm:pl-16 pr-10 sm:pr-14 py-3.5 sm:py-5 text-sm sm:text-xl font-semibold text-white shadow-2xl transition-all outline-none placeholder:text-gray-500 focus:bg-[#1a132b]"
          autoFocus
        />
        {query && (
          <button 
            onClick={handleClear}
            className="absolute inset-y-0 right-3 sm:right-5 flex items-center text-gray-400 hover:text-white p-1.5 transition-colors cursor-pointer"
            aria-label="Clear search"
          >
            <X size={20} className="sm:w-6 sm:h-6" />
          </button>
        )}
      </div>

      {/* Dynamic Filter Categories & Content Type Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-3 sm:pb-6 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 mb-4 sm:mb-6">
        {/* All / Default Tab */}
        <button
          onClick={() => setSelectedCategory('All')}
          className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
            selectedCategory === 'All' || selectedCategory === 'all'
              ? 'bg-gradient-to-r from-[#9248FF] to-[#3299FF] text-white shadow-lg shadow-[#9248FF]/30 scale-105'
              : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
          }`}
        >
          <span>All</span>
          {hasSearched && counts.all > 0 && (
            <span className="text-[10px] sm:text-xs opacity-75 font-mono">({counts.all})</span>
          )}
        </button>

        {/* Dynamic Categories from API */}
        {categories
          .filter((cat) => cat.toLowerCase() !== 'all')
          .map((cat) => {
            const isSelected = selectedCategory.toLowerCase() === cat.toLowerCase();
            const tabCount = getTabCount(cat.toLowerCase());

            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(isSelected ? 'All' : cat)}
                className={`px-3.5 py-1.5 sm:px-5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                  isSelected
                    ? 'bg-gradient-to-r from-[#9248FF] to-[#3299FF] text-white shadow-lg shadow-[#9248FF]/30 scale-105'
                    : 'bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 border border-white/5'
                }`}
              >
                <span>{cat}</span>
                {tabCount !== null && tabCount > 0 && (
                  <span className="text-[10px] sm:text-xs opacity-75 font-mono">({tabCount})</span>
                )}
              </button>
            );
          })}
      </div>

      {/* Content Area */}
      {isSearchActive ? (
        <div className="animate-in fade-in duration-300">
          {/* Header with stats */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
            <h2 className="text-sm sm:text-lg font-bold text-gray-200 tracking-wide flex items-center gap-2 flex-wrap">
              <span>Results {debouncedQuery && `for "${debouncedQuery}"`}</span>
              {selectedCategory !== 'All' && selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-[#9248FF]/20 text-[#c084fc] border border-[#9248FF]/30">
                  <span>{selectedCategory}</span>
                  <button 
                    onClick={() => setSelectedCategory('All')}
                    className="hover:text-white ml-0.5"
                    aria-label="Remove category filter"
                  >
                    ×
                  </button>
                </span>
              )}
            </h2>

            {!isLoading && (
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="font-semibold text-white/90">{results.length} found</span>
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
            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-2">
                  <div className="aspect-[2/3] w-full rounded-2xl bg-white/5 border border-white/5" />
                  <div className="h-4 w-3/4 rounded bg-white/10" />
                  <div className="h-3 w-1/2 rounded bg-white/5" />
                </div>
              ))}
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
              {results.map((item) => (
                <Link 
                  key={`${item.type}-${item.id}`} 
                  href={item.href || (item.type === 'interactive' ? `/interactive/${item.id}` : item.type === 'series' ? `/shows` : item.type === 'short' ? `/shorts?id=${item.id}` : `/movies/${item.slug || item.id}`)} 
                  className="block transition-transform hover:scale-[1.03] duration-300 group"
                >
                  <div className="relative">
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
                    {/* Content Type Glow Pill Badge */}
                    {item.type && (
                      <span className={`absolute top-2.5 left-2.5 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border backdrop-blur-md z-20 ${getTypeBadgeStyles(item.type)}`}>
                        {item.type}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            /* Empty State */
            <div className="space-y-12">
              <div className="py-16 text-center text-gray-400 bg-white/[0.02] rounded-3xl border border-white/5 p-8 max-w-2xl mx-auto">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-gray-500 shadow-inner">
                  <SearchIcon size={28} />
                </div>
                <h3 className="text-lg font-bold text-white">No results found matching your query</h3>
                <p className="text-xs sm:text-sm text-gray-400 mt-1.5 max-w-md mx-auto leading-relaxed">
                  Try searching with a different title, actor, director, genre, or reset your filters.
                </p>
                <button
                  onClick={handleClear}
                  className="mt-6 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#9248FF] to-[#3299FF] text-xs font-bold text-white uppercase tracking-wider shadow-lg shadow-[#9248FF]/25 hover:brightness-110 transition-all cursor-pointer active:scale-95"
                >
                  Reset Search & Filters
                </button>
              </div>

              {/* Suggestions Below Empty State so user can keep browsing */}
              {trendingSearches.length > 0 && (
                <div className="pt-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles size={14} className="text-[#9248FF]" />
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest">Trending Searches</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {trendingSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleTrendingClick(term)}
                        className="px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 hover:border-white/20 text-xs sm:text-sm text-gray-300 transition-all border border-white/5 flex items-center gap-2 active:scale-95 cursor-pointer"
                      >
                        <SearchIcon size={12} className="text-gray-500" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {recommended.length > 0 && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Compass size={14} className="text-[#3299FF]" />
                      <span>Recommended For You</span>
                    </h3>
                    <span className="text-xs text-gray-500">Popular on PrimeTime</span>
                  </div>
                  <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                    {recommended.map((item) => (
                      <Link 
                        key={`empty-rec-${item.type}-${item.id}`} 
                        href={item.href || (item.type === 'interactive' ? `/interactive/${item.id}` : `/movies/${item.slug || item.id}`)} 
                        className="block transition-transform hover:scale-[1.03] duration-300"
                      >
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
      ) : (
        /* Landing Page State (Query is empty) */
        <div className="py-4 sm:py-8 space-y-10">
          {/* Trending Searches Dynamic Tags */}
          {trendingSearches.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3.5">
                <Sparkles size={15} className="text-[#9248FF]" />
                <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest">Trending Searches</h3>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {trendingSearches.map((term) => (
                  <button
                    key={term}
                    onClick={() => handleTrendingClick(term)}
                    className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 hover:border-[#9248FF]/50 text-xs sm:text-sm text-gray-200 transition-all border border-white/10 flex items-center gap-2.5 active:scale-95 shadow-sm cursor-pointer"
                  >
                    <SearchIcon size={13} className="text-[#9248FF]" />
                    <span className="font-medium">{term}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Recommended Curated Picks */}
          {recommended.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xs font-black text-gray-300 uppercase tracking-widest flex items-center gap-2">
                  <Compass size={15} className="text-[#3299FF]" />
                  <span>Recommended For You</span>
                </h3>
                <span className="text-xs text-gray-500">Curated picks</span>
              </div>
              <div className="grid grid-cols-2 min-[480px]:grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3 sm:gap-4 md:gap-5">
                {recommended.map((item) => (
                  <Link 
                    key={`rec-${item.type}-${item.id}`} 
                    href={item.href || (item.type === 'interactive' ? `/interactive/${item.id}` : `/movies/${item.slug || item.id}`)} 
                    className="block transition-transform hover:scale-[1.03] duration-300"
                  >
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
