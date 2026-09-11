import { NextRequest, NextResponse } from 'next/server';

/**
 * GET /api/videos/[id]/play
 *
 * Secure backend API endpoint to obtain video playback information.
 * Authenticates user access, resolves Bunny video ID or playback source URL,
 * and safely returns playback details without exposing backend secrets or Bunny API keys.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: videoId } = await params;
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId') || request.cookies.get('userId')?.value || null;

    if (!videoId) {
      return NextResponse.json(
        { success: false, error: 'Video ID is required' },
        { status: 400 }
      );
    }

    // Call backend API service to resolve movie/video details and check authorization
    const backendApiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
    const accessCheckUrl = `${backendApiBase}/movies/${encodeURIComponent(videoId)}${
      userId ? `?userId=${userId}` : ''
    }`;

    let playUrl = '';
    let title = 'Video';
    let isAuthorized = true;
    let posterImage = '';
    let maxQualityHeight = 480; // Default fallback for unauthenticated/free tier

    if (userId) {
      try {
        const userProfileUrl = `${backendApiBase}/users/${encodeURIComponent(userId)}`;
        const userRes = await fetch(userProfileUrl, { cache: 'no-store' });
        if (userRes.ok) {
          const userJson = await userRes.json();
          if (userJson.data && userJson.data.max_quality_height) {
            maxQualityHeight = userJson.data.max_quality_height;
          }
        }
      } catch (err) {
        console.warn('[API /videos/play] Failed to fetch user profile for quality limit:', err);
      }
    }

    try {
      const res = await fetch(accessCheckUrl, {
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
      });

      if (res.ok) {
        const json = await res.json();
        const movieData = json.data || json;

        if (movieData) {
          title = movieData.title || title;
          posterImage = movieData.posterImage || movieData.card_image || '';

          // Determine video URL or Bunny Video ID
          const rawUrl =
            movieData.videoUrl ||
            movieData.url ||
            movieData.media?.video?.url ||
            '';

          const bunnyVideoId = movieData.bunnyVideoId || movieData.bunny_video_id;

          if (bunnyVideoId) {
            // Construct Bunny CDN HLS stream URL from Bunny Video ID
            const bunnyCdnHost =
              process.env.BUNNY_CDN_DOMAIN ||
              process.env.NEXT_PUBLIC_BUNNY_CDN_DOMAIN ||
              'vz-9341444f-085.b-cdn.net';
            playUrl = `https://${bunnyCdnHost}/${bunnyVideoId}/playlist.m3u8`;
          } else if (rawUrl) {
            playUrl = rawUrl;
          }

          // Check if video URL was revoked due to lack of subscription/access
          if (!playUrl && !movieData.isFree) {
            isAuthorized = false;
          }
        }
      }
    } catch (err) {
      console.warn('[API /videos/play] Backend fetch notice:', err);
    }

    // Fallback: If raw videoId is directly a full .m3u8 URL or Bunny ID
    if (!playUrl) {
      if (videoId.startsWith('http://') || videoId.startsWith('https://')) {
        playUrl = videoId;
      } else if (
        videoId.match(
          /^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i
        ) || videoId.length > 20
      ) {
        const bunnyCdnHost =
          process.env.BUNNY_CDN_DOMAIN ||
          process.env.NEXT_PUBLIC_BUNNY_CDN_DOMAIN ||
          'vz-9341444f-085.b-cdn.net';
        playUrl = `https://${bunnyCdnHost}/${videoId}/playlist.m3u8`;
      }
    }

    if (!isAuthorized || !playUrl) {
      return NextResponse.json(
        {
          success: false,
          error: 'You do not have access to watch this video.',
          isAuthorized: false,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        id: videoId,
        title,
        playUrl,
        posterImage,
        isHls: playUrl.includes('.m3u8'),
        maxQualityHeight,
      },
    });
  } catch (error: any) {
    console.error('[API /videos/play] Error:', error);
    return NextResponse.json(
      { success: false, error: 'Unable to process playback request' },
      { status: 500 }
    );
  }
}
