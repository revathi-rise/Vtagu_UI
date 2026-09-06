'use client';

import React, { useState, useEffect } from 'react';
import { Scene, Choice, InteractiveMovie, getChoices, getScenes, checkMovieAccess } from '@/lib/vtagu.api';
import { Play, ChevronRight, Zap, ArrowRight, Lock } from 'lucide-react';
import Image from 'next/image';
import SceneManager, { SceneManagerHandle } from './SceneManager';
import { PaywallGateModal } from './PaywallGateModal';
import { getUserId } from '@/lib/api-client';

interface InteractiveClientProps {
    movie: InteractiveMovie;
    initialScenes: Scene[];
}

export default function InteractiveClient({ movie, initialScenes }: InteractiveClientProps) {
    const managerRef = React.useRef<SceneManagerHandle>(null);
    const safeInitialScenes = Array.isArray(initialScenes) ? initialScenes : [];
    const [scenes, setScenes] = useState<Scene[]>(safeInitialScenes);
    const [currentScene, setCurrentScene] = useState<Scene | null>(
        safeInitialScenes.find(s => s?.is_start) || safeInitialScenes[0] || null
    );
    const [sceneHistory, setSceneHistory] = useState<Scene[]>([]);

    const [choices, setChoices] = useState<Choice[]>([]);
    const [loadingChoices, setLoadingChoices] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showPaywallModal, setShowPaywallModal] = useState(false);
    const [accessData, setAccessData] = useState<{
        hasAccess: boolean;
        reason: 'free' | 'subscription' | 'single_purchase' | 'none';
        price: number;
        currency: string;
    } | null>(null);
    const [checkingAccess, setCheckingAccess] = useState(true);

    // Fallback: If initialScenes is empty, attempt to fetch scenes client-side
    useEffect(() => {
        if (scenes.length === 0 && movie?.interactive_movie_id) {
            getScenes(movie.interactive_movie_id).then((fetchedScenes) => {
                if (Array.isArray(fetchedScenes) && fetchedScenes.length > 0) {
                    setScenes(fetchedScenes);
                    setCurrentScene(fetchedScenes.find(s => s?.is_start) || fetchedScenes[0] || null);
                }
            }).catch(err => {
                console.error("Error fetching scenes client-side:", err);
            });
        }
    }, [movie?.interactive_movie_id, scenes.length]);

    const checkAccess = async () => {
        setCheckingAccess(true);
        
        // Immediate client check: If movie is explicitly marked free, play directly without modal
        const isMovieFree = Number(movie.is_free) === 1 || Number((movie as any).isFree) === 1 || Boolean(movie.is_free) === true || String(movie.is_free) === '1';
        if (isMovieFree) {
            setAccessData({ hasAccess: true, reason: 'free', price: 0, currency: movie.currency || 'INR' });
            setIsAuthorized(true);
            setCheckingAccess(false);
            return;
        }

        try {
            const userId = getUserId();
            const result = await checkMovieAccess(movie.interactive_movie_id, userId);
            setAccessData(result);
            setIsAuthorized(result.hasAccess);
        } catch (error) {
            console.error('Error checking movie access:', error);
            setIsAuthorized(false);
        } finally {
            setCheckingAccess(false);
        }
    };

    useEffect(() => {
        checkAccess();
    }, [movie.interactive_movie_id]);

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
            if (currentScene) {
                setSceneHistory(prev => [...prev, currentScene]);
            }
            setCurrentScene(scene);
        }
    };

    const handlePrevious = () => {
        if (sceneHistory.length > 0) {
            const prevScene = sceneHistory[sceneHistory.length - 1];
            setSceneHistory(prev => prev.slice(0, -1));
            setCurrentScene(prevScene);
        }
    };

    const handleRestart = () => {
        const startScene = scenes.find(s => s.is_start) || scenes[0];
        if (startScene) {
            setSceneHistory([]);
            setCurrentScene(startScene);
            managerRef.current?.requestFullScreen();
        }
    };

    if (checkingAccess) {
        return (
            <div className="min-h-screen bg-[#0c0816] flex items-center justify-center text-white">
                <div className="w-10 h-10 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin" />
            </div>
        );
    }

    return (
        <>
            <PaywallGateModal
                isOpen={showPaywallModal}
                price={accessData?.price || 0}
                currency={accessData?.currency || 'INR'}
                movieId={movie.interactive_movie_id}
                movieTitle={movie.title}
            />

            <main className="min-h-screen bg-[#0c0816] text-white overflow-x-hidden">
                {/* Hero Section */}
                <div className="relative w-full h-[500px] md:h-[650px] lg:h-[750px] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={movie.banner_image || "/journey_of_ashwin_banner_img.png"}
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
                        <h1 className="text-[28px] md:text-[40px] font-bold mb-3 tracking-tighter animate-in fade-in slide-in-from-bottom-6 duration-1000">
                            {movie.title}
                        </h1>
                        {movie.languages && (
                            <div className="text-cyan-400 font-bold uppercase tracking-[0.25em] text-xs md:text-sm mb-6 animate-in fade-in slide-in-from-bottom-7 duration-1000">
                                Available in: {movie.languages}
                            </div>
                        )}
                        <p className="text-white/60 text-[18px] line-clamp-3 max-w-3xl leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                            {movie.description}
                        </p>

                        <div className="flex flex-wrap gap-4 animate-in fade-in slide-in-from-bottom-10 duration-1000">
                            {isAuthorized ? (
                                <button
                                    onClick={handleRestart}
                                    className="flex items-center gap-3 bg-white text-black px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter uppercase tracking-tight hover:bg-cyan-400 transition-all shadow-2xl shadow-white/5 active:scale-95 group"
                                >
                                    <Play size={22} fill="black" />
                                    <span className="font-inter font-black text-[18px]">Begin Narrative</span>
                                    <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowPaywallModal(true)}
                                    className="relative flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter tracking-tight uppercase transition-all duration-300 overflow-hidden group shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95"
                                >
                                    <Lock size={22} className="transition-transform group-hover:scale-110" />
                                    <span className="font-inter font-black text-[18px] tracking-tight uppercase">Subscribe to Watch</span>
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Content Section */}
                <div className="max-w-[90%] mx-auto md:py-24 py-12">
                    <div className="max-w-6xl mx-auto space-y-20">

                        {/* Scene Manager / Locked Banner */}
                        <div className="animate-in fade-in zoom-in duration-1000">
                            {isAuthorized ? (
                                <SceneManager
                                    ref={managerRef}
                                    currentScene={currentScene}
                                    choices={choices}
                                    onChoiceSelect={handleSceneChange}
                                    onRestart={handleRestart}
                                    onPrevious={handlePrevious}
                                    hasPrevious={sceneHistory.length > 0}
                                />
                            ) : (
                                <div className="p-12 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center gap-6 backdrop-blur-xl">
                                    <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                        <Lock size={32} />
                                    </div>
                                    <div className="space-y-2">
                                        <h3 className="text-2xl font-black text-white uppercase tracking-tight">Premium Interactive Experience</h3>
                                        <p className="text-white/60 max-w-md text-base leading-relaxed">
                                            Unlock full interactive choices and shape the outcome of {movie.title} with a PrimeTime subscription.
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setShowPaywallModal(true)}
                                        className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-[12px] rounded-2xl font-black text-[18px] font-inter tracking-tight uppercase transition-all duration-300 shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95"
                                    >
                                        <Lock size={22} />
                                        <span className="font-inter font-black text-[18px] tracking-tight uppercase">Subscribe to Watch</span>
                                    </button>
                                </div>
                            )}
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
                    <section className="bg-gradient-to-b from-[#0c0816] to-black py-12 md:py-32 border-t border-white/5">
                        <div className="max-w-[90%] mx-auto text-center space-y-8">
                            <h2 className="text-[18px] md:text-[32px] font-bold tracking-tighter">
                                The <span className="text-gradient">Future</span> of Cinema
                            </h2>
                            <p className="text-white/40 max-w-2xl mx-auto text-[12px] md:text-xl leading-relaxed">
                                No longer just a spectator. Step into the director's chair and guide the fate of the characters in this next-generation interactive epic.
                            </p>
                            <div className="pt-6 md:pt-10">
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
        </>
    );
}
