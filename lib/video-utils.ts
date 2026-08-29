/**
 * Video URL utilities for handling video sources and fallbacks
 */

// High-quality test video URLs that support CORS
export const FALLBACK_VIDEO_URLS = {
  // Mux test streams - reliable and fast
  sample1: 'https://stream.mux.com/VZtzUzGRv02ignSoVtNAvMK5OilrEiug65OqFALFF00/low.mp4',
  sample2: 'https://stream.mux.com/O6LdRc0V9kVHB8tBE00XstHFU002VQd2FG7Puy1ec68/low.mp4',
  sample3: 'https://stream.mux.com/j0lYV524UgD3HQtv01SHx12OilLroTKnYvj9y5Kjw9E/low.mp4',
  
  // Google's sample videos - also reliable
  bigBuckBunny: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/BigBuckBunny.mp4',
  elephantsDream: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ElephantsDream.mp4',
  forBiggerBlazes: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerBlazes.mp4',
  forBiggerEscapes: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/ForBiggerEscapes.mp4',
  sintelTrailer: 'https://commondatastorage.googleapis.com/gtv-videos-library/sample/Sintel.mp4',
};

/**
 * Get a fallback video URL based on content ID for testing
 */
export function getFallbackVideoUrl(contentId: string): string {
  const videoOptions = Object.values(FALLBACK_VIDEO_URLS);
  
  // Use content ID hash to deterministically select a video
  const hash = contentId.split('').reduce((a, c) => ((a << 5) - a) + c.charCodeAt(0), 0);
  const index = Math.abs(hash) % videoOptions.length;
  
  return videoOptions[index];
}

/**
 * Detect if URL is a YouTube video
 */
export function isYouTubeUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('youtube.com') || lowerUrl.includes('youtu.be');
}

/**
 * Extract YouTube video ID from various YouTube URL formats
 */
export function getYouTubeVideoId(url: string): string | null {
  if (!isYouTubeUrl(url)) return null;
  
  // Handle different YouTube URL formats
  let videoId = '';
  
  // youtu.be/videoId
  if (url.includes('youtu.be/')) {
    videoId = url.split('youtu.be/')[1]?.split('?')[0] || '';
  }
  // youtube.com/watch?v=videoId
  else if (url.includes('watch?v=')) {
    videoId = new URLSearchParams(url.split('?')[1]).get('v') || '';
  }
  // youtube.com/embed/videoId
  else if (url.includes('embed/')) {
    videoId = url.split('embed/')[1]?.split('?')[0] || '';
  }
  // youtube.com/v/videoId
  else if (url.includes('/v/')) {
    videoId = url.split('/v/')[1]?.split('?')[0] || '';
  }
  // youtube.com/shorts/videoId
  else if (url.includes('/shorts/')) {
    videoId = url.split('/shorts/')[1]?.split('?')[0] || '';
  }
  
  return videoId || null;
}

/**
 * Get YouTube embed URL
 */
export function getYouTubeEmbedUrl(videoUrl: string): string | null {
  const videoId = getYouTubeVideoId(videoUrl);
  if (!videoId) return null;
  
  return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&modestbranding=1&rel=0&fs=1&iv_load_policy=3`;
}

/**
 * Detect if URL is a Rumble video
 */
export function isRumbleUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  const lowerUrl = url.toLowerCase();
  return lowerUrl.includes('rumble.com');
}

/**
 * Extract Rumble embed URL or Video ID
 */
export function getRumbleEmbedUrl(url: string | null | undefined): string | null {
  if (!url || !isRumbleUrl(url)) return null;

  // Already an embed URL format: rumble.com/embed/<id>
  if (url.includes('rumble.com/embed/')) {
    const parts = url.split('rumble.com/embed/')[1]?.split('/')[0]?.split('?')[0];
    if (parts) {
      return `https://rumble.com/embed/${parts}/`;
    }
    return url;
  }

  // Watch URL format: rumble.com/v123abc-title.html or rumble.com/v123abc
  const match = url.match(/rumble\.com\/(v[a-zA-Z0-9]+)/i);
  if (match && match[1]) {
    return `https://rumble.com/embed/${match[1]}/`;
  }

  return null;
}

