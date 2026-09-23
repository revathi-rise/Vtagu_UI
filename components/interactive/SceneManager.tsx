'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Target, ChevronRight, RotateCcw, CheckCircle2, Lock, Sparkles } from 'lucide-react';
import { Scene, Choice } from '@/lib/vtagu.api';
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';
import { VideoPlayerHandle } from '@/components/ui/VideoPlayer';

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
}

export interface SceneManagerHandle {
    requestFullScreen: () => void;
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
    ({ currentScene, choices, onChoiceSelect, onRestart, onPrevious, hasPrevious, movieId, movieTitle, isAuthorized = false, scenes = [], onShowPaywall }, ref) => {
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
    
    // UI State
    const [prevSceneId, setPrevSceneId] = useState<number | undefined>(undefined);
    const [showChoices, setShowChoices] = useState(false);
    const [lockedChoiceModal, setLockedChoiceModal] = useState<{
        isOpen: boolean;
        choiceText: string;
        targetSceneId: number | null;
    } | null>(null);

    if (currentScene?.scene_id !== prevSceneId) {
        setPrevSceneId(currentScene?.scene_id);
        setShowChoices(false);
    }
    
    useImperativeHandle(ref, () => ({
        requestFullScreen: () => {
            if (containerRef.current) {
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                } else if ((containerRef.current as any).webkitRequestFullscreen) {
                    (containerRef.current as any).webkitRequestFullscreen();
                }
            }
        }
    }));

