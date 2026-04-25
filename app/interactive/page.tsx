import React from 'react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import { getInteractiveMovies } from '@/lib/vtagu.api';
import { MediaCard } from '@/components/shared/MediaCard';
import ListingHero from '@/components/shared/ListingHero';
import Link from 'next/link';
import SectionTitle from '@/components/home/SectionTitle';
import { LayoutGrid, Zap } from 'lucide-react';

export const metadata = {
    title: 'Interactive Experiences - PrimeTime',
    description: 'Choose your destiny. Step into the narrative with our exclusive interactive cinematic experiences.',
};

export default async function InteractiveListing() {
    const movies = await getInteractiveMovies();

    const carouselItems = movies.slice(0, 3).map((movie, index) => ({
        id: movie.interactive_movie_id,
        title: movie.title,
        description: movie.description || "Experience a groundbreaking narrative where your choices define the outcome.",
        image: index === 0 ? "/interactive_bg.png" : "/journey_of_ashwin.png",
        slug: movie.interactive_movie_id.toString(),
        badge: index === 0 ? "Narrative Hub" : "Spotlight",
        rating: "Interactive"
    }));

    return (
        <main className="min-h-screen bg-[#050505] text-white selection:bg-primary/30 relative overflow-hidden">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-purple-600/5 rounded-full blur-[150px] pointer-events-none" />

            <Navbar />

            {/* 1. Interactive Hero Carousel */}
            <ListingHero items={carouselItems} basePath="/interactive" />

            {/* 2. Stylized Library Hub */}
            <div className="py-24 max-w-[94%] mx-auto">
                <div className="relative bg-gradient-to-br from-[#1a1125] via-[#141418] to-[#0a0a0c] rounded-[3.5rem] p-8 md:p-16 border border-white/10 overflow-hidden shadow-2xl ring-1 ring-white/5">
                    {/* Atmospheric Background Element */}
                    <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
                    
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-start justify-between gap-8 mb-16">
                        <div className="space-y-4 max-w-2xl">
                            <div className="inline-flex items-center gap-2 bg-primary text-black px-4 py-1.5 rounded-full font-bold text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20">
                                <Zap size={14} fill="black" />
                                Unique Story Branching
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase">
                                Interactive Core: <span className="text-gradient">Narrative Hub</span>
                            </h2>
                            <p className="text-white/40 font-medium max-w-xl leading-relaxed">
                                Take control of the story. Your choices define the outcome in our latest interactive prototypes. Explore the complete collection of branching narratives.
                            </p>
                        </div>
                    </div>

                    <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-y-16 gap-x-8">
                        {movies.map((movie, index) => (
                            <div key={movie.interactive_movie_id} className="relative group">
                                {/* Elegant Numbering for Interactive Hub */}
                                {index < 10 && (
                                    <div className="absolute -left-8 top-1/2 -translate-y-1/2 text-[100px] font-black text-white/5 select-none z-0 group-hover:text-primary/10 transition-colors pointer-events-none">
                                        {index + 1}
                                    </div>
                                )}
                                
                                <div className="relative z-10">
                                    <Link href={`/interactive/${movie.interactive_movie_id}`}>
                                        <MediaCard
                                            variant="portrait"
                                            title={movie.title}
                                            description={movie.description}
                                            image="/journey_of_ashwin.png"
                                            subtitle="Interactive"
                                            year={movie.created_at ? new Date(movie.created_at).getFullYear() : undefined}
                                            badge={index === 0 ? "TRENDING" : "STORY"}
                                            badgeColor={index === 0 ? "purple" : "blue"}
                                        />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <Footer />
        </main>
    );
}
