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
    ({ currentScene, choices, onChoiceSelect, onRestart }, ref) => {
    const playerRef = useRef<VideoPlayerHandle>(null);
    console.log(currentScene, "currentScene");
    
    // UI State
    const [showChoices, setShowChoices] = useState(false);
    
    useImperativeHandle(ref, () => ({
        requestFullScreen: () => {
            playerRef.current?.requestFullScreen();
        }
    }));

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
            <div className="relative aspect-video rounded-[2.5rem] bg-black border border-white/5 overflow-hidden shadow-2xl group ring-1 ring-white/10">
                {currentScene ? (
                    <>
                        <WatchTrackingVideoPlayer
                            ref={playerRef}
                            src={videoUrl}
                            contentId={currentScene.scene_id?.toString() || currentScene.title || 'scene'}
                            contentType="episode"
                            autoPlay={true}
                            loop={!currentScene.is_ending}
                            showControls={!showChoices}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => {
                                if (!currentScene.is_ending) {
                                    setShowChoices(true);
                                } else {
                                    // Finish the webseries by returning to home/catalog
                                    window.location.href = '/';
                                }
                            }}
                            className="w-full h-full"
                            showSkip={true}
                            onSkip={() => {
                                if (playerRef.current?.videoElement) {
                                    playerRef.current.videoElement.currentTime = playerRef.current.videoElement.duration - 1;
                                }
                            }}
                        />

                        {/* Choice Overlay */}
                        <div className={`absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/40 backdrop-blur-md transition-opacity duration-500 ${showChoices ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
                            {currentScene.is_ending ? (
                                <div className="text-center space-y-6 p-8 animate-in fade-in zoom-in duration-500">
                                    <div className="w-20 h-20 bg-cyan-400 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-cyan-400/40">
                                        <CheckCircle2 size={40} className="text-black" />
                                    </div>
                                    <h3 className="text-3xl font-bold">The End</h3>
                                    <button 
                                        onClick={() => {
                                            setShowChoices(false);
                                            onRestart();
                                        }} 
                                        className="flex items-center gap-2 mx-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors"
                                    >
                                        <RotateCcw size={18} /> Restart Story
                                    </button>
                                </div>
                            ) : (
                                <div className="absolute inset-0 pointer-events-none animate-in fade-in duration-700">
                                    {choices.map((choice, index) => {
                                        const styles = getButtonStyles(choice.button_color);
                                        const isLeft = index % 2 === 0;
                                        
                                        // Use choice_text for the slanted box and button_text for the side text, or fallback
                                        const boxText = choice.choice_text || choice.button_text;
                                        const sideText = choice.choice_text ? choice.button_text : '';

                                        return (
                                            <div 
                                                key={choice.choice_id}
                                                onClick={() => onChoiceSelect(choice.next_scene_id || choice.target_scene)}
                                                style={{ '--btn-color': styles.baseColor } as React.CSSProperties}
                                                className={`absolute bottom-[25%] ${isLeft ? 'left-[8%] md:left-[15%]' : 'right-[8%] md:right-[15%]'} flex items-center gap-3 md:gap-5 pointer-events-auto cursor-pointer group hover:scale-105 transition-transform duration-500`}
                                            >
                                                {isLeft ? (
                                                    <>
                                                        <div className="bg-[var(--btn-color)] px-6 py-2 md:px-8 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] transition-shadow duration-500 relative overflow-hidden">
                                                            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shine_1s_ease-in-out]" />
                                                            <span className="block transform skew-x-12 text-[#0c0816] font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center">
                                                                {boxText}
                                                            </span>
                                                        </div>
                                                        {sideText && (
                                                            <div className="text-white font-bold italic text-2xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                                                                {sideText}
                                                            </div>
                                                        )}
                                                        {/* Vector Line */}
                                                        <svg className="absolute top-[90%] right-4 w-[1px] h-[1px] overflow-visible pointer-events-none opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_var(--btn-color)] transition-all duration-500" style={{ stroke: 'var(--btn-color)' }}>
                                                            <path d="M 0,0 L 40,0 L 140,60" fill="none" strokeWidth="3" />
                                                            <circle cx="140" cy="60" r="5" fill="transparent" strokeWidth="3" />
                                                        </svg>
                                                    </>
                                                ) : (
                                                    <>
                                                        {sideText && (
                                                            <div className="text-white font-bold italic text-2xl md:text-4xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] tracking-wide">
                                                                {sideText}
                                                            </div>
                                                        )}
                                                        <div className="bg-[var(--btn-color)] px-6 py-2 md:px-8 md:py-3 transform -skew-x-12 shadow-[0_0_20px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_25px_var(--btn-color)] transition-shadow duration-500 relative overflow-hidden">
                                                            <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:animate-[shine_1s_ease-in-out]" />
                                                            <span className="block transform skew-x-12 text-[#0c0816] font-black italic text-xl md:text-3xl tracking-wide whitespace-pre-line text-center">
                                                                {boxText}
                                                            </span>
                                                        </div>
                                                        {/* Vector Line */}
                                                        <svg className="absolute top-[90%] left-4 w-[1px] h-[1px] overflow-visible pointer-events-none opacity-70 group-hover:opacity-100 group-hover:drop-shadow-[0_0_8px_var(--btn-color)] transition-all duration-500" style={{ stroke: 'var(--btn-color)' }}>
                                                            <path d="M 0,0 L -40,0 L -140,60" fill="none" strokeWidth="3" />
                                                            <circle cx="-140" cy="60" r="5" fill="transparent" strokeWidth="3" />
                                                        </svg>
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
