# Watch Progress API - Implementation Guide

## Overview

The watch progress API tracks user viewing history across the platform. It consists of two main endpoints:
- **POST /watch-progress**: Update or create watch progress
- **GET /watch-progress/user/:userId**: Get watch progress list for a user

## Files Created

### 1. API Integration Layer
- **`lib/api/watch-progress.api.ts`**: Complete API client for watch progress
  - `updateProgress()`: Save or update viewing progress
  - `getProgressList()`: Fetch all user's watch history
  - `getContentProgress()`: Get progress for specific content
  - `deleteProgress()`: Remove a progress record
  - `clearUserProgress()`: Clear all user's progress

### 2. Custom Hook
- **`hooks/useWatchProgress.ts`**: React hook for managing watch progress
  - State management (progress, watchList, isLoading, error)
  - Automatic debouncing for API calls (5s default)
  - Auto-resume from saved progress
  - Mark as finished tracking
  - Clear progress functionality

### 3. Enhanced Components
- **`components/ui/WatchTrackingVideoPlayer.tsx`**: VideoPlayer wrapper with automatic progress tracking
- **`components/home/continueWatching.tsx`**: Updated to fetch and display user's watch list from API
- **`components/interactive/SceneManager.tsx`**: Updated to track interactive scene progress

## Where to Use Watch Progress

### ✅ Already Implemented

1. **ContinueWatching Section** (`components/home/continueWatching.tsx`)
   - Fetches user's watch list from API
   - Displays movies with progress bars
   - Shows fallback mock data if API unavailable

2. **Interactive Scenes** (`components/interactive/SceneManager.tsx`)
   - Tracks progress on interactive choice-based videos
   - Uses WatchTrackingVideoPlayer for automatic progress saving

### 📋 Places Needing Implementation

#### 1. Movie Player
**Location**: `app/movies/[slug]/page.tsx` and related video player components

**How to implement**:
```tsx
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

// Replace existing VideoPlayer with WatchTrackingVideoPlayer
<WatchTrackingVideoPlayer
  src={videoUrl}
  contentId={movie.id.toString()}
  contentType="movie"
  userId={userId}
  autoResume={true}
  showControls={true}
/>
```

**Status**: Movies currently link to external video player via WatchNowButton. Need to:
- Add an internal movie player page or modal
- Integrate WatchTrackingVideoPlayer
- Pass userId from auth context or localStorage

#### 2. Episode Player
**Location**: `app/episodes/[slug]/page.tsx` and `components/title/EpisodeDetailContent.tsx`

**Current State**: Uses embedded iframe from mediadelivery.net

**How to implement for iframe**:
- For embedded iframes, progress tracking is limited by CORS/iframe restrictions
- Option 1: Use iframe postMessage API if the external service supports it
- Option 2: Track progress on page leave/unload
- Option 3: Use a custom video player instead of iframe

```tsx
// Track progress on unmount or page visibility change
useEffect(() => {
  const handlePageHide = () => {
    // Save current progress before leaving
    updateProgress(estimatedCurrentTime, totalDuration, true);
  };
  
  window.addEventListener('pagehide', handlePageHide);
  return () => window.removeEventListener('pagehide', handlePageHide);
}, [updateProgress]);
```

#### 3. My List Page
**Location**: `app/my-list/page.tsx` and related components

**Implementation**:
- Display saved movies from watch progress
- Show progress bars
- Allow users to resume or delete from list
- Use the `watchList` from `useWatchProgress` hook

#### 4. Video Player Component
**Location**: `components/ui/VideoPlayer.tsx`

**Note**: Already supports `onTimeUpdate` callback. Direct use should be rare; prefer `WatchTrackingVideoPlayer`

## How to Use the Hook

### Basic Usage

