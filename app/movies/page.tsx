import React from 'react';
import { getMovies } from '@/lib/vtagu.api';
import { MediaCard } from '@/components/shared/MediaCard';
import Link from 'next/link';

import ListingHero from '@/components/shared/ListingHero';

export const metadata = {
  title: 'Movies - PrimeTime',
  description: 'Explore our curated collection of premium blockbusters and award-winning masterpieces.',
};

export default async function MoviesPage() {
  const movies = await getMovies();

  const carouselItems = movies.slice(0, 5).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    description: movie.shortDescription,
    image: movie.posterImage || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop",
    rating: movie.rating,
    year: movie.releaseYear,
    duration: movie.duration,
    slug: movie.slug,
    badge: index === 0 ? "#1 Trending" : `#${index + 1} Spotlight`
  }));

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">

      {/* 1. Featured Hero Carousel (60% VH) */}
      <ListingHero items={carouselItems} basePath="/movies" />

      {/* 2. Top 10 Grid (Our Collection) */}
      <section className="py-24 max-w-[90%] mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
              Our <span className="text-gradient">Collection</span>
            </h2>
            <div className="w-20 h-1 bg-brand-gradient rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-16 gap-x-8">
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative group">
                <div className="relative z-10">
                  <Link href={`/movies/${movie.slug}`}>
                    <MediaCard
                      variant="portrait"
                      title={movie.title}
                      image={movie.posterImage || "https://picsum.photos/seed/movie/600/900"}
                      rating={movie.rating}
                      year={movie.releaseYear}
                      duration={movie.duration}
                      description={movie.shortDescription}
                      badge={index < 10 ? `#${index + 1} Today` : (movie.isFree ? 'FREE' : 'PREMIUM')}
                      badgeColor={index < 10 ? 'purple' : (movie.isFree ? 'green' : 'orange')}
                      trailerUrl={movie.trailerUrl}
                    />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </main>
  );
}
