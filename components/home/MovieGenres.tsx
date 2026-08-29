'use client';

import React from 'react';
import { LayoutGrid, ArrowLeft, ArrowRight } from 'lucide-react';
import SectionTitle from './SectionTitle';
import { GenreCard } from '../shared/GenreCard';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay, FreeMode } from 'swiper/modules';
import { Genre } from '@/lib/vtagu.api';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/free-mode';

interface MovieGenresProps {
    genres: Genre[];
}

const IMAGE_BASE_URL = "https://www.vtagu.in/";

// Special glow colors for different genres
const GENRE_COLORS: Record<string, string> = {
    "Action": "rgba(239, 68, 68, 0.4)", // Red
    "Comedy": "rgba(234, 179, 8, 0.4)",  // Yellow
    "Drama": "rgba(59, 130, 246, 0.4)",   // Blue
    "Romance": "rgba(236, 72, 153, 0.4)", // Pink
    "Horror": "rgba(168, 85, 247, 0.4)",  // Purple
    "Sci-Fi": "rgba(34, 211, 238, 0.4)",  // Cyan
    "Thriller": "rgba(249, 115, 22, 0.4)", // Orange
};

export default function MovieGenres({ genres = [] }: MovieGenresProps) {
    return null; // Section fully hidden as requested
}