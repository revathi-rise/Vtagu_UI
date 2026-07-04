'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Target, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
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
    ({ currentScene, choices, onChoiceSelect, onRestart, onPrevious, hasPrevious }, ref) => {
    const playerRef = useRef<VideoPlayerHandle>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    console.log(currentScene, "currentScene");
    
    // UI State
    const [showChoices, setShowChoices] = useState(false);
    
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
        if (containerRef.current) {
            if (containerRef.current.requestFullscreen) {
                containerRef.current.requestFullscreen();
            } else if ((containerRef.current as any).webkitRequestFullscreen) {
                (containerRef.current as any).webkitRequestFullscreen();
            }
        }
    };

    useEffect(() => {
        setShowChoices(false);
    }, [currentScene]);

    const videoUrl = currentScene?.poster_url || currentScene?.scene_url || '';

    const handleTimeUpdate = (currentTime: number, duration: number) => {
        if (currentScene?.is_ending) return;

        if (currentScene?.show_choices_on) {
            const showChoicesSeconds = parseTimeToSeconds(currentScene.show_choices_on);
            if (showChoicesSeconds > 0 && currentTime >= showChoicesSeconds && !showChoices) {
                setShowChoices(true);
                // Removed playerRef.current?.pause() so the video keeps playing in the background
            }
        }
    };

    const hasShowOnTime = currentScene?.show_choices_on ? parseTimeToSeconds(currentScene.show_choices_on) > 0 : false;

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold flex items-center gap-3">
                    <Target className="text-cyan-400" />
                    Interactive <span className="text-gradient">Core</span>
                </h2>
                {currentScene && (
                    <div className="text-cyan-400/60 text-xs font-black uppercase tracking-widest bg-cyan-400/5 px-3 py-1 rounded-full border border-cyan-400/20">
                        {currentScene.scene_text || `Scene: ${currentScene.title}`}
                    </div>
                )}
            </div>

            {/* Interactive Player Area */}
            <div ref={containerRef} className="relative aspect-video rounded-[2.5rem] bg-black border border-white/5 overflow-hidden shadow-2xl group ring-1 ring-white/10">
                {currentScene ? (
                    <>
                        <WatchTrackingVideoPlayer
                            ref={playerRef}
                            src={videoUrl}
                            contentId={currentScene.scene_id?.toString() || currentScene.title || 'scene'}
                            contentType="episode"
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
                            onFullscreenRequest={handleFullscreenRequest}
                        />

                        {/* Choice Overlay */}
                        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center transition-opacity duration-500 ${showChoices ? 'opacity-100' : 'opacity-0 pointer-events-none'} ${hasShowOnTime && !currentScene.is_ending ? '' : 'bg-black/40 backdrop-blur-md'}`}>
                            {currentScene.is_ending ? (
                                <div className="text-center space-y-6 p-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-400/40">
                                        <CheckCircle2 size={40} className="text-black" />
                                    </div>
                                    <h3 className="text-3xl font-bold">{currentScene.end_text || "The End"}</h3>
                                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                        <button 
                                            onClick={() => {
                                                setShowChoices(false);
                                                onRestart();
                                            }} 
                                            className="flex items-center gap-2 px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors w-full sm:w-auto justify-center"
                                        >
                                            <RotateCcw size={18} /> Restart Story
                                        </button>
                                        <a 
                                            href="/"
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
                                        const styles = getButtonStyles(choice.button_color);
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
                                                    // 0.5s delay
                                                    setTimeout(() => {
                                                        onChoiceSelect(choice.next_scene_id || choice.target_scene);
                                                    }, 500);
                                                }}
                                                style={{ 
                                                    '--btn-color': styles.baseColor,
                                                    '--btn-bg-hover': styles.rgbaBgHover 
                                                } as React.CSSProperties}
                                                className={`absolute bottom-[20%] md:bottom-[25%] ${positionClass} flex items-center pointer-events-auto cursor-pointer group hover:scale-105 transition-transform duration-500`}
                                            >
                                                {isLeft ? (
                                                    <>
                                                        <div className="bg-[var(--btn-bg-hover)] backdrop-blur-md border border-[var(--btn-color)] px-6 py-2 md:px-10 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] hover:bg-[var(--btn-color)] transition-all duration-500 relative overflow-hidden z-10 group/btn">
                                                            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shine_1s_ease-in-out]" />
                                                            <span className="block transform skew-x-12 font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center text-white transition-colors duration-500 drop-shadow-lg">
                                                                {boxText}
                                                            </span>
                                                        </div>
                                                        {/* Vector Line Accent */}
                                                        {!isSingle && (
                                                            <svg className="absolute top-[90%] right-4 w-[60px] h-[40px] overflow-visible pointer-events-none opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_var(--btn-color)] transition-all duration-500 z-0" style={{ stroke: 'var(--btn-color)' }}>
                                                                <path d="M 0,0 L 15,0 L 35,20" fill="none" strokeWidth="3" />
                                                                <circle cx="35" cy="20" r="4" fill="transparent" strokeWidth="3" />
                                                            </svg>
                                                        )}
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="bg-[var(--btn-bg-hover)] backdrop-blur-md border border-[var(--btn-color)] px-6 py-2 md:px-10 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] hover:bg-[var(--btn-color)] transition-all duration-500 relative overflow-hidden z-10 group/btn">
                                                            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover/btn:animate-[shine_1s_ease-in-out]" />
                                                            <span className="block transform skew-x-12 font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center text-white transition-colors duration-500 drop-shadow-lg">
                                                                {boxText}
                                                            </span>
                                                        </div>
                                                        {/* Vector Line Accent */}
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
