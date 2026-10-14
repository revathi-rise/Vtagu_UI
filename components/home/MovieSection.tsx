'use client';

import React, { useState, useEffect } from 'react';
import { Film } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { Movie, getBadgeText, isKidsProfileActive, isContentKidsApproved, isContentKidsOnly } from '@/lib/vtagu.api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import Link from 'next/link';
import { MediaCard } from '../shared/MediaCard';

import 'swiper/css';
import 'swiper/css/free-mode';

interface MovieSectionProps {
  movies: Movie[];
}

export default function MovieSection({ movies }: MovieSectionProps) {
  const [isKids, setIsKids] = useState(false);

  useEffect(() => {
    setIsKids(isKidsProfileActive());
    const onProfileChange = () => setIsKids(isKidsProfileActive());
    window.addEventListener('profileChanged', onProfileChange);
    return () => window.removeEventListener('profileChanged', onProfileChange);
  }, []);

  // Filter: In normal mode, show general movies + kids movies approved for normal mode (exclude kids_only)
  // In Kids mode, show ONLY kids-approved content
  const visibleMovies = isKids 
    ? (movies || []).filter(isContentKidsApproved) 
    : (movies || []).filter(m => !isContentKidsOnly(m));

  if (!visibleMovies || visibleMovies.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-16 overflow-hidden">
      <div className="max-w-[90%] mx-auto">

        {/* Section Header */}
        <div className="flex items-center justify-between mb-8 sm:mb-10 px-4 sm:px-0">
          <SectionTitle
            title={isKids ? "KIDS " : "CINEMATIC "}
            subtitle={isKids ? "Fun & Animated Adventures" : "Trending Feature Films"}
            Icon={Film}
            gradientText="MOVIES"
            viewAllHref="/movies"
          />
        </div>

        {/* Adaptive Layout: For 1-3 items, render featured width cards instead of an empty carousel */}
        {visibleMovies.length <= 3 ? (
          <div className="flex flex-wrap items-stretch justify-start gap-6 sm:gap-8 px-4 sm:px-0">
            {visibleMovies.map((movie) => (
              <div key={movie.id} className="w-[240px] sm:w-[270px] md:w-[300px]">
                <Link
                  href={`/movies/${movie.slug}`}
                  className="block h-full"
                >
                  <MediaCard
                    variant="portrait"
                    title={movie.title}
                    image={movie.posterImage || "https://picsum.photos/seed/movie/600/900"}
                    trailerUrl={movie.trailerUrl}
                    isComingSoon={movie.isComingSoon || movie.is_coming_soon}
                    rating={movie.rating}
                    duration={movie.duration}
                    year={movie.releaseYear}
                    description={movie.shortDescription}
                    badge={getBadgeText(movie) || undefined}
                    badgeColor={movie.isFree ? 'green' : 'orange'}
                    infoLabel="MOVIE"
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          /* Swiper Carousel for 4+ items */
          <div className="relative group/slider -mx-4 sm:mx-0">
            <Swiper
              modules={[Autoplay, FreeMode]}
              spaceBetween={20}
              slidesPerView={1.5}
              freeMode={true}
              breakpoints={{
                480: { slidesPerView: 2.2, spaceBetween: 20 },
                640: { slidesPerView: 2.5, spaceBetween: 24 },
                1024: { slidesPerView: 3.5, spaceBetween: 28 },
                1440: { slidesPerView: 4.2, spaceBetween: 30 },
              }}
              className="!px-4 !py-6 -my-6"
            >
              {visibleMovies.map((movie) => (
                <SwiperSlide key={movie.id} className="!overflow-visible">
                  <Link
                    href={`/movies/${movie.slug}`}
                    className="block"
                  >
                    <MediaCard
                      variant="portrait"
                      title={movie.title}
                      image={movie.posterImage || "https://picsum.photos/seed/movie/600/900"}
                      trailerUrl={movie.trailerUrl}
                      isComingSoon={movie.isComingSoon || movie.is_coming_soon}
                      rating={movie.rating}
                      duration={movie.duration}
                      year={movie.releaseYear}
                      description={movie.shortDescription}
                      badge={getBadgeText(movie) || undefined}
                      badgeColor={movie.isFree ? 'green' : 'orange'}
                      infoLabel="MOVIE"
                    />
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        )}
      </div>
    </section>
  );
}
