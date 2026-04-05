'use client';

import Image from 'next/image';
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
    <section className="w-full py-16 md:py-24 relative z-20 bg-[#0f0a19]">
      <div className="tv-container px-6 md:px-12 lg:px-24">

        <div className="mb-12 md:mb-16">
          <h2 
            className="text-white font-bold tracking-tight mb-4" 
            style={{ fontSize: 'clamp(2rem, 4vw, 3.5rem)', fontFamily: 'var(--font-poppins)' }}
          >
            Popular on <span className="text-gradient-neon">Primetime</span>
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-[#3299FF] to-transparent rounded-full shadow-[0_0_15px_rgba(50,153,255,0.5)]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 min-[480px]:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-8 gap-6 md:gap-8 lg:gap-10"
        >
          {popularMovies.map((movie, index) => (
            <div 
              key={movie.id} 
              className="group relative cursor-pointer aspect-[2/3] w-full skeuo-card overflow-hidden hover:scale-110 hover:-translate-y-4 hover:z-50 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.25)] border-[#1a1329] hover:border-cyan-400/40"
              suppressHydrationWarning
            >
              {/* Rotating Glow Effect on Hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(34,211,238,0.2),transparent_70%)]" />
              </div>
              <Image
                src={mockPosters[index % mockPosters.length]}
                alt={movie.title}
                fill
                className="object-cover transition-all duration-1000 group-hover:scale-125 group-hover:opacity-30 group-hover:blur-sm brightness-90"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 15vw"
                unoptimized
              />

              {/* Skeuomorphic Inner Shadow */}
              <div className="absolute inset-0 shadow-[inset_0_0_50px_rgba(0,0,0,0.9)] pointer-events-none z-10" />

              {/* Cinematic Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0c0816] via-transparent to-transparent opacity-80 z-20" />

              {/* Top-10 Badge: Upgraded */}
              {index === 0 && (
                <div className="absolute top-4 left-4 z-30">
                  <div className="glass-panel px-3 py-1 rounded shadow-xl">
                    <span className="text-[10px] font-bold text-cyan-400 tracking-widest uppercase">TOP 10</span>
                  </div>
                </div>
              )}

              {/* Title overlay: Reveals on hover with slide-up */}
              <div className="absolute inset-0 z-30 flex flex-col justify-end p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <h3 
                  className="text-white font-semibold text-[18px] md:text-[22px] uppercase text-center w-full leading-tight drop-shadow-2xl"
                  style={{ fontFamily: 'var(--font-poppins)' }}
                >
                   {movie.title}
                </h3>
                <div className="mt-3 flex justify-center">
                  <div className="h-1 w-0 group-hover:w-12 bg-cyan-400 transition-all duration-500 delay-100 rounded-full shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                </div>
              </div>
            </div>
          ))}
        </motion.div>

      </div>
    </section>
  );
}
