'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { getUserId } from '@/lib/api-client';

export default function NewsPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [timeLeft, setTimeLeft] = useState(30);

    useEffect(() => {
        const userId = getUserId();
        
        // Only show if user is logged in
        if (!userId) return;

        // Check if already shown in this session to avoid annoying the user
        const alreadyShown = sessionStorage.getItem('newsPopupShown');
        if (alreadyShown) return;

        // Show the popup
        setIsVisible(true);
        sessionStorage.setItem('newsPopupShown', 'true');

        // Countdown timer for 30 seconds
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    setIsVisible(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-6 right-6 z-[100] w-[350px] md:w-[400px] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-[#1a1329] border border-[#b28cff]/30 rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(146,72,255,0.2)] flex flex-col">
                
                {/* Header */}
                <div className="px-5 py-4 bg-gradient-to-r from-[#b28cff]/20 to-transparent flex items-center justify-between border-b border-white/5">
                    <div className="flex items-center gap-3">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/70">Flash News</span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-[10px] font-bold text-[#b28cff]">Closing in {timeLeft}s</span>
                        <button 
                            onClick={() => setIsVisible(false)}
                            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white transition-all border border-white/5"
                        >
                            <X size={14} />
                        </button>
                    </div>
                </div>

                {/* Content - Static News Iframe */}
                <div className="relative aspect-video bg-black/40">
                    <iframe 
                        src="https://www.google.com/search?q=movie+news&igu=1" 
                        className="w-full h-full border-0 grayscale hover:grayscale-0 transition-all duration-700"
                        title="News Update"
                    />
                    
                    {/* Overlay to handle clicks if needed or just styling */}
                    <div className="absolute inset-0 pointer-events-none border-inset border border-white/5 shadow-inner" />
                </div>

                {/* Footer Info */}
                <div className="p-4 flex items-center justify-between">
                    <div className="flex flex-col">
                        <span className="text-xs font-bold text-white tracking-tight">Stay updated with PrimeTime</span>
                        <span className="text-[9px] text-white/40 uppercase tracking-widest font-medium">New releases every week</span>
                    </div>
                    <a 
                        href="/browse" 
                        className="flex items-center gap-2 bg-[#b28cff] hover:bg-white text-[#1a1329] px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all shadow-lg"
                    >
                        Learn More
                        <ExternalLink size={12} />
                    </a>
                </div>
            </div>
        </div>
    );
}
