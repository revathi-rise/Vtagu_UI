'use client';

import React from 'react';
import { LayoutGrid, Zap, ChevronRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { MediaCard } from '../shared/MediaCard';
import { InteractiveMovie } from '@/lib/vtagu.api';

interface InteractiveHeroProps {
    interactiveMovies: InteractiveMovie[];
}

import { useRouter } from 'next/navigation';

export default function InteractiveGridHero({ interactiveMovies }: InteractiveHeroProps) {
    const router = useRouter();
    if (!interactiveMovies || interactiveMovies.length === 0) return null;
    console.log(interactiveMovies);

    const displayMovies = interactiveMovies;

    return (
        <section className="w-full py-16">
            <div className="max-w-[90%] mx-auto">

                <div className="mb-12">
                    <SectionTitle
                        title="Interactive Spotlight"
                        subtitle="SELECT TO EXPLORE"
                        Icon={LayoutGrid}
                        gradientText="Spotlight"
                        viewAllHref="/interactive"
                    />
                </div>

                <div className="relative bg-gradient-to-br from-[#1a1125] via-[#141418] to-[#0a0a0c] rounded-[3rem] p-8 md:p-12 border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/5">
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-12">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-primary text-black px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20">
                                <Zap size={14} fill="black" />
                                Unique Story Branching
                            </div>

                            <h2 className="title-h2">
                                Interactive Core: <span className="text-gradient">Narrative Hub</span>
                            </h2>
                            <p className="title-desc">
                                Take control of the story. Your choices define the outcome in our latest interactive prototypes.
                            </p>
                        </div>

                        <button className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest hover:text-white transition-all group/btn">
                            Live Narratives
                            <ChevronRight size={18} className="group-hover/btn:translate-x-1 transition-transform" />
                        </button>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {displayMovies.map((movie) => (
                            <MediaCard
                                key={movie.interactive_movie_id}
                                title={movie.title}
                                description={movie.description}
                                image="/journey_of_ashwin.png"
                                subtitle="Interactive"
                                year={movie.created_at ? new Date(movie.created_at).getFullYear() : undefined}
                                badge="USB READY"
                                badgeColor="blue"
                                onClick={() => router.push(`/interactive/${movie.interactive_movie_id}`)}
                                className="cursor-pointer"
                                variant="portrait"
                            />
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}