"use client";
import React, { useEffect, useState } from 'react';
import { newsApi, NewsItem } from '@/lib/api/news.api';
import { Loader2, Calendar, Tag, ChevronRight, Share2, TrendingUp, Newspaper } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    const fetchNews = async () => {
      const res = await newsApi.getNews();
      if (res.status && res.data.length > 0) {
        setNews(res.data);
      } else {
        // Mock data if API is empty
        setNews([
          {
            news_id: 1,
            title: "Global Economy Shows Resilience Amid Shifts",
            content: "The global economic landscape is undergoing significant changes as major markets adapt to new trade policies and technological advancements. Analysts predict a steady growth path for the coming quarters...",
            category: "Economy",
            image_url: "/images/news/economy.png",
            created_on: new Date().toISOString()
          },
          {
            news_id: 2,
            title: "AI Breakthroughs: The Next Frontier in Computing",
            content: "Recent developments in generative AI and neural processing units are set to redefine how we interact with technology. From autonomous systems to personalized healthcare, the possibilities are expanding...",
            category: "AI & Tech",
            image_url: "/images/news/ai.png",
            created_on: new Date().toISOString()
          },
          {
            news_id: 3,
            title: "Climate Action: New Strategies for a Greener Future",
            content: "World leaders and environmental experts are converging on new frameworks to accelerate the transition to renewable energy. Innovation in carbon capture and sustainable agriculture takes center stage...",
            category: "Climate",
            image_url: "/images/news/climate.png",
            created_on: new Date().toISOString()
          }
        ]);
      }
      setLoading(false);
    };
    fetchNews();
  }, []);

  const categories = ['All', ...Array.from(new Set(news.map(item => item.category || 'General')))];
  const filteredNews = activeCategory === 'All' ? news : news.filter(item => (item.category || 'General') === activeCategory);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0914] text-white pb-20">
      {/* Hero Section */}
      <section className="relative h-[60vh] flex items-end pb-12 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image 
            src={news[0]?.image_url || "/images/news/ai.png"} 
            alt="Featured News" 
            fill 
            className="object-cover opacity-40 scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0914] via-[#0B0914]/60 to-transparent" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs font-bold uppercase tracking-widest mb-4 border border-purple-500/30">
              <TrendingUp size={14} /> Featured Story
            </span>
            <h1 className="text-5xl md:text-7xl font-black mb-6 tracking-tight leading-tight">
              {news[0]?.title}
            </h1>
            <p className="text-gray-400 text-lg mb-8 line-clamp-2 max-w-2xl leading-relaxed">
              {news[0]?.content}
            </p>
            <Link 
              href={`/news/${news[0]?.news_id}`}
              className="inline-flex items-center gap-2 bg-white text-black font-bold px-8 py-4 rounded-2xl hover:bg-purple-500 hover:text-white transition-all transform hover:-translate-y-1"
            >
              Read Full Article <ChevronRight size={20} />
            </Link>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-6 -mt-10 relative z-20">
        {/* Category Filters */}
        <div className="flex items-center gap-3 mb-12 overflow-x-auto pb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl font-bold transition-all whitespace-nowrap border ${
                activeCategory === cat 
                  ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20' 
                  : 'bg-[#161224] border-white/5 text-gray-400 hover:border-purple-500/50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* News Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredNews.map((item, idx) => (
            <article 
              key={item.news_id} 
              className="group bg-[#161224] rounded-[2rem] overflow-hidden border border-white/5 hover:border-purple-500/30 transition-all hover:shadow-2xl hover:shadow-purple-500/10"
            >
              <div className="relative h-64 overflow-hidden">
                <Image 
                  src={item.image_url || "/images/news/ai.png"} 
                  alt={item.title} 
                  fill 
                  className="object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[10px] font-bold uppercase tracking-widest border border-white/10">
                    {item.category || 'General'}
                  </span>
                </div>
              </div>
              
              <div className="p-8">
                <div className="flex items-center gap-4 text-gray-500 text-xs mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.created_on).toLocaleDateString()}</span>
                  <span className="flex items-center gap-1.5"><Newspaper size={14} /> 5 min read</span>
                </div>
                
                <h3 className="text-2xl font-bold mb-4 group-hover:text-purple-400 transition-colors line-clamp-2 leading-snug">
                  {item.title}
                </h3>
                
                <p className="text-gray-400 text-sm mb-8 line-clamp-3 leading-relaxed">
                  {item.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <Link 
                    href={`/news/${item.news_id}`}
                    className="flex items-center gap-2 text-white font-bold hover:gap-3 transition-all"
                  >
                    Read More <ChevronRight size={18} className="text-purple-500" />
                  </Link>
                  <button className="p-2 rounded-full bg-white/5 hover:bg-purple-500/20 text-gray-400 hover:text-purple-400 transition-all">
                    <Share2 size={18} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
