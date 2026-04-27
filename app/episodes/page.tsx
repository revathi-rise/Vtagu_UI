import React from 'react';
import { getEpisodes } from '@/lib/vtagu.api';
import { MediaCard } from '@/components/shared/MediaCard';
import Link from 'next/link';

import ListingHero from '@/components/shared/ListingHero';

export const metadata = {
  title: 'Episodes - PrimeTime',
  description: 'Catch up on the latest episodes of your favorite originals and series.',
};

export default async function EpisodesPage() {
  const episodes = await getEpisodes();

  const carouselItems = episodes.slice(0, 5).map((episode, index) => ({
    id: episode.episodeId,
    title: episode.title,
    description: "Experience the latest installment of this epic journey. Every choice matters, every moment counts. Watch now in stunning high definition.",
    image: episode.image && typeof episode.image === 'string' ? episode.image : "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2000&auto=format&fit=crop",
    rating: 4.8,
    year: 2024,
    duration: `S${episode.seasonId} EP`,
    slug: episode.episodeId.toString(),
    badge: index === 0 ? "New Episode" : "Featured"
  }));

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">

      {/* 1. Featured Hero Carousel (60% VH) */}
      <ListingHero items={carouselItems} basePath="/episodes" />

      {/* 2. Episodes Grid */}
      <section className="py-24 max-w-[90%] mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
              Latest <span className="text-gradient">Episodes</span>
            </h2>
            <div className="w-20 h-1 bg-brand-gradient rounded-full" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-y-16 gap-x-8">
            {episodes.map((episode, index) => (
              <div key={episode.episodeId} className="relative group">


                <div className="relative z-10">
                  <Link href={`/episodes/${episode.episodeId}`}>
                    <MediaCard
                      variant="portrait"
                      title={episode.title}
                      image={episode.image && typeof episode.image === 'string' ? episode.image : "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop"}
                      rating={4.8}
                      year={2024}
                      duration={`S${episode.seasonId} EP`}
                      description={`A thrilling new episode in the series. Watch now to continue the journey.`}
                      badge={index < 10 ? `#${index + 1} Today` : `S${episode.seasonId}`}
                      badgeColor={index < 10 ? 'purple' : 'blue'}
                    // trailerUrl={null}
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
