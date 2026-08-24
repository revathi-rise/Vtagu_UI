import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home, Video } from 'lucide-react';
import { getMoviesByLanguage, getPosters } from '@/lib/vtagu.api';
import ListingHero from '@/components/shared/ListingHero';
import ResponsiveGrid from '@/components/shared/ResponsiveGrid';
import { MediaCard } from '@/components/shared/MediaCard';

const IMAGE_BASE_URL = "https://www.vtagu.in/";
const resolveImageUrl = (path?: string) => {
  if (!path) return "https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=2000&auto=format&fit=crop";
  return path.startsWith('http') ? path : `${IMAGE_BASE_URL}${path}`;
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const capitalized = slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  return {
    title: `${capitalized} Movies - VTAGU PrimeTime`,
    description: `Watch high-quality ${capitalized} blockbusters, web series, and exclusive content in 4K HDR only on VTAGU PrimeTime.`,
    keywords: [slug, `${slug} movies`, 'streaming', 'primetime', capitalized],
  };
}

export default async function LanguageMoviesPage({ params }: PageProps) {
  const { slug } = await params;
  const { language, movies, Interactive, episodes } = await getMoviesByLanguage(slug);
  console.log("Language Page Loaded Content:", { movies, Interactive, episodes });

  const displayLanguage = language || slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Fetch banners specifically for this language
  const posters = await getPosters("language", displayLanguage);

  // Sleek empty state fallback when no content is mapped to this language
  const hasContent = (movies && movies.length > 0) || (Interactive && Interactive.length > 0) || (episodes && episodes.length > 0);
  if (!hasContent) {
    return (
      <main className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 select-none relative overflow-hidden">
        {/* Soft Background Neon Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gradient rounded-full opacity-10 blur-[150px] pointer-events-none" />

        <div className="relative z-10 flex flex-col items-center max-w-lg text-center p-8 rounded-3xl glass-morphism border border-white/5 shadow-2xl">
          <div className="w-20 h-20 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-8 shadow-inner animate-pulse">
            <Video size={40} className="text-primary drop-shadow-[0_0_10px_rgba(50,153,255,0.6)]" />
          </div>
          <h1 className="text-3xl font-black uppercase tracking-tight mb-4">
            No Content in <span className="text-gradient">{displayLanguage}</span>
          </h1>
          <p className="text-white/50 leading-relaxed text-sm mb-10 font-medium">
            Our curators are working round the clock to catalog amazing titles for this language. Check back shortly!
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full">
            <Link
              href="/"
              className="flex-1 bg-white/5 hover:bg-white/10 border border-white/10 text-white py-3.5 rounded-xl font-bold uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95"
            >
              <Home size={14} /> Back Home
            </Link>
            <Link
              href="/movies"
              className="flex-1 bg-brand-gradient text-white py-3.5 rounded-xl font-black uppercase text-xs tracking-widest transition-all flex items-center justify-center gap-2 active:scale-95 shadow-[0_4px_20px_rgba(146,72,255,0.4)]"
            >
              Browse All <ChevronRight size={14} />
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // Slice first 5 items of whatever is available for the ListingHero banner carousel
  const bannerItems = (movies && movies.length > 0) ? movies : ((Interactive && Interactive.length > 0) ? Interactive : episodes);
  const bannerBasePath = (movies && movies.length > 0) ? "/movies" : ((Interactive && Interactive.length > 0) ? "/interactive" : "/episodes");

  let carouselItems;
  if (posters && posters.length > 0) {
    carouselItems = posters.map((poster, index) => ({
      id: poster.poster_id,
      title: poster.poster_title || "PRIME EXCLUSIVE",
      description: poster.description || "",
      image: resolveImageUrl(poster.path),
      badge: index === 0 ? `Featured ${displayLanguage}` : `Trending in ${displayLanguage}`,
      link: poster.link,
      slug: "",
      languages: poster.languages || "",
      trailerUrl: poster.trailer_url || ""
    }));
  } else {
    carouselItems = bannerItems.slice(0, 5).map((item: any, index: number) => {
      const isMovie = movies && movies.length > 0;
      const isInteractive = !isMovie && (Interactive && Interactive.length > 0);

      return {
        id: item.id || item.interactive_movie_id,
        title: item.title,
        description: item.shortDescription || item.description || "",
        image: resolveImageUrl(item.posterImage || item.banner_image || item.media?.poster_image?.url || item.media?.image?.url),
        rating: item.rating || "8.5",
        year: item.releaseYear || (item.created_at ? new Date(item.created_at).getFullYear() : undefined),
        duration: item.duration,
        slug: isMovie ? item.slug : (isInteractive ? item.interactive_movie_id.toString() : item.id.toString()),
        badge: index === 0 ? `Featured ${displayLanguage}` : `Trending in ${displayLanguage}`,
        languages: item.languages || ""
      };
    });
  }

  return (
    <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative">
      {/* Dynamic Cinematic Hero Carousel */}
      <ListingHero items={carouselItems} basePath={bannerBasePath} />

      {/* Grid Section of Movies / Content */}
      <section className="py-24 max-w-[90%] mx-auto relative z-20">
        <div className="flex flex-col gap-20">
          
          {/* 1. MOVIES SECTION */}
          {movies && movies.length > 0 && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs font-black tracking-widest text-primary uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(50,153,255,0.8)]" />
                  Blockbusters
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase drop-shadow-lg">
                  {displayLanguage} <span className="text-gradient">Movies</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-gradient rounded-full mt-1 shadow-[0_1px_10px_rgba(146,72,255,0.4)]" />
              </div>

              <ResponsiveGrid gridCols={{ desktop: 5 }}>
                {movies.map((movie) => (
                  <div key={movie.id} className="relative group">
                    <Link href={`/movies/${movie.slug}`}>
                      <MediaCard
                        variant="portrait"
                        title={movie.title}
                        image={resolveImageUrl(movie.posterImage)}
                        rating={movie.rating || "8.5"}
                        year={movie.releaseYear}
                        duration={movie.duration}
                        description={movie.shortDescription}
                        badge={movie.isFree ? 'FREE' : 'PREMIUM'}
                        badgeColor={movie.isFree ? 'green' : 'orange'}
                        trailerUrl={movie.trailerUrl}
                        isComingSoon={movie.isComingSoon || movie.is_coming_soon}
                      />
                    </Link>
                  </div>
                ))}
              </ResponsiveGrid>
            </div>
          )}

          {/* 2. INTERACTIVE SECTION */}
          {Interactive && Interactive.length > 0 && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs font-black tracking-widest text-cyan-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]" />
                  Branching Stories
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase drop-shadow-lg">
                  Interactive <span className="text-gradient">Originals</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-gradient rounded-full mt-1 shadow-[0_1px_10px_rgba(146,72,255,0.4)]" />
              </div>

              <ResponsiveGrid gridCols={{ desktop: 5 }}>
                {Interactive.map((movie) => (
                  <div key={movie.interactive_movie_id} className="relative group">
                    <Link href={`/interactive/${movie.interactive_movie_id}`}>
                      <MediaCard
                        variant="portrait"
                        title={movie.title}
                        image={resolveImageUrl(movie.card_image)}
                        subtitle={movie.languages || "Interactive"}
                        year={movie.created_at ? new Date(movie.created_at).getFullYear() : undefined}
                        description={movie.description}
                        badge="STORY"
                        badgeColor="blue"
                        trailerUrl={movie.trailer_video_url}
                        isComingSoon={Boolean(movie.isComingSoon || movie.is_coming_soon)}
                      />
                    </Link>
                  </div>
                ))}
              </ResponsiveGrid>
            </div>
          )}

          {/* 3. EPISODES SECTION */}
          {episodes && episodes.length > 0 && (
            <div className="flex flex-col gap-8">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs font-black tracking-widest text-purple-400 uppercase">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-400 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />
                  Web Series
                </div>
                <h2 className="text-3xl md:text-4xl font-black tracking-tighter uppercase drop-shadow-lg">
                  {displayLanguage} <span className="text-gradient">Shows & Episodes</span>
                </h2>
                <div className="w-24 h-1.5 bg-brand-gradient rounded-full mt-1 shadow-[0_1px_10px_rgba(146,72,255,0.4)]" />
              </div>

              <ResponsiveGrid gridCols={{ desktop: 5 }}>
                {episodes.map((episode) => (
                  <div key={episode.id} className="relative group">
                    <Link href={`/episodes/${episode.id}`}>
                      <MediaCard
                        variant="portrait"
                        title={episode.title}
                        image={resolveImageUrl(episode.media?.poster_image?.url || episode.media?.image?.url || (episode.image ? String(episode.image) : ""))}
                        rating={episode.rating || "8.0"}
                        duration={episode.duration}
                        description={episode.shortDescription}
                        badge={episode.isFree ? 'FREE' : 'PREMIUM'}
                        badgeColor={episode.isFree ? 'green' : 'orange'}
                        trailerUrl={episode.media?.trailer?.url || episode.url}
                        isComingSoon={episode.isComingSoon || episode.is_coming_soon}
                      />
                    </Link>
                  </div>
                ))}
              </ResponsiveGrid>
            </div>
          )}

        </div>
      </section>

      {/* Ambient background glow near grid */}
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-brand-gradient rounded-full opacity-[0.03] blur-[180px] pointer-events-none" />
    </main>
  );
}
