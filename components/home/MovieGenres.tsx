'use client';

import React from 'react';
import { LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { GenreCard } from '../shared/GenreCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { Genre } from '@/lib/vtagu.api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface MovieGenresProps {
    genres: Genre[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

// Special glow colors for different genres
const GENRE_COLORS: Record<string, string> = {
    "Action": "rgba(239, 68, 68, 0.4)", // Red
    "Comedy": "rgba(234, 179, 8, 0.4)",  // Yellow
    "Drama": "rgba(59, 130, 246, 0.4)",   // Blue
    "Romance": "rgba(236, 72, 153, 0.4)", // Pink
    "Horror": "rgba(168, 85, 247, 0.4)",  // Purple
    "Sci-Fi": "rgba(34, 211, 238, 0.4)",  // Cyan
    "Thriller": "rgba(249, 115, 22, 0.4)", // Orange
};

export default function MovieGenres({ genres = [] }: MovieGenresProps) {
    if (!genres || genres.length === 0) return null;

    const displayGenres = genres.filter(g => g.in_home === 'Y' || !g.in_home).slice(0, 12);

    return (
        <section className="w-full py-10 sm:py-16 overflow-hidden">
            <div className="max-w-[90%] mx-auto">

                {/* Section Header */}
                <div className="mb-12">
                    <SectionTitle
                        title="Browse by Genre"
                        subtitle="Explore Categories"
                        Icon={LayoutGrid}
                        gradientText="Genre"
                        viewAllHref="/genres"
                    />
                </div>

                {/* Genre Slider */}
                <div className="relative group/slider -mx-4 sm:mx-0">
                    <Swiper
                        modules={[Navigation, Autoplay, FreeMode]}
                        spaceBetween={16}
                        slidesPerView={1.5}
                        freeMode={true}
                        navigation={{
                            prevEl: '.genre-prev',
                            nextEl: '.genre-next',
                        }}
                        breakpoints={{
                            480: { slidesPerView: 2.2, spaceBetween: 20 },
                            640: { slidesPerView: 2.5, spaceBetween: 24 },
                            1024: { slidesPerView: 3.5, spaceBetween: 28 },
                            1440: { slidesPerView: 4, spaceBetween: 30 },
                        }}
                        className="!px-4 !py-6 -my-6"
                    >
                        {displayGenres.map((genre) => (
                            <SwiperSlide key={genre.genre_id} className="!overflow-visible">
                                <GenreCard
                                    title={genre.name}
                                    image={genre.path ? `${IMAGE_BASE_URL}${genre.path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"}
                                    color={GENRE_COLORS[genre.name] || "rgba(168, 85, 247, 0.4)"}
                                />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Navigation */}
                    <button className="genre-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                        <ArrowLeft size={20} />
                    </button>
                    <button className="genre-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                        <ArrowRight size={20} />
                    </button>
                </div>
            </div>
        </section>
    );
}