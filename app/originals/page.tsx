import HeroSection from "./components/HeroSection";
import Carousel from "./components/Carousel";
import FeaturedCard from "./components/FeaturedCard";
import ComingSoonCard from "./components/ComingSoonCard";

export const metadata = {
  title: 'PrimeTime Originals',
  description: 'Discover groundbreaking, exclusive Original stories and interactive cinematic branches found nowhere else.',
};

export default function OriginalsPage() {
  return (
    <main className="min-h-screen bg-brand-900 text-white">
      <HeroSection />
      <Carousel />
      <FeaturedCard />
      <ComingSoonCard />
    </main>
  );
}