'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {
  Play,
  Pause,
  Maximize,
  Minimize2,
  Volume1,
  Volume2,
  VolumeX,
  RotateCcw,
  RotateCw,
  AlertCircle,
  ChevronRight,
  ChevronLeft,
  Subtitles,
  Settings,
  Check,
  RefreshCw,
  Gauge,
  Sliders,
  PictureInPicture2,
} from 'lucide-react';
import Hls from 'hls.js';
import { getFallbackVideoUrl } from '@/lib/video-utils';

export interface HlsQualityLevel {
  id: number; // -1 for Auto, or level index in hls.js
  height: number;
  label: string; // e.g. "1080p", "720p", "Auto"
  bitrate?: number;
  isLocked?: boolean;
}

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
  showMinimize?: boolean;
  onMinimize?: () => void;
  subtitles?: {
    language: string;
    label: string;
    url: string;
  }[];
  audioTracks?: {
    language: string;
    label: string;
    url: string;
    isDefault?: boolean;
  }[];
  maxQualityHeight?: number;
}

export interface VideoPlayerHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  requestFullScreen: () => void;
  videoElement: HTMLVideoElement | null;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const VideoPlayer = forwardRef<VideoPlayerHandle, VideoPlayerProps>(
  (
    {
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
      showMinimize = true,
      onMinimize,
      subtitles,
      audioTracks,
      maxQualityHeight,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const hlsRef = useRef<Hls | null>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // UI & Error State
    const [error, setError] = useState<string | null>(null);
    const [isBuffering, setIsBuffering] = useState(false);
    const [showUI, setShowUI] = useState(true);

    // Video Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedEnd, setBufferedEnd] = useState(0);

    // Adaptive Quality & Speed State
    const [qualityLevels, setQualityLevels] = useState<HlsQualityLevel[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
    const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);

    // Menus State
    const [activeMenu, setActiveMenu] = useState<
      'none' | 'settings' | 'quality' | 'speed' | 'subtitles' | 'audio'
    >('none');

    // Subtitle State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
    const [activeSubtitleLanguage, setActiveSubtitleLanguage] = useState<
      string | null
    >(null);
    const [subtitleBlobs, setSubtitleBlobs] = useState<
      { language: string; label: string; url: string; originalUrl: string }[]
    >([]);

    // Audio Track State
    const [selectedAudioTrackUrl, setSelectedAudioTrackUrl] = useState<
      string | null
    >(null);

    // Dynamic Active Source State for retries
    const [activeSrc, setActiveSrc] = useState(src);
    const fallbackTriedRef = useRef(false);

    // Indicator Overlay State (e.g. +10s / -10s / play / pause animation)
    const [indicator, setIndicator] = useState<{
      type: 'play' | 'pause' | 'forward' | 'rewind';
      id: number;
    } | null>(null);
    const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    // Synchronize prop changes to active source
    useEffect(() => {
      setActiveSrc(src);
      fallbackTriedRef.current = false;
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      setCurrentQuality(-1);
    }, [src]);

    // Audio click feedback sound
    const playClickSound = useCallback(() => {
      try {
        const AudioContext =
          window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc.type = 'sine';
        osc.frequency.setValueAtTime(1600, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.035);

        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.001,
          ctx.currentTime + 0.035
        );

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Autoplay security restrictions
      }
    }, []);

    // Visual Indicator overlay trigger
    const triggerIndicator = (
      type: 'play' | 'pause' | 'forward' | 'rewind'
    ) => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
      setIndicator({ type, id: Date.now() });
      indicatorTimeoutRef.current = setTimeout(() => {
        setIndicator(null);
      }, 500);
    };

    // Toggle Play / Pause
    const togglePlay = useCallback(() => {
      if (!videoRef.current) return;
      playClickSound();
      if (videoRef.current.paused) {
        videoRef.current
          .play()
          .then(() => {
            setIsPlaying(true);
            triggerIndicator('play');
          })
          .catch((err) => console.warn('Play interrupted:', err));
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
        triggerIndicator('pause');
      }
    }, [playClickSound]);

    // Fast Seek (+/- 10s)
    const handleSkipSeconds = useCallback(
      (seconds: number) => {
        if (!videoRef.current) return;
        playClickSound();
        const newTime = Math.min(
          Math.max(0, videoRef.current.currentTime + seconds),
          videoRef.current.duration || 0
        );
        videoRef.current.currentTime = newTime;
        setCurrentTime(newTime);
        triggerIndicator(seconds > 0 ? 'forward' : 'rewind');
      },
      [playClickSound]
    );

    // Auto-hide UI controls after 3 seconds of mouse inactivity
    const resetControlsTimeout = useCallback(() => {
      setShowUI(true);
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
      if (isPlaying) {
        controlsTimeoutRef.current = setTimeout(() => {
          if (activeMenu === 'none') {
            setShowUI(false);
          }
        }, 3000);
      }
    }, [isPlaying, activeMenu]);

    // Handle HLS & Native Video Initialization
    useEffect(() => {
      const video = videoRef.current;
      if (!video || !activeSrc) return;

      setError(null);
      setQualityLevels([]);
      setCurrentQuality(-1);

      // Clean up existing HLS instance
      if (hlsRef.current) {
        hlsRef.current.destroy();
        hlsRef.current = null;
      }

      const handleCanPlay = () => {
        setIsBuffering(false);
        if (autoPlay) {
          video.play().catch((e) => console.log('Autoplay handled:', e));
        }
      };

      const handleWaiting = () => setIsBuffering(true);
      const handlePlaying = () => {
        setIsBuffering(false);
        setIsPlaying(true);
      };

      const handleError = () => {
        const videoErr = video.error;
        console.warn('Video element error:', videoErr);

        if (!fallbackTriedRef.current) {
          fallbackTriedRef.current = true;
          const fallbackUrl = getFallbackVideoUrl(src || 'video');
          if (fallbackUrl && fallbackUrl !== activeSrc) {
            console.warn(
              `Playback failed for "${activeSrc}". Trying fallback stream...`
            );
            setActiveSrc(fallbackUrl);
            return;
          }
        }

        setError('Unable to play this video. Please try again.');
      };

      video.addEventListener('waiting', handleWaiting);
      video.addEventListener('playing', handlePlaying);
      video.addEventListener('error', handleError);

      // HLS Manifest Playback (.m3u8)
      if (activeSrc.includes('.m3u8') || activeSrc.includes('playlist')) {
        if (Hls.isSupported()) {
          const hls = new Hls({
            enableWorker: true,
            lowLatencyMode: true,
            backBufferLength: 90,
            xhrSetup: (xhr) => {
              xhr.withCredentials = false;
            },
          });

          hls.loadSource(activeSrc);
          hls.attachMedia(video);
          hlsRef.current = hls;

          // Process Manifest Quality Levels
          hls.on(Hls.Events.MANIFEST_PARSED, (_, data) => {
            handleCanPlay();
            if (data.levels && data.levels.length > 0) {
              const limitHeight = maxQualityHeight && maxQualityHeight > 0 ? maxQualityHeight : Infinity;
              
              if (limitHeight < Infinity) {
                let maxLevelId = -1;
                data.levels.forEach((lvl, idx) => {
                   if (lvl.height <= limitHeight) maxLevelId = Math.max(maxLevelId, idx);
                });
                if (maxLevelId >= 0) {
                  hls.autoLevelCapping = maxLevelId;
                }
              }

              const detectedLevels: HlsQualityLevel[] = data.levels
                .map((level, idx) => ({
                  id: idx,
                  height: level.height || 0,
                  label: level.height ? `${level.height}p` : `Level ${idx + 1}`,
                  bitrate: level.bitrate,
                  isLocked: level.height > limitHeight,
                }))
                .filter((lvl) => lvl.height > 0)
                .sort((a, b) => b.height - a.height); // Sort descending (1080p, 720p, 480p, 360p)

              // Deduplicate resolutions
              const uniqueLevels: HlsQualityLevel[] = [];
              const seenHeights = new Set<number>();
              for (const lvl of detectedLevels) {
                if (!seenHeights.has(lvl.height)) {
                  seenHeights.add(lvl.height);
                  uniqueLevels.push(lvl);
                }
              }

              setQualityLevels(uniqueLevels);
            }
          });

          hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            if (hls.autoLevelEnabled) {
              setCurrentQuality(-1);
            } else {
              setCurrentQuality(data.level);
            }
          });

          // HLS Error Handling
          hls.on(Hls.Events.ERROR, (_, data) => {
            if (data.fatal) {
              switch (data.type) {
                case Hls.ErrorTypes.NETWORK_ERROR:
                  console.warn('HLS Network error, attempting recovery...');
                  hls.startLoad();
                  break;
                case Hls.ErrorTypes.MEDIA_ERROR:
                  console.warn('HLS Media error, attempting recovery...');
                  hls.recoverMediaError();
                  break;
                default:
                  console.warn('Unrecoverable HLS Error:', data);
                  hls.destroy();
                  if (!fallbackTriedRef.current) {
                    fallbackTriedRef.current = true;
                    const fallbackUrl = getFallbackVideoUrl(src || 'video');
                    if (fallbackUrl && fallbackUrl !== activeSrc) {
                      setActiveSrc(fallbackUrl);
                      return;
                    }
                  }
                  setError('Unable to play this video. Please try again.');
                  break;
              }
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          // Native Apple HLS support (Safari / iOS)
          video.src = activeSrc;
          video.addEventListener('loadedmetadata', handleCanPlay);
        } else {
          setError('HLS playback is not supported in your browser.');
        }
      } else {
        // Standard Direct Video Format (MP4/WebM)
        if (crossOrigin || (subtitles && subtitles.length > 0)) {
          video.crossOrigin = crossOrigin || 'anonymous';
        } else {
          video.removeAttribute('crossorigin');
        }
        video.src = activeSrc;
        video.load();
        video.addEventListener('canplay', handleCanPlay);
      }

      return () => {
        if (hlsRef.current) {
          hlsRef.current.destroy();
          hlsRef.current = null;
        }
        video.removeEventListener('waiting', handleWaiting);
        video.removeEventListener('playing', handlePlaying);
        video.removeEventListener('error', handleError);
        video.removeEventListener('canplay', handleCanPlay);
        video.removeEventListener('loadedmetadata', handleCanPlay);
      };
    }, [activeSrc, autoPlay, crossOrigin, src, subtitles]);

    // Handle Manual Quality Selection
    const handleQualitySelect = (levelId: number) => {
      playClickSound();
      setCurrentQuality(levelId);
      if (hlsRef.current) {
        hlsRef.current.currentLevel = levelId;
      }
      setActiveMenu('none');
    };

    // Handle Playback Speed Selection
    const handleSpeedSelect = (speed: number) => {
      playClickSound();
      setSelectedSpeed(speed);
      if (videoRef.current) {
        videoRef.current.playbackRate = speed;
      }
      setActiveMenu('none');
    };

    // Handle Retry Action
    const handleRetry = () => {
      setError(null);
      fallbackTriedRef.current = false;
      setActiveSrc(src);
    };

    // Video Time Updates & Buffer Calculations
    const handleTimeUpdate = () => {
      if (!videoRef.current) return;
      const current = videoRef.current.currentTime;
      const total = videoRef.current.duration || 0;
      setCurrentTime(current);
      setDuration(total);

      // Calculate buffered end percentage
      if (videoRef.current.buffered.length > 0) {
        try {
          const buffered = videoRef.current.buffered.end(
            videoRef.current.buffered.length - 1
          );
          setBufferedEnd(buffered);
        } catch (e) {
          // ignore index errors
        }
      }

      onTimeUpdate?.(current, total);
    };

    const handleLoadedMetadata = () => {
      if (!videoRef.current) return;
      setDuration(videoRef.current.duration || 0);
    };

    // Volume & Mute Control
    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (videoRef.current) {
        videoRef.current.volume = val;
        videoRef.current.muted = val === 0;
        setIsMuted(val === 0);
      }
    };

    const toggleMute = (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();
      if (!videoRef.current) return;
      const newMuted = !isMuted;
      videoRef.current.muted = newMuted;
      setIsMuted(newMuted);
    };

    // Seeking Slider Handler
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!videoRef.current) return;
      const time = parseFloat(e.target.value);
      videoRef.current.currentTime = time;
      setCurrentTime(time);
    };

    // Picture in Picture Toggle
    const togglePictureInPicture = async (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();
      if (!videoRef.current) return;
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else if (document.pictureInPictureEnabled) {
          await videoRef.current.requestPictureInPicture();
        }
      } catch (err) {
        console.warn('Picture-in-picture error:', err);
      }
    };

    // Fullscreen Toggle
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

    // Subtitle Fetching & Blob URLs
    useEffect(() => {
      if (!subtitles || subtitles.length === 0) {
        setSubtitleBlobs([]);
        return;
      }

      let isMounted = true;
      const objectUrls: string[] = [];

      const fetchSubtitles = async () => {
        try {
          const fetched = await Promise.all(
            subtitles.map(async (sub) => {
              try {
                const response = await fetch(sub.url);
                if (!response.ok) throw new Error('Network error');
                const text = await response.text();
                const blob = new Blob([text], { type: 'text/vtt' });
                const blobUrl = URL.createObjectURL(blob);
                objectUrls.push(blobUrl);
                return { ...sub, url: blobUrl, originalUrl: sub.url };
              } catch (e) {
                return { ...sub, originalUrl: sub.url };
              }
            })
          );
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
          tracks[i].mode =
            tracks[i].language === language ? 'showing' : 'hidden';
        }
      } else {
        setSubtitlesEnabled(false);
        setActiveSubtitleLanguage(null);
        for (let i = 0; i < tracks.length; i++) {
          tracks[i].mode = 'hidden';
        }
      }
      setActiveMenu('none');
    };

    // Single / Double Click handling on Video Container
    const handleVideoClick = (e: React.MouseEvent) => {
      if (!videoRef.current) return;
      if ((e.target as HTMLElement).closest('.video-controls-container')) return;

      setActiveMenu('none');

      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
        clickTimeoutRef.current = null;
        // Double click: seek -10s / +10s
        handleDoubleVideoClick(e);
      } else {
        clickTimeoutRef.current = setTimeout(() => {
          clickTimeoutRef.current = null;
          // Single click: toggle play/pause
          togglePlay();
        }, 250);
      }
    };

    const handleDoubleVideoClick = (e: React.MouseEvent) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      if (clickX < width / 2) {
        handleSkipSeconds(-10);
      } else {
        handleSkipSeconds(10);
      }
    };

    // Keyboard Shortcuts Listener
    const handleKeyDown = (e: React.KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === 'INPUT' ||
          activeEl.tagName === 'TEXTAREA' ||
          (activeEl as any).isContentEditable)
      ) {
        return;
      }

      switch (e.key) {
        case ' ':
        case 'k':
        case 'K':
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft':
        case 'j':
        case 'J':
          e.preventDefault();
          handleSkipSeconds(-10);
          break;
        case 'ArrowRight':
        case 'l':
        case 'L':
          e.preventDefault();
          handleSkipSeconds(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          playClickSound();
          if (videoRef.current) {
            const newVol = Math.min(1, videoRef.current.volume + 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            setIsMuted(newVol === 0);
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          playClickSound();
          if (videoRef.current) {
            const newVol = Math.max(0, videoRef.current.volume - 0.1);
            videoRef.current.volume = newVol;
            setVolume(newVol);
            setIsMuted(newVol === 0);
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute(e as any);
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFullscreen(e as any);
          break;
        default:
          break;
      }
    };

    // Imperative ref handle
    useImperativeHandle(ref, () => ({
      play: () => videoRef.current?.play(),
      pause: () => videoRef.current?.pause(),
      togglePlay: () => togglePlay(),
      requestFullScreen: () => {
        if (containerRef.current) {
          if (containerRef.current.requestFullscreen) {
            containerRef.current.requestFullscreen();
          } else if ((containerRef.current as any).webkitRequestFullscreen) {
            (containerRef.current as any).webkitRequestFullscreen();
          }
        }
      },
      videoElement: videoRef.current,
    }));

    const formatTime = (seconds: number) => {
      if (isNaN(seconds) || seconds < 0) return '0:00';
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, '0')}:${secs
          .toString()
          .padStart(2, '0')}`;
      }
      return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className={`relative group bg-black overflow-hidden outline-none select-none font-inter ${className}`}
        onKeyDown={handleKeyDown}
        onMouseMove={resetControlsTimeout}
        onMouseLeave={() => {
          if (isPlaying && activeMenu === 'none') {
            setShowUI(false);
          }
        }}
      >
        {/* Error Screen Overlay */}
        {error ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white bg-black/90 backdrop-blur-md z-50 p-6 text-center">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mb-4 border border-red-500/20 shadow-lg">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-lg font-black uppercase tracking-tight mb-2">
              Playback Error
            </h3>
            <p className="text-sm text-white/70 max-w-md mb-6 font-medium">
              {error}
            </p>
            <button
              onClick={handleRetry}
              className="flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-black font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] active:scale-95"
            >
              <RefreshCw size={16} /> Retry Playback
            </button>
          </div>
        ) : (
          <>
            {/* HTML5 Video Element */}
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
                  default={
                    activeSubtitleLanguage === sub.language && subtitlesEnabled
                  }
                />
              ))}
            </video>

            {/* Tap/Click Animation Overlay */}
            {indicator && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-40 select-none">
                {(indicator.type === 'play' || indicator.type === 'pause') && (
                  <div className="bg-black/70 text-white rounded-full p-6 animate-scale-up-fade-out border border-white/10 backdrop-blur-md shadow-2xl">
                    {indicator.type === 'play' ? (
                      <Play size={44} fill="currentColor" />
                    ) : (
                      <Pause size={44} fill="currentColor" />
                    )}
                  </div>
                )}
                {indicator.type === 'forward' && (
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-black/70 text-white px-5 py-3 rounded-2xl flex flex-col items-center animate-ripple-right border border-cyan-500/30 backdrop-blur-md">
                    <RotateCw size={24} className="text-cyan-400 mb-1" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                      +10s
                    </span>
                  </div>
                )}
                {indicator.type === 'rewind' && (
                  <div className="absolute left-12 top-1/2 -translate-y-1/2 bg-black/70 text-white px-5 py-3 rounded-2xl flex flex-col items-center animate-ripple-left border border-cyan-500/30 backdrop-blur-md">
                    <RotateCcw size={24} className="text-cyan-400 mb-1" />
                    <span className="text-[11px] font-black uppercase tracking-wider text-cyan-400">
                      -10s
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Buffering Spinner */}
            {isBuffering && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-20 pointer-events-none">
                <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
              </div>
            )}

            {/* Muted Autoplay Sound Prompt */}
            {autoPlay && isMuted && isPlaying && (
              <button
                onClick={toggleMute}
                className="absolute top-6 right-6 z-40 bg-black/80 hover:bg-black text-cyan-400 border border-cyan-500/40 backdrop-blur-md px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg hover:scale-105 active:scale-95"
              >
                <VolumeX size={16} /> Click to unmute
              </button>
            )}

            {/* Modern Streaming Control Bar */}
            {showControls && (
              <div
                className={`video-controls-container absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black/95 via-black/70 to-transparent transition-opacity duration-300 ${
                  showUI || activeMenu !== 'none'
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Progress Bar Container */}
                <div className="mb-4 group/progress relative flex items-center cursor-pointer">
                  {/* Buffer range bar */}
                  <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className="h-full bg-white/30 transition-all duration-200"
                      style={{
                        width: `${
                          duration > 0 ? (bufferedEnd / duration) * 100 : 0
                        }%`,
                      }}
                    />
                  </div>
                  {/* Current progress range bar */}
                  <input
                    type="range"
                    min="0"
                    max={duration || 0}
                    step="0.1"
                    value={currentTime}
                    onChange={handleSeek}
                    className="w-full h-1.5 bg-transparent appearance-none cursor-pointer accent-cyan-400 hover:h-2.5 transition-all video-range z-10"
                  />
                </div>

                {/* Main Controls row */}
                <div className="flex items-center justify-between gap-2 sm:gap-4 flex-wrap sm:flex-nowrap">
                  {/* Left Controls Group */}
                  <div className="flex items-center gap-2 sm:gap-4">
                    <button
                      onClick={togglePlay}
                      className="text-white hover:text-cyan-400 transition-all p-2 rounded-xl hover:bg-white/10 active:scale-95"
                      title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                    >
                      {isPlaying ? (
                        <Pause size={24} fill="currentColor" />
                      ) : (
                        <Play size={24} fill="currentColor" />
                      )}
                    </button>

                    <button
                      onClick={() => handleSkipSeconds(-10)}
                      className="text-white/80 hover:text-cyan-400 transition-all p-1.5 rounded-xl hover:bg-white/10 hidden sm:flex items-center justify-center"
                      title="Rewind 10s (Left Arrow)"
                    >
                      <RotateCcw size={18} />
                    </button>

                    <button
                      onClick={() => handleSkipSeconds(10)}
                      className="text-white/80 hover:text-cyan-400 transition-all p-1.5 rounded-xl hover:bg-white/10 hidden sm:flex items-center justify-center"
                      title="Forward 10s (Right Arrow)"
                    >
                      <RotateCw size={18} />
                    </button>

                    {/* Enhanced Volume Control */}
                    <div className="flex items-center gap-2 group/volume relative">
                      <button
                        onClick={toggleMute}
                        className="text-white/90 hover:text-cyan-400 transition-all p-2 rounded-xl hover:bg-white/10 relative"
                        title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                      >
                        {isMuted || volume === 0 ? (
                          <VolumeX size={20} className="text-red-400" />
                        ) : volume < 0.5 ? (
                          <Volume1 size={20} className="text-cyan-400" />
                        ) : (
                          <Volume2 size={20} className="text-cyan-400" />
                        )}
                      </button>

                      {/* Volume Slider Container */}
                      <div className="relative flex items-center w-16 sm:w-24 h-6">
                        {/* Background & Filled Track */}
                        <div className="absolute left-0 right-0 h-1.5 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                          <div
                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-75"
                            style={{
                              width: `${(isMuted ? 0 : volume) * 100}%`,
                            }}
                          />
                        </div>
                        {/* Interactive Range Input */}
                        <input
                          type="range"
                          min="0"
                          max="1"
                          step="0.01"
                          value={isMuted ? 0 : volume}
                          onChange={handleVolumeChange}
                          className="w-full h-full opacity-0 cursor-pointer z-10"
                          title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                        />
                      </div>

                      {/* Hover Volume Percentage Badge */}
                      <span className="hidden group-hover/volume:inline-block text-[10px] font-mono font-bold text-cyan-400 bg-black/80 px-1.5 py-0.5 rounded-md border border-cyan-500/30">
                        {isMuted ? '0%' : `${Math.round(volume * 100)}%`}
                      </span>
                    </div>

                    {/* Time Counter */}
                    <div className="text-white/90 text-xs font-mono font-bold tracking-wider ml-1 sm:ml-2">
                      {formatTime(currentTime)}{' '}
                      <span className="text-white/30">/</span>{' '}
                      {formatTime(duration)}
                    </div>
                  </div>

                  {/* Right Controls Group */}
                  <div className="flex items-center gap-1.5 sm:gap-3">
                    {/* Previous / Skip Episode Buttons if passed */}
                    {showPrevious && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onPrevious?.();
                        }}
                        className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                      >
                        <ChevronLeft size={14} /> Prev
                      </button>
                    )}
                    {showSkip && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onSkip?.();
                        }}
                        className="text-white/70 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg bg-white/5 border border-white/10"
                      >
                        Next <ChevronRight size={14} />
                      </button>
                    )}

                    {/* Subtitle / CC Menu */}
                    {subtitles && subtitles.length > 0 && (
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            playClickSound();
                            setActiveMenu(
                              activeMenu === 'subtitles' ? 'none' : 'subtitles'
                            );
                          }}
                          className={`transition-all p-2 rounded-xl flex items-center justify-center ${
                            subtitlesEnabled
                              ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30'
                              : 'text-white/80 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/10'
                          }`}
                          title="Subtitles / Captions"
                        >
                          <Subtitles size={18} />
                        </button>

                        {/* Subtitles Popup Menu */}
                        {activeMenu === 'subtitles' && (
                          <div className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden min-w-[170px] z-50 shadow-2xl animate-scale-up-fade-in origin-bottom-right">
                            <div className="px-4 py-2.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400">
                              Subtitles
                            </div>
                            <div className="flex flex-col py-1">
                              <button
                                onClick={(e) => toggleSubtitle(e)}
                                className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between ${
                                  !subtitlesEnabled
                                    ? 'text-cyan-400 bg-cyan-400/5'
                                    : 'text-white/80'
                                }`}
                              >
                                <span>Off</span>
                                {!subtitlesEnabled && <Check size={14} />}
                              </button>
                              {subtitles.map((sub) => (
                                <button
                                  key={sub.language}
                                  onClick={(e) =>
                                    toggleSubtitle(e, sub.language)
                                  }
                                  className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between ${
                                    subtitlesEnabled &&
                                    activeSubtitleLanguage === sub.language
                                      ? 'text-cyan-400 bg-cyan-400/5'
                                      : 'text-white/80'
                                  }`}
                                >
                                  <span>{sub.label}</span>
                                  {subtitlesEnabled &&
                                    activeSubtitleLanguage ===
                                      sub.language && <Check size={14} />}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Quality Menu (Adaptive Levels from Manifest) */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setActiveMenu(
                            activeMenu === 'quality' ? 'none' : 'quality'
                          );
                        }}
                        className={`transition-all px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                          currentQuality !== -1
                            ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30'
                            : 'text-white/80 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                        title="Video Quality"
                      >
                        <Sliders size={15} />
                        <span className="hidden sm:inline">
                          {currentQuality === -1
                            ? 'Auto'
                            : qualityLevels.find((q) => q.id === currentQuality)
                                ?.label || 'Auto'}
                        </span>
                      </button>

                      {/* Quality Popup Menu */}
                      {activeMenu === 'quality' && (
                        <div className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden min-w-[170px] z-50 shadow-2xl animate-scale-up-fade-in origin-bottom-right">
                          <div className="px-4 py-2.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center justify-between">
                            <span>Quality</span>
                            <Sliders size={12} />
                          </div>
                          <div className="flex flex-col py-1">
                            {/* Auto Option */}
                            <button
                              onClick={() => handleQualitySelect(-1)}
                              className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between ${
                                currentQuality === -1
                                  ? 'text-cyan-400 bg-cyan-400/5'
                                  : 'text-white/80'
                              }`}
                            >
                              <span>Auto</span>
                              {currentQuality === -1 && <Check size={14} />}
                            </button>

                            {/* Dynamically Detected Rendition Levels */}
                            {qualityLevels.map((lvl) => (
                              <button
                                key={lvl.id}
                                onClick={() => {
                                  if (lvl.isLocked) {
                                    alert("Please upgrade your subscription plan to unlock this video quality.");
                                    return;
                                  }
                                  handleQualitySelect(lvl.id);
                                }}
                                className={`text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between ${
                                  lvl.isLocked 
                                    ? 'text-white/40 cursor-not-allowed bg-black/40 hover:bg-white/5' 
                                    : 'hover:bg-white/10 text-white/80'
                                } ${
                                  currentQuality === lvl.id && !lvl.isLocked
                                    ? 'text-cyan-400 bg-cyan-400/5'
                                    : ''
                                }`}
                                title={lvl.isLocked ? "Premium Quality - Upgrade Plan to Unlock" : ""}
                              >
                                <div className="flex items-center gap-2">
                                  <span>{lvl.label}</span>
                                  {lvl.isLocked && <AlertCircle size={12} className="text-white/40" />}
                                </div>
                                {currentQuality === lvl.id && !lvl.isLocked && (
                                  <Check size={14} />
                                )}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Speed Menu */}
                    <div className="relative">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          setActiveMenu(
                            activeMenu === 'speed' ? 'none' : 'speed'
                          );
                        }}
                        className={`transition-all px-2.5 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-black uppercase tracking-wider ${
                          selectedSpeed !== 1.0
                            ? 'text-cyan-400 bg-cyan-400/10 border border-cyan-500/30'
                            : 'text-white/80 hover:text-cyan-400 bg-white/5 hover:bg-white/10 border border-white/10'
                        }`}
                        title="Playback Speed"
                      >
                        <Gauge size={15} />
                        <span className="hidden sm:inline">
                          {selectedSpeed === 1.0 ? '1x' : `${selectedSpeed}x`}
                        </span>
                      </button>

                      {/* Speed Popup Menu */}
                      {activeMenu === 'speed' && (
                        <div className="absolute bottom-full right-0 mb-4 bg-black/95 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden min-w-[150px] z-50 shadow-2xl animate-scale-up-fade-in origin-bottom-right">
                          <div className="px-4 py-2.5 border-b border-white/10 text-[10px] font-black uppercase tracking-widest text-cyan-400 flex items-center justify-between">
                            <span>Speed</span>
                            <Gauge size={12} />
                          </div>
                          <div className="flex flex-col py-1">
                            {PLAYBACK_SPEEDS.map((speed) => (
                              <button
                                key={speed}
                                onClick={() => handleSpeedSelect(speed)}
                                className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between ${
                                  selectedSpeed === speed
                                    ? 'text-cyan-400 bg-cyan-400/5'
                                    : 'text-white/80'
                                }`}
                              >
                                <span>
                                  {speed === 1.0 ? 'Normal (1x)' : `${speed}x`}
                                </span>
                                {selectedSpeed === speed && <Check size={14} />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Picture in Picture */}
                    <button
                      onClick={togglePictureInPicture}
                      className="text-white/80 hover:text-cyan-400 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10 hidden sm:flex"
                      title="Picture in Picture"
                    >
                      <PictureInPicture2 size={18} />
                    </button>

                    {/* Minimize / Floating Player */}
                    {showMinimize && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          playClickSound();
                          onMinimize?.();
                        }}
                        className="text-white/80 hover:text-cyan-400 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
                        title="Minimize Player"
                      >
                        <Minimize2 size={18} />
                      </button>
                    )}

                    {/* Fullscreen Button */}
                    <button
                      onClick={handleFullscreen}
                      className="text-white/80 hover:text-cyan-400 transition-all p-2 bg-white/5 hover:bg-white/10 rounded-xl border border-white/10"
                      title="Fullscreen (F)"
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
            width: 14px;
            height: 14px;
            background: #22d3ee;
            border-radius: 50%;
            cursor: pointer;
            box-shadow: 0 0 12px rgba(34, 211, 238, 0.7);
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

          @keyframes scaleUpFadeIn {
            from {
              opacity: 0;
              transform: scale(0.95);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-scale-up-fade-in {
            animation: scaleUpFadeIn 0.18s ease-out forwards;
          }

          .animate-scale-up-fade-out {
            animation: scaleUpFadeOut 0.45s ease-out forwards;
          }

          .animate-ripple-left {
            animation: rippleLeft 0.45s ease-in-out forwards;
          }

          .animate-ripple-right {
            animation: rippleLeft 0.45s ease-in-out forwards;
          }
        `}</style>
      </div>
    );
  }
);

VideoPlayer.displayName = 'VideoPlayer';

export default VideoPlayer;
