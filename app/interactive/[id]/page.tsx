import React from 'react';
import { getInteractiveMovies, getScenes } from '@/lib/vtagu.api';
import InteractiveClient from '@/components/interactive/InteractiveClient';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params;
    const movies = await getInteractiveMovies();
    const movie = movies.find(m => m.interactive_movie_id.toString() === id);

    return {
        title: movie ? `${movie.title} - Interactive Experience` : 'Interactive Experience',
        description: movie?.description || 'Step into the narrative.',
    };
}

export default async function InteractiveMoviePage({ params }: Props) {
    const { id } = await params;
    console.log(id, "id from params");

    try {
        // Fetch all movies to find the specific one (SSR)
        const movies = await getInteractiveMovies();
        const movie = movies.find(m => m.interactive_movie_id.toString() === id);

        if (!movie) {
            return (
                <div className="min-h-screen bg-[#0c0816] flex items-center justify-center text-white">
                    <div className="text-center space-y-4">
                        <h1 className="text-2xl font-bold">Experience Not Found</h1>
                        <a href="/interactive" className="text-cyan-400 text-sm font-bold uppercase tracking-widest hover:underline">Return to Library</a>
                    </div>
                </div>
            );
        }

        // Fetch scenes (SSR)
        const scenes = await getScenes(movie.interactive_movie_id);
        console.log(scenes);

        return (
            <InteractiveClient
                movie={movie}
                initialScenes={scenes}
            />
        );
    } catch (error) {
        console.error('Error in InteractiveMoviePage SSR:', error);
        return (
            <div className="min-h-screen bg-[#0c0816] flex items-center justify-center text-white p-8 text-center">
                <div>
                    <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
                    <p className="text-white/40 mb-6">We encountered an error while loading the experience. Please try again later.</p>
                    <a href="/" className="bg-cyan-400 text-black px-6 py-3 rounded-xl font-bold hover:bg-white transition-colors">
                        Go Home
                    </a>
                </div>
            </div>
        );
    }
}
