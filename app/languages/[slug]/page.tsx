import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Video } from 'lucide-react';
import { getMoviesByLanguage } from '@/lib/vtagu.api';
import ListingHero from '@/components/shared/ListingHero';
import ResponsiveGrid from '@/components/shared/ResponsiveGrid';
import { MediaCard } from '@/components/shared/MediaCard';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const capitalized = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${capitalized} Movies - VTAGU PrimeTime`,
    description: `Watch high-quality ${capitalized} blockbusters, web series, and exclusive content in 4K HDR only on VTAGU PrimeTime.`,
    keywords: [slug, `${slug} movies`, 'streaming', 'primetime', capitalized],
  };
}

export default async function LanguageMoviesPage({ params }: PageProps) {
  const { slug } = await params;
  const { language, movies } = await getMoviesByLanguage(slug);

  const displayLanguage = language || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Sleek empty state fallback when no movies are mapped to this language
  if (!movies || movies.length === 0) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Soft Background Neon Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gradient rounded-full opacity-10 blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center p-8 rounded-3xl glass-morphism border border-white/5 shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner animate-pulse">
            <Video size={40} className="text-primary drop-shadow-[0_0_10px_rgba(50,153,255,0.6)]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            No Movies in <span className="text-gradient">{displayLanguage}</span>
          </h1>
          <p className="text-white/50 leading-relaxed text-sm mb-10 font-medium">
            Our curators are working round the clock to catalog amazing blockbuster titles for this language. Check back shortly!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/"
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Home size={14} /> Back Home
            </Link>
            <Link
              href="/movies"
              className="flex-1 bg-brand-gradient text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_20px_rgba(146,72,255,0.4)]"
            >
              Browse All <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Slice first 5 movies for the ListingHero banner carousel
  const carouselItems = movies.slice(0, 5).map((movie, index) => ({
    id: movie.id,
    title: movie.title,
    description: movie.shortDescription,
    image: movie.posterImage || "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop",
    rating: movie.rating || "8.5",
    year: movie.releaseYear,
    duration: movie.duration,
    slug: movie.slug,
    badge: index === 0 ? `Featured ${displayLanguage}` : `Trending in ${displayLanguage}`
  }));

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative">
      {/* Dynamic Cinematic Hero Carousel */}
      <ListingHero items={carouselItems} basePath="/movies" />

      {/* Grid Section of Movies */}
      <section className="py-24 max-w-[90%] mx-auto relative z-20">
        <div className="flex flex-col gap-12">
          {/* Header */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs font-black tracking-widest text-primary uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(50,153,255,0.8)]" />
              Language Showcase
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter uppercase drop-shadow-lg">
              {displayLanguage} <span className="text-gradient">Collection</span>
            </h2>
            <div className="w-24 h-1.5 bg-brand-gradient rounded-full mt-1 shadow-[0_1px_10px_rgba(146,72,255,0.4)]" />
          </div>

          {/* Dynamic Grid Layout */}
          <ResponsiveGrid gridCols={{ desktop: 5 }}>
            {movies.map((movie, index) => (
              <div key={movie.id} className="relative group">
                <Link href={`/movies/${movie.slug}`}>
                  <MediaCard
                    variant="portrait"
                    title={movie.title}
                    image={movie.posterImage || "https://picsum.photos/seed/movie/600/900"}
                    rating={movie.rating || "8.5"}
                    year={movie.releaseYear}
                    duration={movie.duration}
                    description={movie.shortDescription}
                    badge={movie.isFree ? 'FREE' : 'PREMIUM'}
                    badgeColor={movie.isFree ? 'green' : 'orange'}
                    trailerUrl={movie.trailerUrl}
                  />
                </Link>
              </div>
            ))}
          </ResponsiveGrid>
        </div>
      </section>

      {/* Ambient background glow near grid */}
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-brand-gradient rounded-full opacity-[0.03] blur-[180px] pointer-events-none" />
    </main>
  );
}
