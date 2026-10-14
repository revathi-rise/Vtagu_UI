'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Play, Star, Clock, Calendar, LayoutGrid } from 'lucide-react';
import { cn } from '@/lib/utils';
import { getVideoType, getYouTubeVideoId } from '@/lib/video-utils';

interface MediaCardProps {
  title: string;
  image: string;
  previewGif?: string;
  subtitle?: string;
  description?: string;
  badge?: string;
  badgeColor?: 'blue' | 'green' | 'orange' | 'purple';
  isFree?: boolean;
  rating?: number | string;
  duration?: string;
  year?: string | number;
  progress?: number;
  infoLabel?: string;
  trailerUrl?: string;
  isComingSoon?: boolean;
  onClick?: () => void;
  className?: string;
  variant?: 'portrait' | 'landscape';
}

function stripHtml(str?: string): string {
  if (!str) return '';
  let cleaned = String(str);

  // 1. Strip HTML comments (e.g. <!--StartFragment-->, <!--EndFragment-->)
  cleaned = cleaned.replace(/<!--[\s\S]*?-->/g, '');

  // 2. Remove script and style elements and their contents
  cleaned = cleaned.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleaned = cleaned.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  // 3. Replace block tag closings and line breaks with spaces so words don't merge
  cleaned = cleaned.replace(/<\/(p|div|h[1-6]|li|tr)>/gi, ' ');
  cleaned = cleaned.replace(/<br\s*[\/]?>/gi, ' ');

  // 4. Strip all remaining HTML tags
  cleaned = cleaned.replace(/<[^>]+>/g, '');

  // 5. Decode numeric & hex HTML entities (vital for emojis, e.g. &#127925; -> 🎵, &#127775; -> 🌟, &#127926; -> 🎶)
  cleaned = cleaned
    .replace(/&#(\d+);/g, (_, dec) => {
      try {
        return String.fromCodePoint(Number(dec));
      } catch (e) {
        return '';
      }
    })
    .replace(/&#x([0-9a-f]+);/gi, (_, hex) => {
      try {
        return String.fromCodePoint(parseInt(hex, 16));
      } catch (e) {
        return '';
      }
    });

  // 6. Decode common named HTML entities
  cleaned = cleaned
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/&apos;/gi, "'");

  // 7. Heal legacy corrupted '??' or '? ' icons from legacy non-utf8mb4 database columns
  if (cleaned.includes('Moonbug Kids') && (cleaned.includes('??') || cleaned.startsWith('? ') || cleaned.endsWith(' ??') || cleaned.endsWith(' ?'))) {
    cleaned = cleaned
      .replace(/\?\?/g, '🎵')
      .replace(/^\?\s*/, '🎵 ')
      .replace(/\s*\?$/, ' 🌟🎶');
  }
  // Replace standalone ?? around emojis
  cleaned = cleaned.replace(/(^|\s)\?\?(\s|$)/g, '$1🎵$2');

  // 8. Collapse whitespace and trim
  return cleaned.replace(/\s+/g, ' ').trim();
}

