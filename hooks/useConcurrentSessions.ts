'use client';

import { useEffect, useRef, useState } from 'react';
import { pingWatchSession, exitWatchSession } from '@/lib/vtagu.api';
import { getUserId } from '@/lib/api-client';

interface UseConcurrentSessionsOptions {
  contentId: string | number;
  contentType: 'movie' | 'episode' | 'interactive';
  enabled?: boolean;
}

export function useConcurrentSessions({
  contentId,
  contentType,
  enabled = true,
}: UseConcurrentSessionsOptions) {
  const [isExceeded, setIsExceeded] = useState(false);
  const [limit, setLimit] = useState<number>(999);
  const sessionIdRef = useRef<string | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Generate unique session ID on client side only
  if (typeof window !== 'undefined' && !sessionIdRef.current) {
    sessionIdRef.current = Math.random().toString(36).substring(2) + Date.now().toString(36);
  }

  useEffect(() => {
    if (!enabled || !sessionIdRef.current) return;

    const userId = getUserId();
    if (!userId) return; // If not logged in, ignore limit or rely on authentication block

    const sessionId = sessionIdRef.current;

    const ping = async () => {
      try {
        const response = await pingWatchSession(userId, sessionId, contentId, contentType);
        if (response.status === false || response.message === 'LIMIT_EXCEEDED') {
          setIsExceeded(true);
          if (response.limit) setLimit(response.limit);
        } else {
          setIsExceeded(false);
          if (response.limit) setLimit(response.limit);
        }
      } catch (err) {
        console.error('Error during watch session ping:', err);
      }
    };

    // Ping immediately
    ping();

    // Ping every 20 seconds
    intervalRef.current = setInterval(ping, 20000);

    // Call exit immediately on unmount
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      exitWatchSession(sessionId).catch((e) =>
        console.error('Error during exit session:', e)
      );
    };
  }, [contentId, contentType, enabled]);

  // Handle page closing/navigation away using pagehide/beforeunload
  useEffect(() => {
    if (!enabled || !sessionIdRef.current) return;
    const sessionId = sessionIdRef.current;

    const handleBeforeUnload = () => {
      // Use navigator.sendBeacon if possible for more reliable delivery during exit
      if (typeof navigator !== 'undefined' && navigator.sendBeacon) {
        const url = `${process.env.NEXT_PUBLIC_API_URL}/watch-sessions/exit`;
        const blob = new Blob([JSON.stringify({ sessionId })], { type: 'application/json' });
        navigator.sendBeacon(url, blob);
      } else {
        exitWatchSession(sessionId).catch((e) => console.error(e));
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handleBeforeUnload);
    };
  }, [enabled]);

  return { isExceeded, limit };
}
