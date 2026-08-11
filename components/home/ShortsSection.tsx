'use client';

import { useRef, useState, useCallback, memo } from 'react';
import Link from 'next/link';
import { Short } from '@/lib/vtagu.api';
import UniversalVideoPlayer, { UniversalVideoPlayerHandle } from '@/components/ui/UniversalVideoPlayer';

// ─── Card ─────────────────────────────────────────────────────────────────────

interface ShortsTeaserCardProps {
  short: Short;
  index: number;
}

const formatViews = (n: number) => {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return `${n}`;
};

const ShortsTeaserCard = memo(function ShortsTeaserCard({ short, index }: ShortsTeaserCardProps) {
  const videoRef = useRef<UniversalVideoPlayerHandle>(null);
  const [hovering, setHovering] = useState(false);
  // Don't set src until hover — prevents 12 concurrent video fetches on mount
  const [videoSrc, setVideoSrc] = useState<string | null>(null);

  const handleMouseEnter = useCallback(() => {
    setHovering(true);
    if (!short.video_url) return; // no source — nothing to play
    if (!videoSrc) {
      // First hover: set src lazily — play is triggered via onCanPlay
      setVideoSrc(short.video_url);
    } else {
      // src already set — play directly only if element has enough data
      const v = videoRef.current?.videoElement;
      if (v && v.readyState >= 2) {
        v.play().catch((err: Error) => {
          if (err.name !== 'NotSupportedError' && err.name !== 'AbortError') {
            console.warn('[ShortsCard] play error:', err.name);
          }
        });
      }
    }
  }, [short.video_url, videoSrc]);

  const handleMouseLeave = useCallback(() => {
    setHovering(false);
    if (videoRef.current?.videoElement) {
      videoRef.current.videoElement.pause();
      videoRef.current.videoElement.currentTime = 0;
    }
  }, []);

  // Once src is set, play the video (not used via onCanPlay on UniversalVideoPlayer since it handles autoPlay internally, but kept for logic consistency if needed)
  const handleVideoCanPlay = useCallback(() => {
    if (hovering) videoRef.current?.videoElement?.play().catch(() => { });
  }, [hovering]);

  return (
    <Link
      href={`/shorts?id=${short.id}`}
      style={{ textDecoration: 'none', flexShrink: 0 }}
      title={short.title}
      prefetch={false}
    >
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="w-[140px] h-[249px] sm:w-[160px] sm:h-[284px]"
        style={{
          position: 'relative',
          borderRadius: 16,
          overflow: 'hidden',
          background: '#18181b',
          cursor: 'pointer',
          transform: hovering ? 'scale(1.04) translateY(-4px)' : 'scale(1) translateY(0)',
          transition: 'transform 0.3s cubic-bezier(.34,1.56,.64,1), box-shadow 0.3s',
          boxShadow: hovering
            ? '0 20px 40px rgba(50,153,255,0.25), 0 0 0 2px rgba(50,153,255,0.4)'
            : '0 4px 20px rgba(0,0,0,0.5)',
          willChange: 'transform',
        }}
      >
        {/* Thumbnail — always visible, lazy-loaded */}
        {short.thumbnail_url ? (
          <img
            src={short.thumbnail_url}
            alt={short.title}
            loading="lazy"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              opacity: hovering ? 0 : 1,
              transition: 'opacity 0.2s',
            }}
          />
        ) : (
          <div style={{
            position: 'absolute', inset: 0,
            background: `linear-gradient(135deg, hsl(${(index * 47) % 360}, 60%, 20%) 0%, hsl(${(index * 47 + 60) % 360}, 60%, 12%) 100%)`,
          }} />
        )}

        {/* Video — src set ONLY on first hover, preload=none prevents any network request */}
        {videoSrc && (
          <div style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            opacity: hovering ? 1 : 0,
            transition: 'opacity 0.2s',
          }}>
            <UniversalVideoPlayer
              ref={videoRef}
              src={videoSrc}
              muted={true}
              loop={true}
              autoPlay={hovering}
              showControls={false}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Bottom gradient */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0, height: '60%',
          background: 'linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.4) 60%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Top gradient */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, height: '30%',
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.5) 0%, transparent 100%)',
          pointerEvents: 'none',
        }} />

        {/* Play icon */}
        {!hovering && (
          <div style={{
            position: 'absolute',
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 44, height: 44, borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(6px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            border: '1.5px solid rgba(255,255,255,0.3)',
          }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="white">
              <polygon points="5 3 19 12 5 21 5 3" />
            </svg>
          </div>
        )}

        {/* Duration badge */}
        {short.duration && (
          <div style={{
            position: 'absolute',
            top: 10, right: 10,
            background: 'rgba(0,0,0,0.7)',
            backdropFilter: 'blur(4px)',
            color: '#fff', fontSize: 11, fontWeight: 600,
            padding: '2px 7px', borderRadius: 6,
          }}>
            {short.duration}
          </div>
        )}

        {/* Title + views */}
        <div style={{
          position: 'absolute',
          bottom: 0, left: 0, right: 0,
          padding: '12px 10px',
        }}>
          <p style={{
            color: '#fff', fontSize: 12, fontWeight: 700,
            margin: '0 0 4px', lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
          }}>
            {short.title}
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 4,
            color: 'rgba(255,255,255,0.5)', fontSize: 11,
          }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
              <circle cx="12" cy="12" r="3" />
            </svg>
            {formatViews(short.view_count)}
          </div>
        </div>
      </div>
    </Link>
  );
});

