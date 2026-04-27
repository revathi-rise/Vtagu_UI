# Internal Video Player Implementation Guide

## Overview

We've implemented a unified internal video player system across the project using:
- `WatchTrackingVideoPlayer` - Core player component with progress tracking
- `VideoPlayerModal` - Modal wrapper for fullscreen playback
- `WatchNowButton` - Smart button that supports both internal and external playback
- `SceneManager` - Interactive video player (already implemented)

## Components

### 1. WatchTrackingVideoPlayer
**Location**: `components/ui/WatchTrackingVideoPlayer.tsx`

Auto-tracks video progress, supports auto-resume, handles progress persistence.

```tsx
<WatchTrackingVideoPlayer
  src={videoUrl}
  contentId={contentId}
  contentType="movie" // or "episode"
  userId={userId}
  autoResume={true}
  showControls={true}
  autoPlay={false}
  className="w-full h-full"
/>
```

### 2. VideoPlayerModal
**Location**: `components/ui/VideoPlayerModal.tsx`

Fullscreen modal wrapper around WatchTrackingVideoPlayer.

```tsx
const [isOpen, setIsOpen] = useState(false);

<VideoPlayerModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  videoUrl={videoUrl}
  title="Movie Title"
  contentId="movie-123"
  contentType="movie"
  userId={userId}
/>
```

### 3. WatchNowButton
**Location**: `components/ui/WatchNowButton.tsx`

Smart button supporting both internal and external playback.

```tsx
// Internal player (default)
<WatchNowButton 
  url={videoUrl}
  title="Movie Title"
  contentId="movie-123"
  contentType="movie"
  internal={true}
/>

// External link (fallback)
<WatchNowButton 
  url="https://external-video-url.com"
  internal={false}
/>
```

## Implementation Locations

### ✅ Already Implemented

| Component | Location | Status |
|-----------|----------|--------|
| Interactive Scenes | `components/interactive/SceneManager.tsx` | ✅ Uses WatchTrackingVideoPlayer |
| Movie Details Page | `app/movies/[slug]/page.tsx` | ✅ Updated with internal player |
| Continue Watching | `components/home/continueWatching.tsx` | ✅ Fetches watch progress |

### ⏳ Ready to Implement

#### 1. Episode Player
**Location**: `app/episodes/[slug]/page.tsx` and `components/title/EpisodeDetailContent.tsx`

```tsx
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

<WatchTrackingVideoPlayer
  src={episodeUrl}
  contentId={episode.episodeId.toString()}
  contentType="episode"
  userId={userId}
  autoResume={true}
/>
```

#### 2. Interactive Content Page
**Location**: `app/interactive/[id]/page.tsx`

Already uses SceneManager which uses WatchTrackingVideoPlayer ✅

#### 3. Movie Hero Player
**Location**: `components/home/HeroSection.tsx`

```tsx
import WatchNowButton from '@/components/ui/WatchNowButton';

<WatchNowButton 
  url={heroMovie.videoUrl}
  title={heroMovie.title}
  contentId={heroMovie.id.toString()}
  contentType="movie"
  internal={true}
/>
```

#### 4. Category/Genre Players
**Location**: `components/home/MovieSection.tsx`, `components/home/TrendingSection.tsx`

```tsx
// Add play functionality to cards
<button onClick={() => openPlayer(movie.id)}>
  <Play size={24} />
</button>

// Use VideoPlayerModal for playback
<VideoPlayerModal
  isOpen={selectedMovieId === movie.id}
  onClose={() => setSelectedMovieId(null)}
  videoUrl={movie.videoUrl}
  title={movie.title}
  contentId={movie.id.toString()}
  contentType="movie"
/>
```

#### 5. Search Results
**Location**: `app/search/page.tsx` and `components/search/SearchResults.tsx`

```tsx
// Show play button on search results
// Use same VideoPlayerModal pattern
```

#### 6. Browse/Discover Pages
**Location**: `app/browse/page.tsx`

```tsx
// Add play buttons to content cards
// Use VideoPlayerModal for playback
```

## Usage Patterns

### Pattern 1: Simple Play Button
```tsx
'use client';

import { useState } from 'react';
import WatchNowButton from '@/components/ui/WatchNowButton';

function MovieCard({ movie }) {
  return (
    <div>
      <h3>{movie.title}</h3>
      <WatchNowButton
        url={movie.videoUrl}
        title={movie.title}
        contentId={movie.id.toString()}
        contentType="movie"
        internal={true}
      />
    </div>
  );
}
```

