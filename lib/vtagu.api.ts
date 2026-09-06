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
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });

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
  poster_title?: string;
  description?: string;
  genres_list?: string;
  path: string;
  trailer_url?: string;
  link?: string;
  languages?: string;
  page_type?: string;
  reference_id?: number;
  reference_type?: string;
  status: string;
  is_coming_soon?: boolean;
  isComingSoon?: boolean;
  createdon?: string;
}

export async function getPosters(pageType?: string, language?: string, limit?: number): Promise<Poster[]> {
  const url = `${API_BASE}/posters`;
  const params = new URLSearchParams();
  if (pageType) {
    params.append('page_type', pageType);
  }
  if (language) {
    params.append('language', language);
  }
  if (limit) {
    params.append('limit', limit.toString());
  }

  const queryString = params.toString();
  const fullUrl = `${url}${queryString ? `?${queryString}` : ''}`;

  try {
    const res = await fetchWithRetry(fullUrl, { next: { revalidate: 0 } });
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
  is_coming_soon?: boolean;
  isComingSoon?: boolean;
}

export async function getSeries(): Promise<Series[]> {
  const url = `${API_BASE}/series`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
  is_free?: number;
  price?: number;
  currency?: string;
  is_coming_soon?: boolean | number;
  isComingSoon?: boolean;
}

export interface MovieAccessResponse {
  hasAccess: boolean;
  reason: 'free' | 'subscription' | 'single_purchase' | 'none';
  price: number;
  currency: string;
}

export async function checkMovieAccess(movieId: number, userId?: string | null): Promise<MovieAccessResponse> {
  const url = `${API_BASE}/interactive-movies/${movieId}/check-access${userId ? `?userId=${userId}` : ''}`;
  try {
    const res = await fetch(url, { cache: 'no-store' });
    if (!res.ok) {
      throw new Error(`Failed to check movie access. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || { hasAccess: false, reason: 'none', price: 0, currency: 'INR' };
  } catch (err: any) {
    console.error("Error checking movie access:", err);
    return { hasAccess: false, reason: 'none', price: 0, currency: 'INR' };
  }
}

export async function purchaseMovie(movieId: number, userId: string, txnId: string, paidAmount: number, currency: string): Promise<any> {
  const url = `${API_BASE}/interactive-movies/${movieId}/purchase`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId: Number(userId), txnId, paidAmount, currency }),
    });
    if (!res.ok) {
      throw new Error(`Failed to record movie purchase. Status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error("Error recording movie purchase:", err);
    throw err;
  }
}

export interface Scene {
  scene_id: number;
  movie_id: number;
  title: string;
  scene_text?: string;
  scene_url: string;
  poster_url?: string;
  show_choices_on?: string | number | null;
  is_start: boolean;
  is_ending: boolean;
  end_text?: string;
  choices?: Choice[];
  subtitles?: {
      language: string;
      label: string;
      url: string;
  }[];
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
  button_color?: string;
}

export async function getInteractiveMovies(): Promise<InteractiveMovie[]> {
  const url = `${API_BASE}/interactive-movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });    
    if (!res.ok) {
      throw new Error(`Failed to fetch interactive movies. Status: ${res.status}`);
    }
    const result = await res.json();
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
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
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
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
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
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
  isComingSoon?: boolean;
  is_coming_soon?: boolean;
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

const parseBool = (val: any): boolean => {
  if (val === 1 || val === '1' || val === true || val === 'true') return true;
  return false;
};

export function normalizeEpisode(episode: any): Episode {
  if (!episode) return episode;
  return {
    ...episode,
    shortDescription: cleanHtmlString(episode.shortDescription || ""),
    longDescription: cleanHtmlString(episode.longDescription || ""),
    isComingSoon: parseBool(episode.isComingSoon ?? episode.is_coming_soon),
    is_coming_soon: parseBool(episode.isComingSoon ?? episode.is_coming_soon),
    isFree: parseBool(episode.isFree ?? episode.free ?? episode.is_free),
    isFeatured: parseBool(episode.isFeatured ?? episode.featured ?? episode.is_featured),
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
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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

export async function getEpisodeById(id: string | number, userId?: string | null): Promise<Episode | null> {
  const url = `${API_BASE}/episodes/${encodeURIComponent(id)}${userId ? `?userId=${userId}` : ''}`;
  console.log(url);

  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
  isComingSoon?: boolean;
  is_coming_soon?: boolean;
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
    isComingSoon: parseBool(movie.isComingSoon ?? movie.is_coming_soon),
    is_coming_soon: parseBool(movie.isComingSoon ?? movie.is_coming_soon),
    isFree: parseBool(movie.isFree ?? movie.free ?? movie.is_free),
    isFeatured: parseBool(movie.isFeatured ?? movie.featured ?? movie.is_featured),
    posterImage: movie.media?.card_image?.url || movie.media?.image?.url || movie.posterImage || "",
    videoUrl: (movie.media && movie.media.video && typeof movie.media.video.url === 'string') 
      ? movie.media.video.url 
      : (movie.videoUrl || ""),
    trailerUrl: movie.media?.trailer?.url || movie.trailerUrl || "",
    posterAlt: movie.media?.card_image?.alt || movie.media?.image?.alt || movie.posterAlt || "",
    trailerAlt: movie.media?.trailer?.alt || movie.trailerAlt || "",
  };
}

export async function getMovies(): Promise<Movie[]> {
  const url = `${API_BASE}/movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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

export async function getMovieBySlug(slug: string, userId?: string | null): Promise<Movie | null> {
  const url = `${API_BASE}/movies/${encodeURIComponent(slug)}${userId ? `?userId=${userId}` : ''}`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
  isInteractiveIncluded?: number;
  is_interactive_included?: number;
  isStandardIncluded?: number;
  is_standard_included?: number;
}

export async function getPlans(): Promise<Plan[]> {
  const url = `${API_BASE}/plans`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
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
  console.log(url,"url");
  
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } });
    if (!res.ok) {
      if (res.status === 404) {
        return { 
          language: slug.charAt(0).toUpperCase() + slug.slice(1), 
          movies: [], 
          Interactive: [], 
          episodes: [] 
        };
      }
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

export interface WatchSessionResponse {
  status: boolean;
  message: string;
  limit?: number;
  activeCount?: number;
}

export async function pingWatchSession(
  userId: number | string,
  sessionId: string,
  contentId: number | string,
  contentType: string
): Promise<WatchSessionResponse> {
  const url = `${API_BASE}/watch-sessions/ping`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: Number(userId),
        sessionId,
        contentId: Number(contentId),
        contentType,
      }),
    });
    if (!res.ok) {
      throw new Error(`Failed to ping watch session. Status: ${res.status}`);
    }
    return await res.json();
  } catch (err: any) {
    console.error("Error pinging watch session:", err);
    return { status: true, message: 'Fallback to true on network error' };
  }
}

