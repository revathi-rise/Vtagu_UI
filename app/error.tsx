'use client';

import { useEffect } from 'react';
import { RefreshCcw, Home, MessageSquare } from 'lucide-react';
import Link from 'next/link';

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
      <div className="max-w-md w-full text-center space-y-10">
        
        {/* Error Visual */}
        <div className="relative inline-block group">
          <div className="absolute -inset-4 bg-red-500/20 rounded-full blur-3xl group-hover:bg-red-500/30 transition-all duration-700" />
          <div className="relative bg-[#1a1329]/80 backdrop-blur-2xl border border-white/10 w-24 h-24 rounded-3xl flex items-center justify-center mx-auto shadow-2xl overflow-hidden">
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-red-500/10" />
            <div className="text-red-400 font-black text-4xl italic tracking-tighter">!</div>
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
