# Watch Progress API - Integration Architecture

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     Frontend Components                      │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────┐     ┌──────────────────────────────┐ │
│  │   ContinueWatching │     │   WatchTrackingVideoPlayer   │ │
│  │   Component      │     │   (Wrapper Component)        │ │
│  └──────────────────┘     └──────────────────────────────┘ │
│         │                           │                       │
│         └──────────────┬────────────┘                       │
│                        │                                    │
│                   useWatchProgress Hook                     │
│                   (hooks/useWatchProgress.ts)              │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
                         │
┌────────────────────────┼────────────────────────────────────┐
│                        │   API Layer                         │
│  ┌──────────────────────────────────────────────────────┐  │
│  │   watchProgressApi (lib/api/watch-progress.api.ts)   │  │
│  └──────────────────────────────────────────────────────┘  │
│                        │                                    │
└────────────────────────┼────────────────────────────────────┘
                         │
                    fetchWithAuth
                         │
         ┌───────────────┼───────────────┐
         │               │               │
    ┌────────┐    ┌────────────┐  ┌──────────┐
    │ POST   │    │    GET     │  │ DELETE   │
    │        │    │            │  │          │
    └────────┘    └────────────┘  └──────────┘
         │               │               │
         └───────────────┼───────────────┘
                         │
              ┌──────────────────────┐
              │   Backend API        │
              │   (Your Server)      │
              └──────────────────────┘
```

## API Endpoints

### 1. Update/Create Progress
```
POST /watch-progress
Body: {
  userId: string
  contentId: string
  contentType: 'movie' | 'episode'
  progress: number (0-100)
  currentTime: number (seconds)
  duration: number (seconds)
  lastWatchedAt: ISO string
}
Response: WatchProgressResponse { status, message, data }
```

### 2. Get User's Watch List
```
GET /watch-progress/user/:userId
Response: WatchProgressResponse { 
  status, 
  message, 
  data: WatchProgress[] 
}
```

### 3. Get Progress for Specific Content
```
GET /watch-progress/user/:userId/content/:contentId
Response: WatchProgressResponse { status, message, data: WatchProgress }
```

### 4. Delete Progress Record
```
DELETE /watch-progress/:progressId
Response: WatchProgressResponse
```

### 5. Clear All User Progress
```
DELETE /watch-progress/user/:userId
Response: WatchProgressResponse
```

## Files Created/Modified

### ✨ New Files Created

1. **lib/api/watch-progress.api.ts** (165 lines)
   - Complete watch progress API client
   - 5 API endpoints with error handling
   - TypeScript interfaces

2. **hooks/useWatchProgress.ts** (238 lines)
   - React hook for watch progress management
   - Debounced updates
   - Auto-resume functionality
   - Error handling

3. **components/ui/WatchTrackingVideoPlayer.tsx** (97 lines)
   - VideoPlayer wrapper with auto-tracking
   - Auto-resume from saved progress
   - Progress update callbacks

4. **WATCH_PROGRESS_IMPLEMENTATION.md** (Documentation)
   - Complete implementation guide
   - Integration examples
   - API payload formats

### 📝 Files Modified

1. **components/home/continueWatching.tsx**
   - Added `useWatchProgress` hook
   - Fetches user's watch list from API
   - Added loading states
   - Fallback to mock data

2. **components/interactive/SceneManager.tsx**
   - Replaced `VideoPlayer` with `WatchTrackingVideoPlayer`
   - Auto-tracks interactive scene progress

## Integration Checklist by Component

### Home Page (Done ✓)
- [x] ContinueWatching section fetches from API
- [x] Shows loading state with shimmer
- [x] Falls back to mock data if needed
- [ ] Add recent searches with progress
- [ ] Add bookmarks feature

### Movie Section (Partial)
- [ ] Add movie player with WatchTrackingVideoPlayer
- [ ] Movie details page → play button → video player
- [ ] Resume from last position
- [ ] Show progress percentage on movie cards

### Episodes Section (Partial)
- [ ] Replace iframe with custom player using WatchTrackingVideoPlayer
- [ ] OR implement iframe postMessage progress tracking
- [ ] Track episode progress per season
- [ ] Auto-play next episode

### Interactive Content (Done ✓)
- [x] SceneManager tracks scene progress
- [x] Records playback time and progress

### My List Page (To Do)
- [ ] Create page at `app/my-list/page.tsx` or update existing
- [ ] Fetch watch progress list
- [ ] Display with resume buttons
- [ ] Show last watched info
- [ ] Allow removal from list

### Search Results (To Do)
- [ ] Show progress badges on matched content
- [ ] Sort by recently watched
- [ ] Filter by completion status

### User Dashboard (To Do)
- [ ] Display watch time statistics
- [ ] Show continued watching queue
- [ ] Display completion percentage

### Watch History Page (To Do)
- [ ] Create detailed watch history
- [ ] Sort by date watched
- [ ] Allow clearing individual items
- [ ] Bulk delete options

## Data Flow

### Saving Progress
```
User watching video
    ↓
