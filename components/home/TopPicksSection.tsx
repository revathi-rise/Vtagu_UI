import { topPicks } from '@/lib/mock-data';
import { Play, Plus } from 'lucide-react';

const mockShowcase = [
  "https://images.unsplash.com/photo-1543794327-59a5d12224d0?q=80&w=1200&auto=format&fit=crop", // Detective vibe
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?q=80&w=1200&auto=format&fit=crop"  // Cars vibe
];

export default function TopPicksSection() {
  return (
    <section className="w-full py-16 md:py-24 relative z-20 bg-[#0f0a19]">
      <div className="tv-container px-6 md:px-12 lg:px-24">

        <div className="mb-10 md:mb-16">
          <h2 className="text-white font-bold tracking-tight mb-2" style={{ fontSize: 'clamp(1.5rem, 2.5vw, 3rem)' }}>
            Top Picks for You
          </h2>
          <p className="text-text-secondary text-sm md:text-base lg:text-xl">
            Personalized recommendations for your weekend
          </p>
        </div>

        {/* 
          1 column mobile, 2 columns desktop.
          Vertical scaling handled by generic layout flow.
        */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14">
          {topPicks.map((pick, index) => (
            <div
              key={pick.id}
              className="group flex flex-col md:flex-row items-center bg-background-surface rounded-2xl md:rounded-3xl border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/15 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]"
            >

              {/* Image Container */}
              <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] h-[300px] md:h-[350px] lg:h-[400px] relative overflow-hidden shrink-0">
                <img
                  src={mockShowcase[index % mockShowcase.length]}
                  alt={pick.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-background-surface via-background-surface/40 to-transparent"></div>
              </div>

              {/* Content Container */}
              <div className="w-full md:flex-1 p-6 md:p-8 lg:p-10 xl:p-12 flex flex-col justify-center h-full">
                <h3 className="text-white font-bold text-2xl md:text-3xl lg:text-4xl xl:text-5xl mb-3 md:mb-5 tracking-tight group-hover:text-primary transition-colors">
                  {pick.title}
                </h3>

                <p className="text-text-secondary text-sm md:text-base lg:text-lg xl:text-xl leading-relaxed mb-8 md:mb-12 line-clamp-3 md:line-clamp-4">
                  {pick.description}
                </p>

                <div className="flex items-center gap-4 lg:gap-6 mt-auto">
                  <button className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-primary hover:bg-primary-hover flex items-center justify-center text-white shadow-[0_0_15px_rgba(79,128,255,0.3)] transition-transform hover:scale-105 shrink-0">
                    <Play className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7 ml-1 fill-white" />
                  </button>
                  <button className="flex items-center gap-2 text-white/70 hover:text-white font-semibold transition-colors text-sm md:text-base lg:text-xl uppercase tracking-wider">
                    <Plus className="w-4 h-4 md:w-5 md:h-5 lg:w-6 lg:h-6" />
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
