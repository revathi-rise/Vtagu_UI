import Navbar from '@/components/layout/Navbar';
import dynamic from 'next/dynamic';
const HeroSection = dynamic(() => import("@/components/home/HeroSection"))
import TrendingSection from '@/components/home/TrendingSection';
import PopularSection from '@/components/home/PopularSection';
import TopPicksSection from '@/components/home/TopPicksSection';
import Footer from '@/components/layout/Footer';
import ContinueWatching from '@/components/home/continueWatching';
import NewReleases from '@/components/home/NewRelease';
import MovieGenres from '@/components/home/MovieGenres';
import InteractiveHero from '@/components/home/InteractiveHero';


export const metadata = {
  title: 'PrimeTime - Watch TV Shows, Movies, Originals',
  description: 'Watch PrimeTime movies & TV shows online or stream right to your smart TV, game console, PC, Mac, mobile, tablet and more.',
  keywords: ['streaming', 'movies', 'tv shows', 'primetime', 'watch online'],
};

export default function Home() {
  return (
    <main className="min-h-screen bg-background-base selection:bg-primary/30">
      
      <HeroSection />
      <InteractiveHero />
      <TrendingSection />
      <NewReleases />
      <MovieGenres />
      <ContinueWatching />

    </main>
  );
}
