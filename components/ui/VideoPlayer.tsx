'use client';

import React, {
  useRef,
  useState,
  useEffect,
  useMemo,
  useImperativeHandle,
  forwardRef,
  useCallback,
} from 'react';
import {
  Play,
  Pause,
  Maximize,
  Minimize,
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
  Headphones,
  Settings,
  Check,
  RefreshCw,
  Gauge,
  Sliders,
  PictureInPicture2,
  MoreVertical,
  X,
  SkipBack,
  SkipForward,
} from 'lucide-react';
import Hls from 'hls.js';
import { getFallbackVideoUrl } from '@/lib/video-utils';
import {
  requestElementFullscreen,
  exitDocumentFullscreen,
  isElementFullscreen,
  addFullscreenChangeListener,
  getFullscreenElement,
} from '@/lib/fullscreen-utils';

export interface HlsQualityLevel {
  id: number; // -1 for Auto, or level index in hls.js
  height: number;
  label: string; // e.g. "1080p", "720p", "Auto"
  bitrate?: number;
  isLocked?: boolean;
}

export interface SubtitleTrackOption {
  id: string;
  language: string;
  label: string;
  isHls?: boolean;
  hlsIndex?: number;
  isNative?: boolean;
  nativeIndex?: number;
  isExternal?: boolean;
  url?: string;
}

export interface AudioTrackOption {
  id: string;
  language: string;
  label: string;
  isHls?: boolean;
  hlsIndex?: number;
  isNative?: boolean;
  nativeIndex?: number;
  isExternal?: boolean;
  url?: string;
  isDefault?: boolean;
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

export interface VideoPlayerProps {
  src: string;
  poster?: string;
  title?: string;
  metadata?: string;
  contentType?: 'movie' | 'episode' | 'interactive_movie' | 'short';
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  showControls?: boolean;
  className?: string;
  onEnded?: () => void;
  onPlay?: () => void;
  onTimeUpdate?: (currentTime: number, duration: number) => void;
  crossOrigin?: 'anonymous' | 'use-credentials' | '';
  showSkip?: boolean;
  onSkip?: () => void;
  showNext?: boolean;
  onNext?: () => void;
  showPrevious?: boolean;
  onPrevious?: () => void;
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
      title,
      metadata,
      contentType = 'movie',
      autoPlay = false,
      loop = false,
      muted = false,
      showControls = true,
      className = '',
      onEnded,
      onPlay,
      onTimeUpdate,
      crossOrigin,
      showSkip = false,
      onSkip,
      showNext = false,
      onNext,
      showPrevious = false,
      onPrevious,
      onFullscreenRequest,
      showMinimize = true,
      onMinimize,
      onClose,
      isMinimized = false,
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

    // Fullscreen State
    const [isFullscreen, setIsFullscreen] = useState(false);
    const fullscreenTransitionRef = useRef(false);

    // Video Playback State
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(muted);
    const [volume, setVolume] = useState(1);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [bufferedEnd, setBufferedEnd] = useState(0);

    // Synchronize fullscreen state from document / video events
    const updateFullscreenState = useCallback(() => {
      const isFs = isElementFullscreen(containerRef.current, videoRef.current);
      setIsFullscreen(isFs);
    }, []);

    useEffect(() => {
      const cleanup = addFullscreenChangeListener(
        updateFullscreenState,
        videoRef.current
      );
      updateFullscreenState();
      return cleanup;
    }, [updateFullscreenState]);

    // Adaptive Quality & Speed State
    const [qualityLevels, setQualityLevels] = useState<HlsQualityLevel[]>([]);
    const [currentQuality, setCurrentQuality] = useState<number>(-1); // -1 = Auto
    const [autoCurrentLabel, setAutoCurrentLabel] = useState<string>('');
    const [selectedSpeed, setSelectedSpeed] = useState<number>(1.0);

    const currentQualityLabel = useMemo(() => {
      if (currentQuality === -1) {
        return autoCurrentLabel ? `${autoCurrentLabel}` : 'Auto';
      }
      const found = qualityLevels.find((q) => q.id === currentQuality);
      return found?.label || 'HD';
    }, [currentQuality, autoCurrentLabel, qualityLevels]);

    // Timeline Hover & Scrubbing State
    const [hoverTime, setHoverTime] = useState<number | null>(null);
    const [hoverPercent, setHoverPercent] = useState<number>(0);
    const progressTrackRef = useRef<HTMLDivElement>(null);

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

