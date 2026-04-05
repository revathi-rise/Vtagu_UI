const API_BASE = process.env.NEXT_PUBLIC_API_URL;
console.log("API_BASE", API_BASE);

export interface Genre {
  genre_id: number;
  name: string;
  in_home: string;
  path: string;
}

export async function getGenres(): Promise<Genre[]> {
  const url = `${API_BASE}/genres`;
  
  console.log(`[DEBUG] Fetching genres from: ${url}`);
  
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      console.error(`[DEBUG] Fetch failed with status: ${res.status}`);
      throw new Error(`Failed to fetch genres. Status: ${res.status}`);
    }

    const result = await res.json();
    const genres = result.data || [];
    console.log(`[DEBUG] Successfully fetched ${genres.length} genres.`);
    return genres;
  } catch (err: any) {
    console.error(`[DEBUG] Fetch error for ${url}:`, err.message || err);
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
  console.log(`[DEBUG] Fetching posters from: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch posters. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    console.error(`[DEBUG] Fetch error for ${url}:`, err.message || err);
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
  console.log(`[DEBUG] Fetching series from: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch series. Status: ${res.status}`);
    }
    const result = await res.json();
    // According to user example, series returns a direct array, 
    // but genres/posters return { data: [...] }. Handling both logic.
    return Array.isArray(result) ? result : (result.data || []);
  } catch (err: any) {
    console.error(`[DEBUG] Fetch error for ${url}:`, err.message || err);
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
  console.log(`[DEBUG] Fetching interactive movies from: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch interactive movies. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    console.error(`[DEBUG] Fetch error for ${url}:`, err.message || err);
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
  console.log(`[DEBUG] Fetching episodes from: ${url}`);
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      next: { revalidate: 60 },
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch episodes. Status: ${res.status}`);
    }
    const result = await res.json();
    return result.data || [];
  } catch (err: any) {
    console.error(`[DEBUG] Fetch error for ${url}:`, err.message || err);
    return [];
  }
}
