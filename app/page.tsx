import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
const HeroSection = dynamic(() => import("@/components/home/HeroSection"))
import EpisodicVanguard from '@/components/home/EpisodicVanguard';
import PopularSection from '@/components/home/PopularSection';
import TopPicksSection from '@/components/home/TopPicksSection';
import Footer from '@/components/layout/Footer';
import ContinueWatching from '@/components/home/continueWatching';
// import NewReleases from '@/components/home/NewRelease';
import VTAGExclusives from '@/components/home/VTAGExclusives';
import MovieGenres from '@/components/home/MovieGenres';
import InteractiveHero from '@/components/home/InteractiveHero';
import { ScrollReveal } from '@/components/home/ScrollReveal';
import { getPosters, getGenres, getSeries, getInteractiveMovies, getEpisodes } from '@/lib/vtagu.api';

export const metadata = {
  title: 'PrimeTime - Watch TV Shows, Movies, Originals',
  description: 'Watch PrimeTime movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
  keywords: ['streaming', 'movies', 'tv shows', 'primetime', 'watch online'],
};

export default async function Home() {
  const posters = await getPosters();
  const genres = await getGenres();
  const series = await getSeries();
  const interactiveMovies = await getInteractiveMovies();
  const episodes = await getEpisodes();
  
  console.log("series",series);
  console.log("interactiveMovies", interactiveMovies);
  console.log("episodes", episodes);
  
  
  return (
    <main className="snap-container bg-[#0f0a10] selection:bg-primary/30">
      
      <div className="snap-section">
        <HeroSection posters={posters} />
      </div>
      
      <div className="snap-section">
        <ScrollReveal>
          <ContinueWatching />
        </ScrollReveal>
      </div>

      <div className="snap-section">
        <ScrollReveal>
          <InteractiveHero interactiveMovies={interactiveMovies} />
        </ScrollReveal>
      </div>

      <div className="snap-section">
        <ScrollReveal>
          <EpisodicVanguard episodes={episodes} />
        </ScrollReveal>
      </div>
      <div className="snap-section">
        <ScrollReveal>
          <VTAGExclusives />
        </ScrollReveal>
      </div>

      <div className="snap-section">
        <ScrollReveal>
          <MovieGenres genres={genres} />
        </ScrollReveal>
      </div>

    </main>
  );
}
