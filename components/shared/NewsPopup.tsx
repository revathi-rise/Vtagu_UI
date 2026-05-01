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
        <div className="fixed bottom-6 right-6 z-[100] w-[380px] md:w-[420px] animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="bg-[#1a1329] border border-[#b28cff]/30 rounded-[2.5rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(146,72,255,0.15)] flex flex-col group">
                
                {/* Image Header */}
                <div className="relative h-48 overflow-hidden">
                    <Image 
                        src={latestNews.image_url || "/images/news/ai.png"} 
                        alt={latestNews.title}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1329] via-transparent to-transparent" />
                    
                    <button 
                        onClick={() => setIsVisible(false)}
                        className="absolute top-4 right-4 p-2 rounded-full bg-black/40 backdrop-blur-md text-white/70 hover:text-white transition-all border border-white/10"
                    >
                        <X size={18} />
                    </button>

                    <div className="absolute top-4 left-4">
                        <span className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-purple-600 text-white text-[10px] font-black uppercase tracking-widest border border-purple-400/30 shadow-lg">
                            <TrendingUp size={12} /> Just In
                        </span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                        <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">
                            {latestNews.category || 'Movie News'}
                        </span>
                        <div className="w-1 h-1 rounded-full bg-white/20" />
                        <span className="text-[10px] text-white/40 font-bold uppercase tracking-widest">
                            {new Date(latestNews.created_on).toLocaleDateString()}
                        </span>
                    </div>

                    <h3 className="text-xl font-bold text-white mb-3 line-clamp-2 leading-tight group-hover:text-purple-300 transition-colors">
                        {latestNews.title}
                    </h3>

                    <p className="text-sm text-gray-400 mb-6 line-clamp-2 leading-relaxed">
                        {latestNews.content}
                    </p>

                    <div className="flex items-center gap-3">
                        <Link 
                            href={`/news/${latestNews.news_id}`}
                            onClick={() => setIsVisible(false)}
                            className="flex-1 flex items-center justify-center gap-2 bg-white text-[#1a1329] font-black py-3 rounded-2xl text-xs uppercase tracking-widest hover:bg-purple-500 hover:text-white transition-all shadow-lg"
                        >
                            Read More
                            <ChevronRight size={16} />
                        </Link>
                        <Link 
                            href="/news"
                            onClick={() => setIsVisible(false)}
                            className="p-3 rounded-2xl bg-white/5 border border-white/5 hover:border-purple-500/30 text-white/60 hover:text-white transition-all"
                        >
                            <Newspaper size={20} />
                        </Link>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="px-6 py-3 bg-purple-500/10 border-t border-white/5 flex items-center justify-center">
                    <p className="text-[9px] font-bold text-purple-400 uppercase tracking-[0.2em]">
                        Daily News Updates • PrimeTime Exclusive
                    </p>
                </div>
            </div>
        </div>
    );
}
