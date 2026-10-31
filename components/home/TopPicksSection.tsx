'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { topPicks } from '@/lib/mock-data';
import { Play, Plus, Zap, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';
import { Movie, isKidsProfileActive, isContentKidsApproved } from '@/lib/vtagu.api';

const mockShowcase = [
  "https://images.unsplash.com/photo-1543794327-59a5d12224d0?q=80&w=1200&auto=format&fit=crop", // Detective vibe
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"  // Cars vibe
];

interface TopPicksSectionProps {
  movies?: Movie[];
}

export default function TopPicksSection({ movies = [] }: TopPicksSectionProps) {
  const [isKids, setIsKids] = React.useState(false);

  React.useEffect(() => {
    setIsKids(isKidsProfileActive());
    const onProfileChange = () => setIsKids(isKidsProfileActive());
    window.addEventListener('profileChanged', onProfileChange);
    return () => window.removeEventListener('profileChanged', onProfileChange);
  }, []);

  const validMovies = isKids ? movies.filter(isContentKidsApproved) : movies;

  // Use real movies if provided, otherwise fallback to topPicks
  const items = validMovies && validMovies.length > 0 
    ? validMovies.slice(0, 2).map((m, index) => ({
        id: m.id,
        title: m.title,
        description: m.shortDescription || m.longDescription || 'Discover a personalized cinematic experience tailored just for you. Stream this high-rated pick now.',
        image: m.posterImage || mockShowcase[index % mockShowcase.length],
        score: m.rating ? `${Math.round(m.rating * 10)}% SCORE` : '98% SCORE',
        link: `/movies/${m.slug}`,
      }))
    : topPicks.map((pick, index) => ({
        id: pick.id,
        title: pick.title,
        description: pick.description || 'Discover a personalized cinematic experience tailored just for you. Stream this high-rated pick now.',
        image: mockShowcase[index % mockShowcase.length],
        score: '98% SCORE',
        link: '/movies',
      }));

  return (
    <section className="w-full py-12 md:py-20 relative z-20 bg-[#0f0a19]">
      <div className="standard-container">

        <div className="mb-10 md:mb-14">
          <SectionTitle
            title="Top Picks for You"
            subtitle="RECOMMENDED"
            Icon={Star}
            gradientText="Picks"
            viewAllHref="/movies"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12"
        >
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.link}
              className="group flex flex-col md:flex-row items-center skeuo-card overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.02] hover:-translate-y-1 hover:shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.2)] border-[#1a1329] hover:border-cyan-400/30"
            >
              {/* Image Container */}
              <div 
                className="w-full md:w-[45%] h-[260px] md:h-full min-h-[240px] relative overflow-hidden shrink-0 rounded-[1.5rem] m-2"
                suppressHydrationWarning
              >
                <Image
                  src={item.image}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-1000 group-hover:scale-110 opacity-80 group-hover:opacity-100 brightness-90"
                  sizes="(max-width: 768px) 100vw, 40vw"
                  unoptimized
                />
                
                {/* Skeuomorphic Inner Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none" />
                
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0816] via-transparent to-transparent opacity-80" />
                
                {/* Score Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="glass-panel px-3 py-1 rounded-full flex items-center gap-1.5 border-white/20">
                    <Zap size={12} className="text-cyan-400 fill-cyan-400" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">{item.score}</span>
                  </div>
                </div>
              </div>

              {/* Content Container */}
              <div className="w-full md:flex-1 p-6 md:p-8 flex flex-col justify-center h-full">
                <h3 
                  className="text-white font-semibold text-[20px] md:text-[24px] lg:text-[26px] mb-3 tracking-tight uppercase group-hover:text-cyan-400 transition-colors"
                  style={{ fontFamily: 'var(--font-montserrat)' }}
                >
                  {item.title}
                </h3>

                <p className="text-gray-400 text-[13px] md:text-[15px] leading-relaxed mb-6 line-clamp-3 font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
                  {item.description}
                </p>

                <div className="flex items-center gap-4 mt-auto">
                  <span className="w-12 h-12 rounded-full bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center text-black shadow-[0_10px_20px_rgba(34,211,238,0.3)] transition-all group-hover:scale-110 shrink-0">
                    <Play className="w-5 h-5 ml-0.5 fill-black" />
                  </span>
                  <span className="text-cyan-400 text-xs font-bold uppercase tracking-widest group-hover:underline">
                    Watch Now
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