onTimeUpdate triggered every ~250ms
    ↓
updateProgress() called (debounced every 5s)
    ↓
POST /watch-progress
    ↓
Backend saves to database
    ↓
Response with updated progress
    ↓
Local state updated
```

### Resuming Playback
```
User clicks resume/continue
    ↓
resumeFromSavedProgress() called
    ↓
GET /watch-progress/user/:userId/content/:contentId
    ↓
Get currentTime from response
    ↓
Set video.currentTime = savedTime
    ↓
Video plays from saved position
```

### Getting Continue Watching List
```
Page mounts
    ↓
fetchUserWatchList() called
    ↓
GET /watch-progress/user/:userId
    ↓
Get array of watched content
    ↓
Map to display format
    ↓
Render with Swiper carousel
```

## Hook Methods Reference

```tsx
// Get current progress
progress: WatchProgress | null

// Get all user's watched content
watchList: WatchProgress[]

// Loading state
isLoading: boolean

// Error state
error: string | null

// Update current content's progress
updateProgress(currentTime, duration, forceUpdate?)
  → debounced by default (5s)
  → force=true updates immediately

// Fetch current content's progress
fetchProgress()
  → GET /watch-progress/user/:userId/content/:contentId

// Fetch all user's watch history
fetchUserWatchList()
  → GET /watch-progress/user/:userId

// Resume from saved position
resumeFromSavedProgress()
  → Returns: number (seconds)

// Mark as finished (100%)
markAsFinished(duration)
  → POST /watch-progress with 100%

// Clear current item's progress
clearProgress()
  → DELETE /watch-progress/:progressId

// Clear all user progress
clearAllUserProgress()
  → DELETE /watch-progress/user/:userId
```

## Usage Examples by Page

### 1. ContinueWatching Component (Already Done)
```tsx
const [userId, setUserId] = useState(null);
const { watchList, isLoading } = useWatchProgress({ userId });

useEffect(() => {
  setUserId(localStorage.getItem('userId'));
}, []);

// Display watchList in Swiper
watchList.map(item => <MediaCard progress={item.progress} />)
```

### 2. Movie Player Page (To Implement)
```tsx
const { updateProgress, resumeFromSavedProgress } = useWatchProgress({
  userId,
  contentId: movie.id,
  contentType: 'movie',
});

// Track progress as video plays
<WatchTrackingVideoPlayer
  src={movieUrl}
  contentId={movie.id}
  contentType="movie"
/>
```

### 3. My List Page (To Implement)
```tsx
const { watchList, isLoading } = useWatchProgress({ userId });

// Display watched items with resume button
watchList
  .filter(item => item.progress > 0)
  .map(item => (
    <div>
      <h3>{item.contentId}</h3>
      <ProgressBar value={item.progress} />
      <button onClick={() => navigateToContent(item.contentId)}>Resume</button>
    </div>
  ))
```

### 4. Video Player Components (General Usage)
```tsx
const playerRef = useRef<VideoPlayerHandle>(null);
const { updateProgress } = useWatchProgress({
  userId,
  contentId,
  contentType: 'episode',
});

const handleTimeUpdate = (currentTime, duration) => {
  updateProgress(currentTime, duration);
};

<VideoPlayer
  ref={playerRef}
  onTimeUpdate={handleTimeUpdate}
/>
```

## Error Handling Strategy

1. **API Failure**: Falls back to mock data or continues without saving
2. **Network Error**: Logs error, doesn't break UI
3. **No UserId**: Shows anonymous state, doesn't make API calls
4. **Invalid ContentId**: Skips tracking for that session

## Performance Considerations

- **Debounce**: 5 seconds between API calls
- **Lazy Loading**: Progress fetched on demand
- **Caching**: Consider adding React Query for client-side cache
- **Batch Updates**: Consider batching multiple updates

## Security Considerations

- **Authentication**: Uses `fetchWithAuth` with JWT token
- **Authorization**: Backend should verify userId matches current user
- **Rate Limiting**: Debouncing prevents API abuse
- **Data Validation**: Backend should validate contentId, progress values

## Testing Recommendations

1. **Unit Tests**
   - Test hook with mock API
   - Test debouncing logic
   - Test error handling

2. **Integration Tests**
   - Test full flow: play → save → resume
   - Test watch list fetching
   - Test progress clearing

3. **E2E Tests**
   - Test in actual player
   - Test across multiple devices
   - Test offline → online transitions

## Future Enhancements

1. **Playback Quality Tracking**: Save preferred quality for content
2. **Captions/Subtitles**: Save user's subtitle preferences per content
3. **Bookmarks**: Allow marking specific timestamps
4. **Watch Party**: Share playback progress in real-time
5. **Analytics**: Aggregate watch data for recommendations
6. **Export**: Allow users to export watch history
7. **Multi-Device Sync**: Sync progress across devices in real-time
