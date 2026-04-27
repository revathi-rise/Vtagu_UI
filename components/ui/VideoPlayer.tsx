'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, SkipForward, AlertCircle } from 'lucide-react';

declare global {
    interface Window {
        Hls: any;
    }
}

const HLS_CDN_URL = 'https://cdn.jsdelivr.net/npm/hls.js@latest';

export interface VideoPlayerProps {
    src: string;
    poster?: string;
    autoPlay?: boolean;
    loop?: boolean;
    muted?: boolean;
    showControls?: boolean;
    className?: string;
    onEnded?: () => void;
    onTimeUpdate?: (currentTime: number, duration: number) => void;
    crossOrigin?: string;
    showSkip?: boolean;
    onSkip?: () => void;
}

export interface VideoPlayerHandle {
    play: () => void;
    pause: () => void;
    togglePlay: () => void;
    requestFullScreen: () => void;
    videoElement: HTMLVideoElement | null;
}

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
    ({ 
        src, 
        poster, 
        autoPlay = false, 
        loop = false, 
        muted = false, 
        showControls = true, 
        className = '', 
        onEnded, 
        onTimeUpdate,
        crossOrigin = 'anonymous',
        showSkip = false,
        onSkip
    }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);
    
    // UI State
    const [error, setError] = useState<string | null>(null);
    const [hlsLoaded, setHlsLoaded] = useState(false);
    
    // Video State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showUI, setShowUI] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);

    useImperativeHandle(ref, () => ({
        play: () => videoRef.current?.play(),
        pause: () => videoRef.current?.pause(),
        togglePlay: () => {
            if (videoRef.current?.paused) videoRef.current?.play();
            else videoRef.current?.pause();
        },
        requestFullScreen: () => {
            if (containerRef.current) {
                if (containerRef.current.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                } else if ((containerRef.current as any).webkitRequestFullscreen) {
                    (containerRef.current as any).webkitRequestFullscreen();
                }
            }
        },
        videoElement: videoRef.current
    }));

    useEffect(() => {
        if (typeof window === 'undefined') return;
        if (window.Hls) {
            setHlsLoaded(true);
            return;
        }
        const script = document.createElement('script');
        script.src = HLS_CDN_URL;
        script.async = true;
        script.onload = () => setHlsLoaded(true);
        script.onerror = () => setError('Failed to load video player engine.');
        document.head.appendChild(script);
        return () => { if (script.parentNode) document.head.removeChild(script); };
    }, []);

    useEffect(() => {
        if (!hlsLoaded || !src) return;
        
        setError(null);
        const video = videoRef.current;
        if (!video) return;

        if (hlsRef.current) {
            hlsRef.current.destroy();
            hlsRef.current = null;
        }

        const handleCanPlay = () => {
            if (autoPlay) {
                video.play().catch(e => console.log('Autoplay blocked:', e));
            }
        };

        const handleWaiting = () => setIsBuffering(true);
        const handlePlaying = () => setIsBuffering(false);
        
        const handleError = () => {
            const video = videoRef.current;
            if (!video?.error) {
                setError('Unknown video error occurred');
                return;
            }

            const errorCode = video.error.code;
            const errorMessage = video.error.message;
            
            const errorMap: { [key: number]: string } = {
                1: '❌ Video loading was aborted',
                2: '🌐 Network error - Check your connection',
                3: '⚠️ Video decoding failed - Format may not be supported',
                4: '📁 Video format not supported by your browser',
            };

            const message = errorMap[errorCode] || errorMessage || 'Failed to load video';
            console.error('Video playback error:', {
                code: errorCode,
                message: errorMessage,
                src: src,
            });
            setError(message);
        };

        video.addEventListener('waiting', handleWaiting);
        video.addEventListener('playing', handlePlaying);
        video.addEventListener('error', handleError);

        if (src.endsWith('.m3u8')) {
            const Hls = window.Hls;
            if (Hls.isSupported()) {
                const hls = new Hls({ 
                    enableWorker: true, 
                    lowLatencyMode: true,
                    xhrSetup: function(xhr: any) {
                        xhr.withCredentials = false; // Prevent CORS issues
                    }
                });
                hls.loadSource(src);
                hls.attachMedia(video);
                hlsRef.current = hls;
                
                hls.on(Hls.Events.MANIFEST_PARSED, handleCanPlay);
                hls.on(Hls.Events.ERROR, (event: any, data: any) => {
                    console.error('HLS Error:', data);
                    if (data.fatal) {
                        setError('HLS stream error. Please try again.');
                    }
                });
            } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = src;
                video.crossOrigin = 'anonymous';
                video.addEventListener('loadedmetadata', handleCanPlay);
            } else {
                setError('🎬 HLS playback is not supported in your browser. Please try a different video format.');
            }
        } else {
            // Try multiple CORS settings
            video.crossOrigin = crossOrigin || 'anonymous';
            video.src = src;
            video.load();
            video.addEventListener('canplay', handleCanPlay);
        }

        return () => {
            if (hlsRef.current) hlsRef.current.destroy();
            video.removeEventListener('loadedmetadata', handleCanPlay);
            video.removeEventListener('canplay', handleCanPlay);
            video.removeEventListener('waiting', handleWaiting);
            video.removeEventListener('playing', handlePlaying);
            video.removeEventListener('error', handleError);
        };
    }, [src, hlsLoaded, autoPlay]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleTimeUpdate = () => {
        if (!videoRef.current) return;
        const current = videoRef.current.currentTime;
        const total = videoRef.current.duration;
        setCurrentTime(current);
        onTimeUpdate?.(current, total);
    };

    const handleLoadedMetadata = () => {
        if (!videoRef.current) return;
        setDuration(videoRef.current.duration);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (videoRef.current.paused) videoRef.current.play();
        else videoRef.current.pause();
    };

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!videoRef.current) return;
        videoRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!videoRef.current) return;
        const time = parseFloat(e.target.value);
        videoRef.current.currentTime = time;
        setCurrentTime(time);
    };

    const handleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
            (containerRef.current as any).webkitRequestFullscreen();
        }
    };

    return (
        <div 
            ref={containerRef}
            className={`relative group bg-black overflow-hidden ${className}`}
            onMouseMove={() => {
                setShowUI(true);
                // Clear existing timeout if any? Usually simple enough to just show.
            }}
        >
            {error ? (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 bg-black/40 backdrop-blur-md z-50">
                    <AlertCircle size={48} className="text-red-500 mb-4" />
                    <p className="text-sm font-black uppercase tracking-widest">{error}</p>
                </div>
            ) : (
                <>
                    <video
                        ref={videoRef}
                        className="w-full h-full object-cover cursor-pointer"
                        onTimeUpdate={handleTimeUpdate}
                        onLoadedMetadata={handleLoadedMetadata}
                        onPlay={() => setIsPlaying(true)}
                        onPause={() => setIsPlaying(false)}
                        onEnded={onEnded}
                        loop={loop}
                        muted={isMuted}
                        playsInline
                        // crossOrigin={crossOrigin}
                        onClick={togglePlay}
                        poster={poster}
                    />

                    {/* Buffering Spinner */}
                    {isBuffering && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
                            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                        </div>
                    )}

                    {/* Custom Controls */}
                    {showControls && (
                        <div className={`absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 ${showUI ? 'opacity-100' : 'opacity-0'}`}>
                            
                            {/* Progress Bar */}
                            <div className="mb-4 group/progress relative">
                                <input
                                    type="range"
                                    min="0"
                                    max={duration || 0}
                                    value={currentTime}
                                    onChange={handleSeek}
                                    className="w-full h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all video-range"
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-6">
                                    <button onClick={togglePlay} className="text-white hover:text-cyan-400 transition-colors">
                                        {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" />}
                                    </button>
                                    
                                    <div className="flex items-center gap-3 group/volume">
                                        <button onClick={toggleMute} className="text-white hover:text-cyan-400 transition-colors">
                                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                                        </button>
                                        <div className="text-white/80 text-xs font-mono font-bold tracking-wider">
                                            {formatTime(currentTime)} <span className="text-white/20">/</span> {formatTime(duration)}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4">
                                    {showSkip && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                onSkip?.();
                                            }} 
                                            className="text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Skip <SkipForward size={14} />
                                        </button>
                                    )}
                                    <button 
                                        onClick={handleFullscreen}
                                        className="text-white hover:text-cyan-400 transition-colors p-2 bg-white/5 rounded-lg"
                                    >
                                        <Maximize size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}

            <style jsx>{`
                .video-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    width: 12px;
                    height: 12px;
                    background: #22d3ee;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 0 10px rgba(34, 211, 238, 0.5);
                }
            `}</style>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
