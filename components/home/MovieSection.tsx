'use client';

import React from 'react';
import { Film, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { Movie } from '@/lib/vtagu.api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import Link from 'next/link';
import { MediaCard } from '../shared/MediaCard';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface MovieSectionProps {
  movies: Movie[];
}

const mockGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp9m8vG6P6M/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l2SpUNVz1o6n2fM-A/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5O5rG1_K/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lMvTqO9B3o0O9a/giphy.gif"
];

export default function MovieSection({ movies }: MovieSectionProps) {
  if (!movies || movies.length === 0) {
    return null;
  }
  console.log(movies);

  return (
    <section className="w-full py-16 overflow-visible">
      <div className="max-w-[95%] lg:max-w-[90%] mx-auto overflow-visible">

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
        <div className="relative group/slider overflow-visible">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            spaceBetween={30}
            slidesPerView={1.2}
            freeMode={true}
            navigation={{
              prevEl: '.movie-prev',
              nextEl: '.movie-next',
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
                <Link
                  href={`/movies/${movie.slug}`}
                  className="block"
                >
                  <MediaCard
                    variant="portrait"
                    title={movie.title}
                    image={movie.posterImage || "https://picsum.photos/seed/movie/600/900"}
                    // previewGif={mockGifs[index % mockGifs.length]}
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

          {/* Navigation */}
          <button className="movie-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <button className="movie-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
