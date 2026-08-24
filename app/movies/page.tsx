import React from 'react';
import { getMovies, getPosters } from '@/lib/vtagu.api';
import { MediaCard } from '@/components/shared/MediaCard';
import Link from 'next/link';

import ListingHero from '@/components/shared/ListingHero';
import ResponsiveGrid from '@/components/shared/ResponsiveGrid';

export const metadata = {
  title: 'Movies - PrimeTime',
  description: 'Explore our curated collection of premium blockbusters and award-winning masterpieces.',
};

const IMAGE_BASE_URL = "https://www.vtagu.in/";
const resolveImageUrl = (path?: string) => {
  if (!path) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop";
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
};

export default async function MoviesPage() {
  const [movies, posters] = await Promise.all([
    getMovies(),
    getPosters("movies"),
  ]);
console.log(movies, "movies");

  let carouselItems;
  if (posters && posters.length > 0) {
    carouselItems = posters.map((poster, index) => ({
      id: poster.poster_id,
      title: poster.poster_title || "PRIME EXCLUSIVE",
      description: poster.description || "",
      image: resolveImageUrl(poster.path),
      badge: index === 0 ? "#1 Trending" : `#${index + 1} Spotlight`,
      link: poster.link,
      slug: "",
      languages: poster.languages || "",
      trailerUrl: poster.trailer_url || ""
    }));
  } else {
    carouselItems = movies.slice(0, 5).map((movie, index) => ({
      id: movie.id,
      title: movie.title,
      description: movie.shortDescription,
      image: resolveImageUrl(movie.posterImage),
      rating: movie.rating,
      year: movie.releaseYear,
      duration: movie.duration,
      slug: movie.slug,
      badge: index === 0 ? "#1 Trending" : `#${index + 1} Spotlight`,
      languages: movie.languages || ""
    }));
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">

      {/* 1. Featured Hero Carousel (60% VH) */}
      {carouselItems && carouselItems.length > 0 && (
        <ListingHero items={carouselItems} basePath="/movies" />
      )}

      {/* 2. Top 10 Grid (Our Collection) */}
      {movies.length > 0 ? (
        <section className="py-24 max-w-[90%] mx-auto">
          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-2">
              <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
                Our <span className="text-gradient">Collection</span>
              </h2>
              <div className="w-20 h-1 bg-brand-gradient rounded-full" />
            </div>
            <ResponsiveGrid gridCols={{ desktop: 5 }}>
              {movies.map((movie, index) => (
                <div key={movie.id} className="relative group">
                  <div className="relative z-10">
                    <Link href={`/movies/${movie.slug}`}>
                      <MediaCard
                        variant="portrait"
                        title={movie.title}
                        image={resolveImageUrl(movie.posterImage)}
                        rating={movie.rating}
                        year={movie.releaseYear}
                        duration={movie.duration}
                        description={movie.shortDescription}
                        badge={index < 10 ? `#${index + 1} Today` : (movie.isFree ? 'FREE' : 'PREMIUM')}
                        badgeColor={index < 10 ? 'purple' : (movie.isFree ? 'green' : 'orange')}
                        trailerUrl={movie.trailerUrl}
                        isComingSoon={movie.isComingSoon || movie.is_coming_soon}
                      />
                    </Link>
                  </div>
                </div>
              ))}
            </ResponsiveGrid>
          </div>
        </section>
      ) : (
        <section className="py-24 max-w-[90%] mx-auto min-h-[50vh] flex flex-col items-center justify-center text-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-12 max-w-lg mx-auto flex flex-col items-center gap-6 backdrop-blur-md">
            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center border border-primary/20">
              <span className="text-primary text-4xl">🎬</span>
            </div>
            <div className="space-y-3">
              <h2 className="text-2xl font-bold text-white uppercase tracking-tight">No Movies Available</h2>
              <p className="text-white/60 text-sm leading-relaxed">
                We are currently updating our cinematic collection. Please check back later for new and exciting blockbusters.
              </p>
            </div>
            <Link 
              href="/"
              className="mt-4 px-8 py-3 bg-primary hover:bg-primary/90 text-black font-black uppercase tracking-widest text-xs rounded-xl transition-all shadow-[0_0_20px_rgba(50,153,255,0.3)] hover:scale-105 active:scale-95"
            >
              Back to Home
            </Link>
          </div>
        </section>
      )}

    </main>
  );
}
