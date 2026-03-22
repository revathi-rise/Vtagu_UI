import { popularMovies } from '@/lib/mock-data';

const mockPosters = [
  "https://images.unsplash.com/photo-1618519764620-7403abdbdfe9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1611080645607-425f6176a9c7?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1498642279262-ec7aeb4ef5f9?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1509347528160-9a9e3378fac0?q=80&w=600&auto=format&fit=crop"
];

export default function PopularSection() {
  return (
    <section className="w-full py-12 md:py-24 relative z-20 bg-background-surface/30">
      <div className="tv-container px-6 md:px-12 lg:px-24">

        <h2 className="text-white font-bold tracking-tight mb-8 md:mb-12" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}>
          Popular on VTAGU Primetime
        </h2>

        {/* 
          Using CSS Grid for robust, responsive poster layouts.
          Scales from 2 columns on mobile to 6 columns on large TVs.
        */}
        <div className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6 lg:gap-8">
          {popularMovies.map((movie, index) => (
            <div key={movie.id} className="group relative cursor-pointer aspect-[2/3] w-full rounded-lg md:rounded-xl overflow-hidden bg-background-base border border-white/5 mx-auto">

              <img
                src={mockPosters[index % mockPosters.length]}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:opacity-80"
              />

              {/* Optional Top-10 Badge if it was the first item */}
              {index === 0 && (
                <div className="absolute top-2 left-2 md:top-3 md:left-3 bg-primary text-white text-[10px] md:text-xs font-bold px-2 py-1 rounded shadow-lg uppercase">
                  Top 10
                </div>
              )}

              {/* Title overlay on hover for better UX */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4 md:p-6 lg:p-8">
                <h3 className="text-white font-bold text-sm md:text-lg lg:text-xl text-center w-full">
                  {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
