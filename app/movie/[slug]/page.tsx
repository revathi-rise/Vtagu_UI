import React from 'react';
import { notFound } from 'next/navigation';
import TitleHero from '@/components/title/TitleHero';
import RelatedNarratives from '@/components/title/RelatedNarratives';
import { getMovieBySlug } from '@/lib/vtagu.api';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
console.log(movie, "movie");

  if (!movie) {
    const title = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return {
      title: `${title} | Movie | PrimeTime`,
      description: `Watch the movie ${title} in 4K HDR only on PrimeTime.`,
    };
  }

  return {
    title: `${movie.title} | Movie | PrimeTime`,
    description: movie.shortDescription || `Watch the movie ${movie.title} in 4K HDR only on PrimeTime.`,
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  const movieData = {
    title: movie.title || slug.replace(/-/g, ' ').toUpperCase(),
    year: movie.releaseYear?.toString() || "2024",
    rating: movie.ageRestriction || "PG-13",
    description: movie.shortDescription || "",
    backdropUrl: movie.media?.image?.url || movie.posterImage || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1920",
    videoUrl: movie.videoUrl || "",
  };

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white">
      <TitleHero {...movieData} />
      
      <div className="relative z-30 -mt-20">
        <section className="py-20 tv-container px-6 md:px-12 lg:px-20">
            <div className="skeuo-surface-high p-12 lg:p-16 relative overflow-hidden group">
                {/* Surface Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-30 pointer-events-none" />
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white italic mb-10 skeuo-title-3d uppercase tracking-tight">
                        <span className="text-[#00E5FF] mr-4 opacity-50 tracking-tighter">/</span>
                        SYNOPSIS
                    </h2>
                    <div className="space-y-8 max-w-4xl">
                        <p className="text-white/70 text-xl md:text-2xl leading-relaxed font-semibold drop-shadow-md">
                            {movie.longDescription || movie.shortDescription || "No synopsis available."}
                        </p>
                        <div className="h-px w-full bg-gradient-to-r from-[#00E5FF]/30 to-transparent" />
                        <p className="text-white/50 text-base md:text-lg leading-loose italic font-medium">
                            {movie.director || (movie as any).director_name ? (
                              <>Directed by <span className="text-white font-black text-[#00E5FF]">{movie.director || (movie as any).director_name}</span>.</>
                            ) : null} {movie.actors || (movie as any).cast_name ? `Starring ${movie.actors || (movie as any).cast_name}.` : ""}
                        </p>
                    </div>
                </div>

                {/* Decorative physical corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rotate-45 translate-x-16 -translate-y-16" />
            </div>
        </section>
        
        <RelatedNarratives />
      </div>
    </main>
  );
}
