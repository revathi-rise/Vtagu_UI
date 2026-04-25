'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Target, ChevronRight, RotateCcw, CheckCircle2 } from 'lucide-react';
import { Scene, Choice } from '@/lib/vtagu.api';
import VideoPlayer, { VideoPlayerHandle } from '@/components/ui/VideoPlayer';

interface SceneManagerProps {
    currentScene: Scene | null;
    choices: Choice[];
    onChoiceSelect: (nextSceneId: number) => void;
    onRestart: () => void;
}

export interface SceneManagerHandle {
    requestFullScreen: () => void;
}

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
                        <VideoPlayer
                            ref={playerRef}
                            src={videoUrl}
                            autoPlay={true}
                            showControls={!showChoices}
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
                                    <button onClick={onRestart} className="flex items-center gap-2 mx-auto px-8 py-3 bg-white text-black rounded-xl font-bold hover:bg-cyan-400 transition-colors">
                                        <RotateCcw size={18} /> Restart Story
                                    </button>
                                </div>
                            ) : (
                                <div className="text-center px-6 max-w-2xl animate-in slide-in-from-bottom-10 duration-500">
                                    <h3 className="text-3xl font-bold mb-8 drop-shadow-lg text-white">Make your choice</h3>
                                    <div className="flex flex-wrap justify-center gap-4">
                                        {choices.map((choice) => (
                                            <button 
                                                key={choice.choice_id}
                                                onClick={() => onChoiceSelect(choice.next_scene_id || choice.target_scene)}
                                                className="px-8 py-4 bg-white/10 hover:bg-cyan-400 hover:text-black backdrop-blur-xl border border-white/20 rounded-2xl font-black text-sm uppercase tracking-widest transition-all hover:scale-105"
                                            >
                                                {choice.choice_text || choice.button_text}
                                                <ChevronRight size={18} className="inline ml-2" />
                                            </button>
                                        ))}
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
            `}</style>
        </div>
    );
});

SceneManager.displayName = 'SceneManager';

export default SceneManager;
