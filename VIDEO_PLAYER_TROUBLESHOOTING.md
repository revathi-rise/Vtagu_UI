# Video Player Troubleshooting & Setup Guide

## ✅ What Was Fixed

### Issue: "NotSupportedError: The element has no supported sources"

**Root Cause:** The video URL from the API was `null`, `undefined`, or an invalid format that the HTML5 video player couldn't handle.

**Solution Implemented:**
1. **Video URL Validation System** (`lib/video-utils.ts`)
   - Added fallback video URLs from reliable sources (Google & Mux CDN)
   - Validates video URLs before playback
   - Automatically uses fallback video if primary URL is invalid

2. **Smart WatchNowButton** (`components/ui/WatchNowButton.tsx`)
   - Now validates URLs and uses fallback videos
   - Shows error message if video is unavailable
   - Gracefully handles missing URLs

3. **Enhanced VideoPlayer** (`components/ui/VideoPlayer.tsx`)
   - Added proper error event handlers
   - Displays helpful error messages
   - Logs detailed error information for debugging

## 🎬 Fallback Video URLs Available

The system automatically provides sample videos from reliable CDNs:

```
Mux CDN:
- https://stream.mux.com/VZtzUzGRv02ignSoVtNAvMK5OilrEiug65OqFALFF00/low.mp4
- https://stream.mux.com/O6LdRc0V9kVHB8tBE00XstHFU002VQd2FG7Puy1ec68/low.mp4
- https://stream.mux.com/j0lYV524UgD3HQtv01SHx12OilLroTKnYvj9y5Kjw9E/low.mp4

Google Sample Videos (Reliable & Fast):
- https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4
- https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4
- https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4
- https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4
- https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4
```

## 🔧 How Video URL Validation Works

### Code Example (lib/video-utils.ts)

```typescript
import { getVideoUrl } from '@/lib/video-utils';

// Get video URL with automatic fallback
const videoUrl = getVideoUrl(
  movie.videoUrl,  // Primary URL from API
  movie.id,        // Content ID for consistent fallback selection
  true             // Use fallback if primary is invalid
);

// Check if URL is valid
const isValid = isValidVideoUrl(movie.videoUrl);
```

## 🚀 Using the Video Player

### Basic Usage

```tsx
import WatchNowButton from '@/components/ui/WatchNowButton';

export function MovieCard({ movie }) {
  return (
    <WatchNowButton
      url={movie.videoUrl}
      title={movie.title}
      contentId={movie.id.toString()}
      contentType="movie"
      internal={true}
    />
  );
}
```

### With Fallback Handling

```tsx
import { getVideoUrl } from '@/lib/video-utils';

export function MoviePage({ movie }) {
  const validVideoUrl = getVideoUrl(movie.videoUrl, movie.id, true);
  
  return (
    <WatchNowButton
      url={validVideoUrl}
      title={movie.title}
      contentId={movie.id.toString()}
      contentType="movie"
      internal={true}
    />
  );
}
```

## 🔍 Debugging

### If Video Still Won't Play

1. **Check Browser Console:**
   - Look for error messages starting with "Video error:"
   - Note the error code (1-4)

2. **Error Codes:**
   - `1 = MEDIA_ERR_ABORTED` - Download was aborted
   - `2 = MEDIA_ERR_NETWORK` - Network error
   - `3 = MEDIA_ERR_DECODE` - Decoding error (unsupported format)
   - `4 = MEDIA_ERR_SRC_NOT_SUPPORTED` - Source format not supported

3. **Common Solutions:**

   **If URL returns 404:**
   ```bash
   # Test URL in browser
   curl -I "https://your-video-url.mp4"
   # Should return 200, not 404
   ```

   **If CORS error occurs:**
   - Video server must have CORS headers
   - Use CDN URLs that support CORS (provided fallbacks do)

   **If format is unsupported:**
   - Use MP4, WebM, or OGG formats
   - HTML5 supports: .mp4 (H.264), .webm, .ogg
   - HLS (.m3u8) also supported

4. **Enable Debug Logging:**
   ```typescript
   // In browser console
   localStorage.setItem('DEBUG_VIDEO_PLAYER', 'true');
   
   // Your code
   if (localStorage.getItem('DEBUG_VIDEO_PLAYER')) {
     console.log('Video URL:', videoUrl);
     console.log('Is Valid:', isValidVideoUrl(videoUrl));
   }
   ```

## 📝 API Integration

### Expected Movie Object from API

