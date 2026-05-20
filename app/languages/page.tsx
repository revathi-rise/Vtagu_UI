import React from 'react';
import Link from 'next/link';
import { Globe, ArrowLeft, Languages } from 'lucide-react';
import { getLanguages } from '@/lib/vtagu.api';

export const metadata = {
  title: 'Browse Movies by Language - VTAGU PrimeTime',
  description: 'Explore premium cinematic collections grouped by language including Tamil, English, Hindi, Telugu, Malayalam and more.',
};

export default async function LanguagesOverviewPage() {
  const languages = await getLanguages();

  // Artistic background labels and stylistic markers for each language
  const getLanguageDetails = (slug: string) => {
    switch (slug.toLowerCase()) {
      case 'english':
        return { initial: 'EN', gradient: 'from-[#FF512F] to-[#DD2476]', desc: 'Hollywood & Global Cinema' };
      case 'tamil':
        return { initial: 'TA', gradient: 'from-[#11998e] to-[#38ef7d]', desc: 'Kollywood Blockbusters' };
      case 'hindi':
        return { initial: 'HI', gradient: 'from-[#3a7bd5] to-[#3a6073]', desc: 'Bollywood Mainstream Hits' };
      case 'telugu':
        return { initial: 'TE', gradient: 'from-[#F3904F] to-[#3B4371]', desc: 'Tollywood Spectacles' };
      case 'malayalam':
        return { initial: 'ML', gradient: 'from-[#ee0979] to-[#ff6a00]', desc: 'Malayalam Classic Stories' };
      default:
        return { initial: slug.slice(0, 2).toUpperCase(), gradient: 'from-[#3299ff] to-[#9248ff]', desc: 'Exclusive Cinematic Collection' };
    }
  };

  return (
    <main className="min-h-screen bg-[#050505] text-white py-28 relative overflow-hidden select-none">
      {/* Cinematic Ambient Glow */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary rounded-full opacity-[0.03] blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-accent rounded-full opacity-[0.03] blur-[150px] pointer-events-none" />

      <div className="max-w-[90%] mx-auto relative z-10">
        {/* Navigation / Header */}
        <div className="flex flex-col gap-8 mb-16">
          <Link
            href="/"
            className="group flex items-center gap-2 text-xs font-bold text-white/40 hover:text-white transition-all uppercase tracking-widest self-start"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> Back to Home
          </Link>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 text-xs font-black tracking-widest text-primary uppercase">
              <Languages size={16} className="text-primary drop-shadow-[0_0_8px_rgba(50,153,255,0.6)]" />
              Dynamic Catalogues
            </div>
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">
              Explore by <span className="text-gradient">Language</span>
            </h1>
            <p className="text-white/40 text-sm md:text-base max-w-xl mt-2 leading-relaxed">
              Diverge into customized cinematic realms tailored specifically in your preferred tongue. High fidelity, 4K HDR streams on-demand.
            </p>
            <div className="w-24 h-1.5 bg-brand-gradient rounded-full mt-3 shadow-[0_1px_10px_rgba(146,72,255,0.4)]" />
          </div>
        </div>

        {/* Dynamic Grid Layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {languages && languages.length > 0 ? (
            languages.map((lang) => {
              const details = getLanguageDetails(lang.slug);
              return (
                <Link
                  key={lang.slug}
                  href={`/languages/${lang.slug}`}
                  className="group relative flex flex-col justify-between p-8 rounded-3xl min-h-[220px] bg-[#121216]/50 border border-white/5 overflow-hidden transition-all duration-500 hover:border-white/20 hover:bg-[#121216]/80 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(0,0,0,0.6)]"
                >
                  {/* Glowing card border gradient effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  
                  {/* Huge background artistic initial */}
                  <div className={`absolute right-4 bottom-[-10px] text-8xl md:text-9xl font-black select-none pointer-events-none opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500 text-transparent bg-clip-text bg-gradient-to-br ${details.gradient}`}>
                    {details.initial}
                  </div>

                  <div className="flex items-start justify-between relative z-10">
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-brand-gradient group-hover:border-transparent transition-all duration-500 shadow-inner">
                      <Globe size={20} className="text-white/70 group-hover:text-white group-hover:scale-110 transition-all" />
                    </div>
                    <span className="text-[10px] font-black text-white/30 tracking-widest uppercase group-hover:text-primary transition-colors">
                      {lang.code.toUpperCase()}
                    </span>
                  </div>

                  <div className="space-y-2 relative z-10">
                    <h3 className="text-2xl font-black uppercase tracking-tight group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-brand-gradient transition-all duration-500">
                      {lang.name}
                    </h3>
                    <p className="text-xs text-white/40 group-hover:text-white/60 transition-colors font-medium">
                      {details.desc}
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-16 text-center text-white/30 italic text-sm tracking-widest uppercase">
              Loading active languages...
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
