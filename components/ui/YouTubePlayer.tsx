'use client';

import React, {
  useRef,
  useState,
  useImperativeHandle,
  forwardRef,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  AlertCircle,
  Play,
  Pause,
  Volume1,
  Volume2,
  VolumeX,
  SkipForward,
  SkipBack,
  ChevronRight,
  ChevronLeft,
  Settings,
  Sliders,
  Gauge,
  MoreVertical,
  X,
  Check,
} from 'lucide-react';
import {
  requestElementFullscreen,
  exitDocumentFullscreen,
  isElementFullscreen,
  addFullscreenChangeListener,
} from '@/lib/fullscreen-utils';

export interface YouTubePlayerHandle {
  play: () => void;
  pause: () => void;
  togglePlay: () => void;
  requestFullScreen: () => void;
}

export interface YouTubePlayerProps {
  videoId: string;
  title?: string;
  metadata?: string;
  contentType?: 'movie' | 'episode' | 'interactive_movie' | 'short';
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  onEnded?: () => void;
  showSkip?: boolean;
  onSkip?: () => void;
  showPrevious?: boolean;
  onPrevious?: () => void;
  showNext?: boolean;
  onNext?: () => void;
  onFullscreenRequest?: () => void;
  showMinimize?: boolean;
  onMinimize?: () => void;
  onClose?: () => void;
  isMinimized?: boolean;
  subtitles?: {
    language: string;
    label: string;
    url: string;
  }[];
  audioTracks?: {
    language: string;
    label: string;
    url?: string;
    isDefault?: boolean;
  }[];
  maxQualityHeight?: number;
}

// Custom SVG Icons matching exact streaming reference mockup
function Rewind10Icon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
      <path d="M3 3v5h5" />
      <text
        x="12"
        y="15.5"
        fontSize="7.5"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        10
      </text>
    </svg>
  );
}

function Forward10Icon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M21 12a9 9 0 1 1-9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <text
        x="12"
        y="15.5"
        fontSize="7.5"
        fontWeight="bold"
        fill="currentColor"
        stroke="none"
        textAnchor="middle"
        fontFamily="sans-serif"
      >
        10
      </text>
    </svg>
  );
}

function FullscreenCornersIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M4 9V5a1 1 0 0 1 1-1h4" />
      <path d="M20 9V5a1 1 0 0 0-1-1h-4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h4" />
      <path d="M20 15v4a1 1 0 0 1-1 1h-4" />
    </svg>
  );
}

function ExitFullscreenCornersIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M9 4v4a1 1 0 0 1-1 1H4" />
      <path d="M15 4v4a1 1 0 0 0 1 1h4" />
      <path d="M9 20v-4a1 1 0 0 0-1-1H4" />
      <path d="M15 20v-4a1 1 0 0 1 1-1h4" />
    </svg>
  );
}

function SubtitlesBadgeIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="2" y="5" width="20" height="14" rx="3" />
      <path d="M10 10.5a2 2 0 0 0-2-1.5c-1.3 0-2 1-2 3s.7 3 2 3a2 2 0 0 0 2-1.5" />
      <path d="M18 10.5a2 2 0 0 0-2-1.5c-1.3 0-2 1-2 3s.7 3 2 3a2 2 0 0 0 2-1.5" />
    </svg>
  );
}

function PipRectanglesIcon({ size = 20, className = "" }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect x="3" y="4" width="18" height="16" rx="3" />
      <rect x="11" y="11" width="8" height="7" rx="1.5" fill="currentColor" fillOpacity="0.25" stroke="currentColor" />
    </svg>
  );
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];

const YOUTUBE_QUALITY_MAP: Record<string, { label: string; height: number }> = {
  highres: { label: '4K', height: 2160 },
  hd1440: { label: '1440p', height: 1440 },
  hd1080: { label: '1080p', height: 1080 },
  hd720: { label: '720p', height: 720 },
  large: { label: '480p', height: 480 },
  medium: { label: '360p', height: 360 },
  small: { label: '240p', height: 240 },
  tiny: { label: '144p', height: 144 },
  auto: { label: 'Auto', height: -1 },
};

const DEFAULT_QUALITIES = [
  { id: 'auto', label: 'Auto', height: -1 },
  { id: 'hd1080', label: '1080p', height: 1080 },
  { id: 'hd720', label: '720p', height: 720 },
  { id: 'large', label: '480p', height: 480 },
  { id: 'medium', label: '360p', height: 360 },
  { id: 'small', label: '240p', height: 240 },
];

