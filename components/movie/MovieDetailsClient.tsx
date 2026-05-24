'use client';

import React from 'react';
import Image from 'next/image';
import { Star, Clock, Calendar, Globe, User, Plus, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Movie } from '@/lib/vtagu.api';

// Components
import WatchNowButton from '@/components/ui/WatchNowButton';
import DynamicBackgroundVideo from '@/components/movie/DynamicBackgroundVideo';

interface MovieDetailsClientProps {
  movie: Movie;
}

export default function MovieDetailsClient({ movie }: MovieDetailsClientProps) {
  return (
    <main className="min-h-screen bg-[#0B0A10] text-white selection:bg-blue-500/30 font-inter">
      {/* Hero Section with High-Performance Video Background */}
      <div className="relative w-full h-[90vh] lg:h-[100vh] overflow-hidden">
        <DynamicBackgroundVideo
          videoUrl={movie.trailerUrl}
          posterImage={movie.posterImage || "https://picsum.photos/seed/movie/1920/1080"}
          posterAlt={movie.posterAlt || movie.title}
        />

        {/* Content Container */}
        <div className="relative z-20 h-full max-w-[90%] mx-auto flex flex-col justify-end pb-24 lg:pb-32">
          {/* Back Button with Premium Glassmorphism */}
          <Link
            href="/"
            className="absolute top-30 left-0 flex items-center gap-3 text-white/60 hover:text-white transition-all group"
          >
            <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center bg-white/5 backdrop-blur-md group-hover:bg-white/10 group-hover:border-white/20">
              <ChevronLeft size={22} />
            </div>
            <span className="font-bold tracking-widest text-[11px] uppercase">Back to Home</span>
          </Link>

          {/* Metadata Badges */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex flex-wrap items-center gap-3 mb-8"
          >
            <div className="bg-blue-500 text-black text-[10px] font-black uppercase px-6 py-2 rounded-full tracking-[0.2em] shadow-[0_0_25px_rgba(59,130,246,0.4)]">
              {movie.isFree ? 'FREE' : 'PREMIUM'}
            </div>
            <div className="flex items-center gap-2 bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-[12px] font-black text-yellow-500">
              <Star size={14} className="fill-yellow-500" />
              {movie.rating} / 10
            </div>
            <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-[12px] font-black text-white/70 tracking-widest uppercase">
              {movie.ageRestriction || 'PG-13'}
            </div>
            <div className="bg-white/5 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-[12px] font-black text-white/70 tracking-widest">
              4K ULTRA HD
            </div>
          </motion.div>

          {/* Title & Description with Luxury Typography */}
          <div className="max-w-4xl">
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-black mb-6 tracking-tight leading-none text-white skeuo-title-3d uppercase"
            >
              {movie.title}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-lg lg:text-xl text-white/60 mb-12 leading-relaxed font-medium max-w-2xl tracking-tight [&_p]:inline [&_p]:m-0 [&_p]:p-0"
              dangerouslySetInnerHTML={{ __html: movie.shortDescription }}
            />

            {/* Main Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="flex flex-wrap items-center gap-5"
            >
              <WatchNowButton
                url={movie.videoUrl}
                title={movie.title}
                contentId={movie.id.toString()}
                contentType="movie"
                internal={true}
              />

              <button className="flex items-center justify-center w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all group">
                <Plus size={28} className="group-hover:scale-110 transition-transform" />
              </button>

              <button className="flex items-center justify-center w-16 h-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 hover:border-white/20 transition-all group">
                <Share2 size={24} className="group-hover:scale-110 transition-transform" />
              </button>
            </motion.div>
          </div>
        </div>

        {/* Cinematic Scroll Indicator */}
        <div className="absolute bottom-12 right-12 z-20 flex flex-col items-center gap-6 opacity-40">
          <div className="w-[1px] h-24 bg-gradient-to-t from-white to-transparent" />
          <span className="[writing-mode:vertical-lr] text-[9px] font-black tracking-[0.5em] uppercase text-white/50">Details</span>
        </div>
      </div>

      {/* Details Section with Glassmorphism Side Card */}
      <section className="relative z-30 bg-[#0B0A10] py-32">
        <div className="max-w-[90%] mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-24">
            {/* Story & Cast */}
            <div className="lg:col-span-2 space-y-24">
              <div className="reveal-visible">
                <h3 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-10 flex items-center gap-5">
                  <span className="w-12 h-[1px] bg-blue-500" />
                  The Storyline
                </h3>
                <div
                  className="text-2xl lg:text-3xl text-white/90 leading-[1.6] font-light tracking-tight space-y-4"
                  dangerouslySetInnerHTML={{ __html: movie.longDescription }}
                />
              </div>
            </div>

            {/* Sidebar Stats - Luxury Glassmorphism */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 h-fit space-y-10 sticky top-32 shadow-2xl">
                <h4 className="text-white text-2xl font-black tracking-tight uppercase">Movie Info</h4>

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
