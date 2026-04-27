# Watch Progress API - Quick Reference

## TL;DR - Quick Start

### For ContinueWatching-like Components
```tsx
const [userId, setUserId] = useState<string | null>(null);
const { watchList, isLoading } = useWatchProgress({ userId });

useEffect(() => {
  setUserId(localStorage.getItem('userId'));
}, []);

// Use watchList to display items
```

### For Video Player Components
```tsx
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

<WatchTrackingVideoPlayer
  src={videoUrl}
  contentId={contentId}
  contentType="movie"
  userId={userId}
  autoResume={true}
/>
```

### For Custom Video Players
```tsx
const { updateProgress, resumeFromSavedProgress } = useWatchProgress({
  userId,
  contentId,
  contentType: 'episode',
});

// Resume from last position
useEffect(() => {
  resumeFromSavedProgress().then(savedTime => {
    if (videoRef.current) videoRef.current.currentTime = savedTime;
  });
}, []);

// Track progress
const handleTimeUpdate = (currentTime, duration) => {
  updateProgress(currentTime, duration);
};
```

## Component Integration Locations

| Component | Path | Type | Status |
|-----------|------|------|--------|
| ContinueWatching | `components/home/continueWatching.tsx` | Fetch List | ✅ Done |
| SceneManager | `components/interactive/SceneManager.tsx` | Track | ✅ Done |
| Movie Player | `app/movies/[slug]/page.tsx` | Track | ⏳ To Do |
| Episode Player | `app/episodes/[slug]/page.tsx` | Track | ⏳ To Do |
| MyList Page | `app/my-list/page.tsx` | Display | ⏳ To Do |
| Search Results | `app/search/page.tsx` | Display | ⏳ To Do |
| Browse Page | `app/browse/page.tsx` | Display | ⏳ To Do |
| Originals Page | `app/originals/page.tsx` | Display | ⏳ To Do |
| User Dashboard | `app/account/page.tsx` | Display | ⏳ To Do |

## API Methods Quick Reference

### Update Progress
```tsx
const { updateProgress } = useWatchProgress({ userId, contentId });

// Debounced (every 5 seconds)
updateProgress(currentTime, duration);

// Immediate
updateProgress(currentTime, duration, true);
```

### Get Watch List
```tsx
const { watchList, fetchUserWatchList } = useWatchProgress({ userId });

useEffect(() => {
  fetchUserWatchList();
}, [userId]);
```

### Get Single Item Progress
```tsx
const { progress, fetchProgress } = useWatchProgress({ userId, contentId });

useEffect(() => {
  fetchProgress();
}, [userId, contentId]);
```

### Resume From Saved
```tsx
const { resumeFromSavedProgress } = useWatchProgress({ userId, contentId });

const startTime = await resumeFromSavedProgress();
```

### Mark As Finished
```tsx
const { markAsFinished } = useWatchProgress({ userId, contentId });

// When video ends
markAsFinished(videoDuration);
```

### Clear Progress
```tsx
const { clearProgress, clearAllUserProgress } = useWatchProgress({ userId, contentId });

// Clear single item
clearProgress();

// Clear all user progress
clearAllUserProgress();
```

## Common Patterns

### Pattern 1: Auto-Resume Movie Player
```tsx
function MoviePlayer({ movieId, userId }) {
  const videoRef = useRef(null);
  const { resumeFromSavedProgress, updateProgress } = useWatchProgress({
    userId,
    contentId: movieId,
    contentType: 'movie'
  });

  useEffect(() => {
    resumeFromSavedProgress().then(time => {
      if (videoRef.current) videoRef.current.currentTime = time;
    });
  }, []);

  const handleTimeUpdate = () => {
    const video = videoRef.current;
    updateProgress(video.currentTime, video.duration);
  };

  return <video ref={videoRef} onTimeUpdate={handleTimeUpdate} />;
}
```

### Pattern 2: Display Watch History
```tsx
function WatchHistory({ userId }) {
  const { watchList, isLoading } = useWatchProgress({ userId });

  if (isLoading) return <Spinner />;

  return (
    <div>
      {watchList.map(item => (
        <div key={item.id}>
          <h3>{item.contentId}</h3>
          <ProgressBar value={item.progress} />
          <time>{new Date(item.lastWatchedAt).toLocaleDateString()}</time>
        </div>
      ))}
    </div>
  );
}
```

### Pattern 3: Resume/Continue Button
```tsx
function ResumeButton({ contentId, userId }) {
  const { progress, resumeFromSavedProgress } = useWatchProgress({
    userId,
    contentId
  });

  if (!progress || progress.progress === 0) return null;

  const handleResume = async () => {
    const startTime = await resumeFromSavedProgress();
    navigateToPlayer(contentId, startTime);
  };

  return (
    <button onClick={handleResume}>
      Resume ({Math.round(progress.progress)}%)
    </button>
  );
}
```

