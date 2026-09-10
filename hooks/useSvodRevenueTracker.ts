'use client';

import { useEffect, useRef, useCallback } from 'react';
import { API_BASE, getUserId } from '@/lib/api-client';

interface UseSvodRevenueTrackerOptions {
  userId?: string | number;
  filmId: string | number;
  isPlaying?: boolean;
  isBuffering?: boolean;
  intervalSeconds?: number;
}

/**
 * Custom React Hook for logging active watch time seconds to SVOD Pro-Rata backend API
 */
export function useSvodRevenueTracker({
  userId: providedUserId,
  filmId,
  isPlaying = false,
  isBuffering = false,
  intervalSeconds = 60,
}: UseSvodRevenueTrackerOptions) {
  const timeAccumulator = useRef(0);
  const isPlayingRef = useRef(false);

  const userId = providedUserId || getUserId() || 'guest';

  // Keep isPlayingRef updated without re-subscribing interval
  useEffect(() => {
    isPlayingRef.current = isPlaying && !isBuffering;
  }, [isPlaying, isBuffering]);

  /**
   * Syncs accumulated watch time seconds to backend
   */
  const syncWatchTime = useCallback(async () => {
    if (timeAccumulator.current > 0 && filmId && userId) {
      const secondsToLog = timeAccumulator.current;
      timeAccumulator.current = 0; // Reset accumulator before network request

      try {
        const url = `${API_BASE}/v1/tracking/log-watch-time`;
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            user_id: String(userId),
            film_id: String(filmId),
            seconds_watched: secondsToLog,
          }),
        });

        const data = await response.json();
        if (!response.ok || !data.status) {
          console.warn('[SVOD Tracker] Failed to log watch time:', data);
          timeAccumulator.current += secondsToLog; // Restore time on failure
        } else {
          console.log(`[SVOD Tracker] Logged ${secondsToLog}s watched for film ${filmId}`);
        }
      } catch (error) {
        console.error('[SVOD Tracker] Network error logging watch time:', error);
        timeAccumulator.current += secondsToLog; // Restore time on network error
      }
    }
  }, [filmId, userId]);

  const syncWatchTimeRef = useRef(syncWatchTime);
  useEffect(() => {
    syncWatchTimeRef.current = syncWatchTime;
  }, [syncWatchTime]);

  useEffect(() => {
    if (!filmId) return;

    // 1. Tick accumulator every 1 second when video is actively playing
    const secondCounter = setInterval(() => {
      if (isPlayingRef.current) {
        timeAccumulator.current += 1;
      }
    }, 1000);

    // 2. Sync to backend every N seconds (default 60s)
    const syncTimer = setInterval(() => {
      syncWatchTimeRef.current();
    }, intervalSeconds * 1000);

    // Cleanup: Flush watch time on unmount
    return () => {
      clearInterval(secondCounter);
      clearInterval(syncTimer);
      syncWatchTimeRef.current();
    };
  }, [filmId, intervalSeconds]);

  return {
    syncWatchTime,
  };
}
