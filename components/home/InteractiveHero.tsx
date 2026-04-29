'use client';

import React from 'react';
import { LayoutGrid, Zap, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { MediaCard } from '../shared/MediaCard';
import { InteractiveMovie } from '@/lib/vtagu.api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { ArrowLeft, ArrowRight } from 'lucide-react';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface InteractiveHeroProps {
    interactiveMovies: InteractiveMovie[];
}

import { useRouter } from 'next/navigation';

export default function InteractiveGridHero({ interactiveMovies }: InteractiveHeroProps) {
    const router = useRouter();
    if (!interactiveMovies || interactiveMovies.length === 0) return null;
    console.log(interactiveMovies);

    const displayMovies = interactiveMovies;

    return (
        <section className="w-full py-10 sm:py-16 overflow-hidden">
            <div className="max-w-[90%] mx-auto">

                <div className="mb-12">
                    <SectionTitle
                        title="Interactive Spotlight"
                        subtitle="SELECT TO EXPLORE"
                        Icon={LayoutGrid}
                        gradientText="Spotlight"
                        viewAllHref="/interactive"
                    />
                </div>

                <div className="relative bg-gradient-to-br from-[#1a1125] via-[#141418] to-[#0a0a0c] rounded-2xl sm:rounded-[3rem] p-5 sm:p-8 md:p-12 border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/5">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-primary text-black px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20">
                                <Zap size={14} fill="black" />
                                Unique Story Branching
                            </div>

                            <h2 className="title-h2">
                                Interactive Core: <span className="text-gradient">Narrative Hub</span>
                            </h2>
                            <p className="title-desc">
                                Take control of the story. Your choices define the outcome in our latest interactive prototypes.
                            </p>
                        </div>

                        <button className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:text-white transition-all group/btn">
                            Live Narratives
                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="relative z-10 group/slider">
                        <Swiper
                            modules={[Navigation, Autoplay, FreeMode]}
                            spaceBetween={16}
                            slidesPerView={1.3}
                            freeMode={true}
                            navigation={{
                                prevEl: '.interactive-prev',
                                nextEl: '.interactive-next',
                            }}
                            breakpoints={{
                                480: { slidesPerView: 2.0, spaceBetween: 20 },
                                640: { slidesPerView: 2.5, spaceBetween: 24 },
                                1024: { slidesPerView: 3.5, spaceBetween: 28 },
                                1440: { slidesPerView: 4, spaceBetween: 24 },
                            }}
                            className="!px-1"
                        >
                            {displayMovies.map((movie) => (
                                <SwiperSlide key={movie.interactive_movie_id} className="!overflow-visible">
                                    <MediaCard
                                        title={movie.title}
                                        description={movie.description}
                                        image="/journey_of_ashwin.png"
                                        subtitle="Interactive"
                                        year={movie.created_at ? new Date(movie.created_at).getFullYear() : undefined}
                                        badge="USB READY"
                                        badgeColor="blue"
                                        onClick={() => router.push(`/interactive/${movie.interactive_movie_id}`)}
                                        className="cursor-pointer"
                                        variant="portrait"
                                    />
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation */}
                        <button className="interactive-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                            <ArrowLeft size={20} />
                        </button>
                        <button className="interactive-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
                            <ArrowRight size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}