### Pattern 4: Wrap Existing VideoPlayer
```tsx
function MyVideoComponent({ videoUrl, contentId, userId }) {
  const [initialTime, setInitialTime] = useState(0);
  const { resumeFromSavedProgress, updateProgress } = useWatchProgress({
    userId,
    contentId,
    contentType: 'episode'
  });

  useEffect(() => {
    resumeFromSavedProgress().then(setInitialTime);
  }, []);

  return (
    <VideoPlayer
      src={videoUrl}
      onTimeUpdate={(current, duration) => {
        updateProgress(current, duration);
      }}
      onEnded={() => updateProgress(duration, duration, true)}
      initialTime={initialTime}
    />
  );
}
```

## State Structure

```tsx
interface WatchProgress {
  id?: string;
  userId: string;           // Who is watching
  contentId: string;        // What they're watching
  contentType: 'movie' | 'episode';
  progress: number;         // 0-100 percentage
  currentTime: number;      // Seconds into video
  duration: number;         // Total video length
  lastWatchedAt?: string;   // ISO timestamp
  createdAt?: string;
  updatedAt?: string;
}
```

## Hook Return Value

```tsx
{
  // State
  progress: WatchProgress | null,
  watchList: WatchProgress[],
  isLoading: boolean,
  error: string | null,
  
  // Methods
  fetchProgress: async () => WatchProgress | null,
  fetchUserWatchList: async () => WatchProgress[],
  updateProgress: (currentTime, duration, forceUpdate?) => void,
  resumeFromSavedProgress: async () => number,
  markAsFinished: (duration) => void,
  clearProgress: () => void,
  clearAllUserProgress: () => void,
}
```

## Error Handling Patterns

```tsx
// Pattern 1: Check for errors
const { error, isLoading } = useWatchProgress({ userId, contentId });

if (error) {
  console.error('Failed to load progress:', error);
  // Continue without tracking or show fallback UI
}

// Pattern 2: Check if data exists
const { watchList } = useWatchProgress({ userId });

if (!watchList || watchList.length === 0) {
  return <EmptyState />;
}

// Pattern 3: Handle loading
const { isLoading } = useWatchProgress({ userId });

if (isLoading) {
  return <Shimmer />;
}
```

## Getting User ID

```tsx
// From localStorage
const userId = localStorage.getItem('userId');

// From cookies (server component)
const cookieStore = await cookies();
const userId = cookieStore.get('userId')?.value;

// From auth hook (client component)
const { user } = useAuth();
const userId = user?.id;

// From route params
const { userId } = useParams();
```

## Import Statements

```tsx
// Hook
import { useWatchProgress } from '@/hooks/useWatchProgress';

// Wrapper component
import WatchTrackingVideoPlayer from '@/components/ui/WatchTrackingVideoPlayer';

// API client (rarely needed directly)
import { watchProgressApi } from '@/lib/api/watch-progress.api';

// Types
import type { WatchProgress } from '@/lib/api/watch-progress.api';
```

## Debug Logging

```tsx
const { progress, watchList, error, isLoading } = useWatchProgress({ userId, contentId });

useEffect(() => {
  console.log('Watch Progress State:', {
    progress,
    watchList,
    error,
    isLoading,
  });
}, [progress, watchList, error, isLoading]);
```

## Performance Tips

1. **Memoize the hook call**:
   ```tsx
   const watchProgressState = useMemo(
     () => useWatchProgress({ userId, contentId }),
     [userId, contentId]
   );
   ```

2. **Separate concerns**:
   ```tsx
   // Get list separately from single item tracking
   const listHook = useWatchProgress({ userId });
   const trackingHook = useWatchProgress({ userId, contentId });
   ```

3. **Prevent re-renders**:
   ```tsx
   const { watchList } = useWatchProgress({ userId });
   
   const memoizedList = useMemo(
     () => watchList?.filter(item => item.progress > 0),
     [watchList]
   );
   ```

## Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Progress not saving | Check userId is set in localStorage |
| Watch list empty | Call fetchUserWatchList() after userId is set |
| Progress resets | Check debounceTime setting (default: 5s) |
| Resume not working | Verify contentId matches between components |
| API errors | Check network tab, verify backend endpoint URLs |
| Hook not updating | Ensure userId and contentId are provided |
| Memory leaks | Hook cleanup is handled, use ref for video element |

## Next Steps After Implementation

1. ✅ Update ContinueWatching section
2. ✅ Update SceneManager for interactive content
3. ⏳ Add movie player with progress tracking
4. ⏳ Add episode player tracking
5. ⏳ Create My List page
6. ⏳ Add progress badges to search results
7. ⏳ Create watch history page
8. ⏳ Add watch time statistics
9. ⏳ Implement playback quality preferences
10. ⏳ Add multi-device sync