const YouTubePlayer = forwardRef<YouTubePlayerHandle, YouTubePlayerProps>(
  (
    {
      videoId,
      title = 'Vtagu Prime',
      metadata,
      contentType = 'movie',
      autoPlay = false,
      showControls = true,
      className = '',
      onTimeUpdate,
      onEnded,
      showSkip = false,
      onSkip,
      showPrevious = false,
      onPrevious,
      showNext = false,
      onNext,
      onFullscreenRequest,
      showMinimize = true,
      onMinimize,
      onClose,
      isMinimized = false,
      maxQualityHeight,
    },
    ref
  ) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const ytWrapperRef = useRef<HTMLDivElement>(null);
    const playerRef = useRef<any>(null);
    const progressTrackRef = useRef<HTMLDivElement>(null);
    const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    const [error, setError] = useState<string | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [isBuffering, setIsBuffering] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedFraction, setBufferedFraction] = useState(0);
    const [showUI, setShowUI] = useState(true);

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenTransitionRef = useRef(false);

    // Menus & Settings State
    const [activeMenu, setActiveMenu] = useState<
      'none' | 'settings' | 'quality' | 'speed' | 'subtitles'
    >('none');
    const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);

    // Quality Levels State
    const [qualityLevels, setQualityLevels] = useState<{ id: string; label: string; height: number }[]>(DEFAULT_QUALITIES);
    const [currentQuality, setCurrentQuality] = useState<string>('auto');
    const [currentQualityLabel, setCurrentQualityLabel] = useState<string>('360p');

    // Timeline Hover & Scrubbing State
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPercent, setHoverPercent] = useState<number>(0);

    // Visual Indicator overlay
    const [indicator, setIndicator] = useState<{
      type: 'play' | 'pause' | 'forward' | 'rewind';
      id: number;
    } | null>(null);
    const indicatorTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

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

    // Fullscreen listener
    const updateFullscreenState = useCallback(() => {
      const isFs = isElementFullscreen(containerRef.current);
      setIsFullscreen(isFs);
    }, []);

    useEffect(() => {
      const cleanup = addFullscreenChangeListener(updateFullscreenState);
      updateFullscreenState();
      return cleanup;
    }, [updateFullscreenState]);

    // Synthesized modern click sound generator matching VideoPlayer
    const playClickSound = useCallback(() => {
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

        gainNode.gain.setValueAtTime(0.06, ctx.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.035);

        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.04);
      } catch (e) {
        // Autoplay restrictions
      }
    }, []);

    const triggerIndicator = (type: 'play' | 'pause' | 'forward' | 'rewind') => {
      if (indicatorTimeoutRef.current) {
        clearTimeout(indicatorTimeoutRef.current);
      }
      setIndicator({ type, id: Date.now() });
      indicatorTimeoutRef.current = setTimeout(() => {
        setIndicator(null);
      }, 500);
    };

    // Auto-hide UI controls after 3.5 seconds of mouse/touch inactivity
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
        }, 3500);
      }
    }, [isPlaying, activeMenu]);

    useEffect(() => {
      if (isPlaying) {
        resetControlsTimeout();
      } else {
        setShowUI(true);
        if (controlsTimeoutRef.current) {
          clearTimeout(controlsTimeoutRef.current);
        }
      }
    }, [isPlaying, resetControlsTimeout]);

    // Initialize YouTube API
    useEffect(() => {
      if (typeof window === 'undefined') return;

      let player: any = null;
      let checkYTInterval: NodeJS.Timeout | null = null;

      const initPlayer = () => {
        if (ytWrapperRef.current && !document.getElementById(playerIdRef.current)) {
          ytWrapperRef.current.innerHTML = `<div id="${playerIdRef.current}" class="w-full h-full scale-[1.05]"></div>`;
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
            controls: 0,
            disablekb: 1,
            modestbranding: 1,
            rel: 0,
            fs: 0,
            iv_load_policy: 3,
            playsinline: 1,
            enablejsapi: 1,
          },
          events: {
            onReady: (event: any) => {
              setIsReady(true);
              if (event.target) {
                playerRef.current = event.target;
              }

              if (typeof playerRef.current.getDuration === 'function') {
                const dur = playerRef.current.getDuration();
                setDuration(dur);
              }

              // Update available qualities
              try {
                const avail = playerRef.current.getAvailableQualityLevels?.();
                if (Array.isArray(avail) && avail.length > 0) {
                  const mapped = avail.map((q: string) => ({
                    id: q,
                    label: YOUTUBE_QUALITY_MAP[q]?.label || q,
                    height: YOUTUBE_QUALITY_MAP[q]?.height ?? 360,
                  }));
                  setQualityLevels(mapped);
                }
                const currentQ = playerRef.current.getPlaybackQuality?.();
                if (currentQ) {
                  setCurrentQuality(currentQ);
                  setCurrentQualityLabel(YOUTUBE_QUALITY_MAP[currentQ]?.label || '360p');
                }
              } catch (err) {}

              // Load latest video if changed during initialization
              const latestVideoId = currentVideoIdRef.current;
              if (latestVideoId !== initialVideoId.current) {
                playerRef.current.loadVideoById({
                  videoId: latestVideoId,
                  startSeconds: 0,
                });
              } else if (autoPlay) {
                if (typeof playerRef.current.playVideo === 'function') {
                  playerRef.current.playVideo();
                }
              }
            },
            onError: (event: any) => {
              const errorCodes: { [key: number]: string } = {
                2: 'Invalid parameter',
                5: 'HTML5 player error',
                100: 'Video not found',
                101: 'Video not allowed to be played embedded',
                150: 'Video not allowed to be played embedded',
              };
              setError(errorCodes[event.data] || 'YouTube player error');
            },
            onStateChange: (event: any) => {
              const YT = (window as any).YT;
              if (event.data === YT.PlayerState.BUFFERING) {
                setIsBuffering(true);
              } else if (event.data === YT.PlayerState.PLAYING) {
                setIsBuffering(false);
                setIsPlaying(true);
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

    // Track playback progress & loaded fraction periodically
    useEffect(() => {
      if (!isPlaying) return;

      const interval = setInterval(() => {
        if (
          playerRef.current &&
          typeof playerRef.current.getCurrentTime === 'function' &&
          typeof playerRef.current.getDuration === 'function'
        ) {
          const current = playerRef.current.getCurrentTime() || 0;
          const total = playerRef.current.getDuration() || 0;
          const loaded = playerRef.current.getVideoLoadedFraction?.() || 0;

          setCurrentTime(current);
          if (total > 0) setDuration(total);
          setBufferedFraction(loaded);
          onTimeUpdateRef.current?.(current, total);

          // Update current quality label if YouTube adjusted automatically
          try {
            const q = playerRef.current.getPlaybackQuality?.();
            if (q && YOUTUBE_QUALITY_MAP[q]) {
              setCurrentQualityLabel(YOUTUBE_QUALITY_MAP[q].label);
            }
          } catch (e) {}
        }
      }, 500);

      return () => clearInterval(interval);
    }, [isPlaying]);

    // Handle videoId updates
    useEffect(() => {
      setCurrentTime(0);
      setDuration(0);
      setBufferedFraction(0);

      if (playerRef.current && typeof playerRef.current.loadVideoById === 'function') {
        playerRef.current.loadVideoById({
          videoId: videoId,
          startSeconds: 0,
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
      togglePlay: () => {
        togglePlay();
      },
      requestFullScreen: async () => {
        if (onFullscreenRequest) {
          onFullscreenRequest();
          return;
        }
        if (fullscreenTransitionRef.current) return;
        fullscreenTransitionRef.current = true;
        try {
          await requestElementFullscreen(containerRef.current);
        } catch (err) {
          console.warn('YouTube imperative request fullscreen failed:', err);
        } finally {
          fullscreenTransitionRef.current = false;
          updateFullscreenState();
        }
      },
    }));

    const formatTime = (seconds: number) => {
      const s = Math.floor(seconds || 0);
      const hours = Math.floor(s / 3600);
      const mins = Math.floor((s % 3600) / 60);
      const secs = Math.floor(s % 60);

      if (hours > 0) {
        return `${hours}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
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

    const handleSkipSeconds = (delta: number) => {
      playClickSound();
      if (typeof playerRef.current?.getCurrentTime === 'function' && typeof playerRef.current?.seekTo === 'function') {
        const current = playerRef.current.getCurrentTime() || 0;
        const target = Math.max(0, Math.min(duration || 0, current + delta));
        playerRef.current.seekTo(target, true);
        setCurrentTime(target);
        triggerIndicator(delta > 0 ? 'forward' : 'rewind');
      }
    };

    const handleVideoClick = (e: React.MouseEvent) => {
      // Prevent click if clicking controls or menus
      if (
        (e.target as HTMLElement).closest('.video-controls-container') ||
        (e.target as HTMLElement).closest('.video-top-overlay') ||
        (e.target as HTMLElement).closest('.video-menu-popup')
      ) {
        return;
      }

      if (activeMenu !== 'none') {
        setActiveMenu('none');
        return;
      }

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
      const rect = containerRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const width = rect.width;

      if (clickX < width / 2) {
        handleSkipSeconds(-10);
      } else {
        handleSkipSeconds(10);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
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
          handleSkipSeconds(-10);
          break;
        case 'ArrowRight':
          e.preventDefault();
          handleSkipSeconds(10);
          break;
        case 'ArrowUp':
          e.preventDefault();
          playClickSound();
          if (typeof playerRef.current?.getVolume === 'function' && typeof playerRef.current?.setVolume === 'function') {
            const currentVol = playerRef.current.getVolume();
            const newVol = Math.min(100, currentVol + 5);
            playerRef.current.setVolume(newVol);
            setVolume(newVol / 100);
            if (isMuted && newVol > 0) {
              playerRef.current.unMute();
              setIsMuted(false);
            }
          }
          break;
        case 'ArrowDown':
          e.preventDefault();
          playClickSound();
          if (typeof playerRef.current?.getVolume === 'function' && typeof playerRef.current?.setVolume === 'function') {
            const currentVol = playerRef.current.getVolume();
            const newVol = Math.max(0, currentVol - 5);
            playerRef.current.setVolume(newVol);
            setVolume(newVol / 100);
            if (newVol === 0) {
              playerRef.current.mute();
              setIsMuted(true);
            }
          }
          break;
        case 'm':
        case 'M':
          e.preventDefault();
          toggleMute();
          break;
        case 'f':
        case 'F':
          e.preventDefault();
          handleFullscreen(e);
          break;
        default:
          break;
      }
    };

    const toggleMute = (e?: React.MouseEvent) => {
      if (e) e.stopPropagation();
      playClickSound();
      if (isMuted) {
        playerRef.current?.unMute?.();
        setIsMuted(false);
      } else {
        playerRef.current?.mute?.();
        setIsMuted(true);
      }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = parseFloat(e.target.value);
      setVolume(val);
      if (playerRef.current) {
        playerRef.current.setVolume?.(val * 100);
        if (val === 0) {
          playerRef.current.mute?.();
          setIsMuted(true);
        } else if (isMuted) {
          playerRef.current.unMute?.();
          setIsMuted(false);
        }
      }
    };

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
      const time = parseFloat(e.target.value);
      if (typeof playerRef.current?.seekTo === 'function') {
        playerRef.current.seekTo(time, true);
      }
      setCurrentTime(time);
    };

    const handleTimelineMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!progressTrackRef.current || !duration) return;
      const rect = progressTrackRef.current.getBoundingClientRect();
      const posX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
      const pct = (posX / rect.width) * 100;
      setHoverPercent(pct);
      setHoverTime((posX / rect.width) * duration);
    };

    const handleTimelineMouseLeave = () => {
      setHoverTime(null);
    };

    const handleQualitySelect = (qualityId: string) => {
      playClickSound();
      setCurrentQuality(qualityId);
      const mapped = YOUTUBE_QUALITY_MAP[qualityId]?.label || qualityId;
      setCurrentQualityLabel(mapped);
      if (typeof playerRef.current?.setPlaybackQuality === 'function') {
        playerRef.current.setPlaybackQuality(qualityId);
      }
    };

    const handleSpeedSelect = (speed: number) => {
      playClickSound();
      setSelectedSpeed(speed);
      if (typeof playerRef.current?.setPlaybackRate === 'function') {
        playerRef.current.setPlaybackRate(speed);
      }
    };

    const handleToggleSubtitles = (enabled: boolean) => {
      playClickSound();
      setSubtitlesEnabled(enabled);
      try {
        if (playerRef.current) {
          if (enabled) {
            playerRef.current.loadModule?.('captions');
            playerRef.current.setOption?.('captions', 'track', { languageCode: 'en' });
          } else {
            playerRef.current.unloadModule?.('captions');
            playerRef.current.setOption?.('captions', 'track', {});
          }
        }
      } catch (err) {}
    };

    const togglePictureInPicture = async () => {
      playClickSound();
      if (showMinimize && onMinimize) {
        onMinimize();
        return;
      }
      try {
        if (document.pictureInPictureElement) {
          await document.exitPictureInPicture();
        } else {
          const video = containerRef.current?.querySelector('video');
          if (video && document.pictureInPictureEnabled) {
            await video.requestPictureInPicture();
          } else if (onMinimize) {
            (onMinimize as () => void)();
          }
        }
      } catch (err) {
        console.warn('PiP toggle failed:', err);
        if (onMinimize) {
          (onMinimize as () => void)();
        }
      }
    };

    const handleFullscreen = async (e?: React.MouseEvent | React.KeyboardEvent) => {
      if (e) e.stopPropagation();
      playClickSound();

      if (onFullscreenRequest) {
        onFullscreenRequest();
        return;
      }

      if (fullscreenTransitionRef.current) return;
      fullscreenTransitionRef.current = true;

      try {
        const isCurrentlyFs = isElementFullscreen(containerRef.current);
        if (isCurrentlyFs) {
          await exitDocumentFullscreen();
        } else {
          await requestElementFullscreen(containerRef.current);
        }
      } catch (err) {
        console.warn('YouTube fullscreen toggle failed:', err);
      } finally {
        fullscreenTransitionRef.current = false;
        updateFullscreenState();
      }
    };

    const handleMinimizeToggle = async (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();

      const isCurrentlyFs = isElementFullscreen(containerRef.current);
      if (isCurrentlyFs) {
        if (!fullscreenTransitionRef.current) {
          fullscreenTransitionRef.current = true;
          try {
            await exitDocumentFullscreen();
          } catch (err) {
            console.warn('YouTube exit fullscreen on minimize failed:', err);
          } finally {
            fullscreenTransitionRef.current = false;
            updateFullscreenState();
          }
        }
      }

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

    const defaultMetadata =
      metadata ||
      (contentType === 'movie'
        ? 'Movie • HD Streaming'
        : contentType === 'episode'
        ? 'Series Episode • HD Streaming'
        : contentType === 'interactive_movie'
        ? 'Interactive Story • HD'
        : 'Streaming in HD • Premium');

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className={`relative w-full h-full bg-black overflow-hidden outline-none group select-none ${className}`}
        style={{ aspectRatio: '16/9' }}
        onKeyDown={handleKeyDown}
        onMouseMove={resetControlsTimeout}
      >
        {/* Loading State */}
        {!isReady && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-20">
            <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(34,211,238,0.4)]" />
          </div>
        )}

        {/* Buffering Spinner matching VideoPlayer */}
        {isReady && isBuffering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-20 pointer-events-none">
            <div className="w-14 h-14 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(34,211,238,0.5)]" />
          </div>
        )}

        {/* YouTube Player Iframe Wrapper */}
        <div ref={ytWrapperRef} className="absolute inset-0 pointer-events-none" />

        {/* Transparent overlay to catch clicks, double-clicks, and toggle play */}
        <div className="absolute inset-0 z-10 cursor-pointer" onClick={handleVideoClick} />

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

        {/* Top Overlay Bar (Matching Reference Image 2 exactly) */}
        {showControls && (
          <div
            className={`video-top-overlay absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 transition-opacity duration-300 pointer-events-auto ${
              showUI || activeMenu !== 'none'
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            {/* Top Left: Glassmorphic Capsule Card */}
            <div className="bg-black/60 backdrop-blur-md border border-white/15 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl max-w-[70%] sm:max-w-md">
              <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                <Play size={13} fill="white" className="ml-0.5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight truncate">
                  {title}
                </h3>
                <p className="text-white/60 text-[10px] sm:text-[11px] font-medium leading-tight truncate mt-0.5">
                  {defaultMetadata}
                </p>
              </div>
            </div>

            {/* Top Right: Glassmorphic Pills (Quality + PiP + Settings + Close) */}
            <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
              {/* Quality Pill Badge */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveMenu(activeMenu === 'quality' ? 'none' : 'quality');
                }}
                className={`bg-black/60 hover:bg-black/80 backdrop-blur-md border px-2.5 sm:px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs transition-all cursor-pointer shadow-lg ${
                  activeMenu === 'quality'
                    ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                    : 'border-white/15 hover:border-cyan-500/40 text-white/90 hover:text-cyan-400'
                }`}
                title="Video Quality"
              >
                <span className="px-1 py-0.2 rounded bg-white/20 text-[9px] font-black tracking-wider text-white">
                  HD
                </span>
                <span className="font-semibold text-xs">{currentQualityLabel}</span>
              </button>

              {/* Picture-in-Picture Pill */}
              <button
                onClick={togglePictureInPicture}
                className="bg-black/60 hover:bg-black/80 backdrop-blur-md border border-white/15 hover:border-cyan-500/40 p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-cyan-400 transition-all cursor-pointer shadow-lg hidden sm:flex items-center justify-center"
                title="Picture-in-Picture"
              >
                <PipRectanglesIcon size={17} />
              </button>

              {/* More Options / Settings Pill */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveMenu(activeMenu === 'settings' ? 'none' : 'settings');
                }}
                className={`bg-black/60 hover:bg-black/80 backdrop-blur-md border p-2 sm:p-2.5 rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center ${
                  activeMenu === 'settings'
                    ? 'border-cyan-500/50 text-cyan-400 bg-cyan-500/10'
                    : 'border-white/15 hover:border-cyan-500/40 text-white/80 hover:text-cyan-400'
                }`}
                title="Settings & Options"
              >
                <MoreVertical size={17} />
              </button>

              {/* Close Button if onClose is passed */}
              {onClose && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onClose();
                  }}
                  className="bg-black/60 hover:bg-rose-500/20 backdrop-blur-md border border-white/15 hover:border-rose-500/40 p-2 sm:p-2.5 rounded-xl text-white/80 hover:text-rose-400 transition-all cursor-pointer shadow-lg flex items-center justify-center"
                  title="Close Player"
                >
                  <X size={17} />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Bottom Controls Bar (Inside video, single aligned row matching VideoPlayer) */}
        {showControls && (
          <div
            className={`video-controls-container absolute bottom-0 left-0 right-0 z-30 px-3 py-2.5 sm:px-5 sm:py-3.5 md:px-6 md:py-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-opacity duration-300 pointer-events-auto ${
              showUI || activeMenu !== 'none'
                ? 'opacity-100'
                : 'opacity-0 pointer-events-none'
            }`}
          >
            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-3.5 w-full flex-nowrap min-w-0">
              {/* Previous Button */}
              {showPrevious && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    onPrevious?.();
                  }}
                  className="text-white/85 hover:text-cyan-400 hover:bg-white/10 active:scale-95 cursor-pointer p-1 sm:p-1.5 rounded-lg transition-all flex items-center justify-center shrink-0"
                  title="Previous"
                  aria-label="Previous"
                >
                  <SkipBack size={18} className="sm:w-[19px] sm:h-[19px]" />
                </button>
              )}

              {/* 1. 10-Second Rewind */}
              <button
                onClick={() => handleSkipSeconds(-10)}
                className="text-white/85 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                title="Rewind 10s (Left Arrow)"
                aria-label="Rewind 10 seconds"
              >
                <Rewind10Icon size={18} className="sm:w-[19px] sm:h-[19px]" />
              </button>

              {/* 2. Play / Pause Button */}
              <button
                onClick={togglePlay}
                className="text-white hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                title={isPlaying ? 'Pause (Space)' : 'Play (Space)'}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? (
                  <Pause size={19} fill="white" className="text-white sm:w-5 sm:h-5" />
                ) : (
                  <Play size={19} fill="white" className="text-white ml-0.5 sm:w-5 sm:h-5" />
                )}
              </button>

              {/* 3. 10-Second Forward */}
              <button
                onClick={() => handleSkipSeconds(10)}
                className="text-white/85 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                title="Forward 10s (Right Arrow)"
                aria-label="Forward 10 seconds"
              >
                <Forward10Icon size={18} className="sm:w-[19px] sm:h-[19px]" />
              </button>

              {/* Next / Skip Button */}
              {(showNext || showSkip) && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();
                    if (onNext) onNext();
                    else if (onSkip) onSkip();
                  }}
                  className="text-white/85 hover:text-cyan-400 hover:bg-white/10 active:scale-95 cursor-pointer p-1 sm:p-1.5 rounded-lg transition-all flex items-center justify-center shrink-0"
                  title="Next / Skip"
                  aria-label="Next"
                >
                  <SkipForward size={18} className="sm:w-[19px] sm:h-[19px]" />
                </button>
              )}

              {/* 4. Progress Timeline Bar (flex-1 glowing scrubber) */}
              <div
                ref={progressTrackRef}
                onMouseMove={handleTimelineMouseMove}
                onMouseLeave={handleTimelineMouseLeave}
                className="relative flex-1 min-w-[50px] sm:min-w-[80px] md:min-w-[120px] h-6 sm:h-7 flex items-center cursor-pointer group/progress mx-0.5 sm:mx-1"
              >
                {/* Base Track */}
                <div className="absolute left-0 right-0 h-1 sm:h-1.5 group-hover/progress:h-2 bg-white/20 rounded-full overflow-hidden transition-all pointer-events-none">
                  {/* Buffer Bar */}
                  <div
                    className="h-full bg-white/30 transition-all duration-200"
                    style={{
                      width: `${Math.min(100, bufferedFraction * 100)}%`,
                    }}
                  />
                </div>

                {/* Played Progress (Glowing Gradient Cyan to Blue) */}
                <div
                  className="absolute left-0 h-1 sm:h-1.5 group-hover/progress:h-2 bg-gradient-to-r from-blue-600 via-cyan-400 to-cyan-300 rounded-full shadow-[0_0_12px_rgba(34,211,238,0.85)] pointer-events-none transition-all"
                  style={{
                    width: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />

                {/* Scrubber Thumb (Solid Pure White Circle) */}
                <div
                  className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 sm:w-3.5 sm:h-3.5 bg-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.6)] pointer-events-none transition-transform group-hover/progress:scale-125"
                  style={{
                    left: `${duration > 0 ? (currentTime / duration) * 100 : 0}%`,
                  }}
                />

                {/* Hover Time Tooltip */}
                {hoverTime !== null && duration > 0 && (
                  <div
                    className="absolute -top-7 -translate-x-1/2 bg-black/90 text-white text-[10px] sm:text-[11px] font-mono font-bold px-2 py-0.5 rounded-md border border-white/20 shadow-xl pointer-events-none whitespace-nowrap z-30"
                    style={{ left: `${hoverPercent}%` }}
                  >
                    {formatTime(hoverTime)}
                  </div>
                )}

                {/* Interactive Seek Input */}
                <input
                  type="range"
                  min="0"
                  max={duration || 0}
                  step="0.1"
                  value={currentTime}
                  onChange={handleSeek}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                  aria-label="Seek timeline"
                />
              </div>

              {/* 5. Timestamp */}
              <div className="text-white/90 text-[10px] sm:text-xs font-mono font-bold tracking-tight shrink-0 select-none whitespace-nowrap flex items-center">
                <span>{formatTime(currentTime)}</span>
                <span className="text-white/40 mx-0.5 sm:mx-1">/</span>
                <span className="text-white/70">{formatTime(duration)}</span>
              </div>

              {/* 6. Volume Control */}
              <div className="flex items-center gap-1 group/volume relative shrink-0">
                <button
                  onClick={toggleMute}
                  className="text-white/80 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 flex items-center justify-center cursor-pointer"
                  title={isMuted ? 'Unmute (M)' : 'Mute (M)'}
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? (
                    <VolumeX size={17} className="text-red-400 sm:w-[18px] sm:h-[18px]" />
                  ) : volume < 0.5 ? (
                    <Volume1 size={17} className="text-cyan-400 sm:w-[18px] sm:h-[18px]" />
                  ) : (
                    <Volume2 size={17} className="text-cyan-400 sm:w-[18px] sm:h-[18px]" />
                  )}
                </button>

                {/* Volume Slider Track */}
                <div className="hidden sm:flex relative items-center w-12 md:w-16 lg:w-20 h-6">
                  <div className="absolute left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"
                      style={{ width: `${(isMuted ? 0 : volume) * 100}%` }}
                    />
                  </div>
                  <div
                    className="absolute top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-white rounded-full shadow pointer-events-none"
                    style={{ left: `calc(${isMuted ? 0 : volume * 100}% - 5px)` }}
                  />
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    title={`Volume: ${Math.round((isMuted ? 0 : volume) * 100)}%`}
                    aria-label="Volume"
                  />
                </div>
              </div>

              {/* 7. Subtitles [CC] Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveMenu(activeMenu === 'subtitles' ? 'none' : 'subtitles');
                }}
                className={`p-1 sm:p-1.5 rounded-lg border transition-all active:scale-95 shrink-0 flex items-center justify-center cursor-pointer relative ${
                  activeMenu === 'subtitles' || subtitlesEnabled
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'border-transparent text-white/80 hover:text-cyan-400 hover:bg-white/10'
                }`}
                title="Subtitles / Closed Captions"
                aria-label="Subtitles"
              >
                <SubtitlesBadgeIcon size={17} className="sm:w-[18px] sm:h-[18px]" />
                {subtitlesEnabled && (
                  <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_rgba(34,211,238,0.8)]" />
                )}
              </button>

              {/* 8. Settings Gear Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  playClickSound();
                  setActiveMenu(activeMenu === 'settings' ? 'none' : 'settings');
                }}
                className={`p-1 sm:p-1.5 rounded-lg border transition-all active:scale-95 shrink-0 flex items-center justify-center cursor-pointer ${
                  activeMenu === 'settings'
                    ? 'bg-cyan-500/20 border-cyan-500/50 text-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.3)]'
                    : 'border-transparent text-white/80 hover:text-cyan-400 hover:bg-white/10'
                }`}
                title="Settings (Quality, Speed)"
                aria-label="Settings"
              >
                <Settings size={17} className="sm:w-[18px] sm:h-[18px]" />
              </button>

              {/* 9. Picture-in-Picture / Minimize Button */}
              {showMinimize ? (
                <button
                  onClick={handleMinimizeToggle}
                  className="text-white/80 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                  title="Minimize Player"
                  aria-label="Minimize Player"
                >
                  <PipRectanglesIcon size={17} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              ) : (
                <button
                  onClick={togglePictureInPicture}
                  className="text-white/80 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                  title="Picture in Picture"
                  aria-label="Picture in Picture"
                >
                  <PipRectanglesIcon size={17} className="sm:w-[18px] sm:h-[18px]" />
                </button>
              )}

              {/* 10. Fullscreen Button */}
              <button
                onClick={handleFullscreen}
                className="text-white/80 hover:text-cyan-400 transition-all p-1 sm:p-1.5 rounded-lg hover:bg-white/10 active:scale-95 shrink-0 flex items-center justify-center cursor-pointer"
                title={isFullscreen ? 'Exit Fullscreen (F)' : 'Enter Fullscreen (F)'}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
              >
                {isFullscreen ? (
                  <ExitFullscreenCornersIcon size={17} className="sm:w-[18px] sm:h-[18px]" />
                ) : (
                  <FullscreenCornersIcon size={17} className="sm:w-[18px] sm:h-[18px]" />
                )}
              </button>
            </div>
          </div>
        )}

        {/* UNIFIED SETTINGS & POPUP MENUS (Glassmorphic) */}
        {activeMenu !== 'none' && (
          <div
            className="video-menu-popup absolute bottom-16 sm:bottom-20 right-4 sm:right-6 bg-[#0c0d14]/95 backdrop-blur-2xl border border-white/15 rounded-2xl overflow-hidden min-w-[260px] max-w-[320px] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.2)] animate-scale-up-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 1. Root Settings Menu */}
            {activeMenu === 'settings' && (
              <div>
                <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Settings size={14} className="text-cyan-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-white">Settings</span>
                  </div>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="text-white/60 hover:text-white p-1 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="p-1 flex flex-col">
                  <button
                    onClick={() => setActiveMenu('quality')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Sliders size={16} className="text-cyan-400" />
                      <span>Quality</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                      <span>{currentQualityLabel}</span>
                      <ChevronRight size={14} />
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveMenu('speed')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <Gauge size={16} className="text-cyan-400" />
                      <span>Playback Speed</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                      <span>{selectedSpeed === 1.0 ? 'Normal (1x)' : `${selectedSpeed}x`}</span>
                      <ChevronRight size={14} />
                    </div>
                  </button>

                  <button
                    onClick={() => setActiveMenu('subtitles')}
                    className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-2.5">
                      <SubtitlesBadgeIcon size={16} className="text-cyan-400" />
                      <span>Subtitles</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-white/50 text-[11px]">
                      <span>{subtitlesEnabled ? 'On' : 'Off'}</span>
                      <ChevronRight size={14} />
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* 2. Quality Selection Submenu */}
            {activeMenu === 'quality' && (
              <div>
                <div className="px-3.5 py-3 border-b border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveMenu('settings')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-cyan-400 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Quality</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="text-white/60 hover:text-white p-1 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-col py-1 max-h-64 overflow-y-auto">
                  {qualityLevels.map((lvl) => {
                    const isLocked = maxQualityHeight !== undefined && lvl.height > maxQualityHeight;
                    const isSelected = currentQuality === lvl.id;
                    return (
                      <button
                        key={lvl.id}
                        onClick={() => {
                          if (isLocked) {
                            alert("Please upgrade your subscription plan to unlock this video quality.");
                            return;
                          }
                          handleQualitySelect(lvl.id);
                          setActiveMenu('none');
                        }}
                        className={`text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                          isLocked
                            ? 'text-white/40 cursor-not-allowed bg-black/40 hover:bg-white/5'
                            : 'hover:bg-white/10 text-white/80'
                        } ${isSelected && !isLocked ? 'text-cyan-400 bg-cyan-400/5' : ''}`}
                      >
                        <div className="flex items-center gap-2">
                          <span>{lvl.label}</span>
                          {isLocked && <AlertCircle size={12} className="text-white/40" />}
                        </div>
                        {isSelected && !isLocked && <Check size={14} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* 3. Speed Selection Submenu */}
            {activeMenu === 'speed' && (
              <div>
                <div className="px-3.5 py-3 border-b border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveMenu('settings')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-cyan-400 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Playback Speed</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="text-white/60 hover:text-white p-1 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-col py-1 max-h-64 overflow-y-auto">
                  {PLAYBACK_SPEEDS.map((speed) => (
                    <button
                      key={speed}
                      onClick={() => {
                        handleSpeedSelect(speed);
                        setActiveMenu('none');
                      }}
                      className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                        selectedSpeed === speed ? 'text-cyan-400 bg-cyan-400/5' : 'text-white/80'
                      }`}
                    >
                      <span>{speed === 1.0 ? 'Normal (1x)' : `${speed}x`}</span>
                      {selectedSpeed === speed && <Check size={14} />}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Subtitles Submenu */}
            {activeMenu === 'subtitles' && (
              <div>
                <div className="px-3.5 py-3 border-b border-white/10 flex items-center justify-between">
                  <button
                    onClick={() => setActiveMenu('settings')}
                    className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-cyan-400 cursor-pointer"
                  >
                    <ChevronLeft size={16} />
                    <span>Subtitles</span>
                  </button>
                  <button
                    onClick={() => setActiveMenu('none')}
                    className="text-white/60 hover:text-white p-1 rounded-lg"
                  >
                    <X size={14} />
                  </button>
                </div>
                <div className="flex flex-col py-1 max-h-64 overflow-y-auto">
                  <button
                    onClick={() => {
                      handleToggleSubtitles(false);
                      setActiveMenu('none');
                    }}
                    className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                      !subtitlesEnabled ? 'text-cyan-400 bg-cyan-400/5' : 'text-white/80'
                    }`}
                  >
                    <span>Off</span>
                    {!subtitlesEnabled && <Check size={14} />}
                  </button>
                  <button
                    onClick={() => {
                      handleToggleSubtitles(true);
                      setActiveMenu('none');
                    }}
                    className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                      subtitlesEnabled ? 'text-cyan-400 bg-cyan-400/5' : 'text-white/80'
                    }`}
                  >
                    <span>English (Auto-generated / Closed Captions)</span>
                    {subtitlesEnabled && <Check size={14} />}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <style jsx>{`
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
            0%,
            100% {
              opacity: 0.2;
              transform: translateX(0);
            }
            50% {
              opacity: 1;
              transform: translateX(2px);
            }
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

          .animate-chevron-1 {
            animation: chevronPulse 0.4s infinite;
          }
          .animate-chevron-2 {
            animation: chevronPulse 0.4s infinite 0.1s;
          }
          .animate-chevron-3 {
            animation: chevronPulse 0.4s infinite 0.2s;
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
        `}</style>
      </div>
    );
  }
);

YouTubePlayer.displayName = 'YouTubePlayer';

export default YouTubePlayer;
