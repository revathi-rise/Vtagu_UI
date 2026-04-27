'use client';

import React, { useEffect, useState } from 'react';
import { History, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { MediaCard } from '../shared/MediaCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import Shimmer from '@/components/shared/Shimmer';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const mockImages = [
    "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop"
];

// Fallback mock data if API is not available
const FALLBACK_CONTINUE_MOVIES = [
    {
        id: 1,
        title: "The Cosmic Voyager",
        genre: "Sci-Fi",
        progress: 65,
        duration: "45m left",
        rating: "9.8",
        description: "A deep-space expedition encounters an anomaly that challenges their understanding of time.",
        image: "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 2,
        title: "Midnight Echoes",
        genre: "Thriller",
        progress: 20,
        duration: "1h 20m left",
        rating: "8.5",
        description: "In a quiet town where nothing ever happens, a series of mysterious signals reveals dark secrets.",
        image: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 3,
        title: "Neon Jungle",
        genre: "Action",
        progress: 90,
        duration: "12m left",
        rating: "9.2",
        description: "A futuristic mercenary must navigate the underworld of a cybernetic mega-city.",
        image: "https://images.unsplash.com/photo-1506466010722-395aa2bef877?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 4,
        title: "Desert Mirage",
        genre: "Adventure",
        progress: 45,
        duration: "1h 10m left",
        rating: "8.9",
        description: "Two explorers find an ancient map leading to a legendary oasis hidden in the shifting sands.",
        image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?q=80&w=800&auto=format&fit=crop"
    },
    {
        id: 5,
        title: "Arctic Silence",
        genre: "Documentary",
        progress: 10,
        duration: "1h 45m left",
        rating: "9.5",
        description: "Explore the vast, untouched wilderness of the Arctic and the creatures that call it home.",
        image: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=800&auto=format&fit=crop"
    }
];

export default function ContinueWatching() {
    const [userId, setUserId] = useState<string | null>(null);
    const { watchList, isLoading } = useWatchProgress({ userId: userId || undefined });

    useEffect(() => {
        // Get user ID from localStorage
        const storedUserId = localStorage.getItem('userId');
        if (storedUserId) {
            setUserId(storedUserId);
        }
    }, []);

    // Use watch list from API if available and not empty, otherwise use fallback
    const movies = watchList && watchList.length > 0 
        ? watchList.map((item, index) => ({
            id: item.contentId,
            title: item.contentId, // This should be replaced with actual title from your content API
            genre: item.contentType === 'movie' ? 'Movie' : 'Episode',
            progress: item.progress || 0,
            duration: item.currentTime ? `${Math.floor(item.currentTime / 60)}m watched` : "Not started",
            rating: "9.0",
            description: item.contentId,
            image: mockImages[index % mockImages.length]
        }))
        : FALLBACK_CONTINUE_MOVIES;

    return (
        <section className="w-full py-16 overflow-visible">
            <div className="max-w-[94%] mx-auto overflow-visible">
                <div className="flex items-center justify-between mb-10 px-4">
                    <SectionTitle
                        title="Continue "
                        subtitle="CONTINUE"
                        Icon={History}
                        gradientText="Watching"
                        viewAllHref="/watch-history"
                    />
                </div>

                {isLoading ? (
                    // Loading skeleton
                    <div className="relative group/slider overflow-visible">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 px-4">
                            {Array.from({ length: 4 }).map((_, i) => (
                                <Shimmer key={i} className="h-56" />
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="relative group/slider overflow-visible">
                        <Swiper
                            modules={[Navigation, Autoplay, FreeMode]}
                            spaceBetween={24}
                            slidesPerView={1.2}
                            freeMode={true}
                            navigation={{
                                prevEl: '.continue-prev',
                                nextEl: '.continue-next',
                            }}
                            breakpoints={{
                                640: { slidesPerView: 2.2 },
                                1024: { slidesPerView: 3.2 },
                                1440: { slidesPerView: 4 },
                            }}
                            className="!overflow-visible !px-4"
                        >
                            {movies.map((movie, index) => (
                                <SwiperSlide key={movie.id} className="!overflow-visible">
                                    <MediaCard
                                        variant="landscape"
                                        title={movie.title}
                                        image={movie.image}
                                        subtitle={movie.genre}
                                        duration={movie.duration}
                                        rating={movie.rating}
                                        progress={movie.progress}
                                        description={movie.description}
                                        badge={`${Math.round(movie.progress)}%`}
                                        badgeColor="blue"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation */}
                        <button className="continue-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="continue-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}