/**
 * Detect video type from URL
 */
export type VideoType = 'native' | 'youtube' | 'rumble' | 'iframe' | 'unknown';

export function getVideoType(url: string | null | undefined): VideoType {
  if (!url || typeof url !== 'string') return 'unknown';
  
  if (isYouTubeUrl(url)) return 'youtube';

  if (isRumbleUrl(url)) return 'rumble';
  
  if (url.includes('iframe.mediadelivery.net') || url.includes('iframe') || url.includes('/embed/')) {
    return 'iframe';
  }
  
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.m3u8', '.mov', '.mkv'];
  const lowerUrl = url.toLowerCase();
  
  if (videoExtensions.some(ext => lowerUrl.includes(ext)) ||
      url.includes('stream.mux.com') ||
      url.includes('commondatastorage.googleapis.com')) {
    return 'native';
  }
  
  return 'unknown';
}

/**
 * Validate video URL
 */
export function isValidVideoUrl(url: string | null | undefined): boolean {
  if (!url || typeof url !== 'string') return false;
  
  try {
    // Check if it's YouTube
    if (isYouTubeUrl(url)) {
      return !!getYouTubeVideoId(url);
    }

    // Check if it's Rumble
    if (isRumbleUrl(url)) {
      return !!getRumbleEmbedUrl(url);
    }

    // Check if it's a valid iframe/embed source
    if (url.includes('iframe.mediadelivery.net') || url.includes('iframe') || url.includes('/embed/')) {
      return true;
    }
    
    // Check if it's a valid native video URL
    new URL(url);
    const videoExtensions = ['.mp4', '.webm', '.ogg', '.m3u8', '.mov'];
    const lowerUrl = url.toLowerCase();
    return videoExtensions.some(ext => lowerUrl.includes(ext)) || 
           url.includes('stream.mux.com') ||
           url.includes('commondatastorage.googleapis.com');
  } catch {
    return false;
  }
}

/**
 * Get video URL with fallback
 */
export function getVideoUrl(
  primaryUrl: string | null | undefined, 
  contentId: string = 'video',
  useFallback: boolean = true
): string {
  // If primary URL is valid, use it
  if (isValidVideoUrl(primaryUrl)) {
    return primaryUrl as string;
  }
  
  // If no fallback requested, return empty string
  if (!useFallback) {
    console.warn(`Invalid video URL: ${primaryUrl}`);
    return '';
  }
  
  // Use fallback
  console.warn(`Using fallback video for contentId: ${contentId}`);
  return getFallbackVideoUrl(contentId);
}

export const FALLBACK_SHORT_POSTERS = [
  'https://images.unsplash.com/photo-1536440136628-849c177e76a1?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1542204165-65bf26472b9b?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1509281373149-e957c6296406?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1626814026160-2237a95fc5a0?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1605806616949-1e87b487cb2a?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1515630278258-407f66498911?q=80&w=600&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541873676-a18131494184?q=80&w=600&auto=format&fit=crop',
];

/**
 * Resolves a thumbnail URL for a short item with YouTube and fallback support
 */
export function getShortThumbnailUrl(short: any, index: number = 0): string {
  if (!short) return FALLBACK_SHORT_POSTERS[index % FALLBACK_SHORT_POSTERS.length];

  // 1. Check explicit thumbnail properties
  const url = short.thumbnail_url || short.thumbnail || short.poster_url || short.poster || short.poster_image || short.image;
  if (url && typeof url === 'string' && url.trim().length > 0) {
    return url.trim();
  }

  // 2. Extract YouTube thumbnail if video_url is a YouTube link
  if (short.video_url && typeof short.video_url === 'string') {
    const ytId = getYouTubeVideoId(short.video_url);
    if (ytId) {
      return `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
    }
  }

  // 3. Fallback vertical poster image
  const seed = (typeof short.id === 'number' ? short.id : 0) + index;
  return FALLBACK_SHORT_POSTERS[Math.abs(seed) % FALLBACK_SHORT_POSTERS.length];
}