// ─── Section ──────────────────────────────────────────────────────────────────

interface ShortsSectionProps {
  shorts: Short[];
}

export default function ShortsSection({ shorts }: ShortsSectionProps) {
  console.log(shorts, "shorts");
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  if (!shorts || shorts.length === 0) return null;

  const updateScrollState = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  const scroll = (dir: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: dir === 'left' ? -360 : 360, behavior: 'smooth' });
  };

  return (
    <section className='max-w-[90%] mx-auto' style={{ padding: '40px 0 32px', position: 'relative' }}>
      {/* Section header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-5 pb-6">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: 'linear-gradient(135deg, #3299ff, #9248ff)',
              animation: 'pulse-short 2s ease-in-out infinite',
            }} />
            <span style={{
              fontSize: 12, fontWeight: 700, letterSpacing: 3,
              textTransform: 'uppercase',
              background: 'linear-gradient(135deg, #3299ff, #9248ff)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Vtagu Shorts
            </span>
          </div>
          <h2 className="title-h2">
            Short&nbsp;
            <span style={{
              background: 'linear-gradient(135deg, #3299ff 0%, #9248ff 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Clips
            </span>
          </h2>
          <p className="title-desc" style={{ marginTop: 6 }}>
            Quick vertical videos — hover to preview, click to watch
          </p>
        </div>

        <Link
          href="/shorts"
          prefetch={false}
          className="inline-flex items-center justify-center gap-2 px-5 py-3 sm:px-6 sm:py-3 rounded-full text-white text-sm font-bold no-underline shrink-0 w-full sm:w-auto transition-transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #3299ff 0%, #9248ff 100%)',
            boxShadow: '0 4px 20px rgba(50,153,255,0.3)',
          }}
        >
          Watch All
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Scroll wrapper */}
      <div style={{ position: 'relative' }}>
        {canScrollLeft && (
          <button
            onClick={() => scroll('left')}
            aria-label="Scroll left"
            style={{
              position: 'absolute', left: 8, top: '50%',
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(20,20,24,0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', cursor: 'pointer', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        )}

        {canScrollRight && (
          <button
            onClick={() => scroll('right')}
            aria-label="Scroll right"
            style={{
              position: 'absolute', right: 8, top: '50%',
              transform: 'translateY(-50%)',
              width: 40, height: 40, borderRadius: '50%',
              background: 'rgba(20,20,24,0.9)',
              backdropFilter: 'blur(8px)',
              border: '1px solid rgba(255,255,255,0.12)',
              color: '#fff', cursor: 'pointer', zIndex: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 4px 16px rgba(0,0,0,0.5)',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        )}

        {/* Cards row */}
        <div
          ref={scrollRef}
          onScroll={updateScrollState}
          style={{
            display: 'flex',
            gap: 16,
            overflowX: 'auto',
            scrollSnapType: 'x mandatory',
            padding: '12px 24px 20px',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
          className="no-scrollbar"
        >
          {shorts.map((short, i) => (
            <div key={short.id} style={{ scrollSnapAlign: 'start' }}>
              <ShortsTeaserCard short={short} index={i} />
            </div>
          ))}

          {/* See All card */}
          <Link href="/shorts" prefetch={false} style={{ textDecoration: 'none', flexShrink: 0, scrollSnapAlign: 'start' }}>
            <div className="w-[140px] h-[249px] sm:w-[160px] sm:h-[284px]" style={{
              borderRadius: 16,
              background: 'linear-gradient(135deg, rgba(50,153,255,0.1) 0%, rgba(146,72,255,0.1) 100%)',
              border: '2px dashed rgba(50,153,255,0.3)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 12,
              cursor: 'pointer',
              transition: 'border-color 0.2s, background 0.2s',
            }}>
              <div style={{
                width: 52, height: 52, borderRadius: '50%',
                background: 'linear-gradient(135deg, #3299ff, #9248ff)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </div>
              <span style={{
                color: '#fff', fontSize: 13, fontWeight: 700,
                textAlign: 'center', padding: '0 12px',
              }}>
                See All Shorts
              </span>
            </div>
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse-short {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </section>
  );
}
