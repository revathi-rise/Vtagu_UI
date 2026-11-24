import React from 'react';
import { getMovieBySlug, getMovies } from '@/lib/vtagu.api';
import { notFound } from 'next/navigation';
import MovieDetailsClient from '@/components/movie/MovieDetailsClient';
import { cookies } from 'next/headers';

interface MovieDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  try {
    const { slug } = await params;
    const movie = await getMovieBySlug(slug);
    
    if (!movie || !movie.id) return { title: 'Movie Not Found - PrimeTime' };

    return {
      title: `${movie.title || 'Movie'} - PrimeTime`,
      description: movie.shortDescription || '',
    };
  } catch (e) {
    return { title: 'Movie Details - PrimeTime' };
  }
}

export async function generateStaticParams() {
  try {
    const movies = await getMovies();
    if (!Array.isArray(movies)) return [];
    return movies
      .filter((movie) => movie && movie.slug)
      .map((movie) => ({
        slug: movie.slug,
      }));
  } catch (error) {
    return [];
  }
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { slug } = await params;
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value || null;
  const movie = await getMovieBySlug(slug, userId);

  if (!movie || !movie.id) {
    notFound();
  }

  return (
    <MovieDetailsClient movie={movie} initialUserId={userId} />
  );
}