export const MediaCard = ({
  title,
  image,
  previewGif,
  subtitle,
  description,
  badge,
  badgeColor = 'orange',
  isFree,
  rating,
  duration,
  year,
  progress,
  infoLabel,
  onClick,
  className,
  variant = 'portrait',
  trailerUrl,
  isComingSoon = false,
}: MediaCardProps) => {
  const [isHovered, setIsHovered] = useState(false);

  const badgeColors = {
    blue: 'bg-primary shadow-[0_0_12px_rgba(50,153,255,0.5)] border-primary/40',
    green: 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)] border-emerald-400/40',
    orange: 'bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.5)] border-amber-400/40',
    purple: 'bg-brand-gradient shadow-[0_0_12px_rgba(146,72,255,0.5)] border-purple-400/40',
  };

  const isPortrait = variant === 'portrait';
  const videoType = trailerUrl ? getVideoType(trailerUrl) : 'unknown';

  const embedUrl = (trailerUrl && videoType === 'youtube')
    ? (() => {
        const videoId = getYouTubeVideoId(trailerUrl);
        return videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&controls=0&rel=0&modestbranding=1&showinfo=0&iv_load_policy=3` : null;
      })()
    : null;

  const cleanDescription = stripHtml(description);

  // ---------------------------------------------------------------
  // 1. PORTRAIT VARIANT: Modern Seamless Poster Card
  // ---------------------------------------------------------------
  if (isPortrait) {
    return (
      <div
        className="relative group isolate select-none h-full"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Ambient Neon Glow Layer on Hover */}
        <div className="absolute -inset-1 bg-gradient-to-r from-[#b28cff]/35 via-pink-500/25 to-cyan-500/35 rounded-[1.8rem] opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 z-0 pointer-events-none" />

        {/* Seamless Poster Container */}
        <div
          className={cn(
            "relative z-10 w-full aspect-[2/3] rounded-2xl overflow-hidden bg-[#120a1c] border border-white/10 group-hover:border-purple-400/50 transition-all duration-500 shadow-2xl flex flex-col justify-end group-hover:-translate-y-2",
            className
          )}
          onClick={onClick}
        >
          {/* Edge-to-edge Poster Image */}
          <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-105">
            <Image
              src={image || "https://picsum.photos/seed/media/600/900"}
              alt={title}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Dynamic Video Trailer / Preview on Hover */}
          {(previewGif || embedUrl || (trailerUrl && videoType === 'native')) && isHovered && (
            <div className="absolute inset-0 z-10 transition-opacity duration-500">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  className="w-full h-full object-cover scale-[1.3] pointer-events-none"
                  allow="autoplay; encrypted-media"
                  frameBorder="0"
                />
              ) : videoType === 'native' ? (
                <video
                  src={trailerUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="w-full h-full object-cover"
                />
              ) : previewGif ? (
                <Image
                  src={previewGif}
                  alt={`${title} preview`}
                  fill
                  className="object-cover scale-105"
                  unoptimized
                />
              ) : null}
            </div>
          )}

          {/* Multi-layered Cinematic Gradients */}
          <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/80 via-black/30 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-x-0 bottom-0 h-[65%] bg-gradient-to-t from-[#090513] via-[#090513]/85 to-transparent z-20 pointer-events-none" />
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300 z-10 pointer-events-none" />

          {/* Top Badges Bar */}
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-30 pointer-events-none gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              {isComingSoon ? (
                <span className="text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white tracking-widest bg-gradient-to-r from-amber-500 to-rose-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] animate-pulse">
                  Coming Soon
                </span>
              ) : badge ? (
                <span className={cn(
                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white tracking-wider backdrop-blur-md border",
                  badgeColors[badgeColor] || "bg-primary shadow-[0_0_12px_rgba(50,153,255,0.5)] border-primary/40"
                )}>
                  {badge}
                </span>
              ) : isFree !== undefined ? (
                <span className={cn(
                  "text-[10px] font-black uppercase px-2.5 py-1 rounded-full text-white tracking-wider backdrop-blur-md shadow-lg border",
                  isFree 
                    ? "bg-emerald-600 shadow-[0_0_12px_rgba(16,185,129,0.5)] border-emerald-400/40" 
                    : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_12px_rgba(245,158,11,0.6)] border-amber-400/40"
                )}>
                  {isFree ? 'FREE' : 'PAID'}
                </span>
              ) : null}
            </div>

            {rating && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md border border-white/15 px-2.5 py-1 rounded-full text-[11px] font-black text-amber-300 shadow-lg ml-auto">
                <Star size={11} className="fill-amber-400 text-amber-400" />
                <span>{rating}</span>
              </div>
            )}
          </div>

          {/* Hover Play Button (Quick Action) */}
          <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-90 group-hover:scale-100">
            <div className="w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-brand-gradient text-white flex items-center justify-center shadow-[0_0_30px_rgba(178,140,255,0.7)] group-hover:scale-105 transition-transform duration-300 border border-white/30">
              <Play size={22} className="fill-white translate-x-0.5" />
            </div>
          </div>

          {/* Bottom Content Overlay (Single Clean Info Row) */}
          <div className="relative z-30 p-4 sm:p-5 flex flex-col gap-1.5 pointer-events-none">
            {subtitle && (
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#b28cff] line-clamp-1 drop-shadow-sm">
                {subtitle}
              </span>
            )}

            <h3 className="text-white font-black text-base sm:text-lg leading-tight line-clamp-1 group-hover:text-white transition-colors drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              {title}
            </h3>

            {/* Clean Single Metadata Row (NO duplicate year) */}
            <div className="flex items-center gap-2 text-[11px] text-white/80 font-bold flex-wrap pt-0.5">
              {year && <span>{year}</span>}
              {year && duration && <span className="w-1 h-1 rounded-full bg-white/40" />}
              {duration && (
                <span className="flex items-center gap-1 text-white/70">
                  <Clock size={11} className="text-[#b28cff]" />
                  {duration}
                </span>
              )}
              {((year || duration) && (infoLabel || true)) && <span className="w-1 h-1 rounded-full bg-white/40" />}
              <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[9px] font-black uppercase text-white/90 tracking-wider">
                {infoLabel || 'MOVIE'}
              </span>
              <span className="px-1.5 py-0.5 rounded bg-cyan-500/20 border border-cyan-400/30 text-[9px] font-black uppercase text-cyan-300 tracking-wider">
                4K UHD
              </span>
            </div>

            {/* Description expander on hover (desktop only) */}
            {cleanDescription && (
              <div className="hidden sm:block overflow-hidden transition-all duration-300 max-h-0 group-hover:max-h-16 group-hover:mt-1">
                <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed font-medium">
                  {cleanDescription}
                </p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {progress !== undefined && progress > 0 && (
            <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 z-40 overflow-hidden">
              <div
                className="h-full bg-brand-gradient shadow-[0_0_10px_rgba(168,85,247,0.8)]"
                style={{ width: `${progress}%` }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------
  // 2. LANDSCAPE VARIANT: Modern 16:9 Card (Episodes / Widescreen)
  // ---------------------------------------------------------------
  return (
    <div
      className="relative group isolate select-none h-full"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-0.5 bg-brand-gradient rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur z-0" />

      {/* Main Landscape Container */}
      <div
        className={cn(
          "relative z-10 flex flex-col h-full rounded-2xl overflow-hidden bg-[#160e22] border border-white/10 group-hover:border-purple-400/40 transition-all duration-300 shadow-xl group-hover:-translate-y-1.5",
          className
        )}
        onClick={onClick}
      >
        {/* 16:9 Image / Preview */}
        <div className="relative w-full aspect-[16/9] overflow-hidden">
          <div className={cn(
            "absolute inset-0 transition-opacity duration-500",
            isHovered && (previewGif || embedUrl || videoType === 'native') ? "opacity-0" : "opacity-100"
          )}>
            <Image
              src={image || "https://picsum.photos/seed/media/600/900"}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              unoptimized
            />
          </div>

          {/* Video Preview */}
          {(previewGif || embedUrl || (trailerUrl && videoType === 'native')) && (
            <div className={cn(
              "absolute inset-0 transition-opacity duration-500 z-10",
              isHovered ? "opacity-100" : "opacity-0"
            )}>
              {isHovered && (
                <>
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      className="w-full h-full object-cover scale-[1.3] pointer-events-none"
                      allow="autoplay; encrypted-media"
                      frameBorder="0"
                    />
                  ) : videoType === 'native' ? (
                    <video
                      src={trailerUrl}
                      autoPlay
                      muted
                      loop
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  ) : previewGif ? (
                    <Image
                      src={previewGif}
                      alt={`${title} preview`}
                      fill
                      className="object-cover scale-105"
                      unoptimized
                    />
                  ) : null}
                </>
              )}
            </div>
          )}

          {/* Subtle overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 z-20" />

          {/* Top Badges */}
          <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between z-30 flex-wrap gap-1">
            <div className="flex items-center gap-1.5">
              {isComingSoon ? (
                <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white tracking-widest bg-gradient-to-r from-amber-500 to-rose-600 shadow-[0_0_10px_rgba(245,158,11,0.6)] animate-pulse">
                  Coming Soon
                </span>
              ) : badge ? (
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white tracking-wider backdrop-blur-md border",
                  badgeColors[badgeColor] || "bg-primary shadow-[0_0_12px_rgba(50,153,255,0.5)] border-primary/40"
                )}>
                  {badge}
                </span>
              ) : isFree !== undefined ? (
                <span className={cn(
                  "text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white tracking-wider backdrop-blur-md border",
                  isFree 
                    ? "bg-emerald-600 shadow-[0_0_10px_rgba(16,185,129,0.5)] border-emerald-400/40" 
                    : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_10px_rgba(245,158,11,0.6)] border-amber-400/40"
                )}>
                  {isFree ? 'FREE' : 'PAID'}
                </span>
              ) : null}
            </div>

            {rating && (
              <div className="flex items-center gap-1 bg-black/70 backdrop-blur-md px-2 py-0.5 rounded-full text-[10px] font-black text-amber-300 border border-white/15 ml-auto">
                <Star size={10} className="fill-amber-400 text-amber-400" />
                {rating}
              </div>
            )}
          </div>

          {/* Hover Play Button */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-30">
            <div className="w-11 h-11 rounded-full bg-brand-gradient flex items-center justify-center text-white shadow-[0_0_20px_rgba(146,72,255,0.7)] group-hover:scale-105 transition-transform duration-300 border border-white/20">
              <Play size={18} fill="white" className="ml-0.5" />
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-3.5 flex flex-col flex-grow bg-[#160e22] gap-1.5">
          {subtitle && (
            <span className="text-[10px] text-[#b28cff] font-extrabold uppercase tracking-widest line-clamp-1">
              {subtitle}
            </span>
          )}

          <h3 className="text-white font-black text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-primary transition-colors">
            {title}
          </h3>

          {cleanDescription && (
            <p className="text-[11px] text-white/50 line-clamp-2 leading-relaxed">
              {cleanDescription}
            </p>
          )}

          {/* Single clean metadata row (NO DUPLICATE YEAR) */}
          {(duration || year || infoLabel) && (
            <div className="mt-auto pt-2 flex items-center gap-2.5 border-t border-white/5 text-[10px] text-white/60 font-bold">
              {year && <span>{year}</span>}
              {year && duration && <span className="w-1 h-1 rounded-full bg-white/30" />}
              {duration && (
                <span className="flex items-center gap-1 text-white/70">
                  <Clock size={11} className="text-[#b28cff]" />
                  {duration}
                </span>
              )}
              {((year || duration) && infoLabel) && <span className="w-1 h-1 rounded-full bg-white/30" />}
              {infoLabel && (
                <span className="px-1.5 py-0.5 rounded bg-white/10 border border-white/15 text-[9px] font-black uppercase text-white/80">
                  {infoLabel}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Progress bar */}
        {progress !== undefined && progress > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/5 z-40 overflow-hidden">
            <div
              className="h-full bg-brand-gradient shadow-[0_0_10px_rgba(168,85,247,0.8)]"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
      </div>
    </div>
  );
};
