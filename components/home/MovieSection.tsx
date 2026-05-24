'use client';

import React from 'react';
import { Film } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { Movie } from '@/lib/vtagu.api';
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
  console.log(movies);
  
  if (!movies || movies.length === 0) {
    return null;
  }
  console.log(movies);

  return (
    <section className="w-full py-10 sm:py-16 overflow-hidden">
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-4">
          <SectionTitle
            title="CINEMATIC "
            subtitle="Trending Movies"
            Icon={Film}
            gradientText="MOVIES"
            viewAllHref="/movies"
          />
        </div>

        {/* Carousel Container */}
        <div className="relative group/slider -mx-4 sm:mx-0">
          <Swiper
            modules={[Autoplay, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.5}
            freeMode={true}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 20 },
              640: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 3.5, spaceBetween: 28 },
              1440: { slidesPerView: 4, spaceBetween: 30 },
            }}
            className="!px-4 !py-6 -my-6"
          >
            {movies.map((movie, index) => (
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
                    rating={movie.rating}
                    duration={movie.duration}
                    year={movie.releaseYear}
                    description={movie.shortDescription}
                    badge={movie.isFree ? 'FREE' : 'PREMIUM'}
                    badgeColor={movie.isFree ? 'green' : 'orange'}
                    infoLabel="MOVIE" // Explicitly setting MOVIE label
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
