import { getUserWatchlist, toggleWatchlist, checkWatchlist, removeFromWatchlist, WatchlistItem } from '@/lib/vtagu.api';

export const watchlistService = {
  getUserWatchlist,
  toggleWatchlist,
  checkWatchlist,
  removeFromWatchlist,
};

export type { WatchlistItem };