### Pattern 2: Modal with Multiple Videos
```tsx
'use client';

import { useState } from 'react';
import VideoPlayerModal from '@/components/ui/VideoPlayerModal';
import { Play } from 'lucide-react';

function MovieGrid({ movies }) {
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [userId, setUserId] = useState<string>();

  useEffect(() => {
    const id = localStorage.getItem('userId');
    setUserId(id || undefined);
  }, []);

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {movies.map(movie => (
          <div key={movie.id} className="relative group cursor-pointer">
            <img src={movie.poster} alt={movie.title} />
            <button
              onClick={() => setSelectedMovie(movie)}
              className="absolute inset-0 flex items-center justify-center bg-black/0 group-hover:bg-black/40 transition opacity-0 group-hover:opacity-100"
            >
              <Play size={48} className="text-white fill-white" />
            </button>
          </div>
        ))}
      </div>

      {selectedMovie && (
        <VideoPlayerModal
          isOpen={!!selectedMovie}
          onClose={() => setSelectedMovie(null)}
          videoUrl={selectedMovie.videoUrl}
          title={selectedMovie.title}
          contentId={selectedMovie.id.toString()}
          contentType="movie"
          userId={userId}
        />
      )}
    </>
  );
}
```

### Pattern 3: Player with Track Progress
```tsx
'use client';

import { useRef, useState } from 'react';
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

function MoviePlayer({ movie, userId }) {
  const playerRef = useRef(null);
  const [progress, setProgress] = useState(0);

  return (
    <div className="w-full h-screen">
      <WatchTrackingVideoPlayer
        ref={playerRef}
        src={movie.videoUrl}
        contentId={movie.id.toString()}
        contentType="movie"
        userId={userId}
        autoResume={true}
        autoPlay={true}
        showControls={true}
        onProgressUpdate={(percent, currentTime) => {
          setProgress(percent);
          console.log(`Progress: ${percent}%`);
        }}
      />
      <div className="text-white">
        Progress: {Math.round(progress)}%
      </div>
    </div>
  );
}
```

## Features

### Auto-Resume
When a user returns to watch a video, it automatically resumes from their last position.

```tsx
// This is handled automatically by WatchTrackingVideoPlayer
<WatchTrackingVideoPlayer
  autoResume={true}  // Default: true
  {...props}
/>
```

### Progress Tracking
All playback is automatically tracked with:
- Progress percentage (0-100)
- Current time in seconds
- Total duration
- Last watched timestamp

### Progress Callback
Get real-time progress updates:

```tsx
const handleProgressUpdate = (percent, currentTime) => {
  console.log(`${percent}% watched, at ${currentTime}s`);
};

<WatchTrackingVideoPlayer
  onProgressUpdate={handleProgressUpdate}
  {...props}
/>
```

### Video Completion
When a video reaches 100%, it's automatically marked as finished in the database.

## Supported Video Types

- ✅ MP4 (direct video files)
- ✅ HLS Streams (.m3u8)
- ✅ DASH Streams
- ✅ YouTube (via embedding - no tracking)
- ✅ Custom streams

## Getting UserId

```tsx
// Client-side from localStorage
const userId = localStorage.getItem('userId');

// From cookies (server component)
const cookieStore = await cookies();
const userId = cookieStore.get('userId')?.value;

// From auth context
const { user } = useAuth();
const userId = user?.id;
```

## Props Reference

### WatchNowButton
```tsx
interface WatchNowButtonProps {
  url: string;                          // Video URL
  title?: string;                       // Video title (default: "Video")
  contentId?: string;                   // Content ID (default: "video")
  contentType?: 'movie' | 'episode';   // Type (default: "movie")
  internal?: boolean;                   // Use internal player (default: true)
}
```

### VideoPlayerModal
```tsx
interface VideoPlayerModalProps {
  isOpen: boolean;                      // Show/hide modal
  onClose: () => void;                  // Close callback
  videoUrl: string;                     // Video URL
  title: string;                        // Display title
  contentId: string;                    // Content ID
  contentType?: 'movie' | 'episode';   // Type (default: "movie")
  userId?: string;                      // User ID for tracking
}
```

### WatchTrackingVideoPlayer
```tsx
interface WatchTrackingVideoPlayerProps {
  src: string;                          // Video URL
  contentId: string;                    // Content ID
  contentType?: 'movie' | 'episode';   // Type (default: "movie")
  userId?: string;                      // User ID for tracking
  autoResume?: boolean;                 // Auto-resume (default: true)
  onProgressUpdate?: (progress, time) => void;  // Progress callback
  onTimeUpdate?: (current, duration) => void;   // Time update callback
  onEnded?: () => void;                 // Ended callback
  // ... all VideoPlayer props
}
```

## Next Steps

1. ✅ Movie details page - Done
2. ⏳ Episode player - Update with WatchTrackingVideoPlayer
3. ⏳ Hero section - Add WatchNowButton
4. ⏳ Category/Trending sections - Add play buttons with VideoPlayerModal
5. ⏳ Search results - Show play option
6. ⏳ Browse pages - Add play buttons
7. ⏳ My List - Add resume buttons using VideoPlayerModal

## Testing

Test the implementation by:

1. Click "Watch Now" on a movie
2. Play for 30 seconds
3. Close without finishing
4. Go to "Continue Watching"
5. Verify video appears with progress
6. Click resume
7. Verify it starts from saved time

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Video doesn't start | Check `src` URL is valid |
| Progress not saving | Verify userId is set in localStorage |
| Resume doesn't work | Check contentId matches between plays |
| Modal won't close | Verify `onClose` callback is passed |
| Controls not showing | Set `showControls={true}` |
