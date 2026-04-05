import React from 'react';
import TitleHero from '@/components/title/TitleHero';
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
    title: `${title} | Movie | PrimeTime`,
    description: `Watch the movie ${title} in 4K HDR only on PrimeTime.`,
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  // Mock data for a movie
  const movieData = {
    title: slug.replace(/-/g, ' ').toUpperCase(),
    year: "2024",
    rating: "PG-13",
    description: "An epic cinematic journey through forgotten realms and ancient mysteries. Experience the award-winning visual masterpiece that redefined the action-adventure genre.",
    backdropUrl: "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=1920"
  };

  return (
    <main className="min-h-screen bg-[#0B0A10] text-white">
      <TitleHero {...movieData} />
      
      <div className="relative z-30 -mt-20">
        <section className="py-20 tv-container px-6 md:px-12 lg:px-20">
            <div className="skeuo-card p-12 lg:p-16">
                <h2 className="text-3xl font-black text-white italic mb-6">SYNOPSIS</h2>
                <p className="text-white/60 text-lg leading-loose max-w-4xl">
                    In a world where legends are lost to time, a group of unlikely heroes embarks on a perilous quest to uncover the secret of the Alchemy of Gold. As they navigate treacherous landscapes and face formidable foes, they discover that the true gold lies within their courage and unity.
                    <br/><br/>
                    Directed by the visionary director Sarah Jenkins, this film features breathtaking cinematography and a soul-stirring original score.
                </p>
            </div>
        </section>
        
        <RelatedNarratives />
      </div>
    </main>
  );
}
