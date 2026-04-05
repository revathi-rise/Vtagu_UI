const API_BASE = process.env.NEXT_PUBLIC_API_URL;

/**
 * Enhanced logging that only runs in development
 */
const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    // We always log errors, but we can format them consistently
    console.error('[ERROR]', ...args);
  }
};

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
      logger.debug(`Retrying fetch for ${url}. Retries left: ${retries}`);
      return fetchWithRetry(url, options, retries - 1);
    }
    
    return res;
  } catch (err) {
    if (retries > 0) {
      logger.debug(`Retrying fetch for ${url} due to error. Retries left: ${retries}`);
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
}

export interface Genre {
  genre_id: number;
  name: string;
  in_home: string;
  path: string;
}

export async function getGenres(): Promise<Genre[]> {
  const url = `${API_BASE}/genres`;
  logger.debug(`Fetching genres from: ${url}`);
  
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });

    if (!res.ok) {
      throw new Error(`Failed to fetch genres. Status: ${res.status}`);
    }

    const result = await res.json();
    const genres = result.data || [];
    logger.debug(`Successfully fetched ${genres.length} genres.`);
    return genres;
  } catch (err: any) {
    logger.error(`Fetch error for ${url}:`, err.message || err);
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
  logger.debug(`Fetching posters from: ${url}`);
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
        throw new Error(`Failed to fetch posters. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    logger.error(`Fetch error for ${url}:`, err.message || err);
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
  logger.debug(`Fetching series from: ${url}`);
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch series. Status: ${res.status}`);
    }
    const result = await res.json();
    return Array.isArray(result) ? result : (result.data || []);
  } catch (err: any) {
    logger.error(`Fetch error for ${url}:`, err.message || err);
    return [];
  }
}

export interface InteractiveMovie {
  interactive_movie_id: number;
  title: string;
  description: string;
  created_at: string;
}

export async function getInteractiveMovies(): Promise<InteractiveMovie[]> {
  const url = `${API_BASE}/interactive-movies`;
  logger.debug(`Fetching interactive movies from: ${url}`);
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch interactive movies. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    logger.error(`Fetch error for ${url}:`, err.message || err);
    return [];
  }
}

export interface Episode {
  episode_id: number;
  season_id: number;
  title: string;
  url: string;
  image: number | string;
}

export async function getEpisodes(): Promise<Episode[]> {
  const url = `${API_BASE}/episodes`;
  logger.debug(`Fetching episodes from: ${url}`);
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch episodes. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    logger.error(`Fetch error for ${url}:`, err.message || err);
    return [];
  }
}

