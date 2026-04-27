'use client';

import { useEffect } from 'react';
import { RefreshCcw, Home, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if available
    console.error('[PRODUCTION ERROR]', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#0f0a10] flex items-center justify-center p-4 selection:bg-cyan-500/30">
      <div className="max-w-2xl w-full text-center space-y-8">
        
        {/* Error Visual */}
        <div className="relative w-full aspect-[16/9] rounded-[2rem] overflow-hidden border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] group">
          <Image 
            src="/vtagu_prevent.png" 
            alt="Vtagu Preview" 
            fill 
            className="object-cover group-hover:scale-105 transition-transform duration-700"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f0a10] via-transparent to-black/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-20 h-20 bg-red-500/20 backdrop-blur-md rounded-full border border-red-500/50 flex items-center justify-center animate-pulse">
               <div className="text-red-500 font-black text-4xl italic tracking-tighter">!</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight" style={{ fontFamily: 'var(--font-montserrat)' }}>
            CHANNELS <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">UNSTABLE</span>
          </h1>
          <p className="text-gray-400 text-lg font-medium leading-relaxed max-w-sm mx-auto" style={{ fontFamily: 'var(--font-inter)' }}>
            We've encountered a transmission error. The PrimeTime servers are currently recalibrating.
          </p>
        </div>

        {/* Support Options */}
        <div className="grid grid-cols-1 gap-4 pt-4">
          <button
            onClick={() => reset()}
            className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest hover:bg-cyan-400 hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 shadow-[0_15px_30px_rgba(255,255,255,0.1)]"
          >
            <RefreshCcw size={20} />
            Initialize Re-Link
          </button>
          
          <div className="flex gap-4">
            <Link 
              href="/"
              className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a1329] text-white/70 font-bold border border-white/5 hover:border-white/20 hover:text-white transition-all"
            >
              <Home size={18} />
              Return Base
            </Link>
            <button className="flex-1 flex items-center justify-center gap-2 py-4 rounded-2xl bg-[#1a1329] text-white/70 font-bold border border-white/5 hover:border-white/20 hover:text-white transition-all">
              <MessageSquare size={18} />
              S.O.S
            </button>
          </div>
        </div>

        {/* System Code */}
        <div className="pt-10 flex items-center justify-center gap-3 text-[10px] font-black text-white/20 uppercase tracking-[0.3em]">
          <span className="w-8 h-[1px] bg-white/10" />
          SYSTEM CODE: {error.digest || 'PT-ERR-ALPHA'}
          <span className="w-8 h-[1px] bg-white/10" />
        </div>
      </div>
    </div>
  );
}
