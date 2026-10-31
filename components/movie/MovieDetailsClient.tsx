'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Clock, Calendar, Globe, User, Plus, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Movie, getMovieBySlug, incrementMovieView, getBadgeText } from '@/lib/vtagu.api';
import { getUserId } from '@/lib/api-client';

// Components
import WatchNowButton from '@/components/ui/WatchNowButton';
import DynamicBackgroundVideo from '@/components/movie/DynamicBackgroundVideo';
import { PaywallGateModal } from '@/components/interactive/PaywallGateModal';

interface MovieDetailsClientProps {
  movie: Movie;
  initialUserId?: string | null;
}

export default function MovieDetailsClient({ movie: initialMovie }: MovieDetailsClientProps) {
  const [movie, setMovie] = useState<Movie>(initialMovie);
  const [showPaywallModal, setShowPaywallModal] = useState(false);

  useEffect(() => {
    setMovie(initialMovie);
  }, [initialMovie]);

  useEffect(() => {
    if (movie?.id) {
      incrementMovieView(movie.id);
    }
  }, [movie?.id]);

  // Client-side re-verification for logged in & subscribed users
  useEffect(() => {
    if (!movie.isFree && !movie.videoUrl && movie.slug) {
      const userId = getUserId();
      if (userId) {
        getMovieBySlug(movie.slug, userId).then((freshMovie) => {
          if (freshMovie && freshMovie.videoUrl) {
            setMovie(freshMovie);
          }
        }).catch(() => { });
      }
    }
  }, [movie.isFree, movie.videoUrl, movie.slug]);

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white selection:bg-blue-500/30 font-inter">
      <PaywallGateModal
        isOpen={showPaywallModal}
        price={(movie as any).price || 0}
        currency={(movie as any).currency || 'INR'}
        movieId={movie.id}
        movieTitle={movie.title}
        contentType="movie"
      />

      {/* Hero Section with High-Performance Video Background */}
      <div className="relative w-full min-h-[75vh] lg:h-[100vh] overflow-hidden">
        <DynamicBackgroundVideo
          videoUrl={movie.trailerUrl || movie.videoUrl || ""}
          posterImage={movie.posterImage || "https://picsum.photos/seed/movie/1920/1080"}
          posterAlt={movie.posterAlt || movie.title}
        />

        {/* Content Container */}
        <div className="relative z-20 h-full standard-container flex flex-col justify-end pb-8 sm:pb-20 lg:pb-32 pt-20 sm:pt-0 pointer-events-none">
          {/* Back Button with Premium Glassmorphism */}
          <Link
            href="/"
            className="w-fit mb-4 sm:mb-6 flex items-center gap-2 sm:gap-3 text-white/60 hover:text-white transition-all group pointer-events-auto"
          >
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white/10 group-hover:border-white/20">
              <ChevronLeft size={20} className="sm:w-[22px] sm:h-[22px]" />
            </div>
            <span className="font-bold tracking-widest text-[10px] sm:text-[11px] uppercase">Back to Home</span>
          </Link>

          {/* Metadata Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-2 sm:gap-3 mb-5 sm:mb-8"
          >
            {getBadgeText(movie) && (
              <div className={`text-black text-[9px] sm:text-[10px] font-black uppercase px-4 sm:px-6 py-1.5 sm:py-2 rounded-full tracking-[0.2em] shadow-[0_0_25px_rgba(59,130,246,0.4)] ${movie.isFree ? 'bg-green-500' : 'bg-blue-500'}`}>
                {getBadgeText(movie)}
              </div>
            )}
            <div className="flex items-center gap-1.5 sm:gap-2 bg-white/5 backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-[12px] font-black text-yellow-500">
              <Star size={13} className="fill-yellow-500" />
              {movie.rating} / 10
            </div>
            {Boolean((movie as any).certificate?.code || movie.ageRestriction) && (
              <div 
                style={
                  (movie as any).certificate?.badge_color 
                    ? { 
                        borderColor: `${(movie as any).certificate.badge_color}40`, 
                        backgroundColor: `${(movie as any).certificate.badge_color}18`,
                        color: (movie as any).certificate.badge_color || '#fff'
                      } 
                    : undefined
                }
                className="backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-[12px] font-black tracking-widest uppercase flex items-center gap-1.5"
              >
                <span>{(movie as any).certificate?.code || movie.ageRestriction}</span>
                {Boolean((movie as any).certificate?.certification_system) && (
                  <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500/20 text-emerald-300 rounded font-bold border border-emerald-500/30">
                    {(movie as any).certificate.certification_system}
                  </span>
                )}
              </div>
            )}
            {Boolean((movie as any).quality || (movie as any).video_quality || (movie as any).play_quality) && (
              <div className="bg-white/5 backdrop-blur-md px-3.5 sm:px-5 py-1.5 sm:py-2 rounded-full border border-white/10 text-[11px] sm:text-[12px] font-black text-white/70 tracking-widest uppercase">
                {(movie as any).quality || (movie as any).video_quality || (movie as any).play_quality}
              </div>
            )}
          </motion.div>

          {/* Title & Description with Luxury Typography */}
          <div className="max-w-4xl pointer-events-auto">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-[26px] sm:text-[34px] md:text-[44px] font-mo font-black mb-4 sm:mb-6 tracking-tight leading-tight text-white skeuo-title-3d uppercase"
            >
              {movie.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-sm sm:text-base lg:text-xl text-white/60 mb-6 sm:mb-12 leading-relaxed font-medium max-w-2xl tracking-tight [&_p]:inline [&_p]:m-0 [&_p]:p-0 [&_*]:!bg-transparent"
              dangerouslySetInnerHTML={{ __html: movie.shortDescription }}
            />

            {/* Main Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center gap-3 sm:gap-5"
            >
              <WatchNowButton
                url={movie.videoUrl}
                title={movie.title}
                contentId={movie.id?.toString() || ""}
                contentType="movie"
                internal={true}
                onLockedClick={() => setShowPaywallModal(true)}
                subtitles={(movie as any).subtitles || (movie as any).media?.subtitles}
                audioTracks={(movie as any).audioTracks || (movie as any).audio_tracks}
              />

              <button aria-label="Add to list" className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all group active:scale-95 shrink-0">
                <Plus size={18} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>

              <button aria-label="Share movie" className="flex items-center justify-center w-11 h-11 sm:w-14 sm:h-14 rounded-full sm:rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all group active:scale-95 shrink-0">
                <Share2 size={18} className="sm:w-6 sm:h-6 group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="hidden sm:flex absolute bottom-12 right-12 z-20 flex-col items-center gap-6 opacity-40">
          <div className="w-[1px] h-24 bg-gradient-to-t from-white to-transparent" />
          <span className="[writing-mode:vertical-lr] text-[9px] font-black tracking-[0.5em] uppercase text-white/50">Details</span>
        </div>
      </div>

      {/* Details Section with Glassmorphism Side Card */}
      <section className="relative z-30 bg-[#0B0A10] py-12 sm:py-20 lg:py-32">
        <div className="standard-container">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-14 lg:gap-24">
            {/* Story & Cast */}
            <div className="lg:col-span-2 space-y-12 sm:space-y-24">
              <div className="reveal-visible">
                <h3 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-6 sm:mb-10 flex items-center gap-4 sm:gap-5">
                  <span className="w-8 sm:w-12 h-[1px] bg-blue-500" />
                  The Storyline
                </h3>
                <div
                  className="text-base sm:text-xl lg:text-[24px] text-white/90 leading-[1.6] font-light tracking-tight space-y-4 [&_*]:!bg-transparent"
                  dangerouslySetInnerHTML={{ __html: movie.longDescription }}
                />
              </div>
            </div>

            {/* Sidebar Stats - Luxury Glassmorphism */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-[32px] sm:rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[28px] sm:rounded-[32px] p-6 sm:p-8 lg:p-12 h-fit space-y-6 sm:space-y-10 lg:sticky lg:top-32 shadow-2xl">
                <h4 className="text-white text-xl sm:text-2xl font-black tracking-tight uppercase">Movie Info</h4>

                <div className="space-y-6">
                  {/* Cast & Crew Group */}
                  <div className="space-y-6 pb-2 border-b border-white/5">
                    {/* Director */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-white/40">
                        <User size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Director</span>
                      </div>
                      <span className="text-base font-bold text-white/95 pl-7">{movie.director}</span>
                    </div>

                    {/* Languages */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-white/40">
                        <Globe size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Languages</span>
                      </div>
                      <span className="text-base font-bold text-white/95 pl-7">{movie.languages}</span>
                    </div>

                    {/* Starring */}
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-3 text-white/40">
                        <User size={16} className="text-blue-500" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Starring</span>
                      </div>
                      <span className="text-base font-bold text-white/95 pl-7 leading-relaxed">{movie.actors}</span>
                    </div>
                  </div>

                  {/* Metadata Stats */}
                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-3 text-white/40">
                        <Calendar size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Released</span>
                      </div>
                      <span className="text-base font-black tracking-tight">{movie.releaseYear}</span>
                    </div>
                    <div className="flex items-center justify-between py-2 border-b border-white/5">
                      <div className="flex items-center gap-3 text-white/40">
                        <Clock size={18} />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em]">Duration</span>
                      </div>
                      <span className="text-base font-black tracking-tight">{movie.duration}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-8">
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-3xl p-8 space-y-4">
                    <div className="flex items-center gap-4 text-blue-400">
                      <Star size={24} className="fill-blue-400" />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Premium Content</span>
                    </div>
                    <p className="text-sm text-white/50 leading-relaxed font-medium">
                      This title is streaming in 4k Dolby Vision and Atmos for the ultimate cinematic experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
