import React from 'react';
import TitleHero from '@/components/title/TitleHero';
import EpisodeSection from '@/components/title/EpisodeSection';
import RelatedNarratives from '@/components/title/RelatedNarratives';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const title = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${title} | Episodes | PrimeTime`,
    description: `Watch the episodic journey of ${title} in 4K HDR exclusively on PrimeTime.`,
  };
}

export default async function EpisodeDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  // Mock data for a series (e.g., Lost Legends)
  const seriesData = {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    year: "2024",
    rating: "TV-MA",
    seasons: "3 Seasons",
    description: "In a world of constant change, one constant remains: the search for truth. Follow the gripping journey of a group of misfits as they unravel a conspiracy that goes deeper than anyone suspected.",
    backdropUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1920"
  };

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white">
      <TitleHero {...seriesData} />
      
      <div className="relative z-30 -mt-20">
        <EpisodeSection />
        <RelatedNarratives />
      </div>
    </main>
  );
}
