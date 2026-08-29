'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { AlertCircle, Maximize, Minimize2, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack, ChevronRight, ChevronLeft } from 'lucide-react';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  requestFullScreen: () => void;
}

interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
  showPrevious?: boolean;
  onPrevious?: () => void;
  onFullscreenRequest?: () => void;
  showMinimize?: boolean;
  onMinimize?: () => void;
}

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  ({
    videoId,
    title = 'Video',
    autoPlay = false,
    showControls = false,
    className = '',
    onTimeUpdate,
    onEnded,
    showSkip = false,
    onSkip,
    showPrevious = false,
    onPrevious,
    onFullscreenRequest,
    showMinimize = true,
    onMinimize,
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ytWrapperRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showUI, setShowUI] = useState(true);

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

    const playerIdRef = useRef<string>(`youtube-player-${Math.random().toString(36).substr(2, 9)}`);
    const initialVideoId = useRef(videoId);
    const currentVideoIdRef = useRef(videoId);

    const onTimeUpdateRef = useRef(onTimeUpdate);
    const onEndedRef = useRef(onEnded);

    useEffect(() => {
      onTimeUpdateRef.current = onTimeUpdate;
      onEndedRef.current = onEnded;
    }, [onTimeUpdate, onEnded]);

    useEffect(() => {
      currentVideoIdRef.current = videoId;
    }, [videoId]);

    // Initialize YouTube API once on mount
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      let player: any = null;
      let checkYTInterval: NodeJS.Timeout | null = null;

      const initPlayer = () => {
        // Manually inject the target div so React doesn't try to manage it or overwrite it
        if (ytWrapperRef.current && !document.getElementById(playerIdRef.current)) {
          ytWrapperRef.current.innerHTML = `<div id="${playerIdRef.current}" class="w-full h-full scale-[1.2]"></div>`;
        }

        const container = document.getElementById(playerIdRef.current);
        if (!container) return;
        const YT = (window as any).YT;
        if (!YT || !YT.Player) return;

        player = new YT.Player(playerIdRef.current, {
          width: '100%',
          height: '100%',
          videoId: initialVideoId.current,
          playerVars: {
            autoplay: autoPlay ? 1 : 0,
            controls: 0, // Always hide native controls
            disablekb: 1, // Disable keyboard controls to match
            modestbranding: 1,
            rel: 0,
            fs: 0, // We handle fullscreen
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            'onReady': (event: any) => {
              setIsReady(true);
              
              if (event.target) {
                playerRef.current = event.target;
              }

              if (typeof playerRef.current.getDuration === 'function') {
                setDuration(playerRef.current.getDuration());
              }
              
              // Load the latest video if it changed during initialization
              const latestVideoId = currentVideoIdRef.current;
              if (latestVideoId !== initialVideoId.current) {
                playerRef.current.loadVideoById({
                  videoId: latestVideoId,
                  startSeconds: 0
                });
              } else if (autoPlay) {
                if (typeof playerRef.current.playVideo === 'function') {
                  playerRef.current.playVideo();
                }
              }
            },
            'onError': (event: any) => {
              const errorCodes: { [key: number]: string } = {
                2: 'Invalid parameter',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video not allowed to be played embedded',
                150: 'Video not allowed to be played embedded',
              };
              setError(errorCodes[event.data] || 'YouTube player error');
            },
            'onStateChange': (event: any) => {
              const YT = (window as any).YT;
              if (event.data === YT.PlayerState.BUFFERING) {
                setIsBuffering(true);
              } else if (event.data === YT.PlayerState.PLAYING) {
                setIsBuffering(false);
                setIsPlaying(true);
                if (onTimeUpdateRef.current) {
                  // Update progress periodically during playback
                  const interval = setInterval(() => {
                    if (
                      playerRef.current && 
                      typeof playerRef.current.getCurrentTime === 'function' &&
                      typeof playerRef.current.getDuration === 'function'
                    ) {
                      const current = playerRef.current.getCurrentTime();
                      const total = playerRef.current.getDuration();
                      setCurrentTime(current);
                      setDuration(total);
                      onTimeUpdateRef.current?.(current, total);
                    }
                  }, 1000);

                  // Clean up interval when not playing
                  const checkPlayback = setInterval(() => {
                    if (playerRef.current?.getPlayerState?.() !== YT.PlayerState.PLAYING) {
                      clearInterval(interval);
                      clearInterval(checkPlayback);
                    }
                  }, 1000);
                }
              } else {
                setIsBuffering(false);
                setIsPlaying(false);
              }

              if (event.data === YT.PlayerState.ENDED && onEndedRef.current) {
                onEndedRef.current();
              }
            },
          },
        });
        playerRef.current = player;
      };

      if ((window as any).YT && (window as any).YT.Player) {
        initPlayer();
      } else {
        if (!document.getElementById('youtube-iframe-api-script')) {
          const tag = document.createElement('script');
          tag.id = 'youtube-iframe-api-script';
          tag.src = 'https://www.youtube.com/iframe_api';
          const firstScriptTag = document.getElementsByTagName('script')[0];
          firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
        }

        checkYTInterval = setInterval(() => {
          if ((window as any).YT && (window as any).YT.Player) {
            if (checkYTInterval) clearInterval(checkYTInterval);
            initPlayer();
          }
        }, 100);

        const previousCallback = (window as any).onYouTubeIframeAPIReady;
        (window as any).onYouTubeIframeAPIReady = () => {
          if (previousCallback) previousCallback();
          if (checkYTInterval) clearInterval(checkYTInterval);
          initPlayer();
        };
      }

      return () => {
        if (checkYTInterval) clearInterval(checkYTInterval);
        if (player && player.destroy) {
          player.destroy();
        }
      };
    }, [autoPlay]);

    // Handle videoId updates by reusing the existing player instance
    useEffect(() => {
      setCurrentTime(0);
      setDuration(0);
      
      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 0
        });
      }
    }, [videoId]);

    useImperativeHandle(ref, () => ({
      play: () => {
        if (typeof playerRef.current?.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      },
      pause: () => {
        if (typeof playerRef.current?.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      },
      requestFullScreen: () => {
        if (containerRef.current?.requestFullscreen) {
          containerRef.current.requestFullscreen();
        } else if ((containerRef.current as any).webkitRequestFullscreen) {
          (containerRef.current as any).webkitRequestFullscreen();
        }
      },
    }));

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const togglePlay = () => {
      playClickSound();
      if (isPlaying) {
        if (typeof playerRef.current?.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
          triggerIndicator('pause');
        }
      } else {
        if (typeof playerRef.current?.playVideo === 'function') {
          playerRef.current.playVideo();
          triggerIndicator('play');
        }
      }
    };

    const handleVideoClick = (e: React.MouseEvent) => {
      // Prevent click if clicking controls
      if ((e.target as HTMLElement).closest('.video-controls-container')) return;

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        handleDoubleVideoClick(e);
      } else {
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
          togglePlay();
        }, 250);
      }
    };

    const handleDoubleVideoClick = (e: React.MouseEvent) => {
      if (!containerRef.current || !playerRef.current) return;
      playClickSound();
      
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;
      
      if (clickX < width / 2) {
        // Rewind 10s
        if (typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.seekTo === 'function') {
          const current = playerRef.current.getCurrentTime();
          const newTime = Math.max(0, current - 10);
          playerRef.current.seekTo(newTime, true);
          setCurrentTime(newTime);
          triggerIndicator('rewind');
        }
      } else {
        // Fast forward 10s
        if (typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.seekTo === 'function') {
          const current = playerRef.current.getCurrentTime();
          const newTime = Math.min(duration || 0, current + 10);
          playerRef.current.seekTo(newTime, true);
          setCurrentTime(newTime);
          triggerIndicator('forward');
        }
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (!playerRef.current) return;
      
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
          if (typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.seekTo === 'function') {
            const current = playerRef.current.getCurrentTime();
            const newTime = Math.max(0, current - 5);
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
            triggerIndicator('rewind');
          }
          break;
        case 'ArrowRight':
          e.preventDefault();
          playClickSound();
          if (typeof playerRef.current.getCurrentTime === 'function' && typeof playerRef.current.seekTo === 'function') {
            const current = playerRef.current.getCurrentTime();
            const newTime = Math.min(duration || 0, current + 5);
            playerRef.current.seekTo(newTime, true);
            setCurrentTime(newTime);
            triggerIndicator('forward');
          }
          break;
        case 'ArrowUp':
          e.preventDefault();
          playClickSound();
          if (typeof playerRef.current.getVolume === 'function' && typeof playerRef.current.setVolume === 'function') {
            const currentVol = playerRef.current.getVolume();
            const newVol = Math.min(100, currentVol + 5);
            playerRef.current.setVolume(newVol);
            if (isMuted && newVol > 0) {
              if (typeof playerRef.current.unMute === 'function') playerRef.current.unMute();
              setIsMuted(false);
            }
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          playClickSound();
          if (typeof playerRef.current.getVolume === 'function' && typeof playerRef.current.setVolume === 'function') {
            const currentVol = playerRef.current.getVolume();
            const newVol = Math.max(0, currentVol - 5);
            playerRef.current.setVolume(newVol);
            if (newVol === 0) {
              if (typeof playerRef.current.mute === 'function') playerRef.current.mute();
              setIsMuted(true);
            }
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          playClickSound();
          if (isMuted) {
            if (typeof playerRef.current?.unMute === 'function') playerRef.current.unMute();
            setIsMuted(false);
          } else {
            if (typeof playerRef.current?.mute === 'function') playerRef.current.mute();
            setIsMuted(true);
          }
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

    const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();
      if (isMuted) {
        if (typeof playerRef.current?.unMute === 'function') playerRef.current.unMute();
        setIsMuted(false);
      } else {
        if (typeof playerRef.current?.mute === 'function') playerRef.current.mute();
        setIsMuted(true);
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (typeof playerRef.current?.seekTo === 'function') {
        playerRef.current.seekTo(time, true);
      }
      setCurrentTime(time);
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

    const handleMinimizeToggle = (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();
      if (onMinimize) {
        onMinimize();
      }
    };

    if (error) {
      return (
        <div className={`relative w-full bg-black flex items-center justify-center ${className}`} style={{ aspectRatio: '16/9' }}>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/60 bg-black/40 backdrop-blur-md z-50">
            <AlertCircle size={48} className="text-red-500 mb-4" />
            <p className="text-sm font-black uppercase tracking-widest text-center px-4">
              {error}
            </p>
            <p className="text-xs text-white/40 mt-2">This video may not be available for embedding</p>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className={`relative w-full bg-black overflow-hidden outline-none group ${className}`}
        style={{ aspectRatio: '16/9' }}
        onKeyDown={handleKeyDown}
        onMouseMove={() => setShowUI(true)}
      >
        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </div>
        )}

        {/* Buffering State */}
        {isReady && isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-[2px] z-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </div>
        )}

        {/* YouTube Player */}
        <div ref={ytWrapperRef} className="absolute inset-0" />
        
        {/* Transparent overlay to catch clicks and toggle play */}
        <div className="absolute inset-0 z-10 cursor-pointer animate-youtube-clickable" onClick={handleVideoClick} />

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
                        <button onClick={(e) => { e.stopPropagation(); togglePlay(); }} className="text-white hover:text-cyan-400 transition-colors">
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
                        {showMinimize && (
                            <button 
                                onClick={handleMinimizeToggle}
                                className="text-white hover:text-cyan-400 transition-colors p-2 bg-white/5 rounded-lg"
                                title="Minimize / Floating Player"
                            >
                                <Minimize2 size={18} />
                            </button>
                        )}
                        <button 
                            onClick={handleFullscreen}
                            className="text-white hover:text-cyan-400 transition-colors p-2 bg-white/5 rounded-lg"
                            title="Fullscreen"
                        >
                            <Maximize size={18} />
                        </button>
                    </div>
                </div>
            </div>
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
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
