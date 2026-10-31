'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Play, Layers, Film, Maximize2 } from 'lucide-react';
import { Episode, getEpisodeById, incrementEpisodeView } from '@/lib/vtagu.api';
import { getUserId } from '@/lib/api-client';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';
import WatchNowButton from '@/components/ui/WatchNowButton';
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

interface EpisodeDetailContentProps {
  episode: Episode;
  iframeSrc: string | null;
}

export default function EpisodeDetailContent({ episode: initialEpisode, iframeSrc: initialIframeSrc }: EpisodeDetailContentProps) {
  const [episode, setEpisode] = useState<Episode>(initialEpisode);
  const [iframeSrc, setIframeSrc] = useState<string | null>(initialIframeSrc);
  const [playerOpen, setPlayerOpen] = useState(false);

  useEffect(() => {
    setEpisode(initialEpisode);
    setIframeSrc(initialIframeSrc);
  }, [initialEpisode, initialIframeSrc]);

  useEffect(() => {
    const epId = episode.id || episode.episodeId;
    if (epId) {
      incrementEpisodeView(epId);
    }
  }, [episode.id, episode.episodeId]);

  // Client-side re-verification for logged-in & subscribed users
  useEffect(() => {
    if (!initialIframeSrc && !episode.isFree) {
      const userId = getUserId();
      const epSlug = episode.slug || (episode.id || episode.episodeId)?.toString();
      if (userId && epSlug) {
        getEpisodeById(epSlug, userId).then((freshEp) => {
          if (freshEp) {
            setEpisode(freshEp);
            const freshUrl = freshEp.media?.video?.url || freshEp.url;
            if (freshUrl && typeof freshUrl === 'string' && freshUrl.trim() !== '') {
              setIframeSrc(freshUrl);
            }
          }
        }).catch(() => {});
      }
    }
  }, [initialIframeSrc, episode.isFree, episode.slug, episode.id, episode.episodeId]);

  const epImage = episode.media?.poster_image?.url || episode.image;
  const hasAccess = episode.isFree || (iframeSrc && iframeSrc.trim() !== '');
  const isLocked = !hasAccess;
  const displayIframeSrc = isLocked ? null : iframeSrc;
 
  return (
    <>
      {displayIframeSrc && (
        <VideoPlayerModal
          isOpen={playerOpen}
          onClose={() => setPlayerOpen(false)}
          videoUrl={displayIframeSrc}
          title={episode.title}
          contentId={(episode.id || episode.episodeId || "").toString()}
          contentType="episode"
          subtitles={(episode as any).subtitles || (episode as any).media?.video?.subtitles}
          audioTracks={(episode as any).audioTracks || (episode as any).audio_tracks}
        />
      )}

      <section className="py-8 sm:py-14 md:py-20 tv-container px-3 sm:px-6 md:px-12 lg:px-20">
        <div className="skeuo-surface-high p-4 sm:p-8 lg:p-16 rounded-[1.5rem] sm:rounded-[2rem] relative overflow-visible space-y-6 sm:space-y-12">

          {/* ── Inline Preview Player (Matching VideoPlayer UI) ── */}
          {displayIframeSrc && (
            <div id="episode-player" className="relative w-full aspect-video rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.9)] ring-1 ring-white/10 bg-black">
              <WatchTrackingVideoPlayer
                src={displayIframeSrc}
                title={episode.title}
                metadata={`Season ${(episode as any).seasonNumber || (episode as any).season_number || 1} • Episode ${episode.episode_number || (episode as any).episodeNumber || 1}`}
                contentId={(episode.id || episode.episodeId || "").toString()}
                contentType="episode"
                autoPlay={false}
                showControls={true}
                showMinimize={false}
                onFullscreenRequest={() => setPlayerOpen(true)}
                subtitles={(episode as any).subtitles || (episode as any).media?.video?.subtitles}
                audioTracks={(episode as any).audioTracks || (episode as any).audio_tracks}
                className="w-full h-full"
              />
            </div>
          )}

          {/* ── Episode Info ── */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-12">

            {/* Poster */}
            <div className="relative w-full lg:w-[330px] flex-shrink-0 aspect-[16/9] sm:aspect-[4/3] rounded-[1.2rem] sm:rounded-[2rem] overflow-hidden skeuo-glass-specular shadow-[0_30px_60px_rgba(0,0,0,0.8)]">
              <Image
                src={episode.media?.card_image?.url || "https://images.unsplash.com/photo-1542281286-9e0a16bb7366?auto=format&fit=crop&q=80&w=800"}
                alt={episode.title}
                fill
                className="object-cover"
                unoptimized
              />
              {/* <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /> */}
            </div>

            {/* Metadata */}
            <div className="flex-1 flex flex-col justify-center gap-4 sm:gap-6">

              {/* Season Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-cyan-400/10 border border-cyan-400/30 text-cyan-400 text-xs font-black tracking-[0.2em] uppercase w-fit">
                <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,1)] animate-pulse" />
                Season {episode.season_id || episode.seasonId}
              </div>

              {/* Title */}
              <h1 className="text-2xl sm:text-3xl md:text-5xl font-black text-white italic uppercase tracking-tighter skeuo-title-3d leading-tight">
                {episode.title}
              </h1>

              {/* Meta Chips */}
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Layers size={14} className="text-cyan-400" />
                  Episode #{episode.episode_number || episode.id || episode.episodeId}
                </div>
                <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                  <Film size={14} className="text-cyan-400" />
                  Season {episode.season_id || episode.seasonId}
                </div>
                {episode.duration && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-cyan-400 text-[10px] font-black">MIN</span>
                    {episode.duration}
                  </div>
                )}
                {episode.rating && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10 text-yellow-400">
                    ★ {episode.rating}
                  </div>
                )}
                {(episode as any).certificate?.code && (
                  <div 
                    style={
                      (episode as any).certificate?.badge_color 
                        ? { 
                            borderColor: `${(episode as any).certificate.badge_color}50`, 
                            backgroundColor: `${(episode as any).certificate.badge_color}20`,
                            color: (episode as any).certificate.badge_color || '#fff'
                          } 
                        : undefined
                    }
                    className="flex items-center gap-1.5 text-[11px] font-black uppercase tracking-widest text-amber-400 bg-amber-400/10 px-3 py-2 rounded-xl border border-amber-400/30"
                  >
                    <span>{(episode as any).certificate.code}</span>
                    {Boolean((episode as any).certificate?.certification_system) && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-white/10 text-white/90 rounded font-bold">
                        {(episode as any).certificate.certification_system}
                      </span>
                    )}
                  </div>
                )}
                {Boolean((episode as any).quality || (episode as any).video_quality || (episode as any).play_quality) && (
                  <div className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white/60 bg-white/5 px-3 py-2 rounded-xl border border-white/10">
                    <span className="text-primary text-[10px] font-black">PLAY</span>
                    {(episode as any).quality || (episode as any).video_quality || (episode as any).play_quality}
                  </div>
                )}
              </div>

              {/* Description */}
              <div 
                className="text-base md:text-lg text-white/60 leading-relaxed max-w-[90%] font-medium [&_p]:inline [&_p]:m-0 [&_p]:p-0"
                dangerouslySetInnerHTML={{ __html: episode.longDescription || episode.shortDescription || "An unmissable episode in the series. Dive into the latest chapter of this gripping story — exclusive premium content delivered in stunning high definition." }}
              />

              {/* CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-2">
                {displayIframeSrc ? (
                  <button
                    onClick={() => setPlayerOpen(true)}
                    className="bg-primary text-black h-11 sm:h-14 px-5 sm:px-8 rounded-full sm:rounded-2xl text-xs sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 hover:bg-primary/90 hover:shadow-[0_0_25px_rgba(50,153,255,0.4)] transition-all duration-300 group relative overflow-hidden active:scale-95 shadow-xl cursor-pointer"
                  >
                    <Play size={18} fill="black" className="group-hover:scale-110 transition-transform relative z-10 shrink-0" />
                    <span className="relative z-10 font-bold tracking-wider whitespace-nowrap">Watch Fullscreen</span>
                  </button>
                ) : (
                  <WatchNowButton
                    url={displayIframeSrc}
                    title={episode.title}
                    contentId={(episode.id || episode.episodeId || "").toString()}
                    contentType="episode"
                    internal={true}
                    subtitles={(episode as any).subtitles || (episode as any).media?.video?.subtitles}
                    audioTracks={(episode as any).audioTracks || (episode as any).audio_tracks}
                  />
                )}
                {episode.media?.trailer?.url && (
                  <button
                    onClick={() => {
                       window.open(episode.media?.trailer?.url, "_blank");
                    }}
                    className="h-11 sm:h-14 px-5 sm:px-8 rounded-full sm:rounded-2xl text-xs sm:text-base font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 bg-white/10 text-white hover:bg-white/20 transition-all border border-white/10 active:scale-95 shrink-0 cursor-pointer"
                  >
                    <Play size={16} className="shrink-0" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>

        </div>
      </section>
    </>
  );
}
