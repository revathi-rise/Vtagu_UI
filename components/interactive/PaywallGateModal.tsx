'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CreditCard, Sparkles, Home } from 'lucide-react';
import Link from 'next/link';

interface PaywallProps {
  isOpen: boolean;
  price: number;
  currency: string;
  movieId: number;
  movieTitle: string;
  contentType?: 'movie' | 'episode';
}

export const PaywallGateModal = ({ isOpen, price, currency, movieId, movieTitle, contentType = 'movie' }: PaywallProps) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative w-full max-w-lg bg-[#161224] border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl p-8 md:p-10 text-center"
        >
          {/* Decorative ambient light */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-gradient-to-br from-cyan-500/10 to-[#b28cff]/10 blur-[80px] rounded-full pointer-events-none" />
          
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-purple-500 to-blue-600" />

          <div className="flex flex-col items-center space-y-6 relative z-10">
            <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 shadow-inner">
              <Sparkles size={32} />
            </div>

            <div>
              <div className="inline-flex items-center gap-2 bg-cyan-400/10 text-cyan-400 px-3.5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-cyan-400/20">
                Premium Content
              </div>
              <h2 className="text-3xl font-black text-white uppercase tracking-tight leading-tight">
                Unlock {movieTitle}
              </h2>
              <p className="text-white/60 text-sm mt-3 leading-relaxed max-w-sm mx-auto">
                {contentType === 'episode' 
                  ? "This episode is premium content. You can purchase lifetime access to this episode or subscribe to get unlimited access to all premium series."
                  : "This choice-driven narrative is premium content. You can purchase lifetime access to this experience or subscribe to get unlimited access to all interactive films."
                }
              </p>
            </div>

            <div className="w-full space-y-4 pt-4">
              {/* Option 1: Buy Movie Separately (Only if price > 0) */}
              {price > 0 && (
                <Link
                  href={`/checkout?type=${contentType}&id=${movieId}`}
                  className="flex items-center justify-center gap-3 w-full bg-white hover:bg-white/90 text-black font-black py-4.5 rounded-2xl transition-all duration-300 shadow-lg text-sm uppercase tracking-[0.15em] active:scale-95"
                >
                  <CreditCard size={18} />
                  Unlock {contentType === 'episode' ? 'Episode' : 'Movie'} Separately • {currency} {price}
                </Link>
              )}

              {/* Option 2: Subscribe to Interactive Plan */}
              <Link
                href="/pricing"
                className="flex items-center justify-center gap-3 w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:opacity-95 text-white font-black py-4.5 rounded-2xl transition-all duration-300 shadow-lg text-sm uppercase tracking-[0.15em] active:scale-95"
              >
                <Sparkles size={18} />
                Get Premium Pass (All {contentType === 'episode' ? 'Series' : 'Movies'})
              </Link>
            </div>

            <div className="pt-6 w-full flex justify-center border-t border-white/5">
              <Link
                href="/"
                className="flex items-center gap-2 text-white/40 hover:text-white transition-colors text-xs font-black uppercase tracking-widest group"
              >
                <Home size={14} className="group-hover:-translate-y-0.5 transition-transform" />
                Back to Home
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
