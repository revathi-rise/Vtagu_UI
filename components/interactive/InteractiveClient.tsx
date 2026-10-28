'use client';

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Scene, Choice, InteractiveMovie, getChoices, getScenes, checkMovieAccess } from '@/lib/vtagu.api';
import {
    Play,
    ChevronRight,
    Zap,
    Lock,
    Info,
    User,
    Globe,
    Users,
    Calendar,
    Clock,
    Target,
    Mail,
    X,
    Volume2,
    Sparkles,
    ArrowRight
} from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import SceneManager, { SceneManagerHandle } from './SceneManager';
import { PaywallGateModal } from './PaywallGateModal';
import { getUserId } from '@/lib/api-client';
import { exitDocumentFullscreen } from '@/lib/fullscreen-utils';

interface InteractiveClientProps {
    movie: InteractiveMovie;
    initialScenes: Scene[];
}

export default function InteractiveClient({ movie, initialScenes }: InteractiveClientProps) {
    const managerRef = useRef<SceneManagerHandle>(null);
    const safeInitialScenes = Array.isArray(initialScenes) ? initialScenes : [];
    const [scenes, setScenes] = useState<Scene[]>(safeInitialScenes);
    const [currentScene, setCurrentScene] = useState<Scene | null>(
        safeInitialScenes.find(s => s?.is_start) ||
        safeInitialScenes.find(s => Number(s?.is_free) === 1 || Boolean(s?.is_free) === true || String(s?.is_free) === '1' || (!!s?.scene_url && s.scene_url.length > 0)) ||
        safeInitialScenes[0] ||
        null
    );
    const [sceneHistory, setSceneHistory] = useState<Scene[]>([]);

    const [choices, setChoices] = useState<Choice[]>([]);
    const [loadingChoices, setLoadingChoices] = useState(false);
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [showPaywallModal, setShowPaywallModal] = useState(false);
    const [showCastModal, setShowCastModal] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);

    useEffect(() => {
        if (showPaywallModal) {
            exitDocumentFullscreen().catch(() => {});
        }
    }, [showPaywallModal]);

    // Endings tracking state (dynamic, initialized to 0)
    const [unlockedEndings, setUnlockedEndings] = useState<number>(0);

    const [accessData, setAccessData] = useState<{
        hasAccess: boolean;
        reason: 'free' | 'subscription' | 'single_purchase' | 'none';
        price: number;
        currency: string;
    } | null>(null);
    const [checkingAccess, setCheckingAccess] = useState(true);

    // Dynamic field helpers to prevent static/hardcoded defaults
    const displayDirector = movie.director?.trim() ? movie.director.trim() : null;
    const displayLanguage = movie.languages?.trim() ? movie.languages.trim() : (movie as any).language?.trim() || null;
    const displayYear = movie.year || (movie.created_at ? new Date(movie.created_at).getFullYear() : null);
    const displayDuration = movie.duration?.trim()
        ? movie.duration.trim()
        : (scenes.length > 0 ? `${scenes.length} Interactive Scenes` : null);
    const displayStarring = movie.actors?.trim() ? movie.actors.trim() : null;
    const displayDescription = movie.description?.trim() ? movie.description.trim() : '';

    // Parse dynamic genres
    const genresList: string[] = useMemo(() => {
        if (Array.isArray(movie.genres) && movie.genres.length > 0) return movie.genres;
        if (typeof movie.genres === 'string' && movie.genres.trim().length > 0) {
            return movie.genres.split(',').map(g => g.trim()).filter(Boolean);
        }
        if (typeof movie.genre_id === 'string' && movie.genre_id.trim().length > 0) {
            return movie.genre_id.split(',').map(g => g.trim()).filter(Boolean);
        }
        return [];
    }, [movie.genres, movie.genre_id]);

    // Parse dynamic actors
    const actorsList: string[] = useMemo(() => {
        if (movie.actors && typeof movie.actors === 'string' && movie.actors.trim().length > 0) {
            return movie.actors.split(',').map(a => a.trim()).filter(Boolean);
        }
        return [];
    }, [movie.actors]);

    const totalEndings = movie.total_endings || (scenes.filter(s => s.is_ending).length > 0 ? scenes.filter(s => s.is_ending).length : 5);

    // Check user endings from localStorage
    useEffect(() => {
        if (typeof window !== 'undefined' && movie.interactive_movie_id) {
            try {
                const stored = localStorage.getItem(`vtagu_endings_${movie.interactive_movie_id}`);
                if (stored) {
                    const parsed = JSON.parse(stored);
                    if (Array.isArray(parsed)) {
                        setUnlockedEndings(Math.min(totalEndings, parsed.length));
                    }
                }
            } catch (e) { }
        }
    }, [movie.interactive_movie_id, totalEndings]);

    // Record ending when reached
    useEffect(() => {
        if (currentScene?.is_ending && typeof window !== 'undefined' && movie.interactive_movie_id) {
            try {
                const key = `vtagu_endings_${movie.interactive_movie_id}`;
                const stored = localStorage.getItem(key);
                const currentList: number[] = stored ? JSON.parse(stored) : [];
                if (!currentList.includes(currentScene.scene_id)) {
                    const updated = [...currentList, currentScene.scene_id];
                    localStorage.setItem(key, JSON.stringify(updated));
                    setUnlockedEndings(Math.min(totalEndings, updated.length));
                }
            } catch (e) { }
        }
    }, [currentScene?.is_ending, currentScene?.scene_id, movie.interactive_movie_id, totalEndings]);

    const checkAccess = async () => {
        setCheckingAccess(true);

        let isUserPaidAccount = false;
        try {
            const userJson = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
            if (userJson) {
                const userObj = JSON.parse(userJson);
                const nowSec = Math.floor(Date.now() / 1000);
                const subExpiry = userObj.active_subscription?.timestamp_to;
                const isSubExpired = userObj.is_expired || (subExpiry ? Number(subExpiry) < nowSec : false);

                if (
                    !isSubExpired && (
                        userObj.is_subscribed ||
                        userObj.isSubscribed ||
                        String(userObj.type) === '1' ||
                        String(userObj.type) === '2' ||
                        userObj.role === 'admin'
                    )
                ) {
                    isUserPaidAccount = true;
                }
            }
        } catch (e) { }

        const isMovieFree =
            Number(movie.is_free) === 1 ||
            Number((movie as any).isFree) === 1 ||
            Boolean(movie.is_free) === true ||
            String(movie.is_free) === '1' ||
            Number(movie.price) === 0 ||
            movie.price === 0;

        try {
            const userId = getUserId();
            const result = await checkMovieAccess(movie.interactive_movie_id, userId);
            setAccessData(result);
            const authorized = Boolean(isUserPaidAccount || result.hasAccess || isMovieFree);
            setIsAuthorized(authorized);

            const needsSceneRefresh = authorized || isMovieFree || scenes.length === 0 || scenes.some(s => !s.scene_url || s.scene_url.trim() === '');
            if (needsSceneRefresh) {
                const refreshedScenes = await getScenes(movie.interactive_movie_id, userId);
                if (Array.isArray(refreshedScenes) && refreshedScenes.length > 0) {
                    setScenes(refreshedScenes);
                    setCurrentScene(prev => {
                        if (!prev) return refreshedScenes.find(s => s?.is_start) || refreshedScenes[0];
                        return refreshedScenes.find(s => s.scene_id === prev.scene_id) || refreshedScenes[0];
                    });
                }
            }
        } catch (error) {
            console.error('Error checking movie access:', error);
            const fallbackAuthorized = Boolean(isUserPaidAccount || isMovieFree);
            setIsAuthorized(fallbackAuthorized);
            if (fallbackAuthorized) {
                try {
                    const fallbackScenes = await getScenes(movie.interactive_movie_id, getUserId());
                    if (Array.isArray(fallbackScenes) && fallbackScenes.length > 0) {
                        setScenes(fallbackScenes);
                        setCurrentScene(prev => {
                            if (!prev) return fallbackScenes.find(s => s?.is_start) || fallbackScenes[0];
                            return fallbackScenes.find(s => s.scene_id === prev.scene_id) || fallbackScenes[0];
                        });
                    }
                } catch (e) { }
            }
        } finally {
            setCheckingAccess(false);
        }
    };

    useEffect(() => {
        checkAccess();

        const handleAuthUpdate = () => {
            checkAccess();
        };

        window.addEventListener('authChanged', handleAuthUpdate);
        window.addEventListener('storage', handleAuthUpdate);
        return () => {
            window.removeEventListener('authChanged', handleAuthUpdate);
            window.removeEventListener('storage', handleAuthUpdate);
        };
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
            const isMovieFree = Number(movie.is_free) === 1 || Number(movie.price) === 0;
            const isSceneFree =
                Number(scene.is_free) === 1 ||
                Boolean(scene.is_free) === true ||
                String(scene.is_free) === '1' ||
                String(scene.is_free).toLowerCase() === 'true';
            const hasVideo = Boolean(scene.scene_url && scene.scene_url.trim().length > 0);

            // If user is not authorized and target scene is locked or lacks video, show recommended unlock modal instead of broken black screen
            if (!isAuthorized && !isMovieFree && (scene.is_locked || !isSceneFree || !hasVideo)) {
                setShowPaywallModal(true);
                return;
            }

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
            managerRef.current?.restartPlayback();
            managerRef.current?.requestFullScreen();
        }
    };

    const handleBeginNarrative = () => {
        const playerEl = document.getElementById('interactive-player-section') || document.getElementById('interactive-experience');
        if (playerEl) {
            playerEl.scrollIntoView({ behavior: 'smooth' });
        }
        handleRestart();
    };

    if (checkingAccess) {
        return (
            <div className="min-h-screen bg-[#070913] flex items-center justify-center text-white">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-cyan-400/30 border-t-cyan-400 rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
                    <span className="text-xs uppercase font-black tracking-[0.25em] text-cyan-300/80">Loading Narrative Matrix...</span>
                </div>
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

            {/* Cast & Creative Crew Modal */}
            <AnimatePresence>
                {showCastModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setShowCastModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-2xl bg-[#0d101d] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.15)] text-white space-y-6"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                        <Users size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-wider text-white">Cast & Creative Crew</h3>
                                        <p className="text-xs text-white/50">{movie.title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowCastModal(false)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            {/* Director Block */}
                            {displayDirector ? (
                                <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/20 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 font-black">
                                            <User size={22} />
                                        </div>
                                        <div>
                                            <span className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-400">Director</span>
                                            <h4 className="text-base font-bold text-white">{displayDirector}</h4>
                                        </div>
                                    </div>
                                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 uppercase tracking-wider">
                                        Primary Lead
                                    </span>
                                </div>
                            ) : null}

                            {/* Actors List */}
                            {actorsList.length > 0 ? (
                                <div className="space-y-3">
                                    <span className="text-[11px] font-black uppercase tracking-[0.2em] text-white/50">Starring Cast ({actorsList.length})</span>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                                        {actorsList.map((actor, idx) => (
                                            <div key={idx} className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center gap-2.5">
                                                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs font-bold text-white/80 shrink-0">
                                                    {actor.charAt(0)}
                                                </div>
                                                <span className="text-xs font-medium text-white/90 truncate">{actor}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : !displayDirector ? (
                                <div className="p-8 rounded-2xl bg-white/5 border border-white/10 text-center text-white/50 text-xs">
                                    Cast and crew details will be updated soon.
                                </div>
                            ) : null}

                            <button
                                onClick={() => setShowCastModal(false)}
                                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg shadow-cyan-400/20 active:scale-95"
                            >
                                Close Details
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Contact / More Info Modal */}
            <AnimatePresence>
                {showInfoModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xl"
                        onClick={() => setShowInfoModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="relative w-full max-w-xl bg-[#0d101d] border border-cyan-500/30 rounded-3xl p-6 md:p-8 shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.15)] text-white space-y-6"
                        >
                            <div className="flex items-center justify-between pb-4 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400">
                                        <Info size={20} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-black uppercase tracking-wider text-white">Interactive Cinema Guide</h3>
                                        <p className="text-xs text-white/50">{movie.title}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowInfoModal(false)}
                                    className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 border border-white/10 flex items-center justify-center text-white/70 hover:text-white transition-all"
                                >
                                    <X size={18} />
                                </button>
                            </div>

                            <div className="space-y-4 text-sm text-white/70 leading-relaxed">
                                <p>
                                    Welcome to PrimeTime Interactive Originals. Unlike traditional movies, you hold the decision matrix. Every choice you make forks the storyline into distinctive paths leading to unique conclusions.
                                </p>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-cyan-300">Tips for Best Experience</h4>
                                    <ul className="text-xs space-y-1.5 list-disc list-inside text-white/60">
                                        <li>Use headphones for 3D binaural spatial sound cues.</li>
                                        <li>You have limited time on critical branch points to pick your choice.</li>
                                        <li>You can rewind your decision at any ending to discover alternative fates.</li>
                                    </ul>
                                </div>
                                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                                    <div>
                                        <span className="text-[10px] font-black uppercase tracking-wider text-white/40">Inquiries & Licensing</span>
                                        <div className="text-xs font-bold text-white">support@vtagu.com</div>
                                    </div>
                                    <Mail size={18} className="text-cyan-400" />
                                </div>
                            </div>

                            <button
                                onClick={() => setShowInfoModal(false)}
                                className="w-full py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-widest transition-all shadow-lg active:scale-95"
                            >
                                Got it
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <main className="min-h-screen bg-[#070913] text-white overflow-x-hidden font-inter selection:bg-cyan-500/30">
                {/* Hero Header Section */}
                <div className="relative w-full h-[520px] md:h-[660px] lg:h-[760px] overflow-hidden">
                    <div className="absolute inset-0 z-0">
                        <Image
                            src={movie.banner_image || movie.card_image || "/journey_of_ashwin_banner_img.png"}
                            alt={movie.title}
                            fill
                            className="object-cover opacity-60 scale-100"
                            priority
                        />
                        {/* Cinematic gradient overlays */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#070913] via-[#070913]/60 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#070913] via-[#070913]/80 to-transparent" />
                    </div>

                    <div className="relative z-10 max-w-[92%] 2xl:max-w-7xl mx-auto h-full flex flex-col justify-end pb-12 md:pb-16">
                        {/* Interactive Original Badge */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                            className="flex flex-wrap items-center gap-3 mb-4"
                        >
                            <div className="inline-flex items-center gap-2 bg-cyan-400 text-black px-4 py-1.5 rounded-full font-black text-[10px] uppercase tracking-widest shadow-[0_0_20px_rgba(34,211,238,0.4)]">
                                <Zap size={13} fill="black" />
                                <span>Interactive Original</span>
                            </div>
                        </motion.div>

                        {/* Title */}
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.1 }}
                            className="text-[clamp(1.75rem,3.5vw,4rem)] font-black tracking-tight uppercase leading-[1.05] max-w-4xl mb-4 drop-shadow-2xl"
                        >
                            {movie.title}
                        </motion.h1>

                        {/* Metadata Pills: Language, Quality, Certificate */}
                        <motion.div
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="flex flex-wrap items-center gap-2.5 mb-4"
                        >
                            {/* Language Pill */}
                            {displayLanguage && (
                                <div className="inline-flex items-center gap-1.5 bg-cyan-950/40 border border-cyan-400/50 text-cyan-300 px-3.5 py-1 rounded-full font-black text-[11px] uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                                    <Globe size={13} className="text-cyan-400" />
                                    <span>{displayLanguage}</span>
                                </div>
                            )}

                            {/* Quality Pill (4K ULTRA HD) - Dynamic */}
                            {Boolean((movie as any).quality || (movie as any).video_quality || (movie as any).play_quality) && (
                                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/50 text-amber-400 px-3.5 py-1 rounded-full font-black text-[11px] uppercase tracking-wider backdrop-blur-md shadow-[0_0_15px_rgba(251,191,36,0.2)]">
                                    <span>{(movie as any).quality || (movie as any).video_quality || (movie as any).play_quality}</span>
                                </div>
                            )}

                            {/* Certificate Pill (U/A 13+) - Dynamic */}
                            {Boolean((movie as any).certificate?.code) && (
                                <div
                                    style={
                                        (movie as any).certificate?.badge_color
                                            ? {
                                                borderColor: `${(movie as any).certificate.badge_color}60`,
                                                backgroundColor: `${(movie as any).certificate.badge_color}18`,
                                                color: (movie as any).certificate.badge_color || '#fff'
                                            }
                                            : undefined
                                    }
                                    className="inline-flex items-center gap-1.5 bg-white/5 border border-white/20 text-white/90 px-3 py-1 rounded-full font-black text-[11px] uppercase tracking-wider backdrop-blur-md shadow-lg"
                                >
                                    <span>{(movie as any).certificate.code}</span>
                                    {Boolean((movie as any).certificate?.certification_system) && (
                                        <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white/80 rounded font-bold">
                                            {(movie as any).certificate.certification_system}
                                        </span>
                                    )}
                                </div>
                            )}
                        </motion.div>

                        {/* Genre Pills */}
                        {genresList.length > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.25 }}
                                className="flex flex-wrap items-center gap-2 mb-5"
                            >
                                {genresList.map((genre, idx) => (
                                    <span
                                        key={idx}
                                        className="px-3.5 py-1 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 text-[11px] font-semibold tracking-wide backdrop-blur-sm transition-colors"
                                    >
                                        {genre}
                                    </span>
                                ))}
                            </motion.div>
                        )}

                        {/* Synopsis / Description */}
                        {displayDescription && (
                            <motion.p
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.3 }}
                                className="text-white/70 text-sm md:text-base lg:text-lg line-clamp-3 max-w-2xl leading-relaxed mb-8"
                            >
                                {displayDescription}
                            </motion.p>
                        )}

                        {/* Begin Narrative CTA Button */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.35 }}
                            className="flex flex-wrap items-center gap-4"
                        >
                            {isAuthorized || scenes.some(s => Number(s.is_free) === 1 || Boolean(s.is_free) === true || (!!s.scene_url && s.scene_url.length > 0)) ? (
                                <button
                                    onClick={handleBeginNarrative}
                                    className="flex items-center gap-3 bg-gradient-to-r from-cyan-400 via-cyan-300 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black px-8 py-3.5 rounded-full font-black text-sm md:text-base uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(34,211,238,0.5)] hover:shadow-[0_0_45px_rgba(34,211,238,0.8)] active:scale-95 group cursor-pointer"
                                >
                                    <div className="w-6 h-6 rounded-full bg-black/15 flex items-center justify-center">
                                        <Play size={15} fill="black" className="ml-0.5" />
                                    </div>
                                    <span className="font-black">START INTERACTIVE</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            ) : (
                                <button
                                    onClick={() => setShowPaywallModal(true)}
                                    className="flex items-center gap-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 text-white px-8 py-3.5 rounded-full font-black text-sm md:text-base uppercase tracking-wider transition-all duration-300 shadow-[0_0_30px_rgba(59,130,246,0.5)] active:scale-95 group cursor-pointer"
                                >
                                    <Lock size={18} className="group-hover:scale-110 transition-transform" />
                                    <span>Subscribe to Watch</span>
                                    <ChevronRight size={18} className="group-hover:translate-x-1.5 transition-transform" />
                                </button>
                            )}
                        </motion.div>
                    </div>
                </div>

                {/* Content Section with Original Full-width Player */}
                <section className="max-w-[94%] 2xl:max-w-7xl mx-auto py-10 md:py-16 space-y-16">
                    {/* Scene Manager / Free Preview Player (Full-Width Cinematic Placement) */}
                    <div id="interactive-player-section" className="animate-in fade-in zoom-in duration-1000">
                        {(isAuthorized || (scenes.some(s => Number(s.is_free) === 1 || Boolean(s.is_free) === true || s.is_locked === false || (!!s.scene_url && s.scene_url.length > 0)))) ? (
                            <SceneManager
                                ref={managerRef}
                                currentScene={currentScene}
                                choices={choices}
                                loadingChoices={loadingChoices}
                                onChoiceSelect={handleSceneChange}
                                onRestart={handleRestart}
                                onPrevious={handlePrevious}
                                hasPrevious={sceneHistory.length > 0}
                                movieId={movie.interactive_movie_id}
                                movieTitle={movie.title}
                                isAuthorized={isAuthorized || Number(movie.is_free) === 1 || Number(movie.price) === 0}
                                scenes={scenes}
                                onShowPaywall={() => setShowPaywallModal(true)}
                                previewStep={sceneHistory.length + 1}
                            />
                        ) : (
                            <div className="p-12 md:p-16 rounded-[2.5rem] bg-white/5 border border-white/10 flex flex-col items-center justify-center text-center gap-6 backdrop-blur-xl">
                                <div className="w-16 h-16 rounded-full bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
                                    <Lock size={32} />
                                </div>
                                <div className="space-y-2 max-w-md">
                                    <h3 className="text-2xl font-black text-white uppercase tracking-tight">Premium Interactive Experience</h3>
                                    <p className="text-white/60 text-base leading-relaxed">
                                        Unlock full interactive choices and shape the outcome of {movie.title} with a PrimeTime subscription.
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowPaywallModal(true)}
                                    className="flex items-center justify-center gap-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3.5 rounded-2xl font-black text-base uppercase tracking-tight transition-all duration-300 shadow-[0_20px_50px_rgba(59,130,246,0.3)] active:scale-95"
                                >
                                    <Lock size={22} />
                                    <span>Subscribe to Watch</span>
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Movie Information & Interactive Details Section (Cleanly Placed Below Player) */}
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start pt-4">
                        {/* Left: 3 Feature Highlights (lg:col-span-7) */}
                        <div className="lg:col-span-7 space-y-4">
                            <div className="flex items-center gap-3 pb-1">
                                <div className="w-8 h-8 rounded-lg bg-cyan-400/10 border border-cyan-400/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.3)]">
                                    <Sparkles size={18} />
                                </div>
                                <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-cyan-400">
                                    Interactive Highlights
                                </h3>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                {/* Card 1: Multiple Endings */}
                                <div className="p-6 rounded-2xl bg-[#0a0d1a]/85 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 space-y-3 group backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <Target size={20} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-white">Multiple Endings</h4>
                                        <p className="text-white/50 text-[11px] leading-relaxed">
                                            Your choices define the outcome. Explore unique narrative conclusions based on your decisions.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 2: Real-Time Choices */}
                                <div className="p-6 rounded-2xl bg-[#0a0d1a]/85 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 space-y-3 group backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <Zap size={20} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-white">Real-Time Choices</h4>
                                        <p className="text-white/50 text-[11px] leading-relaxed">
                                            Experience zero-latency transitions between scenes. The story unfolds seamlessly as you interact.
                                        </p>
                                    </div>
                                </div>

                                {/* Card 3: Premium Audio */}
                                <div className="p-6 rounded-2xl bg-[#0a0d1a]/85 border border-white/10 hover:border-cyan-500/40 transition-all duration-300 space-y-3 group backdrop-blur-xl">
                                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
                                        <Volume2 size={20} />
                                    </div>
                                    <div className="space-y-1.5">
                                        <h4 className="text-xs font-black uppercase tracking-wider text-white">Premium Audio</h4>
                                        <p className="text-white/50 text-[11px] leading-relaxed">
                                            Optimized for binaural spatial sound cues. Best experienced with headphones.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <section className="py-16 md:py-24">
                                <div className="max-w-[90%] 2xl:max-w-7xl mx-auto text-center space-y-6">
                                    <h2 className="text-2xl sm:text-3xl md:text-4xl font-black uppercase tracking-tight text-white">
                                        The <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">Future</span> of Cinema
                                    </h2>
                                    <p className="text-white/50 max-w-xl mx-auto text-xs sm:text-sm md:text-base leading-relaxed">
                                        No longer just a spectator. Step into the director's chair and guide the fate of the characters in this next-generation interactive epic.
                                    </p>
                                    <div className="pt-4">
                                        <a
                                            href="/interactive"
                                            className="inline-flex items-center gap-3 text-cyan-400 hover:text-white font-black text-xs uppercase tracking-[0.25em] transition-colors group"
                                        >
                                            <span>View More Interactive Originals</span>
                                            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
                                        </a>
                                    </div>
                                </div>
                            </section>
                        </div>

                        {/* Right: Interactive Details Card (lg:col-span-5) */}
                        <div className="lg:col-span-5">
                            <div className="rounded-2xl md:rounded-3xl bg-[#0e1224]/90 border border-cyan-500/30 p-6 md:p-7 shadow-[0_15px_40px_rgba(0,0,0,0.6)] space-y-6">
                                {/* Header */}
                                <div className="flex items-center gap-2.5 pb-4 border-b border-white/10">
                                    <Info size={18} className="text-cyan-400" />
                                    <h3 className="text-sm md:text-base font-black uppercase tracking-wider text-white">
                                        Interactive Details
                                    </h3>
                                </div>

                                {/* Details List */}
                                <div className="space-y-4 text-xs">
                                    {/* Director */}
                                    <div className="flex items-start justify-between py-2 border-b border-white/5 gap-4">
                                        <div className="flex items-center gap-2 text-white/50 uppercase font-black tracking-wider shrink-0">
                                            <User size={15} className="text-cyan-400" />
                                            <span>Director</span>
                                        </div>
                                        <span className="font-bold text-white text-right">{displayDirector || 'Not Specified'}</span>
                                    </div>

                                    {/* Language */}
                                    <div className="flex items-start justify-between py-2 border-b border-white/5 gap-4">
                                        <div className="flex items-center gap-2 text-white/50 uppercase font-black tracking-wider shrink-0">
                                            <Globe size={15} className="text-cyan-400" />
                                            <span>Language</span>
                                        </div>
                                        <span className="font-bold text-white text-right">{displayLanguage || 'Not Specified'}</span>
                                    </div>

                                    {/* Starring */}
                                    <div className="flex flex-col py-2 border-b border-white/5 gap-2">
                                        <div className="flex items-center gap-2 text-white/50 uppercase font-black tracking-wider">
                                            <Users size={15} className="text-cyan-400" />
                                            <span>Starring</span>
                                        </div>
                                        <p className="font-medium text-white/80 leading-relaxed text-[11px] pl-6">
                                            {displayStarring || 'Not Specified'}
                                        </p>
                                    </div>

                                    {/* Released */}
                                    <div className="flex items-start justify-between py-2 border-b border-white/5 gap-4">
                                        <div className="flex items-center gap-2 text-white/50 uppercase font-black tracking-wider shrink-0">
                                            <Calendar size={15} className="text-cyan-400" />
                                            <span>Released</span>
                                        </div>
                                        <span className="font-bold text-white text-right">{displayYear || 'Not Specified'}</span>
                                    </div>

                                    {/* Duration */}
                                    <div className="flex items-start justify-between py-2 border-b border-white/5 gap-4">
                                        <div className="flex items-center gap-2 text-white/50 uppercase font-black tracking-wider shrink-0">
                                            <Clock size={15} className="text-cyan-400" />
                                            <span>Duration</span>
                                        </div>
                                        <span className="font-bold text-white text-right">{displayDuration || 'Multi-branch'}</span>
                                    </div>
                                </div>

                                {/* Action Buttons: View Cast & Crew, Contact / More Info */}
                                <div className="space-y-3 pt-2">
                                    <button
                                        onClick={() => setShowCastModal(true)}
                                        className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-black text-xs uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(34,211,238,0.25)] active:scale-95 cursor-pointer"
                                    >
                                        <Users size={15} fill="black" />
                                        <span>View Cast & Crew</span>
                                    </button>

                                    <button
                                        onClick={() => setShowInfoModal(true)}
                                        className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 hover:border-white/25 text-white/80 hover:text-white font-bold text-xs uppercase tracking-wider transition-all duration-300 active:scale-95 cursor-pointer"
                                    >
                                        <Mail size={15} className="text-cyan-400" />
                                        <span>Contact / More Info</span>
                                    </button>
                                </div>

                                {/* Endings Progress Bar */}
                                <div className="pt-4 border-t border-white/10 space-y-2.5">
                                    <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider">
                                        <div className="flex items-center gap-2 text-cyan-300">
                                            <Target size={16} className="text-cyan-400" />
                                            <span>{unlockedEndings} / {totalEndings} Endings Unlocked</span>
                                        </div>
                                        <span className="text-white/40 text-[10px]">
                                            {totalEndings > 0 ? Math.round((unlockedEndings / totalEndings) * 100) : 0}%
                                        </span>
                                    </div>
                                    <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                                        <div
                                            className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 shadow-[0_0_12px_rgba(34,211,238,0.8)] transition-all duration-700"
                                            style={{ width: `${totalEndings > 0 ? Math.min(100, (unlockedEndings / totalEndings) * 100) : 0}%` }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </>
    );
}
