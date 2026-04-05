'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { LayoutGrid, Zap, Heart, Smile, Sparkles, ArrowLeft, ArrowRight, Music, Clapperboard, Leaf } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

import { Genre } from '@/lib/vtagu.api';

interface MovieGenresProps {
    genres: Genre[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

const getGenreIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('action')) return <Zap className="text-cyan-400" size={32} />;
    if (n.includes('romance')) return <Heart className="text-cyan-400" size={32} />;
    if (n.includes('comedy')) return <Smile className="text-cyan-400" size={32} />;
    if (n.includes('thriller')) return <Sparkles className="text-cyan-400" size={32} />;
    if (n.includes('song') || n.includes('music')) return <Music className="text-cyan-400" size={32} />;
    if (n.includes('trailer') || n.includes('clapperboard')) return <Clapperboard className="text-cyan-400" size={32} />;
    if (n.includes('life') || n.includes('style')) return <Leaf className="text-cyan-400" size={32} />;
    return <LayoutGrid className="text-cyan-400" size={32} />;
};

export default function MovieGenres({ genres = [] }: MovieGenresProps) {
    if (!genres || genres.length === 0) return null;

    const displayGenres = genres.filter(g => g.in_home === 'Y' || !g.in_home).slice(0, 8);

    return (
        <section className="w-full py-16 bg-[#0f0a19] overflow-visible">
            <div className="max-w-[90%] mx-auto overflow-visible">

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
                <div className="relative group/slider overflow-visible">
                    <Swiper
                        modules={[Navigation, Autoplay, FreeMode]}
                        spaceBetween={30}
                        slidesPerView={1.2}
                        freeMode={true}
                        navigation={{
                            prevEl: '.genre-prev',
                            nextEl: '.genre-next',
                        }}
                        breakpoints={{
                            640: { slidesPerView: 2.2 },
                            1024: { slidesPerView: 3.5 },
                            1280: { slidesPerView: 4.5 },
                        }}
                        className="!overflow-visible"
                    >
                        {displayGenres.map((genre) => (
                            <SwiperSlide key={genre.genre_id} className="!overflow-visible">
                                <motion.div
                                    whileHover={{ y: -15, scale: 1.05 }}
                                    transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
                                    className="skeuo-card relative h-[320px] overflow-hidden cursor-pointer group border-[#1a1329] hover:border-cyan-400/40 hover:shadow-[0_40px_80px_rgba(0,0,0,0.95),0_0_40px_rgba(34,211,238,0.25)]"
                                >
                                    {/* Main Artwork with Cinematic Shimmer */}
                                    <img
                                        src={genre.path ? `${IMAGE_BASE_URL}${genre.path}` : "https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=1000&auto=format&fit=crop"}
                                        alt={genre.name}
                                        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:scale-125 group-hover:opacity-40 grayscale-[20%] group-hover:grayscale-0 brightness-75 group-hover:blur-sm"
                                    />

                                    {/* Skeuomorphic Inner Shadow */}
                                    <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none z-10" />

                                    {/* Cinematic Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0c0816] via-[#0c0816]/30 to-transparent opacity-90 z-20" />
                                    
                                    {/* Neon Glow on Hover */}
                                    <div className="absolute inset-0 bg-cyan-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-10" />

                                    {/* Content Box */}
                                    <div className="absolute inset-0 p-10 flex flex-col justify-between z-30">
                                        {/* Top: Icon pop */}
                                        <motion.div
                                            className="w-16 h-16 rounded-[1.5rem] bg-cyan-400/10 backdrop-blur-xl border border-cyan-400/20 flex items-center justify-center shadow-2xl group-hover:bg-cyan-400/30 transition-all duration-500"
                                            whileHover={{ rotate: 12, scale: 1.1 }}
                                        >
                                            <div className="group-hover:scale-110 transition-transform duration-500">
                                                {getGenreIcon(genre.name)}
                                            </div>
                                        </motion.div>

                                        {/* Bottom: Info with slide-up */}
                                        <div className="space-y-3">
                                            <p className="text-gray-400 text-[12px] font-normal uppercase tracking-[0.2em] translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500" style={{ fontFamily: 'var(--font-inter)' }}>
                                                Collection
                                            </p>
                                            <h4 
                                              className="text-2xl md:text-3xl font-semibold text-white uppercase tracking-tight group-hover:text-cyan-400 transition-colors line-clamp-2 leading-none"
                                              style={{ fontFamily: 'var(--font-poppins)' }}
                                            >
                                                {genre.name}
                                            </h4>

                                            {/* Advanced Underline Animation */}
                                            <div className="h-1.5 w-0 bg-gradient-to-r from-cyan-400 to-[#3299FF] group-hover:w-full transition-all duration-700 rounded-full shadow-[0_0_15px_rgba(34,211,238,0.5)]" />
                                        </div>
                                    </div>

                                    {/* Watermark: Kinetic Motion */}
                                    <span className="absolute -bottom-10 -right-10 text-[12rem] font-black text-white/5 select-none pointer-events-none group-hover:text-cyan-400/10 transition-all duration-1000 group-hover:rotate-12 uppercase italic leading-none">
                                        {genre.name.substring(0, 1)}
                                    </span>
                                </motion.div>
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    {/* Premium Navigation Buttons */}
                    <button className="genre-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-cyan-400 hover:text-black hover:scale-110 disabled:hidden shadow-2xl">
                        <ArrowLeft size={24} />
                    </button>
                    <button className="genre-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-14 h-14 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-500 hover:bg-cyan-400 hover:text-black hover:scale-110 disabled:hidden shadow-2xl">
                        <ArrowRight size={24} />
                    </button>
                </div>
            </div>
        </section>
    );
}