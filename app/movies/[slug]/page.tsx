import React from 'react';
import { getMovieBySlug, getMovies } from '@/lib/vtagu.api';
import { notFound } from 'next/navigation';
import MovieDetailsClient from '@/components/movie/MovieDetailsClient';

interface MovieDetailsPageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: MovieDetailsPageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);
  console.log(movie, "movie");
  
  if (!movie) return { title: 'Movie Not Found' };

  return {
    title: `${movie.title} - PrimeTime`,
    description: movie.shortDescription,
  };
}

export async function generateStaticParams() {
  const movies = await getMovies();
  return movies.map((movie) => ({
    slug: movie.slug,
  }));
}

export default async function MovieDetailsPage({ params }: MovieDetailsPageProps) {
  const { slug } = await params;
  const movie = await getMovieBySlug(slug);

  if (!movie) {
    notFound();
  }

  return <MovieDetailsClient movie={movie} />;
}
