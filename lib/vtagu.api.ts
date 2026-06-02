const API_BASE = process.env.NEXT_PUBLIC_API_URL;

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  try {
    const res = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
    
    if (!res.ok && retries > 0) {
        return fetchWithRetry(url, options, retries - 1);
    }
    
    return res;
  } catch (err: any) {
    if (retries > 0) {
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export interface Genre {
  genre_id: number;
  name?: string;
  genre_name?: string;
  in_home: string;
  path: string;
}

export async function getGenres(): Promise<Genre[]> {
  const url = `${API_BASE}/genres`;
  
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Failed to fetch genres. Status: ${res.status}`);
    }

    const result = await res.json();
    const genres = result.data || [];
    return genres;
  } catch (err: any) {
    return [];
  }
}

export interface Poster {
  poster_id: number;
  path: string;
  link: string;
  status: string;
  createdon: string;
}

export async function getPosters(): Promise<Poster[]> {
  const url = `${API_BASE}/posters`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
        throw new Error(`Failed to fetch posters. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    return [];
  }
}

export interface Series {
  series_id: number;
  title: string;
  description_short: string;
  description_long: string;
  genre_id: number;
  age_group: number;
  actors: string;
  director: number;
  year: number;
  country_id: number;
  rating: number;
  featured: number;
}

export async function getSeries(): Promise<Series[]> {
  const url = `${API_BASE}/series`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch series. Status: ${res.status}`);
    }
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (err: any) {
    return [];
  }
}

export interface InteractiveMovie {
  interactive_movie_id: number;
  title: string;
  description: string;
  banner_image?: string;
  card_image?: string;
  trailer_video_url?: string;
  languages?: string;
  created_at: string;
}

export interface Scene {
  scene_id: number;
  movie_id: number;
  title: string;
  scene_text?: string;
  scene_url: string;
  poster_url?: string;
  show_choices_on: number;
  is_start: boolean;
  is_ending: boolean;
  choices?: Choice[];
}

export interface Choice {
  choice_id: number;
  scene_id: number;
  target_scene: number;
  next_scene_id?: number; // from example
  button_text: string;
  choice_text?: string; // from example
  position_x: number;
  position_y: number;
}

export async function getInteractiveMovies(): Promise<InteractiveMovie[]> {
  const url = `${API_BASE}/interactive-movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });    
    if (!res.ok) {
      throw new Error(`Failed to fetch interactive movies. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    return [];
  }
}

export async function getScenes(movieId: number): Promise<Scene[]> {
  const url = `${API_BASE}/scenes?id=${movieId}`;
  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch scenes. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || result;
  } catch (err: any) {
    return [];
  }
}

export async function getChoices(sceneId: number): Promise<Choice[]> {
  const url = `${API_BASE}/choices?scene_id=${sceneId}`;
  try {
    const res = await fetchWithRetry(url);
    if (!res.ok) {
      throw new Error(`Failed to fetch choices. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || result;
  } catch (err: any) {
    return [];
  }
}

export interface Episode {
  id: number;
  season_id: number;
  episode_number: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  duration: string;
  languages: string;
  rating: number;
  isFeatured: boolean;
  isFree: boolean;
  viewCount: number;
  media?: {
    poster_image?: { url: string; alt?: string };
    image?: { url: string; alt?: string };
    card_image?: { url: string; alt?: string };
    video?: { url: string; alt?: string };
    trailer?: { url: string; alt?: string };
  };
  createdAt?: string;
  updatedAt?: string;

  // Fallback fields for transition period
  episodeId?: number;
  seasonId?: number;
  url?: string;
  image?: number | string | null;
}

export function normalizeEpisode(episode: any): Episode {
  if (!episode) return episode;
  return {
    ...episode,
    shortDescription: cleanHtmlString(episode.shortDescription || ""),
    longDescription: cleanHtmlString(episode.longDescription || ""),
    // Provide backwards compatible fields just in case
    episodeId: episode.id || episode.episodeId,
    seasonId: episode.season_id || episode.seasonId,
    url: episode.media?.video?.url || episode.url || "",
    image: episode.media?.poster_image?.url || episode.media?.image?.url || episode.image || null,
  };
}

export async function getEpisodes(): Promise<Episode[]> {
  const url = `${API_BASE}/episodes`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch episodes. Status: ${res.status}`);
    }
    const result = await res.json();
    const data = Array.isArray(result) ? result : (result.data || []);
    return data.map(normalizeEpisode);
  } catch (err: any) {
    return [];
  }
}

export async function getEpisodeById(id: string | number): Promise<Episode | null> {
  const url = `${API_BASE}/episodes/${id}`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch episode. Status: ${res.status}`);
    }
    const result = await res.json();
    return normalizeEpisode(result.data || result);
  } catch (err: any) {
    return null;
  }
}

export interface Movie {
  id: number;
  title: string;
  slug: string;
  shortDescription: string;
  longDescription: string;
  releaseYear: number;
  countryId: number;
  rating: number;
  genreId: number;
  ageGroup: number;
  actors: string;
  director: string;
  isFeatured: boolean;
  isFree: boolean;
  movieType: number;
  contentType: number;
  ageRestriction: string;
  kidsRestriction: boolean;
  videoUrl: string;
  trailerUrl: string;
  trailerAlt: string;
  posterImage: string;
  posterAlt: string;
  duration: string;
  languages: string;
  viewCount: number;
  isInteractive: boolean;
  interactiveMap: any;
  createdAt: string;
  updatedAt: string;
  media?: {
    image?: {
      url: string;
      alt?: string;
    };
    card_image?: {
      url: string;
      alt?: string;
    };
    video?: {
      url: string;
      alt?: string;
    };
    trailer?: {
      url: string;
      alt?: string;
    };
  };
}

