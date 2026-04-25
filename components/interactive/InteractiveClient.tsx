'use client';

import React, { useState, useEffect } from 'react';
import { Scene, Choice, InteractiveMovie, getChoices } from '@/lib/vtagu.api';
import { Play, ChevronRight, Zap, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import SceneManager, { SceneManagerHandle } from './SceneManager';

interface InteractiveClientProps {
    movie: InteractiveMovie;
    initialScenes: Scene[];
}

export default function InteractiveClient({ movie, initialScenes }: InteractiveClientProps) {
    const managerRef = React.useRef<SceneManagerHandle>(null);
    const [scenes, setScenes] = useState<Scene[]>(initialScenes);
    const [currentScene, setCurrentScene] = useState<Scene | null>(
        initialScenes.find(s => s.is_start) || initialScenes[0] || null
    );

    const [choices, setChoices] = useState<Choice[]>([]);
    const [loadingChoices, setLoadingChoices] = useState(false);

    const fetchChoicesForScene = async (scene: Scene) => {
        if (scene.choices && scene.choices.length > 0) {
            setChoices(scene.choices);
            return;
        }

        setLoadingChoices(true);
        try {
            const fetchedChoices = await getChoices(scene.scene_id);
            setChoices(fetchedChoices || []);
        } catch (error) {
            console.error('Error fetching choices:', error);
            setChoices([]);
        } finally {
            setLoadingChoices(false);
        }
    };

    useEffect(() => {
        if (currentScene) {
            fetchChoicesForScene(currentScene);
        }
    }, [currentScene]);

    const handleSceneChange = async (sceneId: number | undefined) => {
        if (sceneId === undefined) return;
        const scene = scenes.find(s => s.scene_id === sceneId);
        if (scene) {
            setCurrentScene(scene);
        }
    };

    const handleRestart = () => {
        const startScene = scenes.find(s => s.is_start) || scenes[0];
        if (startScene) {
            setCurrentScene(startScene);
            managerRef.current?.requestFullScreen();
        }
    };

    return (
        <main className="min-h-screen bg-[#0c0816] text-white overflow-x-hidden">
            {/* Hero Section */}
            <div className="relative h-[65vh] w-full overflow-hidden">
                <div className="absolute inset-0 z-0">
                    <Image
                        src="/journey_of_ashwin_banner_img.png"
                        alt={movie.title}
                        fill
                        className="object-cover opacity-50 scale-100"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#0c0816]/60 to-[#0c0816]" />
                </div>

                <div className="relative z-10 max-w-[90%] mx-auto h-full flex flex-col justify-end pb-16">
                    <div className="inline-flex items-center gap-2 bg-cyan-400 text-black px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest mb-6 w-fit shadow-lg shadow-cyan-400/20 animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <Zap size={14} fill="black" />
                        Interactive Original
                    </div>
                    <h1 className="text-6xl md:text-8xl font-bold mb-6 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
                        {movie.title}
                    </h1>
                    <p className="text-white/60 text-lg md:text-xl max-w-3xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                        {movie.description}
                    </p>

                    <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                        <button
                            onClick={handleRestart}
                            className="flex items-center gap-4 bg-white text-black px-10 py-5 rounded-2xl font-black text-sm uppercase tracking-[0.2em] hover:bg-cyan-400 transition-all shadow-2xl shadow-white/5 active:scale-95 group"
                        >
                            <Play size={20} fill="black" />
                            Begin Narrative
                            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section - Simplified (Removed Sidebar) */}
            <div className="max-w-[90%] mx-auto py-24">
                <div className="max-w-6xl mx-auto space-y-20">
                    
                    {/* Scene Manager - Centered & Expanded */}
                    <div className="animate-in fade-in zoom-in duration-1000">
                        <SceneManager
                            ref={managerRef}
                            currentScene={currentScene}
                            choices={choices}
                            onChoiceSelect={handleSceneChange}
                            onRestart={handleRestart}
                        />
                    </div>

                    {/* Movie Info Grid - New Section to replace Map */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-10">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                            <h4 className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Multiple Endings</h4>
                            <p className="text-white/60 text-sm leading-relaxed">Your choices define the outcome. Explore over 12 unique narrative conclusions based on your split-second decisions.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                            <h4 className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Real-time Choice</h4>
                            <p className="text-white/60 text-sm leading-relaxed">Experience zero-latency transitions between scenes. The narrative flows seamlessly as you interact.</p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/5 space-y-4">
                            <h4 className="text-cyan-400 font-black text-[10px] uppercase tracking-widest">Premium Audio</h4>
                            <p className="text-white/60 text-sm leading-relaxed">Optimized for spatial audio. For the best experience, we recommend using headphones to hear every narrative detail.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Footer Infusion Section */}
            <section className="bg-gradient-to-b from-[#0c0816] to-black py-32 border-t border-white/5">
                <div className="max-w-[90%] mx-auto text-center space-y-8">
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tighter">
                        The <span className="text-gradient">Future</span> of Cinema
                    </h2>
                    <p className="text-white/40 max-w-2xl mx-auto text-xl leading-relaxed">
                        No longer just a spectator. Step into the director's chair and guide the fate of the characters in this next-generation interactive epic.
                    </p>
                    <div className="pt-10">
                        <button className="inline-flex items-center gap-3 text-cyan-400 font-black text-sm uppercase tracking-[0.3em] group hover:text-white transition-colors">
                            View More Interactive Originals
                            <ArrowRight size={20} className="group-hover:translate-x-3 transition-transform" />
                        </button>
                    </div>
                </div>
            </section>

            <style jsx>{`
                .text-gradient {
                    background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            `}</style>
        </main>
    );
}
