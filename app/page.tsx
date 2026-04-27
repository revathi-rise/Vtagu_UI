import dynamic from 'next/dynamic';
import EpisodicVanguard from '@/components/home/EpisodicVanguard';
import Footer from '@/components/layout/Footer';
import ContinueWatching from '@/components/home/continueWatching';
import InteractiveHero from '@/components/home/InteractiveHero';
import MovieSection from '@/components/home/MovieSection';
import MovieGenres from '@/components/home/MovieGenres';
import { getPosters, getInteractiveMovies, getEpisodes, getMovies, getGenres } from '@/lib/vtagu.api';

const HeroSection = dynamic(() => import("@/components/home/HeroSection"))

export const metadata = {
  title: 'PrimeTime - Watch TV Shows, Movies, Originals',
  description: 'The ultimate streaming destination for premium entertainment.',
  keywords: ['streaming', 'movies', 'tv shows', 'primetime'],
};

export default async function Home() {
  const [posters, interactiveMovies, episodes, movies, genres] = await Promise.all([
    getPosters(),
    getInteractiveMovies(),
    getEpisodes(),
    getMovies(),
    getGenres(),
  ]);
  return (
    <main className="bg-[#0f0a10] selection:bg-primary/30 min-h-screen">
      
      {/* 1. Banner */}
      <HeroSection posters={posters} />
      
      {/* 2. Continue Watching */}
      <ContinueWatching />

      {/* 3. Movies Section */}
      <MovieSection movies={movies} />
      
      {/* 4. Interactive Section */}
      <InteractiveHero interactiveMovies={interactiveMovies} />
      
      {/* 5. Episodes Section */}
      <EpisodicVanguard episodes={episodes} />

      {/* 6. Genre Section */}
      <MovieGenres genres={genres} />
    </main>
  );
}
