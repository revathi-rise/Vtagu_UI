'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { watchProgressApi, WatchProgress } from '@/lib/api/watch-progress.api';

interface UseWatchProgressOptions {
  userId?: string;
  contentId?: string;
  contentType?: 'movie' | 'episode';
  autoUpdate?: boolean;
  debounceTime?: number;
}

export function useWatchProgress(options: UseWatchProgressOptions = {}) {
  const {
    userId,
    contentId,
    contentType = 'movie',
    autoUpdate = true,
    debounceTime = 5000, // Update every 5 seconds
  } = options;

  const [progress, setProgress] = useState<WatchProgress | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [watchList, setWatchList] = useState<WatchProgress[]>([]);

  // Use ref to store timeout for debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch progress for current content
   */
  const fetchProgress = useCallback(async () => {
    if (!userId || !contentId) {
      setError('userId and contentId are required');
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await watchProgressApi.getContentProgress(userId, contentId);
      
      if (response.status && response.data) {
        setProgress(response.data as WatchProgress);
        return response.data as WatchProgress;
      } else {
        setError(response.message || 'Failed to fetch progress');
        setProgress(null);
        return null;
      }
    } catch (err: any) {
      setError(err.message);
      setProgress(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, [userId, contentId]);

  /**
   * Fetch all progress for user (for Continue Watching section)
   */
  const fetchUserWatchList = useCallback(async () => {
    if (!userId) {
      setError('userId is required');
      return [];
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await watchProgressApi.getProgressList(userId);
      
      if (response.status && Array.isArray(response.data)) {
        setWatchList(response.data);
        return response.data;
      } else {
        setError(response.message || 'Failed to fetch watch list');
        setWatchList([]);
        return [];
      }
    } catch (err: any) {
      setError(err.message);
      setWatchList([]);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  /**
   * Update progress with debounce to avoid too many API calls
   */
  const updateProgress = useCallback(
    async (
      currentTime: number,
      duration: number,
      forceUpdate: boolean = false
    ) => {
      if (!userId || !contentId) return;

      // Clear existing timeout
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }

      // Calculate progress percentage
      const progressPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

      // If not forcing update, debounce the API call
      if (!forceUpdate) {
        updateTimeoutRef.current = setTimeout(async () => {
          try {
            const response = await watchProgressApi.updateProgress({
              userId,
              contentId,
              contentType,
              progress: Math.round(progressPercent),
              currentTime: Math.round(currentTime),
              duration: Math.round(duration),
              lastWatchedAt: new Date().toISOString(),
            });

            if (response.status && response.data) {
              setProgress(response.data as WatchProgress);
            } else {
              setError(response.message || 'Failed to update progress');
            }
          } catch (err: any) {
            setError(err.message);
          }
        }, debounceTime);
      } else {
        // Force immediate update
        try {
          const response = await watchProgressApi.updateProgress({
            userId,
            contentId,
            contentType,
            progress: Math.round(progressPercent),
            currentTime: Math.round(currentTime),
            duration: Math.round(duration),
            lastWatchedAt: new Date().toISOString(),
          });

          if (response.status && response.data) {
            setProgress(response.data as WatchProgress);
          } else {
            setError(response.message || 'Failed to update progress');
          }
        } catch (err: any) {
          setError(err.message);
        }
      }
    },
    [userId, contentId, contentType, debounceTime]
  );

  /**
   * Resume watching from saved progress
   */
  const resumeFromSavedProgress = useCallback(async (): Promise<number> => {
    const data = await fetchProgress();
    return data?.currentTime || 0;
  }, [fetchProgress]);

  /**
   * Mark as finished (100% progress)
   */
  const markAsFinished = useCallback(async (duration: number) => {
    return updateProgress(duration, duration, true);
  }, [updateProgress]);

  /**
   * Clear progress for current content
   */
  const clearProgress = useCallback(async () => {
    if (!progress?.id) return;

    try {
      const response = await watchProgressApi.deleteProgress(progress.id);
      
      if (response.status) {
        setProgress(null);
      } else {
        setError(response.message || 'Failed to clear progress');
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [progress?.id]);

  /**
   * Clear all user's progress
   */
  const clearAllUserProgress = useCallback(async () => {
    if (!userId) return;

    try {
      const response = await watchProgressApi.clearUserProgress(userId);
      
      if (response.status) {
        setProgress(null);
        setWatchList([]);
      } else {
        setError(response.message || 'Failed to clear all progress');
      }
    } catch (err: any) {
      setError(err.message);
    }
  }, [userId]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  return {
    // State
    progress,
    watchList,
    isLoading,
    error,
    
    // Methods
    fetchProgress,
    fetchUserWatchList,
    updateProgress,
    resumeFromSavedProgress,
    markAsFinished,
    clearProgress,
    clearAllUserProgress,
  };
}
