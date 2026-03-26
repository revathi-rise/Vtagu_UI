import { topPicks } from '@/lib/mock-data';
import { Play, Plus, Star, Zap, Clock, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import SectionTitle from './SectionTitle';

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
        {/* List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-10 lg:gap-14"
        >
          {topPicks.map((pick, index) => (
            <div
              key={pick.id}
              className="group flex flex-col md:flex-row items-center bg-[#0c0816] rounded-[2.5rem] border-[8px] border-[#1a1329] overflow-hidden transition-all duration-500 hover:border-[#251b3a] hover:-translate-y-2 hover:shadow-[0_25px_50px_rgba(0,0,0,0.8),0_0_40px_rgba(34,211,238,0.3)]"
            >

              {/* Image Container */}
              <div className="w-full md:w-[45%] lg:w-[40%] xl:w-[35%] h-[300px] md:h-[350px] lg:h-[400px] relative overflow-hidden shrink-0 rounded-[1.8rem] m-2">
                <img
                  src={mockShowcase[index % mockShowcase.length]}
                  alt={pick.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100"
                />
                
                {/* Skeuomorphic Inner Shadow */}
                <div className="absolute inset-0 shadow-[inset_0_0_30px_rgba(0,0,0,0.7)] pointer-events-none" />
                
                <div className="absolute inset-0 bg-gradient-to-t md:bg-gradient-to-r from-[#0c0816] via-transparent to-transparent opacity-60"></div>
              </div>

              {/* Content Container */}
              <div className="w-full md:flex-1 p-8 md:p-10 flex flex-col justify-center h-full">
                <h3 className="text-white font-black text-2xl md:text-3xl lg:text-4xl mb-4 tracking-tight uppercase group-hover:text-cyan-400 transition-colors">
                  {pick.title}
                </h3>

                <p className="text-gray-400 text-sm md:text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                  {pick.description}
                </p>

                <div className="flex items-center gap-6 mt-auto">
                  <button className="w-14 h-14 rounded-full bg-cyan-400 hover:bg-cyan-300 flex items-center justify-center text-black shadow-[0_10px_20px_rgba(34,211,238,0.3)] transition-all hover:scale-110 shrink-0">
                    <Play className="w-6 h-6 ml-1 fill-black" />
                  </button>
                  <button className="flex items-center gap-2 text-white/50 hover:text-white font-black transition-all text-xs uppercase tracking-widest">
                    <Plus className="w-4 h-4" />
                    Add to List
                  </button>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
