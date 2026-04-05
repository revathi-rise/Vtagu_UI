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
            <div className="skeuo-surface-high p-12 lg:p-16 relative overflow-hidden group">
                {/* Surface Reflection Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent opacity-30 pointer-events-none" />
                
                <div className="relative z-10">
                    <h2 className="text-3xl md:text-4xl font-black text-white italic mb-10 skeuo-title-3d uppercase tracking-tight">
                        <span className="text-[#00E5FF] mr-4 opacity-50 tracking-tighter">/</span>
                        SYNOPSIS
                    </h2>
                    <div className="space-y-8 max-w-4xl">
                        <p className="text-white/70 text-xl md:text-2xl leading-relaxed font-semibold drop-shadow-md">
                            In a world where legends are lost to time, a group of unlikely heroes embarks on a perilous quest to uncover the secret of the Alchemy of Gold. As they navigate treacherous landscapes and face formidable foes, they discover that the true gold lies within their courage and unity.
                        </p>
                        <div className="h-px w-full bg-gradient-to-r from-[#00E5FF]/30 to-transparent" />
                        <p className="text-white/50 text-base md:text-lg leading-loose italic font-medium">
                            Directed by the visionary director <span className="text-white font-black text-[#00E5FF]">Sarah Jenkins</span>, this film features breathtaking cinematography and a soul-stirring original score that transports viewers to a world beyond imagination.
                        </p>
                    </div>
                </div>

                {/* Decorative physical corner accent */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent rotate-45 translate-x-16 -translate-y-16" />
            </div>
        </section>
        
        <RelatedNarratives />
      </div>
    </main>
  );
}
