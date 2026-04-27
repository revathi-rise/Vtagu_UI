import React from 'react';
import dynamic from 'next/dynamic';
import { getMovieBySlug, getMovies } from '@/lib/vtagu.api';
import { notFound } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import Image from 'next/image';
import { Star, Clock, Calendar, Globe, User, Plus, Share2, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import * as motion from 'framer-motion/client';

// Shared Components
import Shimmer from '@/components/shared/Shimmer';
import WatchNowButton from '@/components/ui/WatchNowButton';
import DynamicBackgroundVideo from '@/components/movie/DynamicBackgroundVideo';

interface MovieDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  if (!movie) return { title: 'Movie Not Found' };

  return {
    title: `${movie.title} - PrimeTime`,
    description: movie.shortDescription,
  };
}

export async function generateStaticParams() {
  const movies = await getMovies();
  return movies.map((movie) => ({
    slug: movie.slug,
  }));
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white selection:bg-blue-500/30 font-inter">
      <Navbar />

      {/* Hero Section with High-Performance Video Background */}
      <div className="relative w-full h-[90vh] lg:h-[100vh] overflow-hidden">
        <DynamicBackgroundVideo
          videoUrl={movie.videoUrl}
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
              className="text-6xl lg:text-[10rem] font-black mb-8 tracking-tighter leading-[0.8] text-white skeuo-title-3d uppercase"
            >
              {movie.title}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="text-xl lg:text-2xl text-white/60 mb-12 leading-relaxed font-medium max-w-2xl tracking-tight"
            >
              {movie.shortDescription}
            </motion.p>

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
                <p className="text-2xl lg:text-3xl text-white/90 leading-[1.6] font-light tracking-tight">
                  {movie.longDescription}
                </p>
              </div>

              <div>
                <h3 className="text-blue-500 text-[10px] font-black tracking-[0.4em] uppercase mb-12 flex items-center gap-5">
                  <span className="w-12 h-[1px] bg-blue-500" />
                  Cast & Crew
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500/10 transition-colors">
                      <User size={28} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Director</span>
                      <span className="text-xl font-bold tracking-tight text-white/90">{movie.director}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500/10 transition-colors">
                      <Globe size={24} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Languages</span>
                      <span className="text-xl font-bold tracking-tight text-white/90">{movie.languages}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-5 md:col-span-2 group">
                    <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-blue-500 shrink-0 group-hover:bg-blue-500/10 transition-colors">
                      <User size={28} />
                    </div>
                    <div>
                      <span className="block text-[9px] font-black text-white/30 uppercase tracking-[0.2em] mb-2">Starring</span>
                      <p className="text-xl font-bold tracking-tight text-white/90 max-w-xl">{movie.actors}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar Stats - Luxury Glassmorphism */}
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-b from-blue-500/20 to-purple-500/20 rounded-[40px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[32px] p-12 h-fit space-y-12 sticky top-32 shadow-2xl">
                <h4 className="text-white text-2xl font-black tracking-tight uppercase">Movie Info</h4>

                <div className="space-y-8">
                  <div className="flex items-center justify-between py-5 border-b border-white/5">
                    <div className="flex items-center gap-4 text-white/40">
                      <Calendar size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Released</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">{movie.releaseYear}</span>
                  </div>
                  <div className="flex items-center justify-between py-5 border-b border-white/5">
                    <div className="flex items-center gap-4 text-white/40">
                      <Clock size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Duration</span>
                    </div>
                    <span className="text-xl font-black tracking-tight">{movie.duration}</span>
                  </div>
                  <div className="flex items-center justify-between py-5 border-b border-white/5">
                    <div className="flex items-center gap-4 text-white/40">
                      <Globe size={20} />
                      <span className="text-[10px] font-black uppercase tracking-[0.2em]">Country</span>
                    </div>
                    <span className="text-xl font-black tracking-tight uppercase">USA</span>
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
