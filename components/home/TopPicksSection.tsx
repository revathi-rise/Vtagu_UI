'use client';

import { topPicks } from '@/lib/mock-data';
import { Play, Plus, Zap, Clock, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

const mockShowcase = [
  "https://images.unsplash.com/photo-1543794327-59a5d12224d0?q=80&w=1200&auto=format&fit=crop", // Detective vibe
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"  // Cars vibe
];

export default function TopPicksSection() {
  return (
    <section className="w-full py-16 md:py-24 relative z-20 bg-[#0f0a19]">
      <div className="tv-container px-6 md:px-12 lg:px-24">

        <div className="mb-12 md:mb-16">
          <SectionTitle
            title="Top Picks for You"
            subtitle="RECOMMENDED"
            Icon={Star}
            gradientText="Picks"
            viewAllHref="#"
          />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14"
        >
          {topPicks.map((pick, index) => (
            <div
              key={pick.id}
              className="group flex flex-col md:flex-row items-center skeuo-card overflow-hidden transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:scale-[1.03] hover:-translate-y-2 hover:shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.2)] border-[#1a1329] hover:border-cyan-400/30"
            >
              {/* Image Container: Upgraded with Inner Glow */}
              <div className="w-full md:w-[45%] h-[300px] md:h-full relative overflow-hidden shrink-0 rounded-[1.8rem] m-2">
                <img
                  src={mockShowcase[index % mockShowcase.length]}
                  alt={pick.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70 group-hover:opacity-100 brightness-90"
                />
                
                {/* Skeuomorphic Inner Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none" />
                
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0816] via-transparent to-transparent opacity-80" />
                
                {/* Score Badge */}
                <div className="absolute top-4 left-4 z-20">
                  <div className="glass-panel px-3 py-1 rounded-full flex items-center gap-1.5 border-white/20">
                    <Zap size={12} className="text-cyan-400 fill-cyan-400" />
                    <span className="text-[10px] font-bold text-white tracking-widest uppercase">98% SCORE</span>
                  </div>
                </div>
              </div>

              {/* Content Container: Upgraded Typography & Actions */}
              <div className="w-full md:flex-1 p-8 md:p-10 flex flex-col justify-center h-full">
                {/* Title: Poppins SemiBold */}
                <h3 
                  className="text-white font-semibold text-[22px] md:text-[26px] lg:text-[28px] mb-4 tracking-tight uppercase group-hover:text-cyan-400 transition-colors"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                  {pick.title}
                </h3>

                {/* Description: Inter Regular */}
                <p className="text-gray-400 text-[14px] md:text-[16px] leading-relaxed mb-8 line-clamp-3 font-normal" style={{ fontFamily: 'var(--font-inter)' }}>
                  {pick.description || 'Discover a personalized cinematic experience tailored just for you. Stream this high-rated pick now.'}
                </p>

                <div className="flex items-center gap-6 mt-auto">
                  <button className="w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center text-black shadow-[0_10px_20px_rgba(34,211,238,0.3)] transition-all hover:scale-110 hover:rotate-6 shrink-0 active:scale-90">
                    <Play className="w-6 h-6 ml-1 fill-black" />
                  </button>
                  <button className="flex items-center gap-2 text-white/50 hover:text-white font-bold transition-all text-[11px] uppercase tracking-[0.2em] group/btn" style={{ fontFamily: 'var(--font-inter)' }}>
                    <Plus className="w-4 h-4 transition-transform group-hover/btn:rotate-90" />
                    My List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
