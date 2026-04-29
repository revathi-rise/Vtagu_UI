'use client';

import React from 'react';
import { Film, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { MediaCard } from '../shared/MediaCard';
import { Episode } from '@/lib/vtagu.api';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import Link from 'next/link';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

interface EpisodicVanguardProps {
  episodes: Episode[];
}

const mockGifs = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lTjJp9m8vG6P6M/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l2SpUNVz1o6n2fM-A/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/3o7TKMGpxP5O5rG1_K/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExOHYyNnd6b3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6Z3B6JmVwPXYxX2ludGVybmFsX2dpZl9ieV9pZCZjdD1n/l41lMvTqO9B3o0O9a/giphy.gif"
];

export default function EpisodicVanguard({ episodes }: EpisodicVanguardProps) {
  if (!episodes || episodes.length === 0) {
    return null;
  }

  return (
    <section className="w-full py-10 sm:py-16 overflow-hidden">
      <div className="max-w-[90%] mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-10 px-4">
          <SectionTitle
            title="FEATURED "
            subtitle="Premium Collection"
            Icon={Film}
            gradientText="EPISODES"
            viewAllHref="#"
          />
        </div>

        {/* Carousel Container */}
        <div className="relative group/slider -mx-4 sm:mx-0">
          <Swiper
            modules={[Navigation, Autoplay, FreeMode]}
            spaceBetween={16}
            slidesPerView={1.5}
            freeMode={true}
            navigation={{
              prevEl: '.episodic-prev',
              nextEl: '.episodic-next',
            }}
            breakpoints={{
              480: { slidesPerView: 2.2, spaceBetween: 20 },
              640: { slidesPerView: 2.5, spaceBetween: 24 },
              1024: { slidesPerView: 3.5, spaceBetween: 28 },
              1440: { slidesPerView: 4, spaceBetween: 24 },
            }}
            className="!px-4"
          >
            {episodes.map((episode, index) => (
              <SwiperSlide key={episode.episodeId} className="!overflow-visible">
                <Link
                  href={`/episodes/${slugify(episode.title)}`}
                  className="block"
                >
                  <MediaCard
                    variant="landscape"
                    title={episode.title}
                    image={`https://picsum.photos/seed/${episode.episodeId + 100}/800/450`}
                    previewGif={mockGifs[index % mockGifs.length]}
                    subtitle={`S${episode.seasonId} • EPISODE`}
                    description={`Watch the latest episode of ${episode.title}. Experience premium episodic storytelling at its best.`}
                    badge="PREMIUM"
                    badgeColor="orange"
                    infoLabel="EPISODE" // Explicitly setting EPISODE label
                  />
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Navigation */}
          <button className="episodic-prev absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
            <ArrowLeft size={20} />
          </button>
          <button className="episodic-next absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-40 w-12 h-12 rounded-full glass-panel flex items-center justify-center text-white opacity-0 group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary shadow-2xl border border-white/10">
            <ArrowRight size={20} />
          </button>
        </div>
      </div>
    </section>
  );
}
