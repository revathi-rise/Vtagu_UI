'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '@/store';
import { 
  fetchUserWatchProgress, 
  saveWatchProgress, 
  fetchContentProgress,
  deleteWatchProgress,
  setCurrentProgress
} from '@/store/slices/watchProgressSlice';
import { WatchProgress } from '@/lib/api/watch-progress.api';
import { getUserId } from '@/lib/api-client';

interface UseWatchProgressOptions {
  userId?: number | string;
  contentId?: number | string;
  contentType?: 'movie' | 'episode';
  autoUpdate?: boolean;
  debounceTime?: number;
}

export function useWatchProgress(options: UseWatchProgressOptions = {}) {
  const {
    userId: providedUserId,
    contentId,
    contentType = 'movie',
    autoUpdate = true,
    debounceTime = 5000, // Update every 5 seconds
  } = options;

  const userId = providedUserId || getUserId();

  const dispatch = useDispatch<AppDispatch>();
  const { watchList, currentProgress, loading: isLoading, error } = useSelector(
    (state: RootState) => state.watchProgress
  );

  // Use ref to store timeout for debouncing
  const updateTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Fetch progress for current content
   */
  const fetchProgress = useCallback(async () => {
    if (!userId || !contentId) {
      return null;
    }

    const result = await dispatch(fetchContentProgress({ userId, contentId }));
    if (fetchContentProgress.fulfilled.match(result)) {
      return result.payload;
    }
    return null;
  }, [userId, contentId, dispatch]);

  /**
   * Fetch all progress for user (for Continue Watching section)
   */
  const fetchUserWatchList = useCallback(async () => {
    if (!userId) {
      return [];
    }

    const result = await dispatch(fetchUserWatchProgress(userId));
    if (fetchUserWatchProgress.fulfilled.match(result)) {
      return result.payload;
    }
    return [];
  }, [userId, dispatch]);

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
      
      // Log progress update
      console.log(`[WatchProgress] Saving progress for ${contentId}: ${progressPercent.toFixed(2)}% (${currentTime}s / ${duration}s)`);

      const progressData = {
        userId,
        contentId,
        contentType,
        watchedDuration: Math.round(currentTime),
        totalDuration: Math.round(duration),
        progressPercentage: Math.round(progressPercent),
        lastWatchedAt: new Date().toISOString(),
      };

      // If not forcing update, debounce the API call
      if (!forceUpdate) {
        updateTimeoutRef.current = setTimeout(() => {
          dispatch(saveWatchProgress(progressData));
        }, debounceTime);
      } else {
        // Force immediate update
        dispatch(saveWatchProgress(progressData));
      }
    },
    [userId, contentId, contentType, debounceTime, dispatch]
  );

  /**
   * Resume watching from saved progress
   */
  const resumeFromSavedProgress = useCallback(async (): Promise<number> => {
    const data = await fetchProgress();
    return data?.watchedDuration || 0;
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
    if (!currentProgress?.id) return;
    await dispatch(deleteWatchProgress(currentProgress.id));
  }, [currentProgress?.id, dispatch]);

  /**
   * Clear all user's progress (Note: backend API for this might need specific thunk)
   */
  const clearAllUserProgress = useCallback(async () => {
    if (!userId) return;
    // For now, we can clear the current state or implement a thunk if needed
    // The previous implementation called watchProgressApi.clearUserProgress(userId)
    // We should probably add a thunk for this if it's used frequently.
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
    progress: currentProgress,
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
    setCurrentProgress: (p: WatchProgress | null) => dispatch(setCurrentProgress(p)),
  };
}

