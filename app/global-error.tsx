'use client';

import React, { useEffect } from 'react';
import { RefreshCcw, Home, AlertTriangle } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[CRITICAL GLOBAL ROOT ERROR]', error);
  }, [error]);

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#070913] text-white flex items-center justify-center p-4 font-sans selection:bg-red-500/30">
        <div className="max-w-lg w-full text-center space-y-6 p-8 rounded-3xl bg-[#0d0915] border border-red-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(239,68,68,0.2)]">
          
          <div className="w-16 h-16 mx-auto rounded-2xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-500">
            <AlertTriangle size={32} />
          </div>

          <div className="space-y-2">
            <h1 className="text-2xl font-black uppercase tracking-wide text-white">
              SYSTEM TRANSMISSION ERROR
            </h1>
            <p className="text-white/60 text-sm leading-relaxed">
              An unexpected core error occurred while loading the application. Our systems are working to restore the link.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <button
              onClick={() => reset()}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl bg-gradient-to-r from-red-500 to-orange-500 text-white font-black text-xs uppercase tracking-widest hover:brightness-110 active:scale-95 transition-all shadow-lg cursor-pointer"
            >
              <RefreshCcw size={15} />
              Re-initialize Connection
            </button>

            <button
              onClick={() => {
                if (typeof window !== 'undefined') window.location.href = '/';
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 text-white/80 hover:text-white font-bold text-xs border border-white/10 transition-all cursor-pointer"
            >
              <Home size={15} />
              Return to Base (Home)
            </button>
          </div>

          <div className="text-[10px] text-white/30 tracking-widest font-mono uppercase pt-2 border-t border-white/5">
            CODE: {error?.digest || 'CORE-500-ROOT'}
          </div>

        </div>
      </body>
    </html>
  );
}