export async function exitWatchSession(sessionId: string): Promise<any> {
  const url = `${API_BASE}/watch-sessions/exit`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sessionId }),
    });
    return await res.json();
  } catch (err: any) {
    console.error("Error exiting watch session:", err);
    return { status: true };
  }
}

// ----------------------------------------------------
// Shorts (Vertical Video) Endpoints
// ----------------------------------------------------

export interface Short {
  id: number;
  title: string;
  slug: string;
  description: string;
  video_url: string;
  thumbnail_url: string;
  duration: string;
  languages: string;
  genre_id: number;
  is_free: boolean;
  is_featured: boolean;
  is_active: boolean;
  view_count: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Public: fetch active shorts — optional limit for home page teaser */
export async function getActiveShorts(limit?: number, userId?: string | null): Promise<Short[]> {
  const queryParts = [];
  if (limit) queryParts.push(`limit=${limit}`);
  if (userId) queryParts.push(`userId=${userId}`);
  const params = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  const url = `${API_BASE}/shorts/active${params}`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 0 } }); // No cache
    if (!res.ok) throw new Error(`Failed to fetch active shorts. Status: ${res.status}`);
    const result = await res.json();
    if (Array.isArray(result.data)) return result.data;
    if (Array.isArray(result)) return result;
    return [];
  } catch (err: any) {
    console.error('Error fetching active shorts:', err);
    return [];
  }
}


