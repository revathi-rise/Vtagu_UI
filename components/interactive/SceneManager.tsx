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
        if (currentScene?.show_choices_on) {
            const showChoicesSeconds = parseTimeToSeconds(currentScene.show_choices_on);
            if (showChoicesSeconds > 0 && currentTime >= showChoicesSeconds && !showChoices) {
                setShowChoices(true);
                playerRef.current?.pause();
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
                            showControls={!showChoices}
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setShowChoices(true)}
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
                                <div className="text-center px-6 max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
                                    <h3 className="text-3xl font-bold mb-8 drop-shadow-lg text-white">Make your choice</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {choices.map((choice) => {
                                            const styles = getButtonStyles(choice.button_color);
                                            return (
                                                <button 
                                                    key={choice.choice_id}
                                                    onClick={() => onChoiceSelect(choice.next_scene_id || choice.target_scene)}
                                                    style={{
                                                        '--btn-color': styles.baseColor,
                                                        '--btn-border': styles.rgbaBorder,
                                                        '--btn-glow': styles.rgbaGlow,
                                                        '--btn-bg-hover': styles.rgbaBgHover,
                                                    } as React.CSSProperties}
                                                    className="choice-btn px-8 py-4 bg-white/5 backdrop-blur-xl border border-[var(--btn-border)] rounded-2xl font-black text-sm uppercase tracking-widest transition-all duration-300 relative overflow-hidden group text-white hover:scale-105 active:scale-95"
                                                >
                                                    {/* Shine effect */}
                                                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full shine-effect" />
                                                    
                                                    {/* Radial background hover glow */}
                                                    <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-radial-glow pointer-events-none" />

                                                    <span className="relative z-10 flex items-center justify-center gap-2">
                                                        {choice.choice_text || choice.button_text}
                                                        <ChevronRight size={18} className="transform group-hover:translate-x-1 transition-transform duration-300" />
                                                    </span>
                                                </button>
                                            );
                                        })}
                                    </div>
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
