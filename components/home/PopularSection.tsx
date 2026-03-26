import { popularMovies } from '@/lib/mock-data';
import { motion } from 'framer-motion';

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
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-4 md:gap-6 lg:gap-8"
        >
          {popularMovies.map((movie, index) => (
            <div key={movie.id} className="group relative cursor-pointer aspect-[2/3] w-full rounded-[1.5rem] overflow-hidden bg-[#0c0816] border-[6px] border-[#1a1329] mx-auto transition-all duration-500 hover:border-[#251b3a] hover:-translate-y-2 hover:shadow-[0_20px_40px_rgba(0,0,0,0.8),0_0_30px_rgba(34,211,238,0.3)]">

              <img
                src={mockPosters[index % mockPosters.length]}
                alt={movie.title}
                loading="lazy"
                className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:opacity-60"
              />

              {/* Skeuomorphic Inner Shadow */}
              <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] pointer-events-none" />

              {/* Optional Top-10 Badge (Cyan) */}
              {index === 0 && (
                <div className="absolute top-3 left-3 bg-cyan-400 text-black text-[9px] md:text-[10px] font-black tracking-widest px-2 py-0.5 rounded-sm shadow-lg uppercase">
                   TOP 10
                </div>
              )}

              {/* Title overlay on hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                <h3 className="text-white font-black text-xs md:text-sm tracking-widest uppercase text-center w-full drop-shadow-md">
                   {movie.title}
                </h3>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