    // Menus State
    const [activeMenu, setActiveMenu] = useState<
      'none' | 'settings' | 'quality' | 'speed' | 'subtitles' | 'audio'
    >('none');

    // Subtitle State
    const [subtitlesEnabled, setSubtitlesEnabled] = useState(false);
    const [activeSubtitleId, setActiveSubtitleId] = useState<string | null>(null);
    const [activeSubtitleLanguage, setActiveSubtitleLanguage] = useState<
      string | null
    >(null);
    const [hlsSubtitleTracks, setHlsSubtitleTracks] = useState<SubtitleTrackOption[]>([]);
    const [nativeSubtitleTracks, setNativeSubtitleTracks] = useState<SubtitleTrackOption[]>([]);
    const [subtitleBlobs, setSubtitleBlobs] = useState<
      { language: string; label: string; url: string; originalUrl: string }[]
    >([]);

    // Audio Track State
    const [hlsAudioTracks, setHlsAudioTracks] = useState<AudioTrackOption[]>([]);
    const [nativeAudioTracks, setNativeAudioTracks] = useState<AudioTrackOption[]>([]);
    const [activeAudioTrackId, setActiveAudioTrackId] = useState<string | null>(null);

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

    // Unified Subtitle List (combines external subtitles, HLS manifest subtitles, and native subtitles)
    const allSubtitleTracks = useMemo(() => {
      const tracks: SubtitleTrackOption[] = [];
      const seen = new Set<string>();

      // 1. External subtitles (<track> elements)
      subtitleBlobs.forEach((sub, idx) => {
        const key = `${sub.language || ''}-${sub.label || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          tracks.push({
            id: `ext-sub-${idx}`,
            language: sub.language,
            label: sub.label || sub.language?.toUpperCase() || `Subtitle ${idx + 1}`,
            isExternal: true,
            url: sub.url,
          });
        }
      });

      // 2. HLS Manifest subtitle tracks
      hlsSubtitleTracks.forEach((sub) => {
        const key = `${sub.language || ''}-${sub.label || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          tracks.push(sub);
        }
      });

      // 3. Native Apple HLS subtitle tracks
      nativeSubtitleTracks.forEach((sub) => {
        const key = `${sub.language || ''}-${sub.label || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          tracks.push(sub);
        }
      });

      return tracks;
    }, [subtitleBlobs, hlsSubtitleTracks, nativeSubtitleTracks]);

    // Unified Audio Track List (combines HLS manifest audio tracks, external audioTracks, and native audio tracks)
    const allAudioTracks = useMemo(() => {
      const tracks: AudioTrackOption[] = [];
      const seen = new Set<string>();

      // 1. HLS Manifest audio tracks
      hlsAudioTracks.forEach((track) => {
        const key = `${track.language || ''}-${track.label || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          tracks.push(track);
        }
      });

      // 2. External audioTracks prop
      if (audioTracks && Array.isArray(audioTracks)) {
        audioTracks.forEach((track, idx) => {
          const key = `${track.language || ''}-${track.label || ''}`;
          if (!seen.has(key)) {
            seen.add(key);
            tracks.push({
              id: `ext-audio-${idx}`,
              language: track.language,
              label: track.label || track.language?.toUpperCase() || `Audio ${idx + 1}`,
              isExternal: true,
              url: track.url,
              isDefault: track.isDefault,
            });
          }
        });
      }

      // 3. Native Apple HLS audio tracks
      nativeAudioTracks.forEach((track) => {
        const key = `${track.language || ''}-${track.label || ''}`;
        if (!seen.has(key)) {
          seen.add(key);
          tracks.push(track);
        }
      });

      return tracks;
    }, [hlsAudioTracks, audioTracks, nativeAudioTracks]);

