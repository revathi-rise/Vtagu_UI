'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Short, getActiveShorts, incrementShortView } from '@/lib/vtagu.api';

// ─── Icons ───────────────────────────────────────────────────────────────────

function ArrowLeftIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 12H5M12 19l-7-7 7-7" />
    </svg>
  );
}
function VolumeOffIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <line x1="23" y1="9" x2="17" y2="15" /><line x1="17" y1="9" x2="23" y2="15" />
    </svg>
  );
}
function VolumeOnIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" /><path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
    </svg>
  );
}
function PlayIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
function PauseIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="currentColor">
      <rect x="6" y="4" width="4" height="16" /><rect x="14" y="4" width="4" height="16" />
    </svg>
  );
}
function ShareIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
      <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
    </svg>
  );
}
function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── Single Short Card ────────────────────────────────────────────────────────

interface ShortCardProps {
  short: Short;
  isActive: boolean;
  isMuted: boolean;
  onToggleMute: () => void;
  onViewCounted: (id: number) => void;
}

function ShortCard({ short, isActive, isMuted, onToggleMute, onViewCounted }: ShortCardProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0);
  const viewedRef = useRef(false);

  // Auto-play / pause based on active state
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      // Guard: skip play if there is no valid source
      if (!short.video_url) {
        setPaused(true);
        return;
      }
      video.currentTime = 0;
      viewedRef.current = false;
      setPaused(false);

      const tryPlay = () => {
        video.play().catch((err: Error) => {
          // NotSupportedError = no valid source yet; AbortError = interrupted by scroll — swallow both
          if (err.name !== 'NotSupportedError' && err.name !== 'AbortError') {
            console.warn('[ShortCard] play() error:', err.name, err.message);
          }
          setPaused(true);
        });
      };

      // readyState >= 2 means browser has current frame data — enough to start
      if (video.readyState >= 2) {
        tryPlay();
      } else {
        // Wait for canplay (fires earlier than canplaythrough)
        video.addEventListener('canplay', tryPlay, { once: true });
        // Also load explicitly in case browser paused network activity
        video.load();
        return () => video.removeEventListener('canplay', tryPlay);
      }
    } else {
      video.pause();
      video.currentTime = 0;
      setProgress(0);
    }
  }, [isActive, short.video_url]);

  // Sync mute state imperatively — the HTML `muted` attr is static, JS .muted controls runtime
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    video.muted = isMuted;
  }, [isMuted, isActive]); // re-sync when active card changes too

  // Progress bar
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const onTime = () => {
      if (video.duration) setProgress((video.currentTime / video.duration) * 100);
      // Count view after 3 seconds
      if (!viewedRef.current && video.currentTime >= 3) {
        viewedRef.current = true;
        onViewCounted(short.id);
      }
    };
    video.addEventListener('timeupdate', onTime);
    return () => video.removeEventListener('timeupdate', onTime);
  }, [short.id, onViewCounted]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video || !short.video_url) return;
    if (video.paused) {
      video.play().catch((err: Error) => {
        if (err.name !== 'NotSupportedError' && err.name !== 'AbortError') {
          console.warn('[ShortCard] togglePlay error:', err.name);
        }
      });
      setPaused(false);
    } else {
      video.pause();
      setPaused(true);
    }
  };

  const formatViews = (n: number) => {
    if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
    if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
    return `${n}`;
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#000',
        scrollSnapAlign: 'start',
        flexShrink: 0,
      }}
    >
      {/* Video — only render if URL exists */}
      {short.video_url ? (
        <video
          ref={videoRef}
          src={short.video_url}
          poster={short.thumbnail_url || undefined}
          muted        // HTML attribute — required for autoplay policy in all browsers
          autoPlay={isActive}
          loop
          playsInline
          preload={isActive ? 'auto' : 'none'}
          onError={() => setPaused(true)}
          onClick={togglePlay}
          style={{
            height: '100%',
            maxWidth: '100%',
            aspectRatio: '9/16',
            objectFit: 'cover',
            cursor: 'pointer',
            display: 'block',
          }}
        />
      ) : (
        /* Fallback when no video URL — show thumbnail or gradient */
        <div style={{
          height: '100%',
          width: '100%',
          aspectRatio: '9/16',
          background: short.thumbnail_url
            ? `url(${short.thumbnail_url}) center/cover no-repeat`
            : 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: 13 }}>Video unavailable</span>
        </div>
      )}

      {/* Play/Pause overlay */}
      {paused && (
        <div
          onClick={togglePlay}
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0,0,0,0.35)',
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(8px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '2px solid rgba(255,255,255,0.3)',
          }}>
            <PlayIcon />
          </div>
        </div>
      )}

      {/* Bottom gradient overlay */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: '55%',
        background: 'linear-gradient(to top, rgba(0,0,0,0.92) 0%, rgba(0,0,0,0.5) 50%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Top gradient overlay */}
      <div style={{
        position: 'absolute',
        top: 0, left: 0, right: 0, height: '20%',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.6) 0%, transparent 100%)',
        pointerEvents: 'none',
      }} />

      {/* Right-side action buttons */}
      <div style={{
        position: 'absolute',
        right: 16, bottom: 100,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24,
      }}>
        {/* Mute / Unmute */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <button
            onClick={onToggleMute}
            style={{
              width: 48, height: 48, borderRadius: '50%',
              background: isMuted
                ? 'rgba(255,80,80,0.25)'
                : 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              border: isMuted
                ? '1px solid rgba(255,80,80,0.5)'
                : '1px solid rgba(255,255,255,0.2)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            title={isMuted ? 'Tap to unmute' : 'Mute'}
          >
            {isMuted ? <VolumeOffIcon /> : <VolumeOnIcon />}
          </button>
          {isMuted && (
            <span style={{
              color: 'rgba(255,255,255,0.6)', fontSize: 9, fontWeight: 700,
              textTransform: 'uppercase', letterSpacing: 0.5, textAlign: 'center',
            }}>
              Unmute
            </span>
          )}
        </div>

        {/* Share */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({ title: short.title, url: window.location.href });
            } else {
              navigator.clipboard.writeText(window.location.href);
            }
          }}
          style={{
            width: 48, height: 48, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(8px)',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'all 0.2s',
          }}
          title="Share"
        >
          <ShareIcon />
        </button>

        {/* View count */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ color: 'rgba(255,255,255,0.7)' }}><EyeIcon /></div>
          <span style={{ color: '#fff', fontSize: 12, fontWeight: 600 }}>
            {formatViews(short.view_count)}
          </span>
        </div>
      </div>

      {/* Bottom content */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 72,
        padding: '0 20px 24px',
      }}>
        <h2 style={{
          color: '#fff', fontSize: 17, fontWeight: 700,
          margin: '0 0 6px', lineHeight: 1.3,
          textShadow: '0 2px 8px rgba(0,0,0,0.8)',
        }}>
          {short.title}
        </h2>
        {short.description && (
          <p style={{
            color: 'rgba(255,255,255,0.75)', fontSize: 13, margin: '0 0 8px',
            lineHeight: 1.5, display: '-webkit-box',
            WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>
            {short.description}
          </p>
        )}
        {short.duration && (
          <span style={{
            color: 'rgba(255,255,255,0.5)', fontSize: 12,
            background: 'rgba(255,255,255,0.1)',
            padding: '2px 8px', borderRadius: 12,
          }}>
            {short.duration}
          </span>
        )}
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'absolute',
        bottom: 0, left: 0, right: 0, height: 3,
        background: 'rgba(255,255,255,0.15)',
      }}>
        <div style={{
          height: '100%',
          width: `${progress}%`,
          background: 'linear-gradient(90deg, #3299ff, #9248ff)',
          transition: 'width 0.1s linear',
        }} />
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function ShortsPage() {
  const router = useRouter();
  const [shorts, setShorts] = useState<Short[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true); // MUST start muted — browsers block autoplay of unmuted video
  const containerRef = useRef<HTMLDivElement>(null);
  const countedViews = useRef<Set<number>>(new Set());

  useEffect(() => {
    getActiveShorts().then((data) => {
      setShorts(data);
      setLoading(false);
    });
  }, []);

  // Scroll snapping observer — detect which card is visible
  useEffect(() => {
    const container = containerRef.current;
    if (!container || shorts.length === 0) return;

    const cards = Array.from(container.children) as HTMLElement[];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = cards.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveIndex(idx);
          }
        });
      },
      { root: container, threshold: 0.6 }
    );
    cards.forEach((c) => observer.observe(c));
    return () => observer.disconnect();
  }, [shorts]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') scrollToIndex(activeIndex + 1);
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') scrollToIndex(activeIndex - 1);
      if (e.key === 'Escape') router.back();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeIndex, router]);

  const scrollToIndex = (idx: number) => {
    const container = containerRef.current;
    if (!container) return;
    const clamped = Math.max(0, Math.min(idx, shorts.length - 1));
    const card = container.children[clamped] as HTMLElement;
    if (card) card.scrollIntoView({ behavior: 'smooth' });
  };

  const handleViewCounted = useCallback((id: number) => {
    if (!countedViews.current.has(id)) {
      countedViews.current.add(id);
      incrementShortView(id);
    }
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: '#fff', fontFamily: 'sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, border: '3px solid rgba(255,255,255,0.1)',
            borderTopColor: '#3299ff', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', margin: 0 }}>Loading shorts…</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  if (shorts.length === 0) {
    return (
      <div style={{
        height: '100%', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', color: '#fff',
      }}>
        <p style={{ fontSize: 48, margin: '0 0 12px' }}>🎬</p>
        <p style={{ fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>No Shorts Yet</p>
        <p style={{ color: 'rgba(255,255,255,0.4)', margin: '0 0 24px' }}>Check back soon!</p>
        <button
          onClick={() => router.push('/')}
          style={{
            padding: '12px 28px', borderRadius: 28,
            background: 'linear-gradient(135deg, #3299ff, #9248ff)',
            color: '#fff', border: 'none', fontSize: 15,
            fontWeight: 600, cursor: 'pointer',
          }}
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', width: '100%', height: '100%' }}>
      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        padding: '14px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 70%, transparent 100%)',
      }}>
        {/* Left: Back button */}
        <button
          onClick={() => router.back()}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'rgba(255,255,255,0.12)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.18)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, transform 0.15s',
            flexShrink: 0,
          }}
          title="Go back"
        >
          <ArrowLeftIcon />
        </button>

        {/* Center: Brand + counter */}
        <div style={{
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {/* Animated live dot */}
            <div style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3299ff, #9248ff)',
              animation: 'pulse-dot 2s ease-in-out infinite',
            }} />
            <span style={{
              color: '#fff', fontSize: 15, fontWeight: 800,
              letterSpacing: 2, textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #fff 60%, rgba(255,255,255,0.6) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Vtagu Shorts
            </span>
          </div>

          {/* Dot indicators */}
          {shorts.length > 1 && (
            <div style={{ display: 'flex', gap: 5 }}>
              {shorts.slice(0, Math.min(shorts.length, 10)).map((_, i) => (
                <div
                  key={i}
                  onClick={() => scrollToIndex(i)}
                  style={{
                    width: i === activeIndex ? 18 : 6,
                    height: 6, borderRadius: 3,
                    background: i === activeIndex
                      ? 'linear-gradient(90deg, #3299ff, #9248ff)'
                      : 'rgba(255,255,255,0.3)',
                    transition: 'width 0.3s, background 0.3s',
                    cursor: 'pointer',
                  }}
                />
              ))}
              {shorts.length > 10 && (
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 10, lineHeight: '6px' }}>…</span>
              )}
            </div>
          )}
        </div>

        {/* Right: Home button */}
        <button
          onClick={() => router.push('/')}
          style={{
            width: 42, height: 42, borderRadius: '50%',
            background: 'linear-gradient(135deg, rgba(50,153,255,0.25), rgba(146,72,255,0.25))',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(50,153,255,0.35)',
            color: '#fff', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, transform 0.15s',
            flexShrink: 0,
          }}
          title="Go to Home"
        >
          {/* Home icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </button>
      </div>

      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(1.4); }
        }
      `}</style>

      {/* Vertical scroll container */}
      <div
        ref={containerRef}
        style={{
          width: '100%',
          height: '100%',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          scrollBehavior: 'smooth',
        }}
        className="no-scrollbar"
      >
        {shorts.map((short, idx) => (
          <div
            key={short.id}
            style={{
              width: '100%',
              height: '100vh',
              scrollSnapAlign: 'start',
              flexShrink: 0,
            }}
          >
            <ShortCard
              short={short}
              isActive={idx === activeIndex}
              isMuted={isMuted}
              onToggleMute={() => setIsMuted((m) => !m)}
              onViewCounted={handleViewCounted}
            />
          </div>
        ))}
      </div>

      {/* Up/Down navigation arrows (desktop hint) */}
      <div style={{
        position: 'fixed', right: 20, top: '50%',
        transform: 'translateY(-50%)',
        display: 'flex', flexDirection: 'column', gap: 12, zIndex: 50,
      }}>
        {activeIndex > 0 && (
          <button
            onClick={() => scrollToIndex(activeIndex - 1)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M18 15l-6-6-6 6" />
            </svg>
          </button>
        )}
        {activeIndex < shorts.length - 1 && (
          <button
            onClick={() => scrollToIndex(activeIndex + 1)}
            style={{
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