/** Admin: fetch all shorts (active + inactive) */
export async function getAllShorts(): Promise<Short[]> {
  const url = `${API_BASE}/shorts`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    if (!res.ok) throw new Error(`Failed to fetch shorts. Status: ${res.status}`);
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    console.error('Error fetching all shorts:', err);
    return [];
  }
}

/** Admin: create a short */
export async function createShort(data: Partial<Short>): Promise<any> {
  const url = `${API_BASE}/shorts`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

/** Admin: update a short */
export async function updateShort(id: number, data: Partial<Short>): Promise<any> {
  const url = `${API_BASE}/shorts/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify(data),
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

/** Admin: delete a short */
export async function deleteShort(id: number): Promise<any> {
  const url = `${API_BASE}/shorts/${id}`;
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    const res = await fetchWithRetry(url, {
      method: 'DELETE',
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) },
    });
    return await res.json();
  } catch (err: any) {
    throw err;
  }
}

/** Public: increment view count for a short */
export async function incrementShortView(id: number): Promise<void> {
  const url = `${API_BASE}/shorts/${id}/view`;
  try {
    await fetch(url, { method: 'POST' });
  } catch {
    // silently fail — view tracking is non-critical
  }
}

/** Public: increment view count for a movie */
export async function incrementMovieView(id: number): Promise<void> {
  const url = `${API_BASE}/movies/${id}/view`;
  try {
    await fetch(url, { method: 'POST' });
  } catch {
    // silently fail
  }
}

/** Public: increment view count for an episode */
export async function incrementEpisodeView(id: number): Promise<void> {
  const url = `${API_BASE}/episodes/${id}/view`;
  try {
    await fetch(url, { method: 'POST' });
  } catch {
    // silently fail
  }
}

/* ==========================================================================
   Watchlist (My List) API
   ========================================================================== */

export interface WatchlistItem {
  id: number;
  userId: number;
  contentId: number;
  contentType: string;
  createdAt: string;
  details?: any;
}

export async function getUserWatchlist(userId: number | string): Promise<WatchlistItem[]> {
  const url = `${API_BASE}/watchlist/user/${userId}`;
  try {
    const res = await fetchWithRetry(url, { cache: 'no-store' });
    if (!res.ok) return [];
    const data = await res.json();
    return data.data || [];
  } catch (err: any) {
    console.error('Error fetching user watchlist:', err);
    return [];
  }
}

export async function toggleWatchlist(
  userId: number | string,
  contentId: number | string,
  contentType: string = 'movie'
): Promise<{ status: boolean; message: string; inWatchlist: boolean }> {
  const url = `${API_BASE}/watchlist/toggle`;
  try {
    const res = await fetchWithRetry(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: Number(userId),
        contentId: Number(contentId),
        contentType,
      }),
    });
    return await res.json();
  } catch (err: any) {
    console.error('Error toggling watchlist:', err);
    return { status: false, message: err.message || 'Error updating watchlist', inWatchlist: false };
  }
}

export async function checkWatchlist(
  userId: number | string,
  contentId: number | string,
  contentType: string = 'movie'
): Promise<boolean> {
  const url = `${API_BASE}/watchlist/check?userId=${userId}&contentId=${contentId}&contentType=${contentType}`;
  try {
    const res = await fetchWithRetry(url, { cache: 'no-store' });
    if (!res.ok) return false;
    const data = await res.json();
    return !!data.inWatchlist;
  } catch (err: any) {
    return false;
  }
}

export async function removeFromWatchlist(
  userId: number | string,
  contentId: number | string,
  contentType: string = 'movie'
): Promise<boolean> {
  const url = `${API_BASE}/watchlist/remove`;
  try {
    const res = await fetchWithRetry(url, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: Number(userId),
        contentId: Number(contentId),
        contentType,
      }),
    });
    const data = await res.json();
    return !!data.status;
  } catch (err: any) {
    return false;
  }
}

