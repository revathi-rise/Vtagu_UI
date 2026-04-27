import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface WatchProgress {
  id?: string;
  userId: string;
  contentId: string;
  contentType: 'movie' | 'episode'; // Type of content
  progress: number; // Progress in percentage (0-100)
  currentTime: number; // Current time in seconds
  duration: number; // Total duration in seconds
  lastWatchedAt?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface WatchProgressResponse {
  status: boolean;
  message: string;
  data?: WatchProgress | WatchProgress[];
  error?: string;
}

export const watchProgressApi = {
  /**
   * Update or create watch progress
   * POST /watch-progress
   */
  updateProgress: async (data: Omit<WatchProgress, 'id' | 'createdAt' | 'updatedAt'>): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress`;
    logger.debug(`Calling updateProgress API: ${url}`, data);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        throw new Error(`Failed to update watch progress: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      logger.error('updateProgress error:', error);
      return {
        status: false,
        message: 'Failed to update progress',
        error: error.message,
      };
    }
  },

  /**
   * Get watch progress list for a user
   * GET /watch-progress/user/:userId
   */
  getProgressList: async (userId: string): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress/user/${userId}`;
    logger.debug(`Calling getProgressList API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'GET',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch watch progress: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      logger.error('getProgressList error:', error);
      return {
        status: false,
        message: 'Failed to fetch progress list',
        error: error.message,
        data: [],
      };
    }
  },

  /**
   * Get progress for a specific content item
   * GET /watch-progress/user/:userId/content/:contentId
   */
  getContentProgress: async (userId: string, contentId: string): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress/user/${userId}/content/${contentId}`;
    logger.debug(`Calling getContentProgress API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'GET',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to fetch content progress: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      logger.error('getContentProgress error:', error);
      return {
        status: false,
        message: 'Failed to fetch content progress',
        error: error.message,
      };
    }
  },

  /**
   * Delete watch progress record
   * DELETE /watch-progress/:progressId
   */
  deleteProgress: async (progressId: string): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress/${progressId}`;
    logger.debug(`Calling deleteProgress API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to delete watch progress: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      logger.error('deleteProgress error:', error);
      return {
        status: false,
        message: 'Failed to delete progress',
        error: error.message,
      };
    }
  },

  /**
   * Clear all progress for a user
   * DELETE /watch-progress/user/:userId
   */
  clearUserProgress: async (userId: string): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress/user/${userId}`;
    logger.debug(`Calling clearUserProgress API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'DELETE',
      });
      
      if (!res.ok) {
        throw new Error(`Failed to clear user progress: ${res.status}`);
      }
      
      return await res.json();
    } catch (error: any) {
      logger.error('clearUserProgress error:', error);
      return {
        status: false,
        message: 'Failed to clear user progress',
        error: error.message,
      };
    }
  },
};
