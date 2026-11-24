'use client';

import React from 'react';
import Link from 'next/link';
import { Film, Home, Search, Compass, Tv } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] bg-[#0c0714] text-white flex items-center justify-center px-4 py-16 selection:bg-primary/30">
      <div className="max-w-xl w-full text-center space-y-8">
        
        {/* Glow radar beacon */}
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative w-24 h-24 mx-auto flex items-center justify-center"
        >
          <div className="absolute inset-0 rounded-full bg-primary/20 animate-ping opacity-60" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-primary/30 via-purple-900/30 to-[#0c0714] border border-primary/40 flex items-center justify-center text-primary shadow-[0_0_30px_rgba(146,72,255,0.3)]">
            <Film size={36} className="text-white" />
          </div>
          <div className="absolute -bottom-2 px-3 py-0.5 rounded-full bg-brand-gradient text-white text-[11px] font-black tracking-widest uppercase shadow">
            404 NOT FOUND
          </div>
        </motion.div>

        {/* Message */}
        <div className="space-y-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white">
            TRANSMISSION <span className="text-gradient">LOST</span>
          </h1>
          <p className="text-white/60 text-sm sm:text-base max-w-md mx-auto leading-relaxed">
            The movie, series, or page you are looking for does not exist, has been archived, or the link was mistyped.
          </p>
        </div>

        {/* Navigation options */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2 max-w-md mx-auto">
          <Link
            href="/"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-brand-gradient text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all"
          >
            <Home size={16} />
            Return Home
          </Link>

          <Link
            href="/movies"
            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/15 text-white font-black text-xs uppercase tracking-wider border border-white/20 transition-all"
          >
            <Film size={16} />
            Explore Movies
          </Link>

          <Link
            href="/search"
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-bold text-xs border border-white/10 transition-all"
          >
            <Search size={16} />
          </Link>
        </div>

      </div>
    </div>
  );
}
