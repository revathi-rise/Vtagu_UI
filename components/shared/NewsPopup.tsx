'use client';

import React, { useState, useEffect } from 'react';
import { X, ExternalLink, Newspaper, TrendingUp, ChevronRight, Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { RootState } from '@/store';
import { newsApi, NewsItem } from '@/lib/api/news.api';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsPopup() {
    const [isVisible, setIsVisible] = useState(false);
    const [latestNews, setLatestNews] = useState<NewsItem | null>(null);
    const [loading, setLoading] = useState(false);
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        // Only trigger when user becomes authenticated
        if (!isAuthenticated) {
            setIsVisible(false);
            return;
        }

        // Check session storage to prevent multiple popups in one session
        const alreadyShown = sessionStorage.getItem('newsPopupShown');
        if (alreadyShown) return;

        const fetchLatestNews = async () => {
            setLoading(true);
            try {
                const res = await newsApi.getNews();
                if (res.status && res.data.length > 0) {
                    setLatestNews(res.data[0]);
                } else {
                    // Fallback to mock news if API is empty
                    setLatestNews({
                        news_id: 1,
                        title: "PrimeTime Originals: New Content Arriving This Weekend",
                        content: "Get ready for an exclusive lineup of new movies and series. From high-octane action to heart-warming dramas, we have something for everyone.",
                        category: "Exclusives",
                        image_url: "/images/news/ai.png",
                        created_on: new Date().toISOString()
                    });
                }
                setIsVisible(true);
                sessionStorage.setItem('newsPopupShown', 'true');
            } catch (error) {
                console.error('Failed to fetch news for popup:', error);
                // Even on error, show mock news to ensure popup works
                setLatestNews({
                    news_id: 1,
                    title: "PrimeTime: The Ultimate Entertainment Destination",
                    content: "Experience the best in cinema with our curated collection of global hits and local favorites.",
                    category: "General",
                    image_url: "/images/news/ai.png",
                    created_on: new Date().toISOString()
                });
                setIsVisible(true);
                sessionStorage.setItem('newsPopupShown', 'true');
            } finally {
                setLoading(false);
            }
        };

        // Add a small delay to make the entrance feel smoother after login
        const timer = setTimeout(fetchLatestNews, 1000);
        return () => clearTimeout(timer);
    }, [isAuthenticated]);

    if (!isVisible || !latestNews) return null;

    return (
        <div 
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-500"
            onClick={() => setIsVisible(false)}
        >
            <div 
                className="relative w-[90vw] h-[90vh] max-w-[1200px] max-h-[750px] bg-[#140f21] border border-[#b28cff]/30 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_50px_rgba(146,72,255,0.2)] flex flex-col md:flex-row group animate-in zoom-in-95 duration-500"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Close Button on Modal top-right */}
                <button 
                    onClick={() => setIsVisible(false)}
                    className="absolute top-6 right-6 z-50 p-3 rounded-full bg-black/60 backdrop-blur-md text-white/70 hover:text-white transition-all border border-white/10 hover:border-purple-500/50 hover:scale-105 active:scale-95"
                >
                    <X size={20} />
                </button>

                {/* Left Side: Large Featured Image */}
                <div className="relative w-full h-[40%] md:w-[55%] md:h-full overflow-hidden">
                    <Image 
                        src={latestNews.image_url || "/images/news/ai.png"} 
                        alt={latestNews.title}
                        fill
                        priority
                        className="object-cover group-hover:scale-105 transition-transform duration-1000"
                    />
                    {/* Shadow / Gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#140f21] via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-[#140f21] z-10" />
                    
                    {/* Just In badge */}
                    <div className="absolute top-6 left-6 z-20">
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-purple-600 text-white text-xs font-black uppercase tracking-widest border border-purple-400/30 shadow-lg animate-pulse">
                            <TrendingUp size={14} /> Just In
                        </span>
                    </div>
                </div>

                {/* Right Side: News Content */}
                <div className="w-full h-[60%] md:w-[45%] md:h-full p-6 md:p-10 flex flex-col justify-between overflow-y-auto bg-[#140f21]/95 relative z-20">
                    <div className="flex flex-col">
                        {/* Meta Category and Date */}
                        <div className="flex items-center gap-2.5 mb-4">
                            <span className="text-xs font-black text-purple-400 uppercase tracking-widest bg-purple-500/10 px-3 py-1 rounded-md border border-purple-500/20">
                                {latestNews.category || 'Movie News'}
                            </span>
                            <div className="w-1.5 h-1.5 rounded-full bg-white/20" />
                            <span className="text-xs text-white/40 font-bold uppercase tracking-widest">
                                {new Date(latestNews.created_on).toLocaleDateString()}
                            </span>
                        </div>

                        {/* Title */}
                        <h3 className="text-2xl md:text-3xl font-black text-white mb-4 leading-tight group-hover:text-purple-300 transition-colors">
                            {latestNews.title}
                        </h3>

                        {/* Divider */}
                        <div className="h-[1px] w-12 bg-purple-500/50 mb-6" />

                        {/* Description content */}
                        <p className="text-sm md:text-base text-gray-300 leading-relaxed font-medium mb-6 whitespace-pre-line">
                            {latestNews.content}
                        </p>
                    </div>

                    {/* CTAs */}
                    <div className="flex flex-col gap-4 mt-auto pt-6 border-t border-white/5">
                        <div className="flex items-center gap-3">
                            <Link 
                                href={`/news/${latestNews.news_id}`}
                                onClick={() => setIsVisible(false)}
                                className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1a1329] font-black py-4 rounded-2xl text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-lg active:scale-95"
                            >
                                Read More
                                <ChevronRight size={18} />
                            </Link>
                            <Link 
                                href="/news"
                                onClick={() => setIsVisible(false)}
                                className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 text-white/60 hover:text-white transition-all hover:bg-white/10"
                            >
                                <Newspaper size={22} />
                            </Link>
                        </div>
                        
                        {/* Footer text */}
                        <div className="text-center pt-2">
                            <p className="text-[10px] font-black text-purple-400/70 uppercase tracking-[0.25em]">
                                Daily News Updates • PrimeTime Exclusive
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
