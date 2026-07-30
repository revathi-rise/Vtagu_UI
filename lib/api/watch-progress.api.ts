import { API_BASE, fetchWithAuth, logger } from '../api-client';

export interface WatchProgress {
  id?: number | string;
  userId: number | string;
  contentId: number | string;
  contentType: 'movie' | 'episode';
  watchedDuration: number; // Current time in seconds
  totalDuration: number; // Total duration in seconds
  progressPercentage: number; // Progress in percentage (0-100)
  lastWatchedAt?: string;
  createdAt?: string;
  updatedAt?: string;
  content?: {
    movie_id?: number;
    title?: string;
    movie_image?: string;
    duration?: number;
    [key: string]: any;
  };
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
  updateProgress: async (data: Omit<WatchProgress, 'id' | 'createdAt' | 'updatedAt' | 'content'>): Promise<WatchProgressResponse> => {
    const url = `${API_BASE}/watch-progress`;
    
    const userIdNum = typeof data.userId === 'string' ? parseInt(data.userId, 10) : Number(data.userId);
    const contentIdNum = typeof data.contentId === 'string' ? parseInt(data.contentId, 10) : Number(data.contentId);
    
    if (isNaN(userIdNum) || isNaN(contentIdNum)) {
      logger.error('updateProgress error: Invalid userId or contentId', { userId: data.userId, contentId: data.contentId });
      return {
        status: false,
        message: 'Invalid userId or contentId',
        error: 'userId and contentId must be numeric',
      };
    }

    const payload = {
      ...data,
      userId: userIdNum,
      contentId: contentIdNum,
    };

    logger.debug(`Calling updateProgress API: ${url}`, payload);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(payload),
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
  getProgressList: async (userId: number | string): Promise<WatchProgressResponse> => {
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : Number(userId);
    if (isNaN(userIdNum)) {
      logger.error('getProgressList error: Invalid userId', userId);
      return {
        status: false,
        message: 'Failed to fetch progress list',
        error: 'userId must be numeric',
        data: [],
      };
    }

    const url = `${API_BASE}/watch-progress/user/${userIdNum}`;
    logger.debug(`Calling getProgressList API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'GET',
      });
      
      // 404 = user has no watch history yet — this is a valid empty state, not an error
      if (res.status === 404) {
        return {
          status: true,
          message: 'No watch history found',
          data: [],
        };
      }

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
  getContentProgress: async (userId: number | string, contentId: number | string): Promise<WatchProgressResponse> => {
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : Number(userId);
    const contentIdNum = typeof contentId === 'string' ? parseInt(contentId, 10) : Number(contentId);
    
    if (isNaN(userIdNum) || isNaN(contentIdNum)) {
      logger.error('getContentProgress error: Invalid userId or contentId', { userId, contentId });
      return {
        status: false,
        message: 'Failed to fetch content progress',
        error: 'userId and contentId must be numeric',
      };
    }

    const url = `${API_BASE}/watch-progress/user/${userIdNum}/content/${contentIdNum}`;
    logger.debug(`Calling getContentProgress API: ${url}`);
    
    try {
      const res = await fetchWithAuth(url, {
        method: 'GET',
      });
      
      if (res.status === 404) {
        return {
          status: true,
          message: 'No watch progress found for this content',
          data: undefined,
        };
      }
      
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
  deleteProgress: async (progressId: number | string): Promise<WatchProgressResponse> => {
    const progressIdNum = typeof progressId === 'string' ? parseInt(progressId, 10) : Number(progressId);
    if (isNaN(progressIdNum)) {
      logger.error('deleteProgress error: Invalid progressId', progressId);
      return {
        status: false,
        message: 'Failed to delete progress',
        error: 'progressId must be numeric',
      };
    }

    const url = `${API_BASE}/watch-progress/${progressIdNum}`;
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
  clearUserProgress: async (userId: number | string): Promise<WatchProgressResponse> => {
    const userIdNum = typeof userId === 'string' ? parseInt(userId, 10) : Number(userId);
    if (isNaN(userIdNum)) {
      logger.error('clearUserProgress error: Invalid userId', userId);
      return {
        status: false,
        message: 'Failed to clear user progress',
        error: 'userId must be numeric',
      };
    }

    const url = `${API_BASE}/watch-progress/user/${userIdNum}`;
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
