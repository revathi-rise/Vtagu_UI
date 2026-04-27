# 🎯 Video Player Quick Reference

## Issue vs Solution Matrix

| Issue | Symptom | Fix |
|-------|---------|-----|
| **Format Error** | MEDIA_ELEMENT_ERROR | Use MP4, WebM, or YouTube URL |
| **CORS Error** | Network error / No sound | Ensure video URL has CORS headers |
| **YouTube Blocked** | Video embedded restricted | Check YouTube video allow embedding setting |
| **HLS Error** | Format error on m3u8 | HLS.js library will be auto-loaded |
| **Invalid URL** | 404 error | Verify video URL is accessible |
| **No Autoplay** | Video doesn't start | Check browser autoplay policy (may need muted) |
| **No Progress Save** | Progress not resuming | Check userId is set in localStorage |

## One-Line Integration

```tsx
<WatchNowButton url="VIDEO_URL" title="Video Title" contentId="id1" internal={true} />
```

Supports: YouTube URLs, MP4, WebM, HLS, and fallback testing videos.

## Supported URL Examples

```
✅ https://youtube.com/watch?v=dQw4w9WgXcQ
✅ https://youtu.be/dQw4w9WgXcQ
✅ https://example.com/video.mp4
✅ https://stream.mux.com/VIDEO_ID/low.mp4
✅ https://example.com/stream.m3u8
```

## New Components

| Component | File | Use Case |
|-----------|------|----------|
| `YouTubePlayer` | `components/ui/YouTubePlayer.tsx` | Direct YouTube embed |
| `UniversalVideoPlayer` | `components/ui/UniversalVideoPlayer.tsx` | Auto-detect native/YouTube |
| `WatchTrackingVideoPlayer` | `components/ui/WatchTrackingVideoPlayer.tsx` | With progress tracking |
| `VideoPlayerModal` | `components/ui/VideoPlayerModal.tsx` | Fullscreen modal |

## Video Type Detection

```tsx
import { getVideoType, isYouTubeUrl, getYouTubeVideoId } from '@/lib/video-utils';

getVideoType(url)           // Returns: 'youtube' | 'native' | 'unknown'
isYouTubeUrl(url)          // Returns: boolean
getYouTubeVideoId(url)     // Returns: 'VIDEO_ID' or null
```

## Error Messages & Fixes

```
❌ Video loading was aborted
   → Retry, check network connection

🌐 Network error - Check your connection
   → Verify video URL is accessible, check internet

⚠️ Video decoding failed - Format may not be supported
   → Convert to MP4 or WebM, use YouTube for complex formats

📁 Video format not supported by your browser
   → Use MP4 (most compatible), WebM (good support)

📺 YouTube video not available
   → Check YouTube embed settings allow this video
```

## API Response Format

Your API should return:
```json
{
  "videoUrl": "https://youtube.com/watch?v=...",  // or native URL
  "title": "Video Title",
  "id": "123",
  "posterImage": "https://...",
  ...
}
```

## Common Tasks

### Play YouTube Video
```tsx
<WatchNowButton 
  url="https://youtube.com/watch?v=ID"
  title="Title"
  contentId="123"
  internal={true}
/>
```

### Play Native Video with Progress
```tsx
<WatchTrackingVideoPlayer
  src="https://example.com/video.mp4"
  contentId="123"
  userId={userId}
  autoResume={true}
/>
```

### Auto-Detect & Play
```tsx
<UniversalVideoPlayer
  src={videoUrl}  // Detects YouTube or native
  contentId="123"
  autoPlay={true}
/>
```

### Extract YouTube ID
```tsx
import { getYouTubeVideoId } from '@/lib/video-utils';

const id = getYouTubeVideoId('https://youtube.com/watch?v=dQw4w9WgXcQ');
// Result: 'dQw4w9WgXcQ'
```

## Testing with Fallback Videos

Fallback videos are automatically used when API returns `null`:
- Mux CDN videos (3 samples)
- Google sample videos (5 samples)
- All CORS-enabled & reliable

## Browser Support

| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| MP4 | ✅ | ✅ | ✅ | ✅ |
| WebM | ✅ | ✅ | ❌ | ✅ |
| HLS | ✅ | ✅ | ✅ | ✅ |
| YouTube | ✅ | ✅ | ✅ | ✅ |

## Props Reference

### WatchNowButton
```tsx
{
  url: string;                          // Video URL (required)
  title?: string;                       // Display title
  contentId?: string;                   // Content ID for tracking
  contentType?: 'movie' | 'episode';   // Type
  internal?: boolean;                   // Use internal player (default: true)
}
```

### UniversalVideoPlayer
```tsx
{
  src: string;                          // Video URL (supports YouTube & native)
  autoPlay?: boolean;
  showControls?: boolean;
  onTimeUpdate?: (current, duration) => void;
  onEnded?: () => void;
  // ... standard video props
}
```

### YouTubePlayer
```tsx
{
  videoId: string;                      // YouTube video ID only
  autoPlay?: boolean;
  onTimeUpdate?: (current, duration) => void;
  onEnded?: () => void;
  className?: string;
}
```

## Files Modified/Created

**New:**
- `components/ui/YouTubePlayer.tsx` (95 lines)
- `components/ui/UniversalVideoPlayer.tsx` (85 lines)
- `lib/video-utils.ts` (Enhanced with YouTube support)

**Updated:**
- `components/ui/WatchTrackingVideoPlayer.tsx` (Uses UniversalVideoPlayer)
- `components/ui/VideoPlayer.tsx` (Better error handling)
- `components/ui/WatchNowButton.tsx` (URL validation)

## Performance Notes

- YouTube videos: No bandwidth on your server
- Native videos: Use your bandwidth/CDN
- HLS: Adaptive bitrate (best quality for connection)
- Progress tracking: 5-second debounce (efficient)

## Next Steps

1. ✅ Fixed format errors
2. ✅ Added YouTube support
3. ⏳ Test with your API video URLs
4. ⏳ Configure CORS on your video server
5. ⏳ Update remaining pages with new components