    // Synchronize prop changes to active source
    useEffect(() => {
      setActiveSrc(src);
      fallbackTriedRef.current = false;
      setCurrentTime(0);
      setDuration(0);
      setError(null);
      setCurrentQuality(-1);
      setAutoCurrentLabel('');
      setQualityLevels([]);
      setHlsSubtitleTracks([]);
      setNativeSubtitleTracks([]);
      setHlsAudioTracks([]);
      setNativeAudioTracks([]);
      setActiveAudioTrackId(null);
      setActiveSubtitleId(null);
      setSubtitlesEnabled(false);
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

    // Interactive movie scene navigation logic
    const isInteractive =
      contentType === 'interactive_movie' ||
      Boolean(showPrevious || onPrevious || showSkip || onSkip || showNext || onNext);

    const canGoPrevious = Boolean(showPrevious && onPrevious);
    const canGoNext = Boolean((showNext || showSkip) && (onNext || onSkip));

    const handlePreviousScene = useCallback(
      (e?: React.MouseEvent) => {
        if (!canGoPrevious) return;
        if (e) e.stopPropagation();
        playClickSound();
        if (onPrevious) {
          onPrevious();
        }
      },
      [canGoPrevious, onPrevious, playClickSound]
    );

    const handleNextScene = useCallback(
      (e?: React.MouseEvent) => {
        if (!canGoNext) return;
        if (e) e.stopPropagation();
        playClickSound();
        if (onNext) {
          onNext();
        } else if (onSkip) {
          onSkip();
        }
      },
      [canGoNext, onNext, onSkip, playClickSound]
    );

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

    // Auto-hide UI controls after 3 seconds of mouse/touch inactivity
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

    // Kick off auto-hide timer whenever playback starts or resumes
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

      // Helper to parse quality levels from HLS
      const parseQualityLevels = (instance: Hls) => {
        if (!instance.levels || instance.levels.length === 0) return;
        const limitHeight =
          maxQualityHeight && maxQualityHeight > 0
            ? maxQualityHeight
            : Infinity;

        if (limitHeight < Infinity) {
          let maxLevelId = -1;
          instance.levels.forEach((lvl, idx) => {
            if ((lvl.height || 0) <= limitHeight) {
              maxLevelId = Math.max(maxLevelId, idx);
            }
          });
          if (maxLevelId >= 0) {
            instance.autoLevelCapping = maxLevelId;
          }
        }

        const detectedLevels: HlsQualityLevel[] = instance.levels
          .map((level, idx) => {
            let h = level.height || 0;
            if (!h && (level as any).attrs?.RESOLUTION) {
              const parts = String((level as any).attrs.RESOLUTION).split('x');
              if (parts.length === 2) h = parseInt(parts[1], 10) || 0;
            }
            const label =
              h > 0
                ? `${h}p`
                : level.name
                ? level.name
                : level.bitrate
                ? `${Math.round(level.bitrate / 1000)}k`
                : `Level ${idx + 1}`;
            return {
              id: idx,
              height: h,
              label,
              bitrate: level.bitrate,
              isLocked: h > limitHeight,
            };
          })
          .sort((a, b) => (b.height || b.bitrate || 0) - (a.height || a.bitrate || 0));

        // Deduplicate resolutions
        const uniqueLevels: HlsQualityLevel[] = [];
        const seenLabels = new Set<string>();
        for (const lvl of detectedLevels) {
          if (!seenLabels.has(lvl.label)) {
            seenLabels.add(lvl.label);
            uniqueLevels.push(lvl);
          }
        }

        setQualityLevels(uniqueLevels);
      };

      // Helper to parse HLS subtitle tracks
      const parseHlsSubtitles = (instance: Hls) => {
        const tracks = instance.subtitleTracks || [];
        if (tracks.length > 0) {
          const list: SubtitleTrackOption[] = tracks.map((t, idx) => ({
            id: `hls-sub-${idx}`,
            language: t.lang || `track-${idx}`,
            label: t.name || (t.lang ? t.lang.toUpperCase() : `Subtitle ${idx + 1}`),
            isHls: true,
            hlsIndex: idx,
          }));
          setHlsSubtitleTracks(list);
        } else {
          setHlsSubtitleTracks([]);
        }
      };

      // Helper to parse HLS audio tracks
      const parseHlsAudio = (instance: Hls) => {
        const tracks = instance.audioTracks || [];
        if (tracks.length > 0) {
          const list: AudioTrackOption[] = tracks.map((t, idx) => ({
            id: `hls-audio-${idx}`,
            language: t.lang || `audio-${idx}`,
            label: t.name || (t.lang ? t.lang.toUpperCase() : `Audio ${idx + 1}`),
            isHls: true,
            hlsIndex: idx,
            isDefault: t.default,
          }));
          setHlsAudioTracks(list);

          const currentIdx = instance.audioTrack;
          if (currentIdx >= 0 && currentIdx < tracks.length) {
            setActiveAudioTrackId(`hls-audio-${currentIdx}`);
          } else {
            const defIdx = tracks.findIndex((t) => t.default);
            setActiveAudioTrackId(`hls-audio-${defIdx >= 0 ? defIdx : 0}`);
          }
        } else {
          setHlsAudioTracks([]);
        }
      };

      // Native Apple HLS handler
      const handleAppleTracks = () => {
        handleCanPlay();
        // Check native audio tracks
        const nativeAudio = (video as any).audioTracks;
        if (nativeAudio && nativeAudio.length > 0) {
          const list: AudioTrackOption[] = [];
          for (let i = 0; i < nativeAudio.length; i++) {
            const t = nativeAudio[i];
            list.push({
              id: `nat-audio-${i}`,
              label: t.label || t.language || `Audio ${i + 1}`,
              language: t.language || 'und',
              isNative: true,
              nativeIndex: i,
              isDefault: t.enabled,
            });
            if (t.enabled) {
              setActiveAudioTrackId(`nat-audio-${i}`);
            }
          }
          setNativeAudioTracks(list);
        }

        // Check native text tracks
        if (video.textTracks && video.textTracks.length > 0) {
          const list: SubtitleTrackOption[] = [];
          for (let i = 0; i < video.textTracks.length; i++) {
            const t = video.textTracks[i];
            if (t.kind === 'subtitles' || t.kind === 'captions') {
              list.push({
                id: `nat-sub-${i}`,
                label: t.label || t.language || `Subtitle ${i + 1}`,
                language: t.language || 'und',
                isNative: true,
                nativeIndex: i,
              });
              if (t.mode === 'showing') {
                setSubtitlesEnabled(true);
                setActiveSubtitleId(`nat-sub-${i}`);
              }
            }
          }
          setNativeSubtitleTracks(list);
        }
      };

      // HLS Manifest Playback (.m3u8)
      const isHls =
        activeSrc.toLowerCase().includes('.m3u8') ||
        activeSrc.toLowerCase().includes('playlist') ||
        activeSrc.toLowerCase().includes('/hls');

      if (isHls) {
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

          // Manifest & Quality Levels
          hls.on(Hls.Events.MANIFEST_PARSED, () => {
            handleCanPlay();
            parseQualityLevels(hls);
            parseHlsSubtitles(hls);
            parseHlsAudio(hls);
          });

          hls.on(Hls.Events.LEVELS_UPDATED, () => {
            parseQualityLevels(hls);
          });

          hls.on(Hls.Events.SUBTITLE_TRACKS_UPDATED, () => {
            parseHlsSubtitles(hls);
          });

          hls.on(Hls.Events.AUDIO_TRACKS_UPDATED, () => {
            parseHlsAudio(hls);
          });

          hls.on(Hls.Events.LEVEL_SWITCHED, (_, data) => {
            if (hls.autoLevelEnabled) {
              setCurrentQuality(-1);
              const lvl = hls.levels?.[data.level];
              if (lvl) {
                setAutoCurrentLabel(lvl.height ? `${lvl.height}p` : '');
              }
            } else {
              setCurrentQuality(data.level);
            }
          });

          hls.on(Hls.Events.AUDIO_TRACK_SWITCHED, (_, data) => {
            setActiveAudioTrackId(`hls-audio-${data.id}`);
          });

          hls.on(Hls.Events.SUBTITLE_TRACK_SWITCH, (_, data) => {
            if (data.id === -1) {
              setSubtitlesEnabled(false);
              setActiveSubtitleId(null);
            } else {
              setSubtitlesEnabled(true);
              setActiveSubtitleId(`hls-sub-${data.id}`);
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
          video.addEventListener('loadedmetadata', handleAppleTracks);
          if (video.textTracks) {
            video.textTracks.addEventListener('addtrack', handleAppleTracks);
          }
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
        video.removeEventListener('loadedmetadata', handleAppleTracks);
        if (video.textTracks) {
          video.textTracks.removeEventListener('addtrack', handleAppleTracks);
        }
      };
    }, [activeSrc, autoPlay, crossOrigin, maxQualityHeight, src, subtitles]);

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

    const handleFullscreen = async (
      e?: React.MouseEvent | React.KeyboardEvent
    ) => {
      if (e) {
        e.stopPropagation();
      }
      playClickSound();

      if (onFullscreenRequest) {
        onFullscreenRequest();
        return;
      }

      if (fullscreenTransitionRef.current) return;
      fullscreenTransitionRef.current = true;

      try {
        const isCurrentlyFs = isElementFullscreen(
          containerRef.current,
          videoRef.current
        );
        if (isCurrentlyFs) {
          await exitDocumentFullscreen(videoRef.current);
        } else {
          await requestElementFullscreen(
            containerRef.current,
            videoRef.current
          );
        }
      } catch (err) {
        console.warn('Fullscreen toggle failed:', err);
      } finally {
        fullscreenTransitionRef.current = false;
        updateFullscreenState();
      }
    };

    const handleMinimizeClick = async (e: React.MouseEvent) => {
      e.stopPropagation();
      playClickSound();

      const isCurrentlyFs = isElementFullscreen(
        containerRef.current,
        videoRef.current
      );
      if (isCurrentlyFs || getFullscreenElement()) {
        if (!fullscreenTransitionRef.current) {
          fullscreenTransitionRef.current = true;
          try {
            await exitDocumentFullscreen(videoRef.current);
          } catch (err) {
            console.warn('Exit fullscreen on minimize failed:', err);
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

    const handleSubtitleSelect = (sub: SubtitleTrackOption | null) => {
      playClickSound();
      if (!sub) {
        setSubtitlesEnabled(false);
        setActiveSubtitleId(null);
        setActiveSubtitleLanguage(null);
        if (hlsRef.current) {
          hlsRef.current.subtitleTrack = -1;
          hlsRef.current.subtitleDisplay = false;
        }
        if (videoRef.current?.textTracks) {
          for (let i = 0; i < videoRef.current.textTracks.length; i++) {
            videoRef.current.textTracks[i].mode = 'hidden';
          }
        }
      } else {
        setSubtitlesEnabled(true);
        setActiveSubtitleId(sub.id);
        setActiveSubtitleLanguage(sub.language);
        if (sub.isHls && hlsRef.current && typeof sub.hlsIndex === 'number') {
          hlsRef.current.subtitleTrack = sub.hlsIndex;
          hlsRef.current.subtitleDisplay = true;
          if (videoRef.current?.textTracks) {
            for (let i = 0; i < videoRef.current.textTracks.length; i++) {
              videoRef.current.textTracks[i].mode = 'hidden';
            }
          }
        } else {
          if (hlsRef.current) {
            hlsRef.current.subtitleTrack = -1;
            hlsRef.current.subtitleDisplay = false;
          }
          if (videoRef.current?.textTracks) {
            for (let i = 0; i < videoRef.current.textTracks.length; i++) {
              const t = videoRef.current.textTracks[i];
              const matches =
                (sub.isNative && i === sub.nativeIndex) ||
                (sub.isExternal && (t.language === sub.language || t.label === sub.label));
              t.mode = matches ? 'showing' : 'hidden';
            }
          }
        }
      }
      setActiveMenu('none');
    };

    const handleAudioTrackSelect = (track: AudioTrackOption) => {
      playClickSound();
      setActiveAudioTrackId(track.id);

      if (track.isHls && hlsRef.current && typeof track.hlsIndex === 'number') {
        hlsRef.current.audioTrack = track.hlsIndex;
      } else if (track.isNative && videoRef.current) {
        const nativeAudio = (videoRef.current as any).audioTracks;
        if (nativeAudio) {
          for (let i = 0; i < nativeAudio.length; i++) {
            nativeAudio[i].enabled = i === track.nativeIndex;
          }
        }
      } else if (track.isExternal && track.url) {
        if (!audioRef.current) {
          audioRef.current = new Audio();
        }
        audioRef.current.src = track.url;
        audioRef.current.currentTime = videoRef.current?.currentTime || 0;
        if (isPlaying) {
          audioRef.current.play().catch(() => {});
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
        case 'p':
        case 'P':
          if (isInteractive && canGoPrevious) {
            e.preventDefault();
            handlePreviousScene();
          }
          break;
        case 'n':
        case 'N':
          if (isInteractive && canGoNext) {
            e.preventDefault();
            handleNextScene();
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
      requestFullScreen: async () => {
        if (onFullscreenRequest) {
          onFullscreenRequest();
          return;
        }
        if (fullscreenTransitionRef.current) return;
        fullscreenTransitionRef.current = true;
        try {
          await requestElementFullscreen(
            containerRef.current,
            videoRef.current
          );
        } catch (err) {
          console.warn('Imperative request fullscreen failed:', err);
        } finally {
          fullscreenTransitionRef.current = false;
          updateFullscreenState();
        }
      },
      videoElement: videoRef.current,
    }));

    const formatTime = (seconds: number, forceHours = false) => {
      if (isNaN(seconds) || seconds < 0) return forceHours ? '00:00:00' : '00:00';
      const hrs = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      const secs = Math.floor(seconds % 60);

      if (hrs > 0 || forceHours) {
        return `${hrs.toString().padStart(2, '0')}:${mins
          .toString()
          .padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
      }
      return `${mins.toString().padStart(2, '0')}:${secs
        .toString()
        .padStart(2, '0')}`;
    };

    return (
      <div
        ref={containerRef}
        tabIndex={0}
        className={`relative group bg-black overflow-hidden outline-none select-none font-inter ${
          isFullscreen
            ? 'w-screen h-screen max-w-none max-h-none rounded-none border-0 shadow-none m-0 p-0'
            : 'w-full h-full rounded-2xl sm:rounded-3xl'
        } ${!showUI && isPlaying && isFullscreen ? 'cursor-none' : ''} ${className}`}
        onKeyDown={handleKeyDown}
        onMouseMove={resetControlsTimeout}
        onTouchStart={resetControlsTimeout}
        onTouchMove={resetControlsTimeout}
        onClick={resetControlsTimeout}
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
              className="w-full h-full object-cover cursor-pointer block"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              onPlay={() => {
                setIsPlaying(true);
                onPlay?.();
              }}
              onPause={() => setIsPlaying(false)}
              onEnded={onEnded}
              loop={loop}
              muted={isMuted}
              playsInline
              crossOrigin={crossOrigin || 'anonymous'}
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
                    subtitlesEnabled && activeSubtitleLanguage === sub.language
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

            {/* Top Overlay Bar (Matching Reference Image) */}
            {showControls && (
              <div
                className={`video-top-overlay absolute top-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between gap-3 transition-opacity duration-300 ${
                  showUI || activeMenu !== 'none'
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Top Left: Glassmorphic Capsule Card (Reference Image match) */}
                <div className="bg-black/60 backdrop-blur-md border border-white/15 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl flex items-center gap-2.5 sm:gap-3.5 shadow-2xl max-w-[70%] sm:max-w-md">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/10 flex items-center justify-center text-white shrink-0 shadow-inner">
                    <Play size={13} fill="white" className="ml-0.5 text-white" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-white font-bold text-xs sm:text-sm tracking-wide leading-tight truncate">
                      {title || 'Vtagu Prime'}
                    </h3>
                    <p className="text-white/60 text-[10px] sm:text-[11px] font-medium leading-tight truncate mt-0.5">
                      {metadata || 'Streaming in HD • Premium'}
                    </p>
                  </div>
                </div>

                {/* Top Right: Glassmorphic Pills (Quality + PiP + Settings/Close) */}
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
                    <span className="font-semibold text-xs">
                      {currentQualityLabel}
                    </span>
                  </button>

                  {/* Cast / PictureInPicture Pill */}
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

                  {/* Close Modal Button if onClose is passed */}
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

            {/* Bottom Controls Bar (Inside video, bottom edge, single aligned row across all viewports) */}
            {showControls && (
              <div
                className={`video-controls-container absolute bottom-0 left-0 right-0 z-30 px-3 py-2.5 sm:px-5 sm:py-3.5 md:px-6 md:py-4 bg-gradient-to-t from-black/95 via-black/75 to-transparent transition-opacity duration-300 pointer-events-auto ${
                  showUI || activeMenu !== 'none'
                    ? 'opacity-100'
                    : 'opacity-0 pointer-events-none'
                }`}
              >
                {/* Single Unified Aligned Row for Desktop, Tablet, and Mobile */}
                <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 lg:gap-3.5 w-full flex-nowrap min-w-0">
                  {/* Previous Scene Button (Interactive mode only) */}
                  {isInteractive && (
                    <button
                      onClick={handlePreviousScene}
                      disabled={!canGoPrevious}
                      className={`p-1 sm:p-1.5 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                        canGoPrevious
                          ? 'text-white/85 hover:text-cyan-400 hover:bg-white/10 active:scale-95 cursor-pointer'
                          : 'text-white/20 opacity-30 cursor-not-allowed pointer-events-none'
                      }`}
                      title={canGoPrevious ? 'Previous Scene (P)' : 'No Previous Scene'}
                      aria-label="Previous Scene"
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

                  {/* Next Scene / Skip Button (Interactive mode only) */}
                  {isInteractive && (
                    <button
                      onClick={handleNextScene}
                      disabled={!canGoNext}
                      className={`p-1 sm:p-1.5 rounded-lg transition-all flex items-center justify-center shrink-0 ${
                        canGoNext
                          ? 'text-white/85 hover:text-cyan-400 hover:bg-white/10 active:scale-95 cursor-pointer'
                          : 'text-white/20 opacity-30 cursor-not-allowed pointer-events-none'
                      }`}
                      title={canGoNext ? 'Next Scene / Skip to Decision (N)' : 'No Next Scene (Story Ended)'}
                      aria-label="Next Scene"
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
                          width: `${duration > 0 ? (bufferedEnd / duration) * 100 : 0}%`,
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
                        {formatTime(hoverTime, duration >= 3600)}
                      </div>
                    )}

                    {/* Interactive Range Input */}
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

                  {/* 5. Timestamp (00:25 / 05:42) */}
                  <div className="text-white/90 text-[10px] sm:text-xs font-mono font-bold tracking-tight shrink-0 select-none whitespace-nowrap flex items-center">
                    <span>{formatTime(currentTime, duration >= 3600)}</span>
                    <span className="text-white/40 mx-0.5 sm:mx-1">/</span>
                    <span className="text-white/70">{formatTime(duration, duration >= 3600)}</span>
                  </div>

                  {/* 6. Volume Control (Speaker icon + responsive slider) */}
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

                    {/* Volume Slider Track (visible on sm: screens and up, keeps mobile clean and uncrowded) */}
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
                    title="Settings (Quality, Audio, Speed)"
                    aria-label="Settings"
                  >
                    <Settings size={17} className="sm:w-[18px] sm:h-[18px]" />
                  </button>

                  {/* 9. Picture-in-Picture / Minimize Button */}
                  {showMinimize ? (
                    <button
                      onClick={handleMinimizeClick}
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
                className="absolute bottom-16 sm:bottom-20 right-4 sm:right-6 bg-[#0c0d14]/95 backdrop-blur-2xl border border-white/15 rounded-2xl overflow-hidden min-w-[260px] max-w-[320px] z-50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(34,211,238,0.2)] animate-scale-up-fade-in"
                onClick={(e) => e.stopPropagation()}
              >
                {/* 1. Main Settings Menu */}
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
                        onClick={() => setActiveMenu('audio')}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Headphones size={16} className="text-cyan-400" />
                          <span>Audio Language</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-[11px] max-w-[100px] truncate">
                          <span className="truncate">
                            {allAudioTracks.find((t) => t.id === activeAudioTrackId)?.label || (allAudioTracks.length > 0 ? allAudioTracks[0].label : 'Default')}
                          </span>
                          <ChevronRight size={14} />
                        </div>
                      </button>

                      <button
                        onClick={() => setActiveMenu('subtitles')}
                        className="flex items-center justify-between px-3 py-2.5 rounded-xl hover:bg-white/10 text-xs font-semibold text-white/90 transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2.5">
                          <Subtitles size={16} className="text-cyan-400" />
                          <span>Subtitles</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-white/50 text-[11px] max-w-[100px] truncate">
                          <span className="truncate">
                            {subtitlesEnabled
                              ? allSubtitleTracks.find((s) => s.id === activeSubtitleId)?.label || 'On'
                              : 'Off'}
                          </span>
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
                      <button
                        onClick={() => {
                          handleQualitySelect(-1);
                          setActiveMenu('none');
                        }}
                        className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                          currentQuality === -1
                            ? 'text-cyan-400 bg-cyan-400/5'
                            : 'text-white/80'
                        }`}
                      >
                        <span>Auto {autoCurrentLabel ? `(${autoCurrentLabel})` : ''}</span>
                        {currentQuality === -1 && <Check size={14} />}
                      </button>

                      {qualityLevels.map((lvl) => (
                        <button
                          key={lvl.id}
                          onClick={() => {
                            if (lvl.isLocked) {
                              alert("Please upgrade your subscription plan to unlock this video quality.");
                              return;
                            }
                            handleQualitySelect(lvl.id);
                            setActiveMenu('none');
                          }}
                          className={`text-left px-4 py-2.5 text-xs font-bold transition-colors flex items-center justify-between cursor-pointer ${
                            lvl.isLocked 
                              ? 'text-white/40 cursor-not-allowed bg-black/40 hover:bg-white/5' 
                              : 'hover:bg-white/10 text-white/80'
                          } ${
                            currentQuality === lvl.id && !lvl.isLocked
                              ? 'text-cyan-400 bg-cyan-400/5'
                              : ''
                          }`}
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

                {/* 3. Audio Tracks Submenu */}
                {activeMenu === 'audio' && (
                  <div>
                    <div className="px-3.5 py-3 border-b border-white/10 flex items-center justify-between">
                      <button
                        onClick={() => setActiveMenu('settings')}
                        className="flex items-center gap-1.5 text-xs font-bold text-white/80 hover:text-cyan-400 cursor-pointer"
                      >
                        <ChevronLeft size={16} />
                        <span>Audio Language</span>
                      </button>
                      <button
                        onClick={() => setActiveMenu('none')}
                        className="text-white/60 hover:text-white p-1 rounded-lg"
                      >
                        <X size={14} />
                      </button>
                    </div>
                    <div className="flex flex-col py-1 max-h-64 overflow-y-auto">
                      {allAudioTracks.length === 0 ? (
                        <div className="px-4 py-3 text-xs text-white/50">Default audio only</div>
                      ) : (
                        allAudioTracks.map((track) => (
                          <button
                            key={track.id}
                            onClick={() => {
                              handleAudioTrackSelect(track);
                              setActiveMenu('none');
                            }}
                            className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                              activeAudioTrackId === track.id
                                ? 'text-cyan-400 bg-cyan-400/5'
                                : 'text-white/80'
                            }`}
                          >
                            <span>{track.label}</span>
                            {activeAudioTrackId === track.id && (
                              <Check size={14} />
                            )}
                          </button>
                        ))
                      )}
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
                        onClick={() => handleSubtitleSelect(null)}
                        className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                          !subtitlesEnabled
                            ? 'text-cyan-400 bg-cyan-400/5'
                            : 'text-white/80'
                        }`}
                      >
                        <span>Off</span>
                        {!subtitlesEnabled && <Check size={14} />}
                      </button>
                      {allSubtitleTracks.map((sub) => (
                        <button
                          key={sub.id}
                          onClick={() => handleSubtitleSelect(sub)}
                          className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
                            subtitlesEnabled && activeSubtitleId === sub.id
                              ? 'text-cyan-400 bg-cyan-400/5'
                              : 'text-white/80'
                          }`}
                        >
                          <span>{sub.label}</span>
                          {subtitlesEnabled && activeSubtitleId === sub.id && (
                            <Check size={14} />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* 5. Playback Speed Submenu */}
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
                    <div className="flex flex-col py-1">
                      {PLAYBACK_SPEEDS.map((speed) => (
                        <button
                          key={speed}
                          onClick={() => {
                            handleSpeedSelect(speed);
                            setActiveMenu('none');
                          }}
                          className={`text-left px-4 py-2.5 text-xs font-bold transition-colors hover:bg-white/10 flex items-center justify-between cursor-pointer ${
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
            )}
          </>
        )}

        <style jsx global>{`
          :fullscreen,
          :-webkit-full-screen,
          :-moz-full-screen,
          :-ms-fullscreen {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            margin: 0 !important;
            padding: 0 !important;
            border-radius: 0 !important;
            border: none !important;
            box-shadow: none !important;
            aspect-ratio: auto !important;
            background: #000 !important;
            overflow: hidden !important;
          }

          :fullscreen video,
          :-webkit-full-screen video,
          :-moz-full-screen video,
          :-ms-fullscreen video {
            width: 100vw !important;
            max-width: 100vw !important;
            height: 100dvh !important;
            max-height: 100dvh !important;
            object-fit: cover !important;
            border-radius: 0 !important;
            border: none !important;
            aspect-ratio: auto !important;
          }

          :fullscreen [class*="aspect-video"],
          :-webkit-full-screen [class*="aspect-video"],
          :-moz-full-screen [class*="aspect-video"] {
            aspect-ratio: auto !important;
            width: 100vw !important;
            height: 100dvh !important;
            border-radius: 0 !important;
            border: none !important;
          }

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
