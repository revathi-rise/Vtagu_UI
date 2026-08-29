"use client";
import React, { useEffect, useState } from 'react';
import { Bookmark, Play, Trash2, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { getUserId } from '@/lib/api-client';
import { getUserWatchlist, removeFromWatchlist, WatchlistItem } from '@/lib/vtagu.api';

export default function MyListClient() {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  const userId = getUserId();

  useEffect(() => {
    async function loadWatchlist() {
      if (!userId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getUserWatchlist(userId);
      setItems(data);
      setLoading(false);
    }
    loadWatchlist();
  }, [userId]);

  const handleRemove = async (contentId: number, contentType: string) => {
    if (!userId) return;
    const success = await removeFromWatchlist(userId, contentId, contentType);
    if (success) {
      setItems(prev => prev.filter(i => !(i.contentId === contentId && i.contentType === contentType)));
    }
  };

  const getMediaInfo = (item: WatchlistItem) => {
    const details = item.details || {};
    const title = details.title || details.name || `Title #${item.contentId}`;
    const image = details.card_image || details.poster_image || details.banner_image || details.card_img || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=500&auto=format&fit=crop';
    const year = details.year || (item.createdAt ? new Date(item.createdAt).getFullYear() : '2025');
    const typeLabel = item.contentType === 'interactive_movie' ? 'Interactive' : item.contentType === 'series' ? 'Series' : item.contentType === 'short' ? 'Short' : 'Movie';
    const href = item.contentType === 'interactive_movie'
      ? `/interactive-movies/${item.contentId}`
      : item.contentType === 'series'
      ? `/series/${item.contentId}`
      : item.contentType === 'short'
      ? `/shorts`
      : `/movies/${item.contentId}`;

    return { title, image, year, typeLabel, href };
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto w-full flex flex-col items-center justify-center py-32 text-gray-400">
        <Loader2 size={40} className="animate-spin mb-4 text-primary" />
        <p className="text-lg">Loading your watchlist...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto w-full">
      <h1 className="text-4xl font-extrabold text-white mb-2 tracking-tight">My List</h1>
      <p className="text-gray-400 mb-10">Titles you have saved to watch later.</p>

      {items.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-x-6 gap-y-12">
          {items.map((item) => {
            const { title, image, year, typeLabel, href } = getMediaInfo(item);
            return (
              <div key={item.id} className="group relative rounded-xl overflow-hidden aspect-[2/3] bg-[#1a1329] border border-white/5 cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(146,72,255,0.3)] hover:-translate-y-2 transition-all duration-300">
                <img src={image} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" alt={title} />

                {/* Hover Overlay Actions */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4 z-10">
                  <div className="flex justify-end gap-2 translate-y-[-10px] group-hover:translate-y-0 transition-transform duration-300">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        handleRemove(item.contentId, item.contentType);
                      }}
                      title="Remove from list"
                      className="w-8 h-8 rounded-full bg-red-600/80 border border-white/20 flex items-center justify-center text-white hover:bg-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>

                  <Link href={href} className="flex items-center justify-center flex-1">
                    <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center hover:bg-white hover:text-black hover:scale-110 transition-all text-white">
                      <Play size={24} className="ml-1" fill="currentColor" />
                    </div>
                  </Link>
                </div>

                {/* Persistent Metadata Layer */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-[#0f0a19] via-[#0f0a19]/90 to-transparent group-hover:translate-y-full transition-transform duration-300 flex flex-col justify-end">
                  <h3 className="text-white font-bold tracking-wide break-words leading-tight">{title}</h3>
                  <div className="flex items-center gap-2 mt-2 font-bold uppercase tracking-wider text-[10px]">
                    <span className="text-primary">{typeLabel}</span>
                    <span className="text-gray-500 border border-gray-600 px-1 rounded">{year}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 opacity-70 text-center px-4">
          <Bookmark size={64} className="text-gray-600 mb-6" />
          <h2 className="text-2xl font-bold text-gray-300 mb-2">Your list is empty</h2>
          <p className="text-gray-400 max-w-md mb-8">Add shows and movies to your list to keep track of what you want to watch.</p>
          <Link href="/movies" className="bg-primary hover:bg-primary/90 text-white font-bold py-3 px-8 rounded-full transition-colors shadow-lg">
            Browse Content
          </Link>
        </div>
      )}
    </div>
  );
}