    const handleFullscreenRequest = () => {
        const doc = document as any;
        if (doc.fullscreenElement || doc.webkitFullscreenElement) {
            if (doc.exitFullscreen) doc.exitFullscreen();
            else if (doc.webkitExitFullscreen) doc.webkitExitFullscreen();
        } else if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
                (containerRef.current as any).webkitRequestFullscreen();
            }
        }
    };

    const videoUrl = currentScene?.poster_url || currentScene?.scene_url || '';

    const handleTimeUpdate = (currentTime: number, duration: number) => {
        if (currentScene?.is_ending) return;

        if (currentScene?.show_choices_on) {
            const showChoicesSeconds = parseTimeToSeconds(currentScene.show_choices_on);
            if (showChoicesSeconds > 0 && currentTime >= showChoicesSeconds && !showChoices) {
                setShowChoices(true);
            }
        }
    };

    const hasShowOnTime = currentScene?.show_choices_on ? parseTimeToSeconds(currentScene.show_choices_on) > 0 : false;
    const isCurrentSceneFree = Number(currentScene?.is_free) === 1 || currentScene?.is_free === true;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Target className="text-cyan-400" />
                    Interactive <span className="text-gradient">Core</span>
                </h2>
                {currentScene && (
                    <div className="flex items-center gap-3">
                        {!isAuthorized && isCurrentSceneFree ? (
                            <div className="text-emerald-400 text-xs font-black uppercase tracking-widest bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/30 flex items-center gap-2 shadow-lg shadow-emerald-500/10 animate-pulse">
                                <span>🔓</span> FREE PREVIEW SCENE
                            </div>
                        ) : (
                            <div className="text-cyan-400/80 text-xs font-black uppercase tracking-widest bg-cyan-400/5 px-3 py-1 rounded-full border border-cyan-400/20">
                                {currentScene.scene_text || `Scene: ${currentScene.title}`}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {!isAuthorized && isCurrentSceneFree && (
                <div className="bg-gradient-to-r from-emerald-500/15 via-cyan-500/10 to-blue-500/15 border border-emerald-500/30 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 backdrop-blur-md">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-lg">
                            🔓
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Watching Free Preview Scene</h4>
                            <p className="text-white/60 text-xs mt-0.5">
                                Enjoy this free preview! Upgrade to a PrimeTime Subscription to unlock all choice branches and hidden endings.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={() => onShowPaywall && onShowPaywall()}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-600 text-black font-black text-xs uppercase tracking-wider hover:brightness-110 transition-all shadow-md shrink-0"
                    >
                        Unlock Full Movie ✦
                    </button>
                </div>
            )}

            {/* Interactive Player Area */}
            <div ref={containerRef} className="relative aspect-video rounded-[2.5rem] bg-black border border-white/5 overflow-hidden shadow-2xl group ring-1 ring-white/10">
                {currentScene ? (
                    <>
                        <WatchTrackingVideoPlayer
                            ref={playerRef}
                            src={videoUrl}
                            contentId={movieId ? movieId.toString() : (currentScene.scene_id?.toString() || currentScene.title || 'scene')}
                            contentType="interactive_movie"
                            autoPlay={true}
                            loop={false}
                            showControls={!showChoices}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => {
                                setShowChoices(true);
                            }}
                            className="w-full h-full"
                            showSkip={true}
                            onSkip={() => {
                                if (playerRef.current?.videoElement) {
                                    playerRef.current.videoElement.currentTime = playerRef.current.videoElement.duration - 1;
                                }
                            }}
                            showPrevious={hasPrevious}
                            onPrevious={onPrevious}
                            onFullscreenRequest={handleFullscreenRequest}
                            subtitles={currentScene.subtitles}
                        />

                        {/* Choice Overlay */}
                        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-500 ${showChoices ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${hasShowOnTime && !currentScene.is_ending ? '' : 'bg-black/40 backdrop-blur-md'}`}>
                            {showChoices && (
                                currentScene.is_ending ? (
                                    <div className="text-center space-y-6 p-8 animate-in fade-in zoom-in duration-500">
                                        <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-400/40">
                                            <CheckCircle2 size={40} className="text-black" />
                                        </div>
                                        <h3 className="text-3xl font-bold">{currentScene.end_text || "The End"}</h3>
                                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                            <button 
                                                onClick={() => {
                                                    playClickSound();
                                                    setShowChoices(false);
                                                    onRestart();
                                                }} 
                                                className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors w-full sm:w-auto justify-center"
                                            >
                                                <RotateCcw size={18} /> Restart Story
                                            </button>
                                            <a 
                                                href="/"
                                                onClick={() => playClickSound()}
                                                className="flex items-center gap-2 px-8 py-3 bg-white/10 text-white border border-white/20 rounded-xl font-bold hover:bg-white/20 transition-colors w-full sm:w-auto justify-center"
                                            >
                                                Return Home
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-700">
                                        {/* Small Previous and Restart Buttons */}
                                        <div className="absolute top-6 right-6 flex items-center gap-3 z-30">
                                            {hasPrevious && onPrevious && (
                                                <button 
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        playClickSound();
                                                        setShowChoices(false);
                                                        onPrevious();
                                                    }}
                                                    className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-[var(--btn-color)] backdrop-blur-md border border-white/20 hover:border-transparent rounded-full text-white/80 hover:text-black transition-all text-[11px] font-bold uppercase tracking-widest group"
                                                >
                                                    <RotateCcw size={14} className="group-hover:-rotate-45 transition-transform duration-500" /> 
                                                    Previous
                                                </button>
                                            )}
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playClickSound();
                                                    setShowChoices(false);
                                                    onRestart();
                                                }}
                                                className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-black/60 hover:bg-black/90 backdrop-blur-md border border-white/20 rounded-full text-white/80 hover:text-white transition-all text-[11px] font-bold uppercase tracking-widest group"
                                            >
                                                <RotateCcw size={14} className="group-hover:-rotate-180 transition-transform duration-500" /> 
                                                Restart
                                            </button>
                                        </div>
                                        
                                        {choices.map((choice, index) => {
                                            const nextId = choice.next_scene_id || choice.target_scene;
                                            const targetScene = scenes.find(s => s.scene_id === nextId);

                                            // Determine if target scene choice is locked for non-subscribed users
                                            const isTargetLocked = !isAuthorized && targetScene && (
                                                targetScene.is_locked === true || 
                                                (targetScene.is_free !== undefined && !targetScene.is_free && Number(targetScene.is_free) !== 1)
                                            );

                                            const styles = getButtonStyles(isTargetLocked ? '#f59e0b' : choice.button_color);
                                            const isSingle = choices.length === 1;
                                            const isLeft = isSingle ? true : index % 2 === 0;
                                            const positionClass = isSingle 
                                                ? 'left-1/2 -translate-x-1/2' 
                                                : (isLeft ? 'left-[5%] sm:left-[10%] md:left-[15%]' : 'right-[5%] sm:right-[10%] md:right-[15%]');
                                            const boxText = choice.choice_text || choice.button_text;

                                            return (
                                                <div 
                                                    key={choice.choice_id}
                                                    onClick={() => {
                                                        if (isTargetLocked) {
                                                            playClickSound();
                                                            setLockedChoiceModal({
                                                                isOpen: true,
                                                                choiceText: boxText,
                                                                targetSceneId: nextId || null,
                                                            });
                                                        } else {
                                                            playClickSound();
                                                            setShowChoices(false);
                                                            setTimeout(() => {
                                                                onChoiceSelect(nextId!);
                                                            }, 500);
                                                        }
                                                    }}
                                                    style={{ 
                                                        '--btn-color': styles.baseColor,
                                                        '--btn-bg-hover': styles.rgbaBgHover 
                                                    } as React.CSSProperties}
                                                    className={`absolute bottom-[20%] md:bottom-[25%] ${positionClass} flex flex-col items-center pointer-events-auto cursor-pointer group hover:scale-105 transition-transform duration-500`}
                                                >
                                                    {isLeft ? (
                                                        <>
                                                            <div className={`bg-[var(--btn-bg-hover)] backdrop-blur-md border ${isTargetLocked ? 'border-amber-500/80 bg-amber-950/30' : 'border-[var(--btn-color)]'} px-6 py-2 md:px-10 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] hover:bg-[var(--btn-color)] transition-all duration-500 relative overflow-hidden z-10 group/btn`}>
                                                                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shine_1s_ease-in-out]" />
                                                                <span className="transform skew-x-12 font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center text-white transition-colors duration-500 drop-shadow-lg flex items-center justify-center gap-2">
                                                                    {isTargetLocked && (
                                                                        <Lock size={20} className="text-amber-400 shrink-0 inline-block mr-1" />
                                                                    )}
                                                                    {boxText}
                                                                </span>
                                                            </div>
                                                            {isTargetLocked && (
                                                                <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1">
                                                                    <Lock size={10} /> Locked Choice (Upgrade Plan)
                                                                </span>
                                                            )}
                                                            {!isSingle && (
                                                                <svg className="absolute top-[90%] right-4 w-[60px] h-[40px] overflow-visible pointer-events-none opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_var(--btn-color)] transition-all duration-500 z-0" style={{ stroke: 'var(--btn-color)' }}>
                                                                    <path d="M 0,0 L 15,0 L 35,20" fill="none" strokeWidth="3" />
                                                                    <circle cx="35" cy="20" r="4" fill="transparent" strokeWidth="3" />
                                                                </svg>
                                                            )}
                                                        </>
                                                    ) : (
                                                        <>
                                                            <div className={`bg-[var(--btn-bg-hover)] backdrop-blur-md border ${isTargetLocked ? 'border-amber-500/80 bg-amber-950/30' : 'border-[var(--btn-color)]'} px-6 py-2 md:px-10 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] hover:bg-[var(--btn-color)] transition-all duration-500 relative overflow-hidden z-10 group/btn`}>
                                                                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shine_1s_ease-in-out]" />
                                                                <span className="transform skew-x-12 font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center text-white transition-colors duration-500 drop-shadow-lg flex items-center justify-center gap-2">
                                                                    {isTargetLocked && (
                                                                        <Lock size={20} className="text-amber-400 shrink-0 inline-block mr-1" />
                                                                    )}
                                                                    {boxText}
                                                                </span>
                                                            </div>
                                                            {isTargetLocked && (
                                                                <span className="mt-2 text-[10px] font-black uppercase tracking-widest text-amber-300 bg-amber-500/20 border border-amber-500/40 px-3 py-1 rounded-full backdrop-blur-md shadow-lg flex items-center gap-1">
                                                                    <Lock size={10} /> Locked Choice (Upgrade Plan)
                                                                </span>
                                                            )}
                                                            {!isSingle && (
                                                                <svg className="absolute top-[90%] left-4 w-[60px] h-[40px] overflow-visible pointer-events-none opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_var(--btn-color)] transition-all duration-500 z-0" style={{ stroke: 'var(--btn-color)' }}>
                                                                    <path d="M 0,0 L -15,0 L -35,20" fill="none" strokeWidth="3" />
                                                                    <circle cx="-35" cy="20" r="4" fill="transparent" strokeWidth="3" />
                                                                </svg>
                                                            )}
                                                        </>
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
                                AI Content Recommendation
                            </div>

                            <h3 className="text-2xl md:text-3xl font-black text-white uppercase tracking-tight">
                                Unlock Path: "{lockedChoiceModal.choiceText}"
                            </h3>

                            <p className="text-white/70 text-sm leading-relaxed max-w-md mx-auto">
                                You've reached a pivotal decision point in <strong className="text-cyan-400">{movieTitle || 'this interactive film'}</strong>! Selecting <span className="text-white font-bold">"{lockedChoiceModal.choiceText}"</span> unlocks exclusive branching scenes and hidden outcomes. Subscribe to a PrimeTime plan to continue.
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

                        <div className="flex flex-col gap-3 pt-2">
                            <button
                                onClick={() => {
                                    setLockedChoiceModal(null);
                                    if (onShowPaywall) onShowPaywall();
                                }}
                                className="w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:brightness-110 text-white font-black py-4 rounded-2xl uppercase tracking-wider text-sm shadow-xl shadow-cyan-500/25 transition-all active:scale-95"
                            >
                                Unlock Full Access • Subscribe Plan
                            </button>
                            <button
                                onClick={() => setLockedChoiceModal(null)}
                                className="w-full bg-white/10 hover:bg-white/20 text-white/80 font-bold py-3 rounded-2xl text-xs uppercase tracking-wider transition-colors"
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
