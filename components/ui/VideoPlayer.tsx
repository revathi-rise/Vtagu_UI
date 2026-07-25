'use client';

import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from 'react';
import { Play, Pause, Maximize, Volume2, VolumeX, SkipForward, SkipBack, AlertCircle, ChevronRight, ChevronLeft, Subtitles } from 'lucide-react';

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
    showPrevious?: boolean;
    onPrevious?: () => void;
    onFullscreenRequest?: () => void;
    subtitles?: {
        language: string;
        label: string;
        url: string;
    }[];
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
        crossOrigin,
        showSkip = false,
        onSkip,
        showPrevious = false,
        onPrevious,
        onFullscreenRequest,
        subtitles
    }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const hlsRef = useRef<any>(null);
    
    // UI State
    const [error, setError] = useState<string | null>(null);
    const [hlsLoaded, setHlsLoaded] = useState(false);
    
    // Subtitle State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
    const [activeSubtitleLanguage, setActiveSubtitleLanguage] = useState<string | null>(null);
    const [showSubtitleMenu, setShowSubtitleMenu] = useState(false);
    const [subtitleBlobs, setSubtitleBlobs] = useState<{ language: string; label: string; url: string; originalUrl: string }[]>([]);

    useEffect(() => {
        if (!subtitles || subtitles.length === 0) {
            setSubtitleBlobs([]);
            return;
        }

        let isMounted = true;
        let objectUrls: string[] = [];
        
        const fetchSubtitles = async () => {
            try {
                const fetched = await Promise.all(subtitles.map(async (sub) => {
                    try {
                        const response = await fetch(sub.url);
                        if (!response.ok) throw new Error('Network response was not ok');
                        const text = await response.text();
                        const blob = new Blob([text], { type: 'text/vtt' });
                        const blobUrl = URL.createObjectURL(blob);
                        objectUrls.push(blobUrl);
                        return { ...sub, url: blobUrl, originalUrl: sub.url };
                    } catch (e) {
                        console.warn('Failed to load subtitle via fetch, falling back to original URL:', sub.url, e);
                        return { ...sub, originalUrl: sub.url };
                    }
                }));
                if (isMounted) setSubtitleBlobs(fetched);
            } catch (e) {
                console.error('Error fetching subtitles', e);
            }
        };
        
        fetchSubtitles();
        
        return () => {
            isMounted = false;
            objectUrls.forEach(URL.revokeObjectURL);
        };
    }, [subtitles]);
    
    // Video State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showUI, setShowUI] = useState(true);
    const [isBuffering, setIsBuffering] = useState(false);

    // Indicator Overlay State
    const [indicator, setIndicator] = useState<{ type: 'play' | 'pause' | 'forward' | 'rewind'; id: number } | null>(null);
    const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Synthesized premium modern click sound generator
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
            osc.frequency.setValueAtTime(1600, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.035);
            
            gainNode.gain.setValueAtTime(0.08, ctx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);
            
            osc.start(ctx.currentTime);
            osc.stop(ctx.currentTime + 0.04);
        } catch (e) {
            // Autoplay security warning catch
        }
    };

    const triggerIndicator = (type: 'play' | 'pause' | 'forward' | 'rewind') => {
        if (indicatorTimeoutRef.current) {
            clearTimeout(indicatorTimeoutRef.current);
        }
        setIndicator({ type, id: Date.now() });
        indicatorTimeoutRef.current = setTimeout(() => {
            setIndicator(null);
        }, 500);
    };

    const togglePlay = () => {
        if (!videoRef.current) return;
        playClickSound();
        if (videoRef.current.paused) {
            videoRef.current.play();
            triggerIndicator('play');
        } else {
            videoRef.current.pause();
            triggerIndicator('pause');
        }
    };

    const handleVideoClick = (e: React.MouseEvent) => {
        if (!videoRef.current) return;
        
        // Prevent click if clicking controls
        if ((e.target as HTMLElement).closest('.video-controls-container')) return;

        setShowSubtitleMenu(false); // Close subtitle menu if clicking video

        if (clickTimeoutRef.current) {
            clearTimeout(clickTimeoutRef.current);
            clickTimeoutRef.current = null;
            // Double click: seek
            handleDoubleVideoClick(e);
        } else {
            clickTimeoutRef.current = setTimeout(() => {
                clickTimeoutRef.current = null;
                // Single click: play/pause
                togglePlay();
            }, 250); // 250ms threshold
        }
    };

    const handleDoubleVideoClick = (e: React.MouseEvent) => {
        if (!containerRef.current || !videoRef.current) return;
        playClickSound();
        
        const rect = containerRef.current.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const width = rect.width;
        
        if (clickX < width / 2) {
            // Seek backward 10s
            const newTime = Math.max(0, videoRef.current.currentTime - 10);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            triggerIndicator('rewind');
        } else {
            // Seek forward 10s
            const newTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 10);
            videoRef.current.currentTime = newTime;
            setCurrentTime(newTime);
            triggerIndicator('forward');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!videoRef.current) return;
        
        // Ignore shortcuts if typing in fields
        const activeEl = document.activeElement;
        if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA' || (activeEl as any).isContentEditable)) {
            return;
        }

        switch (e.key) {
            case ' ':
                e.preventDefault();
                togglePlay();
                break;
            case 'ArrowLeft':
                e.preventDefault();
                playClickSound();
                const backTime = Math.max(0, videoRef.current.currentTime - 5);
                videoRef.current.currentTime = backTime;
                setCurrentTime(backTime);
                triggerIndicator('rewind');
                break;
            case 'ArrowRight':
                e.preventDefault();
                playClickSound();
                const fwdTime = Math.min(videoRef.current.duration || 0, videoRef.current.currentTime + 5);
                videoRef.current.currentTime = fwdTime;
                setCurrentTime(fwdTime);
                triggerIndicator('forward');
                break;
            case 'ArrowUp':
                e.preventDefault();
                playClickSound();
                const volUp = Math.min(1, videoRef.current.volume + 0.05);
                videoRef.current.volume = volUp;
                if (videoRef.current.muted && volUp > 0) {
                    videoRef.current.muted = false;
                    setIsMuted(false);
                }
                break;
            case 'ArrowDown':
                e.preventDefault();
                playClickSound();
                const volDown = Math.max(0, videoRef.current.volume - 0.05);
                videoRef.current.volume = volDown;
                if (volDown === 0) {
                    videoRef.current.muted = true;
                    setIsMuted(true);
                }
                break;
            case 'm':
            case 'M':
                e.preventDefault();
                playClickSound();
                videoRef.current.muted = !isMuted;
                setIsMuted(!isMuted);
                break;
            case 'f':
            case 'F':
                e.preventDefault();
                playClickSound();
                if (onFullscreenRequest) {
                    onFullscreenRequest();
                } else if (containerRef.current?.requestFullscreen) {
                    containerRef.current.requestFullscreen();
                } else if ((containerRef.current as any).webkitRequestFullscreen) {
                    (containerRef.current as any).webkitRequestFullscreen();
                }
                break;
            default:
                break;
        }
    };

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
        setCurrentTime(0);
        setDuration(0);
    }, [src]);

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

            if (errorCode === 4 && video.crossOrigin) {
                console.warn('Video failed to load with crossOrigin. Retrying without it...');
                video.removeAttribute('crossorigin');
                video.src = src;
                video.load();
                return;
            }

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
                hls.on(Hls.Events.ERROR, (_: any, data: any) => {
                    if (data.fatal) {
                        switch (data.type) {
                            case Hls.ErrorTypes.NETWORK_ERROR:
                                console.warn('Fatal network error, attempting to recover...');
                                hls.startLoad();
                                break;
                            case Hls.ErrorTypes.MEDIA_ERROR:
                                console.warn('Fatal media error, attempting to recover...');
                                hls.recoverMediaError();
                                break;
                            default:
                                console.error('Unrecoverable HLS error:', data);
                                hls.destroy();
                                setError('Video playback failed. Please try again.');
                                break;
                        }
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
            if (crossOrigin || (subtitles && subtitles.length > 0)) {
                video.crossOrigin = crossOrigin || 'anonymous';
            } else {
                video.removeAttribute('crossorigin');
            }
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

    const toggleMute = (e: React.MouseEvent) => {
        e.stopPropagation();
        playClickSound();
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

    const toggleSubtitle = (e: React.MouseEvent, language?: string) => {
        e.stopPropagation();
        playClickSound();
        if (!videoRef.current) return;
        
        const tracks = videoRef.current.textTracks;
        if (!tracks) return;

        if (language) {
            setSubtitlesEnabled(true);
            setActiveSubtitleLanguage(language);
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = tracks[i].language === language ? 'showing' : 'hidden';
            }
        } else {
            setSubtitlesEnabled(false);
            setActiveSubtitleLanguage(null);
            for (let i = 0; i < tracks.length; i++) {
                tracks[i].mode = 'hidden';
            }
        }
        setShowSubtitleMenu(false);
    };

    const handleFullscreen = (e: React.MouseEvent) => {
        e.stopPropagation();
        playClickSound();
        if (onFullscreenRequest) {
            onFullscreenRequest();
        } else if (containerRef.current?.requestFullscreen) {
            containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
            (containerRef.current as any).webkitRequestFullscreen();
        }
    };

    return (
        <div 
            ref={containerRef}
            tabIndex={0}
            className={`relative group bg-black overflow-hidden outline-none ${className}`}
            onKeyDown={handleKeyDown}
            onMouseMove={() => {
                setShowUI(true);
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
                        preload="auto"
                        onClick={handleVideoClick}
                        poster={poster}
                    >
                        {subtitleBlobs.map((sub) => (
                            <track
                                key={sub.language}
                                kind="subtitles"
                                src={sub.url}
                                srcLang={sub.language}
                                label={sub.label}
                                default={activeSubtitleLanguage === sub.language && subtitlesEnabled}
                            />
                        ))}
                    </video>

                    {/* YouTube-like Pulsing/Scaling Overlay Indicator */}
                    {indicator && (
                        <div 
                            key={indicator.id}
                            className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 select-none"
                        >
                            {(indicator.type === 'play' || indicator.type === 'pause') && (
                                <div className="bg-black/60 text-white rounded-full p-6 animate-scale-up-fade-out">
                                    {indicator.type === 'play' ? (
                                        <Play size={40} fill="currentColor" />
                                    ) : (
                                        <Pause size={40} fill="currentColor" />
                                    )}
                                </div>
                            )}
                            {indicator.type === 'forward' && (
                                <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-black/60 text-white px-5 py-3 rounded-xl flex flex-col items-center animate-ripple-right">
                                    <div className="flex gap-0.5">
                                        <ChevronRight size={18} className="animate-chevron-1" />
                                        <ChevronRight size={18} className="animate-chevron-2" />
                                        <ChevronRight size={18} className="animate-chevron-3" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider mt-1">+10s</span>
                                </div>
                            )}
                            {indicator.type === 'rewind' && (
                                <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black/60 text-white px-5 py-3 rounded-xl flex flex-col items-center animate-ripple-left">
                                    <div className="flex gap-0.5">
                                        <ChevronLeft size={18} className="animate-chevron-3" />
                                        <ChevronLeft size={18} className="animate-chevron-2" />
                                        <ChevronLeft size={18} className="animate-chevron-1" />
                                    </div>
                                    <span className="text-[10px] font-black uppercase tracking-wider mt-1">-10s</span>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Buffering Spinner */}
                    {isBuffering && (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
                            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
                        </div>
                    )}

                    {/* Custom Controls */}
                    {showControls && (
                        <div className="video-controls-container absolute bottom-0 left-0 right-0 z-30 p-6 bg-gradient-to-t from-black/80 to-transparent transition-opacity duration-300 group-hover:opacity-100 opacity-100">
                            
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
                                    {showPrevious && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playClickSound();
                                                onPrevious?.();
                                            }} 
                                            className="text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            <SkipBack size={14} /> Previous
                                        </button>
                                    )}
                                    {showSkip && (
                                        <button 
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                playClickSound();
                                                onSkip?.();
                                            }} 
                                            className="text-white/40 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest"
                                        >
                                            Skip <SkipForward size={14} />
                                        </button>
                                    )}
                                    
                                    {/* CC Subtitles Button & Menu */}
                                    {subtitles && subtitles.length > 0 && (
                                        <div className="relative">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    playClickSound();
                                                    setShowSubtitleMenu(!showSubtitleMenu);
                                                }}
                                                className={`transition-colors p-2 rounded-lg flex items-center justify-center ${subtitlesEnabled ? 'text-cyan-400 bg-cyan-400/10' : 'text-white hover:text-cyan-400 bg-white/5'}`}
                                            >
                                                <Subtitles size={18} />
                                            </button>
                                            
                                            {/* Subtitles Popup Menu */}
                                            {showSubtitleMenu && (
                                                <div className="absolute bottom-full right-0 mb-4 bg-black/90 backdrop-blur-md border border-white/10 rounded-xl overflow-hidden min-w-[150px] z-50 shadow-2xl animate-scale-up-fade-in origin-bottom-right">
                                                    <div className="px-4 py-2 border-b border-white/10 text-xs font-black uppercase tracking-widest text-white/50">
                                                        Subtitles
                                                    </div>
                                                    <div className="flex flex-col py-1">
                                                        <button 
                                                            onClick={(e) => toggleSubtitle(e)}
                                                            className={`text-left px-4 py-2 text-sm transition-colors hover:bg-white/10 ${!subtitlesEnabled ? 'text-cyan-400 font-bold' : 'text-white'}`}
                                                        >
                                                            Off
                                                        </button>
                                                        {subtitles.map((sub) => (
                                                            <button 
                                                                key={sub.language}
                                                                onClick={(e) => toggleSubtitle(e, sub.language)}
                                                                className={`text-left px-4 py-2 text-sm transition-colors hover:bg-white/10 ${subtitlesEnabled && activeSubtitleLanguage === sub.language ? 'text-cyan-400 font-bold' : 'text-white'}`}
                                                            >
                                                                {sub.label}
                                                            </button>
                                                        ))}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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

                @keyframes scaleUpFadeOut {
                    0% {
                        transform: scale(0.6);
                        opacity: 0;
                    }
                    30% {
                        transform: scale(1);
                        opacity: 0.9;
                    }
                    100% {
                        transform: scale(1.3);
                        opacity: 0;
                    }
                }

                @keyframes rippleLeft {
                    0% {
                        opacity: 0;
                        transform: translateY(-50%) scale(0.9);
                    }
                    20% {
                        opacity: 1;
                        transform: translateY(-50%) scale(1);
                    }
                    80% {
                        opacity: 1;
                        transform: translateY(-50%) scale(1);
                    }
                    100% {
                        opacity: 0;
                        transform: translateY(-50%) scale(0.95);
                    }
                }

                @keyframes chevronPulse {
                    0%, 100% { opacity: 0.3; }
                    50% { opacity: 1; }
                }

                @keyframes scaleUpFadeIn {
                    from { opacity: 0; transform: scale(0.95); }
                    to { opacity: 1; transform: scale(1); }
                }

                .animate-scale-up-fade-in {
                    animation: scaleUpFadeIn 0.2s ease-out forwards;
                }

                .animate-scale-up-fade-out {
                    animation: scaleUpFadeOut 0.5s ease-out forwards;
                }

                .animate-ripple-left {
                    animation: rippleLeft 0.5s ease-in-out forwards;
                }

                .animate-ripple-right {
                    animation: rippleLeft 0.5s ease-in-out forwards;
                }

                .animate-chevron-1 { animation: chevronPulse 0.5s infinite 0s; }
                .animate-chevron-2 { animation: chevronPulse 0.5s infinite 0.15s; }
                .animate-chevron-3 { animation: chevronPulse 0.5s infinite 0.3s; }
            `}</style>
        </div>
    );
});

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
