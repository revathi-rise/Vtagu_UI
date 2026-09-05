import React from 'react';
import { notFound } from 'next/navigation';
import MovieDetailsClient from '@/components/movie/MovieDetailsClient';
import { getMovieBySlug } from '@/lib/vtagu.api';
import { cookies } from 'next/headers';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    const title = slug
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
      
    return {
      title: `${title} | Movie | PrimeTime`,
      description: `Watch the movie ${title} in 4K HDR only on PrimeTime.`,
    };
  }

  return {
    title: `${movie.title} | Movie | PrimeTime`,
    description: movie.shortDescription || `Watch the movie ${movie.title} in 4K HDR only on PrimeTime.`,
  };
}

export default async function MovieDetailsPage({ params }: PageProps) {
  const { slug } = await params;
  
  const cookieStore = await cookies();
  const userId = cookieStore.get('userId')?.value || null;
  const movie = await getMovieBySlug(slug, userId);

  if (!movie) {
    notFound();
  }

  return (
    <MovieDetailsClient movie={movie} initialUserId={userId} />
  );
}
