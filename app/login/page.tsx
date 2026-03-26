import React from 'react';
import LoginForm from './components/LoginForm';
import { Sparkles } from 'lucide-react';
import Link from 'next/link';

export const metadata = {
  title: 'Sign In - PrimeTime',
  description: 'Log in securely to your PrimeTime streaming account.',
};

export default function LoginPage() {
  return (
    <div className="fixed inset-0 z-[200] w-full min-h-screen flex bg-[#0B0914] overflow-hidden">
      
      {/* Left Column (Form) */}
      <div className="w-full lg:w-[45%] flex flex-col justify-between px-8 sm:px-16 xl:px-24 py-10 min-h-screen overflow-y-auto custom-scrollbar">
        <div>
          <Link href="/" className="font-extrabold text-2xl tracking-tighter text-[#b28cff] block mb-16 hover:opacity-80 transition-opacity">
            PrimeTime
          </Link>
          <div className="flex justify-center xl:justify-start">
             <LoginForm />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-[10px] text-gray-500 mt-12 py-4">
          <p>© 2024 PrimeTime. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

      {/* Right Column (Cinematic) */}
      <div className="hidden lg:flex lg:w-[55%] relative flex-col justify-center p-16 xl:p-24 bg-black overflow-hidden border-l border-white/5 shadow-[-20px_0_50px_rgba(0,0,0,0.5)]">
        {/* Cinematic Background Image */}
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?q=80&w=2000&auto=format&fit=crop" 
            className="w-full h-full object-cover opacity-50 contrast-125" 
            alt="Theater"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0B0914] via-[#0B0914]/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0914] via-transparent to-transparent opacity-80" />
        </div>

        {/* Content Overlay */}
        <div className="relative z-10 max-w-2xl mt-auto pb-12">
          {/* NOW STREAMING Badge */}
          <div className="inline-flex items-center gap-2 bg-[#1a1329]/80 backdrop-blur-md border border-[#b28cff]/20 rounded-full px-4 py-1.5 mb-8 shadow-lg">
             <Sparkles size={14} className="text-[#b28cff]" />
             <span className="text-[10px] uppercase tracking-[0.2em] text-[#e2d4ff] font-bold">Now Streaming</span>
          </div>

          <h1 className="text-6xl xl:text-7xl font-bold text-white leading-[1.1] mb-6 tracking-tight drop-shadow-2xl">
            Join the<br />Luminous<br />Stage
          </h1>
          <p className="text-lg xl:text-xl text-gray-300 max-w-lg leading-relaxed drop-shadow-md">
            Experience movies as they were meant to be seen. Editorial precision meets cinematic depth in your new digital theater.
          </p>

          <div className="mt-16 flex items-center gap-12">
             {/* Members block */}
             <div className="flex items-center gap-4 bg-[#161224]/60 backdrop-blur-md px-6 py-3 rounded-2xl border border-white/5">
                <div className="flex -space-x-3 drop-shadow-md">
                   <div className="w-10 h-10 rounded-full border-2 border-[#161224] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                   </div>
                   <div className="w-10 h-10 rounded-full border-2 border-[#161224] overflow-hidden">
                     <img src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop" className="w-full h-full object-cover" />
                   </div>
                   <div className="w-10 h-10 rounded-full bg-[#2a2438] border-2 border-[#161224] flex items-center justify-center text-[10px] font-bold text-white shadow-inner">+2k</div>
                </div>
                <div>
                   <p className="text-white font-bold text-sm">Join 2,000+ members</p>
                   <p className="text-gray-400 text-[10px]">Watching PrimeTime Originals tonight</p>
                </div>
             </div>
          </div>
        </div>

        {/* Featured Card Absolute */}
        <div className="absolute bottom-10 right-10 z-10 bg-[#161224]/80 backdrop-blur-xl border border-white/5 rounded-2xl p-4 flex gap-5 pr-12 shadow-2xl hover:-translate-y-1 transition-transform cursor-pointer">
           <div className="w-14 h-20 bg-gray-800 rounded-md overflow-hidden shadow-md">
             <img src="https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=200&auto=format&fit=crop" className="w-full h-full object-cover" />
           </div>
           <div className="flex flex-col justify-center">
             <span className="text-[#b28cff] text-[10px] font-bold tracking-widest uppercase mb-1">Featured Tonight</span>
             <h4 className="text-white font-bold mb-2">The Obsidian Horizon</h4>
             <div className="flex items-center gap-2 text-xs text-gray-400">
                <span className="bg-white/10 px-1.5 py-0.5 rounded text-[10px] font-bold text-white">4K</span>
                <span>Drama • 2h 15m</span>
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