Your API should return movie objects with this structure:

```typescript
interface Movie {
  id: number;
  title: string;
  slug: string;
  
  // Video URLs (at least one should be valid)
  videoUrl: string;        // Main video - required
  trailerUrl?: string;     // Optional trailer URL
  
  // Display properties
  posterImage: string;     // Poster image URL
  posterAlt: string;       // Poster alt text
  description: string;
  // ... other properties
}
```

### Sample API Response

```json
{
  "data": {
    "id": 1,
    "title": "The Last Hunt",
    "slug": "the-last-hunt",
    "videoUrl": "https://your-cdn.com/videos/the-last-hunt.mp4",
    "trailerUrl": "https://your-cdn.com/trailers/the-last-hunt.mp4",
    "posterImage": "https://your-cdn.com/posters/the-last-hunt.jpg",
    "posterAlt": "The Last Hunt Poster",
    "description": "In a world where survival is the only law..."
  }
}
```

### If API Returns Null/Empty videoUrl

The system will automatically use a fallback video for testing. Update your API to return valid video URLs.

## 🎯 Testing Checklist

- [ ] Click "Watch Now" button on a movie
- [ ] Video player opens in modal
- [ ] Video starts playing (or shows fallback)
- [ ] Playback controls work (play/pause, volume, seek)
- [ ] Fullscreen button works
- [ ] Close button closes player
- [ ] Progress is saved in "Continue Watching"
- [ ] Resuming video starts from saved time
- [ ] Browser console shows no errors

## 📊 Video Format Support

| Format | Extension | Support |
|--------|-----------|---------|
| H.264 | .mp4 | ✅ Full Support |
| VP9/VP8 | .webm | ✅ Full Support |
| Theora | .ogg | ✅ Full Support |
| HLS Stream | .m3u8 | ✅ Full Support (via HLS.js) |
| DASH Stream | .mpd | ✅ Support (via DASH.js) |

## 🔗 Integration Points

The video player is integrated in these locations:

1. **Movie Details Page** - `app/movies/[slug]/page.tsx`
   - Uses WatchNowButton with WatchTrackingVideoPlayer
   - Automatic progress tracking

2. **Interactive Content** - `components/interactive/SceneManager.tsx`
   - Uses WatchTrackingVideoPlayer directly
   - Tracks scene/episode progress

3. **Continue Watching** - `components/home/continueWatching.tsx`
   - Displays user's watch history
   - Resume buttons use VideoPlayerModal

4. **Episodes** - `app/episodes/[slug]/page.tsx` (ready to implement)
5. **Search Results** - `app/search/page.tsx` (ready to implement)
6. **Browse Pages** - `app/browse/page.tsx` (ready to implement)

## 💡 Pro Tips

1. **For Development/Testing:**
   - Use the provided fallback URLs to test UI/UX
   - They're CORS-enabled and reliable

2. **For Production:**
   - Ensure your API returns valid `videoUrl` values
   - Use CDNs that support CORS headers
   - Test with real video URLs before deploying

3. **Performance:**
   - HLS streams provide adaptive bitrate
   - Use poster images for faster perceived load time
   - Video player uses efficient event handling

4. **User Experience:**
   - Auto-resume from saved progress works automatically
   - Progress updates are debounced (5-second intervals)
   - No manual calls needed for tracking

## 📚 Related Files

- `lib/video-utils.ts` - Video URL validation
- `lib/api/watch-progress.api.ts` - Progress tracking API
- `hooks/useWatchProgress.ts` - Progress tracking hook
- `components/ui/VideoPlayer.tsx` - Core player component
- `components/ui/WatchTrackingVideoPlayer.tsx` - Progress-aware wrapper
- `components/ui/VideoPlayerModal.tsx` - Fullscreen modal wrapper
- `components/ui/WatchNowButton.tsx` - Smart play button

## ❓ FAQ

**Q: Why is the fallback video showing?**
A: The API is returning `null` or invalid video URL. Update your backend to return valid URLs.

**Q: Can I use YouTube videos?**
A: Yes! The system detects YouTube URLs and handles them appropriately.

**Q: How often is progress saved?**
A: Every 5 seconds (debounced) to avoid excessive API calls.

**Q: What if I want to use external player?**
A: Set `internal={false}` on WatchNowButton - it will open the URL in a new tab.

**Q: How do I customize the player appearance?**
A: Edit `components/ui/VideoPlayer.tsx` and `components/ui/VideoPlayerModal.tsx` styles.
