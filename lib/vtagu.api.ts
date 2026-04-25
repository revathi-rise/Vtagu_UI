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
  name: string;
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
  episodeId: number;
  seasonId: number;
  title: string;
  url: string;
  image: number | string | null;
}

export async function getEpisodes(): Promise<Episode[]> {
  const url = `${API_BASE}/episodes`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch episodes. Status: ${res.status}`);
    }
    const result = await res.json();
    // Support both direct array and nested data structure
    return Array.isArray(result) ? result : (result.data || []);
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
    return result.data || result;
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
}

export async function getMovies(): Promise<Movie[]> {
  const url = `${API_BASE}/movies`;
  try {
    const res = await fetchWithRetry(url, { next: { revalidate: 60 } });
    if (!res.ok) {
      throw new Error(`Failed to fetch movies. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
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
    return result.data || result; // Use data if present, else result
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
    return result.data || [];
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
