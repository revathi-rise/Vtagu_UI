'use client';

import React, { useEffect, useState } from 'react';
import { History, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { MediaCard } from '../shared/MediaCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { useWatchProgress } from '@/hooks/useWatchProgress';
import Shimmer from '@/components/shared/Shimmer';
import { getUserId } from '@/lib/api-client';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

export default function ContinueWatching() {
    const [userId, setUserId] = useState<string | null>(null);
    const { watchList, isLoading, fetchUserWatchList } = useWatchProgress({ userId: userId || undefined });

    useEffect(() => {
        // Get user ID reliably
        const id = getUserId();
        if (id) {
            setUserId(id);
        }
    }, []);

    useEffect(() => {
        if (userId) {
            fetchUserWatchList();
        }
    }, [userId, fetchUserWatchList]);

    // Use watch list from API if available and not empty
    const movies = watchList && watchList.length > 0 
        ? watchList.map((item, index) => ({
            id: item.contentId,
            title: item.content?.title || `Content ${item.contentId}`,
            genre: item.contentType === 'movie' ? 'Movie' : 'Episode',
            progress: item.progressPercentage || 0,
            duration: item.watchedDuration ? `${Math.floor(item.watchedDuration / 60)}m watched` : "Not started",
            rating: "9.0",
            description: item.content?.title || `Continue watching ${item.contentType}`,
            image: item.content?.movie_image || "https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=800&auto=format&fit=crop"
        }))
        : [];

    // Hide section if no movies are found and not loading
    if (!isLoading && movies.length === 0) {
        return null;
    }


    return (
        <section className="w-full py-10 sm:py-16 overflow-hidden">
            <div className="max-w-[90%] mx-auto">
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
                    <div className="relative group/slider -mx-4 sm:mx-0">
                        <Swiper
                            modules={[Navigation, Autoplay, FreeMode]}
                            spaceBetween={16}
                            slidesPerView={1.3}
                            freeMode={true}
                            navigation={{
                                prevEl: '.continue-prev',
                                nextEl: '.continue-next',
                            }}
                            breakpoints={{
                                480: { slidesPerView: 1.8, spaceBetween: 20 },
                                640: { slidesPerView: 2.2, spaceBetween: 24 },
                                1024: { slidesPerView: 3.2, spaceBetween: 28 },
                                1440: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                            className="!px-4"
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