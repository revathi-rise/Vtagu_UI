"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Play, Plus, Check, Star, ChevronLeft, ChevronRight, Globe } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Poster, Movie, Episode, toggleWatchlist, checkWatchlist, isKidsProfileActive, isContentKidsApproved } from "@/lib/vtagu.api";
import { useAlert } from '../shared/CustomAlertModal';
import { getUserId } from "@/lib/api-client";
import HeroThumbnailSlider from "./HeroThumbnailSlider";

export interface HeroItem {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  rating: string;
  link: string;
  languages?: string;
  trailerUrl?: string;
  referenceType?: string;
  referenceId?: number;
}

interface HeroSectionProps {
  posters: Poster[];
  movies?: Movie[];
  episodes?: Episode[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

function cleanHtml(str?: string): string {
  if (!str) return "";
  return str
    .replace(/<!--[sS]*?-->/g, "")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/\s+/g, " ")
    .trim();
}

export default function HeroSection({ posters = [], movies = [], episodes = [] }: HeroSectionProps) {
  const { showAlert } = useAlert();
  const [activeIndex, setActiveIndex] = useState(0);
  const [inWatchlist, setInWatchlist] = useState(false);
  const [isKids, setIsKids] = useState(false);
  const userId = getUserId();

  useEffect(() => {
    setIsKids(isKidsProfileActive());
    const onProfileChange = () => setIsKids(isKidsProfileActive());
    window.addEventListener('profileChanged', onProfileChange);
    return () => window.removeEventListener('profileChanged', onProfileChange);
  }, []);

  // Filter posters if kids mode is active
  const filteredPosters = isKids
    ? posters.filter((poster) => {
        if (isContentKidsApproved(poster)) return true;
        if (poster.reference_type === "movie" && poster.reference_id) {
          const m = movies.find((mov) => mov.id === poster.reference_id);
          return m ? isContentKidsApproved(m) : false;
        }
        if ((poster.reference_type === "series" || poster.reference_type === "episode") && poster.reference_id) {
          const ep = episodes.find((e) => e.id === poster.reference_id || e.episodeId === poster.reference_id);
          return ep ? isContentKidsApproved(ep) : false;
        }
        return false;
      })
    : posters;

  // Map API posters to HeroItem format
  let items: HeroItem[] = filteredPosters.map((poster) => {
    let rating = "";
    let link = poster.link || "";

    if (poster.reference_type === "movie" && poster.reference_id) {
      const movie = movies.find((m) => m.id === poster.reference_id);
      if (movie) {
        rating = movie.rating ? movie.rating.toString() : "";
        if (!link) {
          link = `/movies/${movie.slug}`;
        }
      }
    } else if ((poster.reference_type === "series" || poster.reference_type === "episode") && poster.reference_id) {
      const episode = episodes.find((e) => e.id === poster.reference_id || e.episodeId === poster.reference_id);
      if (episode) {
        rating = episode.rating ? episode.rating.toString() : "";
        if (!link) {
          link = `/episodes/${episode.id || episode.episodeId}`;
        }
      }
    }

    return {
      id: poster.poster_id,
      title: cleanHtml(poster.poster_title || ""),
      description: cleanHtml(poster.description || ""),
      image: poster.path.startsWith('http') ? poster.path : `${IMAGE_BASE_URL}${poster.path}`,
      category: poster.genres_list || "",
      rating,
      link: link || "#",
      languages: poster.languages || "",
      trailerUrl: poster.trailer_url || "",
      referenceType: poster.reference_type || 'movie',
      referenceId: poster.reference_id || poster.poster_id,
    };
  });

  // Fallback to movies if posters is empty
  const fallbackMovies = isKids ? movies.filter(isContentKidsApproved) : movies;
  if (items.length === 0 && fallbackMovies && fallbackMovies.length > 0) {
    items = fallbackMovies.slice(0, 5).map((movie) => ({
      id: movie.id,
      title: cleanHtml(movie.title || ""),
      description: cleanHtml(movie.shortDescription || movie.longDescription || ""),
      image: movie.posterImage || (movie.media?.image?.url ?? ""),
      category: (movie as any).genre_name || "Featured",
      rating: movie.rating ? movie.rating.toString() : "",
      link: `/movies/${movie.slug}`,
      languages: movie.languages || "",
      trailerUrl: movie.trailerUrl || "",
      referenceType: 'movie',
      referenceId: movie.id,
    }));
  }

  // Ensure activeIndex is within range
  const safeActiveIndex = items.length > 0 ? activeIndex % items.length : 0;
  const currentItem = items[safeActiveIndex];

  useEffect(() => {
    async function verifyWatchlist() {
      if (!userId || !currentItem) {
        setInWatchlist(false);
        return;
      }
      const isSaved = await checkWatchlist(
        userId,
        currentItem.referenceId || currentItem.id,
        currentItem.referenceType || 'movie'
      );
      setInWatchlist(isSaved);
    }
    verifyWatchlist();
  }, [userId, safeActiveIndex, currentItem]);

  const handleWatchlistToggle = async () => {
    if (!userId) {
      showAlert("Please log in to add items to your watchlist.");
      return;
    }
    if (!currentItem) return;

    const res = await toggleWatchlist(
      userId,
      currentItem.referenceId || currentItem.id,
      currentItem.referenceType || 'movie'
    );
    if (res.status) {
      setInWatchlist(res.inWatchlist);
    }
  };

  const nextSlide = React.useCallback(() => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev + 1) % items.length);
  }, [items.length]);

  const prevSlide = React.useCallback(() => {
    if (items.length <= 1) return;
    setActiveIndex((prev) => (prev - 1 + items.length) % items.length);
  }, [items.length]);

  // Autoplay slides
  React.useEffect(() => {
    if (items.length <= 1) return;
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [nextSlide, items.length]);

  const handleThumbClick = (index: number) => {
    setActiveIndex(index);
  };

  if (items.length === 0 || !currentItem) {
    return (
      <section className="relative w-full py-16 sm:py-24 px-6 overflow-hidden bg-gradient-to-b from-[#1a102a] via-[#0f0a19] to-[#0f0a10] border-b border-white/5 flex flex-col items-center justify-center text-center">
        <div className="max-w-xl mx-auto space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-[0_0_25px_rgba(251,191,36,0.3)]">
            <span className="text-3xl">🌟</span>
          </div>
          <div className="space-y-2">
            <span className="inline-block px-3 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 text-[10px] font-black uppercase tracking-widest">
              Kids Mode
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight uppercase">
              Welcome to Kids Fun Zone
            </h2>
            <p className="text-white/60 text-xs sm:text-sm max-w-md mx-auto">
              Family-safe movies, series, and adventures curated for young explorers.
            </p>
          </div>
          <button
            onClick={() => {
              const defaultProfile = { id: 1, name: "User", avatar: "", color: "from-purple-600 to-indigo-600", isKids: false };
              localStorage.setItem('currentProfile', JSON.stringify(defaultProfile));
              document.cookie = "kids_mode=false; path=/; max-age=0; expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax";
              document.cookie = `currentProfile=${encodeURIComponent(JSON.stringify(defaultProfile))}; path=/; max-age=31536000; SameSite=Lax`;
              if (typeof window !== 'undefined') {
                window.dispatchEvent(new Event('profileChanged'));
              }
              window.location.href = '/';
            }}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-black uppercase tracking-widest transition-all cursor-pointer active:scale-95"
          >
            Exit Kids Mode
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full h-[70vh] sm:h-[80vh] md:h-screen overflow-hidden bg-[#0f0a10]">
      {/* 1. Background Image Slider with Smooth Motion Transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentItem.id}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.0, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <Image
            src={currentItem.image}
            alt={currentItem.title}
            fill
            priority
            className="object-cover"
            sizes="100vw"
          />
          {/* Multi-layered Gradients for readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0f0a10] via-[#0f0a10]/60 to-transparent z-10" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a10] via-transparent to-transparent z-10" />
          <div className="absolute inset-0 bg-black/20 z-10" />
        </motion.div>
      </AnimatePresence>

      {/* 2. Content Layer (Draggable for Swipe Navigation) */}
      <motion.div 
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={(_e, { offset }) => {
          const swipeThreshold = 50;
          if (offset.x > swipeThreshold) {
            prevSlide();
          } else if (offset.x < -swipeThreshold) {
            nextSlide();
          }
        }}
        className="relative z-20 h-full w-full max-w-[90%] mx-auto px-5 sm:px-8 md:px-12 lg:px-20 flex flex-col justify-center cursor-grab active:cursor-grabbing"
      >
        <div className="max-w-2xl space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentItem.id}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="flex flex-col gap-6"
            >
              {/* Badge System */}
              {(currentItem.category || currentItem.rating) && (
                <div className="flex items-center gap-4">
                  {currentItem.category && (
                    <div className="glass-panel px-4 py-1.5 rounded-full border-white/20 flex items-center gap-2">
                      <span className="text-[10px] md:text-[12px] font-bold text-primary tracking-[0.2em] uppercase">
                        {currentItem.category}
                      </span>
                    </div>
                  )}
                  {currentItem.rating && (
                    <div className="flex items-center gap-2 bg-black/40 backdrop-blur-md py-1.5 px-4 rounded-full border border-white/10">
                      <Star className="w-4 h-4 text-[#FACC15] fill-[#FACC15]" />
                      <span className="font-bold text-white text-[12px] md:text-[14px]">{currentItem.rating}</span>
                    </div>
                  )}
                </div>
              )}

              {/* Title */}
              {currentItem.title && (
                <h1 className="title-h2 lg:text-[64px] xl:text-[80px] drop-shadow-2xl">
                  {currentItem.title}
                </h1>
              )}

              {/* Description */}
              {currentItem.description && (
                <p className="title-desc max-w-xl text-white/70">
                  {currentItem.description}
                </p>
              )}

              {/* Languages Row */}
              {currentItem.languages && currentItem.languages.trim() !== "" && (
                <div className="flex flex-wrap items-center gap-2 text-white/70 text-xs md:text-sm font-medium">
                  <span className="text-white/40 uppercase tracking-[0.15em] text-[10px] md:text-[11px] font-bold flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5 text-primary" /> Languages:
                  </span>
                  {currentItem.languages.split(',').map((lang) => (
                    <span 
                      key={lang} 
                      className="px-2.5 py-0.5 rounded-full bg-white/10 text-white/90 text-[11px] font-bold border border-white/5 shadow-sm uppercase tracking-wider"
                    >
                      {lang.trim()}
                    </span>
                  ))}
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-row items-center gap-3 pt-4">
                <Link
                  href={currentItem.link}
                  className="flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full bg-primary text-black font-bold uppercase tracking-widest transition-all hover:scale-105 hover:bg-primary/90 hover:shadow-[0_10px_20px_rgba(50,153,255,0.4)] active:scale-95 text-sm sm:text-base"
                >
                  <Play className="w-4 h-4 sm:w-5 sm:h-5 fill-black" />
                  Watch Now
                </Link>
                <button
                  onClick={handleWatchlistToggle}
                  className={cn(
                    "flex-1 sm:flex-none h-11 sm:h-14 px-6 sm:px-10 flex items-center justify-center gap-2 sm:gap-3 rounded-full text-white font-bold uppercase tracking-widest transition-all active:scale-95 text-sm sm:text-base",
                    inWatchlist
                      ? "bg-green-600/80 hover:bg-green-600 border border-green-400/30"
                      : "glass-panel hover:bg-white/10 border-white/20"
                  )}
                >
                  {inWatchlist ? (
                    <>
                      <Check className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                      In List
                    </>
                  ) : (
                    <>
                      <Plus className="w-4 h-4 sm:w-5 sm:h-5" />
                      Watchlist
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>

      {/* 3. Navigation Controls & Thumbnails */}
      <div className="absolute bottom-6 right-4 sm:bottom-8 sm:right-8 z-40 flex flex-col items-end gap-4 sm:gap-6">
        <div className="flex gap-2 sm:gap-3 items-center">
          <button 
            onClick={prevSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl"
            title="Previous"
          >
            <ChevronLeft size={20} />
          </button>
          <button 
            onClick={nextSlide}
            className="w-10 h-10 sm:w-12 sm:h-12 rounded-full glass-morphism flex items-center justify-center text-white/50 hover:text-white hover:bg-white/10 transition-all border border-white/10 shadow-xl"
            title="Next"
          >
            <ChevronRight size={20} />
          </button>
        </div>

        <HeroThumbnailSlider 
          items={items} 
          activeIndex={safeActiveIndex} 
          onThumbClick={handleThumbClick} 
        />
      </div>
    </section>
  );
}
