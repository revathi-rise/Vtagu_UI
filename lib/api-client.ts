export const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export const logger = {
  debug: (...args: any[]) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log('[DEBUG]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  }
};

// Token management
export const getToken = (): string | null => {
  if (typeof window === 'undefined') {
    // In server components, token should be passed manually or extracted from headers/cookies
    // This function primarily handles client-side retrieval
    return null;
  }
  return localStorage.getItem('token');
};

export const getUserId = (): string | null => {
  if (typeof window === 'undefined') return null;

  // 1. Try to get from localStorage 'user' object
  try {
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      if (user.userId) return user.userId.toString();
      if (user.id) return user.id.toString();
    }
  } catch (e) {
    logger.error('Error parsing user from localStorage:', e);
  }

  // 2. Try to get from cookie
  const cookies = document.cookie.split(';');
  const userIdCookie = cookies.find(c => c.trim().startsWith('userId='));
  if (userIdCookie) {
    return userIdCookie.split('=')[1];
  }

  // 3. Fallback to 'userId' key in localStorage
  return localStorage.getItem('userId');
};

export const setToken = (token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', token);
    // Also set as cookie for Next.js server components
    document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
  }
};

export const removeToken = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
    document.cookie = `token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
  }
};

// Fetch wrapper
export async function fetchWithAuth(url: string, options: RequestInit = {}, retries = 2): Promise<Response> {
  const token = getToken();

  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const enhancedOptions = {
    ...options,
    headers,
  };

  try {
    const res = await fetch(url, enhancedOptions);

    // Auto-logout on unauthorized if it's an API route that requires auth
    // if (res.status === 401) {
    //   removeToken();
    //   window.location.href = '/login';
    // }

    if (!res.ok && retries > 0 && res.status >= 500) {
      logger.debug(`Retrying fetch for ${url}. Status: ${res.status}. Retries left: ${retries}`);
      return fetchWithAuth(url, options, retries - 1);
    }

    return res;
  } catch (err: any) {
    if (retries > 0) {
      logger.debug(`Retrying fetch for ${url} due to network error: ${err.message}. Retries left: ${retries}`);
      return fetchWithAuth(url, options, retries - 1);
    }
    logger.error(`Final fetch failure for ${url}:`, err);
    throw err;
  }
}
