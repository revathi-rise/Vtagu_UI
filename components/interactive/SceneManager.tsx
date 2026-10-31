'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Target, ChevronRight, RotateCcw, CheckCircle2, Lock, Sparkles, Compass, Film } from 'lucide-react';
import { Scene, Choice } from '@/lib/vtagu.api';
import WatchTrackingVideoPlayer, { VideoPlayerHandle } from '@/components/ui/WatchTrackingVideoPlayer';
import {
  requestElementFullscreen,
  exitDocumentFullscreen,
  isElementFullscreen,
  addFullscreenChangeListener,
} from '@/lib/fullscreen-utils';

interface SceneManagerProps {
    currentScene: Scene | null;
    choices: Choice[];
    onChoiceSelect: (nextSceneId: number) => void;
    onRestart: () => void;
    onPrevious?: () => void;
    hasPrevious?: boolean;
    movieId?: number;
    movieTitle?: string;
    isAuthorized?: boolean;
    scenes?: Scene[];
    onShowPaywall?: () => void;
    loadingChoices?: boolean;
    previewStep?: number;
    onResetScene?: () => void;
}

export interface SceneManagerHandle {
    requestFullScreen: () => void;
    restartPlayback: () => void;
    resetScene: () => void;
}

// Helpers for premium button coloring and timing logic
function hexToRgba(hex: string, alpha: number): string {
  let cleanHex = hex.replace('#', '');
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split('').map(char => char + char).join('');
  }
  if (cleanHex.length === 6) {
    const r = parseInt(cleanHex.substring(0, 2), 16);
    const g = parseInt(cleanHex.substring(2, 4), 16);
    const b = parseInt(cleanHex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  return `rgba(255, 255, 255, ${alpha})`;
}

function getButtonStyles(color: string | undefined) {
  const baseColor = color || '#22d3ee'; // Default to cyan-400
  const isHex = baseColor.startsWith('#');
  
  if (isHex) {
    return {
      baseColor,
      rgbaBorder: hexToRgba(baseColor, 0.3),
      rgbaGlow: hexToRgba(baseColor, 0.6),
      rgbaBgHover: hexToRgba(baseColor, 0.15),
    };
  }
  
  return {
    baseColor,
    rgbaBorder: baseColor,
    rgbaGlow: baseColor,
    rgbaBgHover: baseColor,
  };
}

const parseTimeToSeconds = (timeVal: string | number | undefined | null): number => {
  if (timeVal === undefined || timeVal === null) return 0;
  if (typeof timeVal === 'number') return timeVal;
  
  const parts = String(timeVal).split(':');
  if (parts.length === 3) {
    const hours = parseInt(parts[0], 10) || 0;
    const minutes = parseInt(parts[1], 10) || 0;
    const seconds = parseFloat(parts[2]) || 0;
    return hours * 3600 + minutes * 60 + seconds;
  } else if (parts.length === 2) {
    const minutes = parseInt(parts[0], 10) || 0;
    const seconds = parseFloat(parts[1]) || 0;
    return minutes * 60 + seconds;
  }
  
  const parsed = parseFloat(String(timeVal));
  return isNaN(parsed) ? 0 : parsed;
};

const SceneManager = forwardRef<SceneManagerHandle, SceneManagerProps>(
    ({ currentScene, choices, onChoiceSelect, onRestart, onPrevious, hasPrevious = false, movieId, movieTitle, isAuthorized = false, scenes = [], onShowPaywall, loadingChoices = false, previewStep, onResetScene }, ref) => {
    const playerRef = useRef<VideoPlayerHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // Synthesized click sound effect generator
    const playClickSound = () => {
        try {
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gainNode = ctx.createGain();
            
            osc.connect(gainNode);
            gainNode.connect(ctx.destination);
            
            osc.type = 'sine';
            osc.frequency.setValueAtTime(1500, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.03);
            
            gainNode.gain.setValueAtTime(0.12, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {
            // Safe catch for browser autoplays
        }
    };
    
    // UI State - Autoplay disabled by default on initial page load
    const [hasUserStarted, setHasUserStarted] = useState(false);
    const [prevSceneId, setPrevSceneId] = useState<number | undefined>(undefined);
    const [showChoices, setShowChoices] = useState(false);
    const [lockedChoiceModal, setLockedChoiceModal] = useState<{
        isOpen: boolean;
        choiceText: string;
        targetSceneId: number | null;
    } | null>(null);

    const [isFullscreen, setIsFullscreen] = useState(false);

    useEffect(() => {
        const updateFs = () => {
            setIsFullscreen(isElementFullscreen(containerRef.current));
        };
        updateFs();
        const cleanup = addFullscreenChangeListener(updateFs);
        return cleanup;
    }, []);

    if (currentScene?.scene_id !== prevSceneId) {
        setPrevSceneId(currentScene?.scene_id);
        setShowChoices(false);
    }
    
    // Reset Scene Handler: Rewinds playback of current scene from 0:00
    const handleResetScene = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        playClickSound();
        setShowChoices(false);
        setHasUserStarted(true);
        if (playerRef.current?.restartPlayback) {
            playerRef.current.restartPlayback();
        } else if (playerRef.current?.videoElement) {
            playerRef.current.videoElement.currentTime = 0;
            playerRef.current.videoElement.play().catch(() => {});
        }
        if (onResetScene) {
            onResetScene();
        }
    };

    useImperativeHandle(ref, () => ({
        requestFullScreen: async () => {
            await requestElementFullscreen(containerRef.current);
        },
        restartPlayback: () => {
            setShowChoices(false);
            setHasUserStarted(true);
            if (playerRef.current?.restartPlayback) {
                playerRef.current.restartPlayback();
            } else if (playerRef.current?.videoElement) {
                playerRef.current.videoElement.currentTime = 0;
                playerRef.current.videoElement.play().catch(() => {});
            }
        },
        resetScene: () => {
            handleResetScene();
        }
    }));

    const handleRestartClick = (e?: React.MouseEvent) => {
        e?.stopPropagation();
        playClickSound();
        setShowChoices(false);
        setHasUserStarted(true);
        if (playerRef.current?.restartPlayback) {
            playerRef.current.restartPlayback();
        } else if (playerRef.current?.videoElement) {
            playerRef.current.videoElement.currentTime = 0;
            playerRef.current.videoElement.play().catch(() => {});
        }
        onRestart();
    };

    const handleFullscreenRequest = async () => {
        if (isElementFullscreen(containerRef.current)) {
            await exitDocumentFullscreen();
        } else {
            await requestElementFullscreen(containerRef.current);
        }
    };

    const exitFullscreenIfActive = () => {
        if (isElementFullscreen(containerRef.current, playerRef.current?.videoElement)) {
            exitDocumentFullscreen(playerRef.current?.videoElement).catch(() => {});
            setTimeout(() => {
                const playerEl = document.getElementById('interactive-player-section') || containerRef.current;
                playerEl?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 100);
        }
    };

    const videoUrl = currentScene?.poster_url || currentScene?.scene_url || '';
    const sceneIndex = scenes.findIndex(s => s.scene_id === currentScene?.scene_id);
    const currentSceneNum = sceneIndex >= 0 ? sceneIndex + 1 : 1;
    const totalScenesNum = Math.max(scenes.length, 1);

    const handleTimeUpdate = (currentTime: number, duration: number) => {
        if (!hasUserStarted) {
            if (currentTime > 0.5) {
                setHasUserStarted(true);
            } else {
                return;
            }
        }
        if (currentScene?.is_ending) return;

        if (currentScene?.show_choices_on) {
            const showChoicesSeconds = parseTimeToSeconds(currentScene.show_choices_on);
            if (showChoicesSeconds > 0 && currentTime >= showChoicesSeconds && currentTime > 0.5 && !showChoices) {
                setShowChoices(true);
            }
        }
    };

    const isEndingScene = Boolean(
        currentScene?.is_ending || 
        (!loadingChoices && choices.length === 0)
    );
    const hasNextVideo = !isEndingScene && choices.length > 0;

    const handleNextScene = () => {
        if (!hasNextVideo) return;
        setHasUserStarted(true);
        if (playerRef.current?.videoElement) {
            playerRef.current.videoElement.currentTime = Math.max(0, (playerRef.current.videoElement.duration || 1) - 0.5);
        }
        setShowChoices(true);
    };

    const hasShowOnTime = currentScene?.show_choices_on ? parseTimeToSeconds(currentScene.show_choices_on) > 0 : false;
    const isCurrentSceneFree =
        Number(currentScene?.is_free) === 1 ||
        currentScene?.is_free === true ||
        String(currentScene?.is_free) === '1' ||
        String(currentScene?.is_free).toLowerCase() === 'true';

    const isPreviewActive = !isAuthorized && isCurrentSceneFree;
    const currentPreviewStep = previewStep !== undefined ? previewStep : (hasPrevious ? 2 : 1);
    const isPreviewLimitReached = isPreviewActive && currentPreviewStep >= 3;

    return (
        <div className="space-y-4 sm:space-y-6 w-full min-w-0">
            {/* Header: Interactive Core & Scene Status Badge */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4">
                <h2 className="text-xl sm:text-3xl font-extrabold flex items-center gap-2 sm:gap-3 shrink-0">
                    <Target className="text-cyan-400 w-5 h-5 sm:w-7 sm:h-7 shrink-0" />
                    Interactive <span className="text-gradient">Core</span>
                </h2>
                {currentScene && (
                    <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto justify-start sm:justify-end">
                        {!isAuthorized && isCurrentSceneFree ? (
                            <div className="text-emerald-400 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-emerald-500/10 px-3 sm:px-4 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-1.5 sm:gap-2 shadow-lg shadow-emerald-500/10 animate-pulse">
                                <span>🔓</span> FREE PREVIEW • SCENE {Math.min(currentPreviewStep, 3)} OF 3
                            </div>
                        ) : (
                            <div className="text-cyan-400/80 text-[10px] sm:text-xs font-black uppercase tracking-wider bg-cyan-400/5 px-3 py-1.5 rounded-full border border-cyan-400/20 truncate max-w-[220px] sm:max-w-none">
                                {currentScene.scene_text || `Scene: ${currentScene.title}`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Free Preview Banner Card */}
            {!isAuthorized && isCurrentSceneFree && (
                <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-blue-500/15 border border-emerald-500/30 rounded-2xl sm:rounded-3xl p-3.5 sm:p-5 md:p-6 flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 backdrop-blur-xl shadow-xl overflow-hidden">
                    {/* Left: Icon, Title, Badge & Explanation */}
                    <div className="flex items-start gap-3 sm:gap-4 min-w-0 flex-1">
                        <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold text-base sm:text-xl shrink-0 shadow-inner">
                            🔓
                        </div>
                        <div className="min-w-0 flex-1 space-y-1">
                            <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide">
                                    Free Preview Experience
                                </h4>
                                <span className="text-[10px] sm:text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/30 shadow-sm shrink-0">
                                    Scene {Math.min(currentPreviewStep, 3)} of 3
                                </span>
                            </div>
                            <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xl">
                                {currentPreviewStep < 3
                                    ? `Scene ${currentPreviewStep} → Choose next path (${3 - currentPreviewStep} scene${3 - currentPreviewStep > 1 ? 's' : ''} remaining in preview)`
                                    : 'Final preview scene decision! Upgrade to unlock the full movie and all hidden endings.'}
                            </p>
                        </div>
                    </div>

                    {/* Right: Reset Scene & Unlock Buttons */}
                    <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2 sm:gap-3 shrink-0 w-full lg:w-auto">
                        <button
                            onClick={() => onShowPaywall && onShowPaywall()}
                            className="w-full min-[420px]:w-auto px-4 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-cyan-500 to-blue-600 text-black font-black text-xs sm:text-sm uppercase tracking-wider hover:brightness-110 transition-all shadow-lg shadow-cyan-500/25 shrink-0 cursor-pointer active:scale-95 flex items-center justify-center gap-1.5 whitespace-nowrap order-1 min-[420px]:order-2"
                        >
                            <span>Unlock Full Movie</span>
                            <span className="text-black">✦</span>
                        </button>
                        <button
                            onClick={handleResetScene}
                            className="w-full min-[420px]:w-auto px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm uppercase tracking-wider transition-all border border-white/20 hover:border-white/40 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-md whitespace-nowrap order-2 min-[420px]:order-1"
                            title="Replay this scene from 0:00"
                        >
                            <RotateCcw size={14} className="sm:w-[15px] sm:h-[15px] shrink-0" />
                            <span>Reset Scene</span>
                        </button>
                    </div>
                </div>
            )}

            {/* Interactive Player Area */}
            <div
                ref={containerRef}
                className={`relative overflow-hidden group transition-all duration-200 ${
                    isFullscreen
                        ? 'w-screen h-screen max-w-none max-h-none rounded-none border-0 ring-0 shadow-none m-0 p-0 aspect-auto bg-black'
                        : 'aspect-video rounded-xl sm:rounded-[2rem] bg-black border border-white/5 shadow-2xl ring-1 ring-white/10 w-full'
                }`}
            >
                {currentScene ? (
                    <>
                        {videoUrl ? (
                            <WatchTrackingVideoPlayer
                                ref={playerRef}
                                src={videoUrl}
                                contentId={movieId ? movieId.toString() : (currentScene.scene_id?.toString() || currentScene.title || 'scene')}
                                contentType="interactive_movie"
                                title={movieTitle || "Interactive Adventure"}
                                metadata=""
                                autoPlay={hasUserStarted}
                                autoResume={false}
                                loop={false}
                                showControls={!showChoices}
                                onPlay={() => setHasUserStarted(true)}
                                onTimeUpdate={handleTimeUpdate}
                                onEnded={() => {
                                    if (hasUserStarted) {
                                        setShowChoices(true);
                                        // Free Scene completed in Full Screen -> return back to actual place
                                        exitFullscreenIfActive();
                                    }
                                }}
                                className="w-full h-full"
                                showSkip={hasNextVideo}
                                onSkip={hasNextVideo ? handleNextScene : undefined}
                                showNext={hasNextVideo}
                                onNext={hasNextVideo ? handleNextScene : undefined}
                                showPrevious={Boolean(hasPrevious)}
                                onPrevious={hasPrevious ? onPrevious : undefined}
                                onFullscreenRequest={handleFullscreenRequest}
                                subtitles={currentScene.subtitles}
                                audioTracks={(currentScene as any).audioTracks || (currentScene as any).audio_tracks}
                            />
                        ) : (
                            <div className="w-full h-full flex flex-col items-center justify-center bg-black/95 p-8 text-center gap-5">
                                <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                                    <Lock size={30} />
                                </div>
                                <div className="space-y-1">
                                    <h3 className="text-xl font-bold text-white uppercase tracking-tight">Scene Locked</h3>
                                    <p className="text-white/60 text-sm max-w-md">
                                        This scene requires an active PrimeTime subscription or access to play.
                                    </p>
                                </div>
                                <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                                    {hasPrevious && onPrevious && (
                                        <button
                                            onClick={() => {
                                                playClickSound();
                                                onPrevious();
                                            }}
                                            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 active:scale-95 cursor-pointer"
                                            title="Rewind to previous choice"
                                        >
                                            <RotateCcw size={14} />
                                            <span>Rewind Decision</span>
                                        </button>
                                    )}
                                    <button
                                        onClick={handleRestartClick}
                                        className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs uppercase tracking-wider transition-all border border-white/20 active:scale-95 cursor-pointer"
                                        title="Restart story from Scene 1"
                                    >
                                        <RotateCcw size={14} />
                                        <span>Reset Story</span>
                                    </button>
                                    <button
                                        onClick={() => onShowPaywall && onShowPaywall()}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:brightness-110 text-white font-black text-xs uppercase tracking-wider transition-all shadow-xl shadow-cyan-500/25 active:scale-95 cursor-pointer"
                                    >
                                        Unlock Full Movie ✦
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* Choice & Scene End Overlay - Only shown when user has started and choices time reached/ended */}
                        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-500 ${showChoices && hasUserStarted ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${hasShowOnTime && !isEndingScene ? '' : 'bg-black/60 backdrop-blur-md'}`}>
                            {showChoices && hasUserStarted && (
                                loadingChoices ? (
                                    <div className="flex flex-col items-center justify-center gap-3 p-8 animate-in fade-in duration-300">
                                        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
                                        <span className="text-xs font-black uppercase tracking-widest text-cyan-300/80">Loading Narrative Choices...</span>
                                    </div>
                                ) : isEndingScene ? (
                                    <div className="relative z-30 max-w-2xl w-full mx-4 p-8 sm:p-10 rounded-[2.5rem] bg-[#0c0d14]/90 backdrop-blur-2xl border border-white/15 shadow-[0_25px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(34,211,238,0.15)] text-center space-y-6 animate-in fade-in zoom-in-95 duration-500 overflow-hidden">
                                        {/* Ambient radial glow inside card */}
                                        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-b from-cyan-500/20 via-blue-600/10 to-transparent rounded-full blur-3xl pointer-events-none" />

                                        {/* Top Badge */}
                                        <div className="relative z-10 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-black uppercase tracking-widest shadow-lg shadow-cyan-500/10">
                                            <Sparkles size={14} className="text-cyan-400 animate-pulse" />
                                            <span>Story Path Concluded</span>
                                        </div>

                                        {/* Cinematic Title & Narrative */}
                                        <div className="relative z-10 space-y-2">
                                            <h3 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight uppercase drop-shadow-lg">
                                                {currentScene.end_text || currentScene.title || "The End"}
                                            </h3>
                                            <p className="text-white/70 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
                                                {currentScene.description || "You have reached the culmination of this story path. Step back to your previous decision to explore an alternative destiny, or restart the adventure from the beginning."}
                                            </p>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="relative z-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
                                            {/* Rewind to Previous Decision */}
                                            <button
                                                onClick={() => {
                                                    if (!hasPrevious || !onPrevious) return;
                                                    playClickSound();
                                                    setShowChoices(false);
                                                    onPrevious();
                                                }}
                                                disabled={!hasPrevious}
                                                className={`flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto shadow-xl active:scale-95 ${
                                                    hasPrevious
                                                        ? 'bg-gradient-to-r from-cyan-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-500/25 hover:shadow-cyan-500/40 cursor-pointer'
                                                        : 'bg-white/5 border border-white/10 text-white/30 opacity-40 cursor-not-allowed select-none pointer-events-none'
                                                }`}
                                                title={hasPrevious ? "Go back to your previous choice" : "No previous choice available"}
                                            >
                                                <RotateCcw size={16} className={hasPrevious ? "group-hover:-rotate-45 transition-transform" : ""} />
                                                <span>Rewind Decision</span>
                                            </button>

                                            {/* Reset Scene */}
                                            <button
                                                onClick={handleResetScene}
                                                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-cyan-500 hover:text-black text-white border border-white/20 hover:border-transparent rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto backdrop-blur-md active:scale-95 cursor-pointer shadow-lg"
                                                title="Replay Ending Scene from 0:00"
                                            >
                                                <RotateCcw size={16} />
                                                <span>Reset Scene</span>
                                            </button>

                                            {/* Restart Story */}
                                            <button
                                                onClick={handleRestartClick}
                                                className="flex items-center justify-center gap-2.5 px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white border border-white/20 hover:border-white/40 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto backdrop-blur-md active:scale-95 cursor-pointer shadow-lg"
                                            >
                                                <RotateCcw size={16} />
                                                <span>Restart Story</span>
                                            </button>

                                            {/* Explore Other Movies / Home */}
                                            <a
                                                href="/interactive"
                                                onClick={() => playClickSound()}
                                                className="flex items-center justify-center gap-2 px-5 py-3.5 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white border border-white/10 hover:border-white/20 rounded-2xl font-bold text-xs sm:text-sm uppercase tracking-wider transition-all duration-300 w-full sm:w-auto active:scale-95"
                                            >
                                                <Compass size={16} className="text-cyan-400" />
                                                <span>Explore Library</span>
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-700">
                                        {/* Top Navigation: Previous, Reset Scene, and Restart */}
                                        <div className="absolute top-3 right-3 sm:top-6 sm:right-6 flex flex-wrap items-center justify-end gap-1.5 sm:gap-2.5 z-30 pointer-events-auto max-w-[92vw]">
                                            <button 
                                                onClick={(e) => {
                                                    if (!hasPrevious || !onPrevious) return;
                                                    e.stopPropagation();
                                                    playClickSound();
                                                    setShowChoices(false);
                                                    onPrevious();
                                                }}
                                                disabled={!hasPrevious}
                                                className={`flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 backdrop-blur-md rounded-full text-[10px] sm:text-[11px] font-bold uppercase tracking-wider transition-all border ${
                                                    hasPrevious
                                                        ? 'bg-black/70 hover:bg-cyan-500 hover:text-black text-white/90 border-white/25 hover:border-transparent cursor-pointer shadow-lg active:scale-95 group'
                                                        : 'bg-black/40 text-white/30 border-white/10 opacity-35 cursor-not-allowed pointer-events-none'
                                                }`}
                                                title={hasPrevious ? "Previous Scene (P)" : "No Previous Scene"}
                                                aria-label="Previous Scene"
                                            >
                                                <RotateCcw size={12} className={hasPrevious ? "group-hover:-rotate-45 transition-transform duration-300" : ""} /> 
                                                <span>Previous</span>
                                            </button>
                                            <button 
                                                onClick={handleResetScene}
                                                className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-black/70 hover:bg-cyan-500 hover:text-black text-white/90 backdrop-blur-md border border-white/25 hover:border-transparent rounded-full transition-all text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer group"
                                                title="Replay Current Scene from 0:00"
                                                aria-label="Reset Scene"
                                            >
                                                <RotateCcw size={12} className="group-hover:-rotate-90 transition-transform duration-300" /> 
                                                <span>Reset Scene</span>
                                            </button>
                                            <button 
                                                onClick={handleRestartClick}
                                                className="flex items-center gap-1.5 px-3 py-1 sm:px-4 sm:py-2 bg-black/70 hover:bg-white text-white/90 hover:text-black backdrop-blur-md border border-white/25 hover:border-transparent rounded-full transition-all text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-lg active:scale-95 cursor-pointer group"
                                                title="Restart Story from Beginning"
                                                aria-label="Restart Story"
                                            >
                                                <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                                                <span>Restart</span>
                                            </button>
                                        </div>
                                        
                                        {choices.map((choice, index) => {
                                            const nextId = choice.next_scene_id || choice.target_scene;
                                            const targetScene = scenes.find(s => s.scene_id === nextId);

                                            // Determine if target scene choice is locked for non-subscribed users
                                            const isTargetSceneFree =
                                                targetScene?.is_free === true ||
                                                Number(targetScene?.is_free) === 1 ||
                                                String(targetScene?.is_free) === '1' ||
                                                String(targetScene?.is_free).toLowerCase() === 'true';

                                            const isTargetPlayable = Boolean(
                                                targetScene?.scene_url && targetScene.scene_url.trim().length > 0
                                            );

                                            // If next scene has no playable stream or is locked, open recommended unlock modal instead of broken black screen
                                            const isTargetLocked = !isAuthorized && (
                                                isPreviewLimitReached ||
                                                targetScene?.is_locked === true ||
                                                !isTargetSceneFree ||
                                                !isTargetPlayable
                                            );

                                            const isSingle = choices.length === 1;
                                            const isChoiceA = index === 0;

                                            // On mobile portrait: stack choices cleanly (Option A above Option B)
                                            // On desktop/tablet (sm+): separate left and right
                                            const positionClass = isSingle 
                                                ? 'left-1/2 -translate-x-1/2 bottom-[14%] sm:bottom-[18%]' 
                                                : isChoiceA 
                                                    ? 'left-1/2 -translate-x-1/2 bottom-[24%] sm:bottom-[18%] sm:left-[8%] sm:translate-x-0' 
                                                    : 'left-1/2 -translate-x-1/2 bottom-[10%] sm:bottom-[18%] sm:right-[8%] sm:left-auto sm:translate-x-0';
                                            
                                            const rawBoxText = choice.choice_text || choice.button_text || (isChoiceA ? 'Option A' : 'Option B');
                                            const letter = isChoiceA ? 'A' : index === 1 ? 'B' : String.fromCharCode(65 + index);
                                            const boxText = rawBoxText.toUpperCase().startsWith(`${letter}:`) || rawBoxText.toUpperCase().startsWith(`${letter} :`)
                                                ? rawBoxText
                                                : `${letter}: ${rawBoxText}`;

                                            return (
                                                <div 
                                                    key={choice.choice_id}
                                                    onClick={() => {
                                                        if (isTargetLocked) {
                                                            playClickSound();
                                                            exitFullscreenIfActive();
                                                            setLockedChoiceModal({
                                                                isOpen: true,
                                                                choiceText: boxText,
                                                                targetSceneId: nextId || null,
                                                            });
                                                        } else {
                                                            playClickSound();
                                                            setShowChoices(false);
                                                            setHasUserStarted(true);
                                                            setTimeout(() => {
                                                                onChoiceSelect(nextId!);
                                                            }, 400);
                                                        }
                                                    }}
                                                    className={`absolute ${positionClass} w-[88%] sm:w-auto max-w-[360px] sm:max-w-none flex flex-col items-center pointer-events-auto cursor-pointer group hover:scale-105 active:scale-95 transition-all duration-300 z-30`}
                                                >
                                                    <div
                                                        className={`relative w-full sm:w-auto px-5 py-3 sm:px-10 sm:py-3.5 md:px-12 md:py-4 rounded-2xl md:rounded-3xl border transition-all duration-300 flex items-center justify-between sm:justify-center gap-3 backdrop-blur-xl ${
                                                            isTargetLocked
                                                                ? 'bg-gradient-to-r from-amber-950/90 via-amber-900/80 to-amber-950/90 border-amber-500/80 shadow-[0_0_25px_rgba(245,158,11,0.4)]'
                                                                : isChoiceA
                                                                    ? 'bg-gradient-to-r from-[#0055ff] via-[#0088ff] to-[#00d4ff] border-cyan-300/80 shadow-[0_0_35px_rgba(0,180,255,0.65)] hover:shadow-[0_0_50px_rgba(0,212,255,0.95)]'
                                                                    : 'bg-gradient-to-r from-[#7900c4] via-[#bd00b8] to-[#ff0099] border-pink-300/80 shadow-[0_0_35px_rgba(236,72,153,0.65)] hover:shadow-[0_0_50px_rgba(255,0,153,0.95)]'
                                                        }`}
                                                    >
                                                        {/* Subtle sheen reflection overlay */}
                                                        <span className="absolute inset-0 rounded-2xl md:rounded-3xl bg-gradient-to-b from-white/20 to-transparent pointer-events-none" />
                                                        <span className="font-black italic text-sm sm:text-2xl md:text-3xl tracking-wide uppercase text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] flex items-center gap-2 truncate">
                                                            {isTargetLocked && (
                                                                <Lock size={18} className="text-amber-400 shrink-0 inline-block" />
                                                            )}
                                                            <span className="truncate">{boxText}</span>
                                                        </span>
                                                        <ChevronRight size={22} className="text-white shrink-0 group-hover:translate-x-1.5 transition-transform drop-shadow" />
                                                    </div>

                                                    {isTargetLocked && (
                                                        <span className="mt-1.5 text-[9px] sm:text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/40 px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1">
                                                            <Lock size={10} /> {isPreviewLimitReached ? "Unlock Full Movie" : "Locked Choice (Upgrade Plan)"}
                                                        </span>
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                )
                            )}
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full text-white/20">
                        <div className="text-center">
                            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                            <p className="font-medium tracking-widest uppercase text-[10px]">Initializing Stream</p>
                        </div>
                    </div>
                )}
            </div>

            {/* AI Content Recommendation Paywall Modal for Locked Choices */}
            {lockedChoiceModal?.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
                    <div className="relative w-full max-w-lg bg-[#140e28] border border-cyan-500/30 rounded-[2.5rem] p-8 md:p-10 text-center shadow-2xl space-y-6">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500/20 via-cyan-500/20 to-blue-600/30 border border-amber-400/40 flex items-center justify-center mx-auto text-amber-400 shadow-inner">
                            <Lock size={32} />
                        </div>

                        <div className="space-y-3">
                            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-amber-500/20 via-cyan-500/20 to-purple-500/20 border border-amber-400/30 text-amber-300 text-[11px] font-black uppercase tracking-widest shadow-sm">
                                <Sparkles size={14} className="text-amber-400" />
                                {isPreviewLimitReached ? "Free Preview Limit Reached" : "AI Content Recommendation"}
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                                {isPreviewLimitReached 
                                    ? `Preview Concluded: "${lockedChoiceModal.choiceText}"`
                                    : `Unlock Path: "${lockedChoiceModal.choiceText}"`
                                }
                            </h3>

                            <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">
                                {isPreviewLimitReached
                                    ? <>You have enjoyed the <strong className="text-cyan-400">3-Scene Free Preview</strong> (Scene 1 → Choose → Scene 2 → Choose → Scene 3 → Choose)! To explore <span className="text-white font-bold">"{lockedChoiceModal.choiceText}"</span> and discover every branching narrative, upgrade to a PrimeTime subscription.</>
                                    : <>You've reached a pivotal decision point in <strong className="text-cyan-400">{movieTitle || 'this interactive film'}</strong>! Selecting <span className="text-white font-bold">"{lockedChoiceModal.choiceText}"</span> unlocks exclusive branching scenes and hidden outcomes. Subscribe to a PrimeTime plan to continue.</>
                                }
                            </p>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-left space-y-2">
                            <div className="text-[11px] font-black text-cyan-400 uppercase tracking-widest">
                                PrimeTime Subscription Includes:
                            </div>
                            <ul className="text-xs text-white/80 space-y-1.5 font-medium">
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold">✓</span> Unlock all 12+ decision branches & endings
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold">✓</span> Zero-latency interactive streaming
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-emerald-400 font-bold">✓</span> Full access to all Interactive Originals
                                </li>
                            </ul>
                        </div>

                        <div className="flex flex-col gap-2.5 pt-2">
                            <button
                                onClick={() => {
                                    setLockedChoiceModal(null);
                                    if (onShowPaywall) onShowPaywall();
                                }}
                                className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:brightness-110 text-white font-bold py-3 sm:py-3.5 rounded-xl sm:rounded-2xl uppercase tracking-wider text-xs sm:text-sm shadow-lg shadow-cyan-500/25 transition-all active:scale-95 cursor-pointer"
                            >
                                Unlock Full Access • Subscribe Plan
                            </button>
                            <button
                                onClick={() => setLockedChoiceModal(null)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white/80 font-bold py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs uppercase tracking-wider transition-colors cursor-pointer"
                            >
                                Continue Free Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .text-gradient {
                    background: linear-gradient(135deg, #22d3ee 0%, #3b82f6 100%);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                .choice-btn {
                    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.2);
                    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
                }
                .choice-btn:hover {
                    border-color: var(--btn-color) !important;
                    box-shadow: 0 0 25px 2px var(--btn-glow), inset 0 0 10px var(--btn-bg-hover);
                    background-color: var(--btn-bg-hover) !important;
                }
                @keyframes shine {
                    0% {
                        transform: translateX(-100%);
                    }
                    100% {
                        transform: translateX(100%);
                    }
                }
                .choice-btn:hover .shine-effect {
                    animation: shine 1.5s ease-in-out infinite;
                }
                .bg-radial-glow {
                    background: radial-gradient(circle, var(--btn-bg-hover) 0%, transparent 70%);
                }
            `}</style>
        </div>
    );
});

SceneManager.displayName = 'SceneManager';

export default SceneManager;
