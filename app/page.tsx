import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import EpisodicVanguard from '@/components/home/EpisodicVanguard';
import Footer from '@/components/layout/Footer';
import ContinueWatching from '@/components/home/continueWatching';
import InteractiveHero from '@/components/home/InteractiveHero';
import MovieSection from '@/components/home/MovieSection';
import MovieGenres from '@/components/home/MovieGenres';
import ShortsSection from '@/components/home/ShortsSection';
import { getPosters, getInteractiveMovies, getEpisodes, getMovies, getGenres, getActiveShorts } from '@/lib/vtagu.api';

const HeroSection = dynamic(() => import("@/components/home/HeroSection"))

export const metadata = {
  title: 'PrimeTime - Watch TV Shows, Movies, Originals',
  description: 'The ultimate streaming destination for premium entertainment.',
  keywords: ['streaming', 'movies', 'tv shows', 'primetime'],
};

export default async function Home() {
  // Shorts fetch runs in parallel but is non-blocking for the rest of the page
  const [posters, movies, genres, episodes, interactiveMovies, shorts] = await Promise.all([
    getPosters("home"),
    getMovies(),
    getGenres(),
    getEpisodes(),
    getInteractiveMovies(),
    getActiveShorts(8),       // limit to 8 for faster load on home page
  ]);
  
  return (
    <main className="bg-[#0f0a10] selection:bg-primary/30 min-h-screen">
      
      {/* 1. Banner */}
      <HeroSection posters={posters} movies={movies} episodes={episodes} />

      {/* 2. Shorts — high up for fast discovery */}
      <ShortsSection shorts={shorts} />

      {/* 3. Continue Watching */}
      <ContinueWatching />

      {/* 4. Movies Section */}
      <MovieSection movies={movies} />

      {/* 5. Interactive Section */}
      <InteractiveHero interactiveMovies={interactiveMovies} />
      
      {/* 6. Episodes Section */}
      <EpisodicVanguard episodes={episodes} />

      {/* 7. Genre Section */}
      <MovieGenres genres={genres} />
    </main>
  );
}