```tsx
'use client';

import { useWatchProgress } from '@/hooks/useWatchProgress';

function MyVideoComponent({ contentId, userId }) {
  const {
    progress,
    watchList,
    isLoading,
    error,
    updateProgress,
    resumeFromSavedProgress,
    markAsFinished,
    clearProgress,
  } = useWatchProgress({
    userId,
    contentId,
    contentType: 'movie',
  });

  // Auto-resume from saved progress
  useEffect(() => {
    resumeFromSavedProgress().then(savedTime => {
      if (videoRef.current) {
        videoRef.current.currentTime = savedTime;
      }
    });
  }, []);

  // Handle video time update
  const handleTimeUpdate = (currentTime, duration) => {
    updateProgress(currentTime, duration);
  };

  // Mark as completed when video ends
  const handleVideoEnd = () => {
    markAsFinished(videoDuration);
  };

  return (
    <div>
      {isLoading && <Spinner />}
      {error && <Error message={error} />}
      {progress && <ProgressBar value={progress.progress} />}
    </div>
  );
}
```

### Getting User's Watch List

```tsx
function ContinueWatchingSection() {
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id);
  }, []);

  const { watchList, isLoading, fetchUserWatchList } = useWatchProgress({
    userId,
  });

  useEffect(() => {
    fetchUserWatchList();
  }, [userId]);

  return (
    <div>
      {watchList.map(item => (
        <MovieCard
          key={item.contentId}
          progress={item.progress}
          currentTime={item.currentTime}
        />
      ))}
    </div>
  );
}
```

## Hook Options

```tsx
interface UseWatchProgressOptions {
  userId?: string;           // User ID (required for API calls)
  contentId?: string;        // Content ID (required for single content)
  contentType?: 'movie' | 'episode'; // Type of content (default: 'movie')
  autoUpdate?: boolean;      // Auto-update progress (default: true)
  debounceTime?: number;     // Debounce time in ms (default: 5000)
}
```

## API Payload Format

### Update Progress
```json
{
  "userId": "user-123",
  "contentId": "movie-456",
  "contentType": "movie",
  "progress": 45,
  "currentTime": 2700,
  "duration": 6000,
  "lastWatchedAt": "2026-04-26T10:30:00Z"
}
```

### Get Progress List Response
```json
{
  "status": true,
  "message": "Success",
  "data": [
    {
      "id": "progress-123",
      "userId": "user-123",
      "contentId": "movie-456",
      "contentType": "movie",
      "progress": 45,
      "currentTime": 2700,
      "duration": 6000,
      "lastWatchedAt": "2026-04-26T10:30:00Z",
      "createdAt": "2026-04-20T15:00:00Z",
      "updatedAt": "2026-04-26T10:30:00Z"
    }
  ]
}
```

## Error Handling

The hook handles errors gracefully:

```tsx
const { error, isLoading } = useWatchProgress({ userId, contentId });

if (isLoading) return <Spinner />;
if (error) return <ErrorAlert message={error} />;
```

API errors automatically return `status: false` responses, which the hook catches and sets in the error state.

## Debouncing Strategy

By default, progress updates are debounced at **5 seconds**:
- Prevents excessive API calls during playback
- Updates are batched for better performance
- Use `forceUpdate: true` to update immediately

```tsx
// Debounced update (5 seconds default)
updateProgress(currentTime, duration);

// Force immediate update
updateProgress(currentTime, duration, true);
```

## Getting User ID

The hook expects `userId` to be passed. You can get it from:

```tsx
// From localStorage
const userId = localStorage.getItem('userId');

// From auth context (recommended)
const { user } = useAuth();
const userId = user?.id;

// From cookies (server-side)
const cookieStore = await cookies();
const userId = cookieStore.get('userId')?.value;
```

## Fallback for No API

ContinueWatching and other components have fallback mock data. If the API is unavailable:
- Mock data displays instead
- No errors thrown
- User experience continues smoothly

## Component Integration Checklist

- [ ] Movie player: Add WatchTrackingVideoPlayer
- [ ] Episode player: Add iframe progress tracking or replace with custom player
- [ ] My List page: Display watch progress with resume functionality
- [ ] Search results: Show progress on watched items
- [ ] Category/genre pages: Show progress on recently watched
- [ ] User dashboard: Display watch history stats
- [ ] Clear watch history page: Use clearProgress API

## Testing

Test the implementation by:

1. Opening a video in supported player
2. Playing for a bit and closing
3. Navigating to continue watching section
4. Verifying saved progress appears
5. Clicking to resume and verifying it starts from saved time
6. Playing to completion and verifying 100% progress
