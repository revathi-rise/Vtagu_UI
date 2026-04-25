import React from 'react';
import { notFound } from 'next/navigation';
import { getEpisodeById, getEpisodes } from '@/lib/vtagu.api';
import { Metadata } from 'next';
import TitleHero from '@/components/title/TitleHero';
import EpisodeDetailContent from '@/components/title/EpisodeDetailContent';
import RelatedNarratives from '@/components/title/RelatedNarratives';
import Footer from '@/components/layout/Footer';

interface PageProps {
  params: Promise<{ slug: string }>;
}

/**
 * The API returns `url` as a raw HTML embed snippet like:
 *   <div style="..."><iframe src="https://iframe.mediadelivery.net/..." ...></iframe></div>
 *
 * This helper extracts just the `src` attribute value from that HTML string
 * so we can render a clean, controlled <iframe> ourselves.
 */
function extractIframeSrc(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;

  // If it's already a plain URL (no HTML tags), return as-is
  if (!raw.includes('<')) return raw;

  // Parse out the src="..." from the iframe tag
  const match = raw.match(/src=["']([^"']+)["']/i);
  return match ? match[1] : null;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const episode = await getEpisodeById(slug);

  if (!episode) {
    return { title: 'Episode Not Found | PrimeTime' };
  }

  return {
    title: `${episode.title} | Episodes | PrimeTime`,
    description: `Watch ${episode.title} — Season ${episode.seasonId} episode exclusively on PrimeTime.`,
  };
}

export async function generateStaticParams() {
  try {
    const episodes = await getEpisodes();
    return episodes.map((ep) => ({ slug: ep.episodeId.toString() }));
  } catch {
    return [];
  }
}

export default async function EpisodeDetailsPage({ params }: PageProps) {
  const { slug } = await params;

  // SSR: fetch the specific episode by ID
  const episode = await getEpisodeById(slug);

  if (!episode) {
    notFound();
  }

  // Parse the iframe src from the raw embed HTML (or plain URL)
  const iframeSrc = extractIframeSrc(episode.url as string);

  const backdropUrl =
    episode.image && typeof episode.image === 'string'
      ? episode.image
      : 'https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1920';

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white">
      {/* Hero — real episode data */}
      <TitleHero
        title={episode.title}
        year={new Date().getFullYear().toString()}
        rating="TV-MA"
        seasons={`Season ${episode.seasonId}`}
        description={`Watch the latest episode of ${episode.title}. Experience premium episodic storytelling at its finest — exclusively on PrimeTime.`}
        backdropUrl={backdropUrl}
        videoUrl={iframeSrc ?? undefined}
      />

      <div className="relative z-30 -mt-20">
        {/* Embedded player + episode info (client component) */}
        <EpisodeDetailContent episode={episode} iframeSrc={iframeSrc} />

        {/* Related episodes */}
        {/* <RelatedNarratives /> */}
      </div>

      <Footer />
    </main>
  );
}
