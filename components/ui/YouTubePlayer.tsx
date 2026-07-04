'use client';

import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import { AlertCircle, Maximize, Play, Pause, Volume2, VolumeX, SkipForward, SkipBack } from 'lucide-react';

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
  }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ytWrapperRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [showUI, setShowUI] = useState(true);

    // Initialize YouTube API
    React.useEffect(() => {
      if (typeof window === 'undefined') return;

      let player: any = null;
      let checkYTInterval: NodeJS.Timeout | null = null;

      const initPlayer = () => {
        // Manually inject the target div so React doesn't try to manage it or overwrite it
        if (ytWrapperRef.current && !document.getElementById(`youtube-player-${videoId}`)) {
          ytWrapperRef.current.innerHTML = `<div id="youtube-player-${videoId}" class="w-full h-full scale-[1.2]"></div>`;
        }

        const container = document.getElementById(`youtube-player-${videoId}`);
        if (!container) return;
        const YT = (window as any).YT;
        if (!YT || !YT.Player) return;

        player = new YT.Player(`youtube-player-${videoId}`, {
          width: '100%',
          height: '100%',
          videoId: videoId,
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
              
              // Ensure we have the fully initialized player object with all methods
              if (event.target) {
                playerRef.current = event.target;
              }

              // Setup initial duration
              if (typeof playerRef.current.getDuration === 'function') {
                setDuration(playerRef.current.getDuration());
              }
              if (autoPlay) {
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
              if (event.data === YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                if (onTimeUpdate) {
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
                      onTimeUpdate(current, total);
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
                setIsPlaying(false);
              }

              if (event.data === YT.PlayerState.ENDED && onEnded) {
                onEnded();
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
    }, [autoPlay, onTimeUpdate, onEnded, videoId]);

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
      if (isPlaying) {
        if (typeof playerRef.current?.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      } else {
        if (typeof playerRef.current?.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      }
    };

    const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
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
      if (onFullscreenRequest) {
        onFullscreenRequest();
      } else if (containerRef.current?.requestFullscreen) {
        containerRef.current.requestFullscreen();
      } else if ((containerRef.current as any).webkitRequestFullscreen) {
        (containerRef.current as any).webkitRequestFullscreen();
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
        className={`relative w-full bg-black overflow-hidden group ${className}`}
        style={{ aspectRatio: '16/9' }}
        onMouseMove={() => setShowUI(true)}
      >
        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </div>
        )}

        {/* YouTube Player */}
        <div ref={ytWrapperRef} className="absolute inset-0" />
        
        {/* Transparent overlay to catch clicks and toggle play */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={togglePlay} />

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
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
