import React from 'react';
import { getEpisodes, getPosters } from '@/lib/vtagu.api';
import { MediaCard } from '@/components/shared/MediaCard';
import Link from 'next/link';

import ListingHero from '@/components/shared/ListingHero';
import ResponsiveGrid from '@/components/shared/ResponsiveGrid';

export const metadata = {
  title: 'Web Series - PrimeTime',
  description: 'Catch up on the latest web series and episodes of your favorite originals.',
};

const IMAGE_BASE_URL = "https://www.vtagu.in/";

const resolveImageUrl = (path: any) => {
  if (!path || typeof path !== 'string') return null;
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
};

export default async function EpisodesPage() {
  const [episodesResult, posters] = await Promise.all([
    getEpisodes(),
    getPosters("series"),
  ]);

  let episodes = Array.isArray(episodesResult) ? episodesResult : [];

  const postersData = Array.isArray(posters) ? posters : (posters as any)?.data || [];

  let carouselItems;
  // If the posters API returns any data, use only the API response for the banner
  if (postersData && postersData.length > 0) {
    carouselItems = postersData.map((poster: any, index: number) => ({
      id: poster.poster_id,
      title: poster.poster_title || "PRIME EXCLUSIVE",
      description: poster.description || "",
      image: resolveImageUrl(poster.path) || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2000&auto=format&fit=crop",
      badge: index === 0 ? "New Episode" : "Featured",
      link: poster.link,
      slug: "",
      languages: poster.languages || ""
    }));
  } else {
    // If the data is an empty array, fall back and show the existing episodes logic
    carouselItems = episodes
      .slice(0, 5)
      .filter((ep): ep is NonNullable<typeof ep> => ep !== null && ep !== undefined)
      .map((episode, index) => {
        const epId = episode.id || episode.episodeId || index;
        const epSlug = epId?.toString();
        const epSeason = episode.season_id || episode.seasonId || 1;
        const rawImage = episode.media?.poster_image?.url || episode.image;
        const epImage = resolveImageUrl(rawImage) || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=2000&auto=format&fit=crop";

        return {
          id: epId,
          title: episode.title || `Episode ${index + 1}`,
          description: episode.shortDescription || "Experience the latest installment of this epic journey. Every choice matters, every moment counts. Watch now in stunning high definition.",
          image: epImage,
          rating: episode.rating || 4.8,
          year: episode.createdAt ? new Date(episode.createdAt).getFullYear() : 2024,
          duration: `S${epSeason} EP`,
          slug: epSlug,
          badge: episode.isFeatured ? "Featured" : (index === 0 ? "New Episode" : "Featured"),
          languages: episode.languages || ""
        };
      });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30">

      {/* 1. Featured Hero Carousel (60% VH) */}
      <ListingHero items={carouselItems} basePath="/episodes" />

      {/* 2. Episodes Grid */}
      <section className="py-24 max-w-[90%] mx-auto">
        <div className="flex flex-col gap-12">
          <div className="flex flex-col gap-2">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tighter uppercase">
              Latest <span className="text-gradient">Web Series</span>
            </h2>
            <div className="w-20 h-1 bg-brand-gradient rounded-full" />
          </div>
          <ResponsiveGrid gridCols={{ desktop: 5 }}>
            {episodes.map((episode, index) => {
              if (!episode) return null;
              const epId = episode.id || episode.episodeId || index;
              const epSlug = epId?.toString();
              const epSeason = episode.season_id || episode.seasonId || 1;
              const rawImage = episode.media?.card_image?.url || episode.media?.poster_image?.url || episode.image;
              const epImage = resolveImageUrl(rawImage) || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?q=80&w=800&auto=format&fit=crop";

              return (
              <div key={epId} className="relative group">
                <div className="relative z-10">
                  <Link href={`/episodes/${epSlug}`}>
                    <MediaCard
                      variant="portrait"
                      title={episode.title || `Episode ${index + 1}`}
                      image={epImage}
                      rating={episode.rating || 4.8}
                      year={episode.createdAt ? new Date(episode.createdAt).getFullYear() : 2024}
                      duration={episode.duration || `S${epSeason} EP`}
                      description={episode.shortDescription || `A thrilling new episode in the series. Watch now to continue the journey.`}
                      badge={episode.isFeatured ? "Featured" : (index < 10 ? `#${index + 1} Today` : `S${epSeason}`)}
                      badgeColor={episode.isFeatured ? "orange" : (index < 10 ? 'purple' : 'blue')}
                      trailerUrl={episode.media?.trailer?.url}
                      isComingSoon={episode.isComingSoon || episode.is_coming_soon}
                    />
                  </Link>
                </div>
              </div>
            )})}
          </ResponsiveGrid>
        </div>
      </section>

    </main>
  );
}