export function cleanHtmlString(htmlStr: string): string {
  if (!htmlStr) return '';

  let cleaned = htmlStr;

  // 1. Remove CodeMirror syntax highlighting spans or any span tags, but KEEP their inner content
  // E.g., <span class="ͼ1a">p</span> -> p
  cleaned = cleaned.replace(/<span[^>]*>(.*?)<\/span>/gi, '$1');

  // 2. Decode HTML entities
  cleaned = cleaned
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ');

  return cleaned.trim();
}

export function normalizeMovie(movie: any): Movie {
  if (!movie) return movie;
  return {
    ...movie,
    id: movie.id || movie.movie_id || movie.movieId,
    shortDescription: cleanHtmlString(movie.shortDescription || ""),
    longDescription: cleanHtmlString(movie.longDescription || ""),
    posterImage: movie.media?.card_image?.url || movie.media?.image?.url || movie.posterImage || "",
    videoUrl: movie.media?.video?.url || movie.videoUrl || "",
    trailerUrl: movie.media?.trailer?.url || movie.trailerUrl || "",
    posterAlt: movie.media?.card_image?.alt || movie.media?.image?.alt || movie.posterAlt || "",
    trailerAlt: movie.media?.trailer?.alt || movie.trailerAlt || "",
  };
}

export async function getMovies(): Promise<Movie[]> {
  const url = `${API_BASE}/movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch movies. Status: ${res.status}`);
    }
    const result = await res.json();
    const data = result.data || [];
    return data.map(normalizeMovie);
  } catch (err: any) {
    return [];
  }
}

export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  const url = `${API_BASE}/movies/${slug}`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
        if (res.status === 404) return null;
      throw new Error(`Failed to fetch movie detail. Status: ${res.status}`);
    }
    const result = await res.json();
    return normalizeMovie(result.data || result);
  } catch (err: any) {
    return null;
  }
}

// ----------------------------------------------------
// New Endpoints: Trending, Admin CRUD for Movies
// ----------------------------------------------------

export async function getTrendingMovies(limit: number = 10): Promise<Movie[]> {
  const url = `${API_BASE}/movies/trending?limit=${limit}`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch trending movies. Status: ${res.status}`);
    }
    const result = await res.json();
    const data = result.data || [];
    return data.map(normalizeMovie);
  } catch (err: any) {
    return [];
  }
}

export async function createMovie(data: any): Promise<any> {
  const url = `${API_BASE}/movies`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

export async function updateMovie(id: number, data: any): Promise<any> {
  const url = `${API_BASE}/movies/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

export async function deleteMovie(id: number): Promise<any> {
  const url = `${API_BASE}/movies/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

// ----------------------------------------------------
// New Endpoints: Admin CRUD for Episodes
// ----------------------------------------------------

export async function createEpisode(data: any): Promise<any> {
  const url = `${API_BASE}/episodes`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

export async function updateEpisode(id: number, data: any): Promise<any> {
  const url = `${API_BASE}/episodes/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

export async function deleteEpisode(id: number): Promise<any> {
  const url = `${API_BASE}/episodes/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'DELETE',
      headers: {
        ...(token ? { 'Authorization': `Bearer ${token}` } : {})
      }
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

// ----------------------------------------------------
// Plans Endpoints
// ----------------------------------------------------

export interface Plan {
  planId: number;
  name: string;
  screens: string;
  quality: string;
  compatibility: number;
  unlimited: number;
  cancellation: number;
  price: string;
  discount: number;
  validity: string;
  status: number;
}

export async function getPlans(): Promise<Plan[]> {
  const url = `${API_BASE}/plans`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 3600 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch plans. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    return [];
  }
}

// ----------------------------------------------------
// Languages Endpoints
// ----------------------------------------------------

export interface Language {
  name: string;
  code: string;
  slug: string;
}

export interface LanguageMoviesResponse {
  language: string;
  movies: Movie[];
  Interactive: InteractiveMovie[];
  episodes: Episode[];
}

export async function getLanguages(): Promise<Language[]> {
  const url = `${API_BASE}/languages`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch active languages. Status: ${res.status}`);
    }
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (err: any) {
    console.error("Error fetching languages in API:", err);
    return [];
  }
}

export async function getMoviesByLanguage(slug: string): Promise<LanguageMoviesResponse> {
  const url = `${API_BASE}/languages/${slug}/movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch movies by language slug "${slug}". Status: ${res.status}`);
    }
    const result = await res.json();
    const data = result.data || {};
    return {
      language: data.language || '',
      movies: (data.movies || []).map(normalizeMovie),
      Interactive: data.Interactive || [],
      episodes: (data.episodes || []).map(normalizeEpisode),
    };
  } catch (err: any) {
    console.error(`Error fetching movies by language ${slug} in API:`, err);
    return { language: '', movies: [], Interactive: [], episodes: [] };
  }
}

