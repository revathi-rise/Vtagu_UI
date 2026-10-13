/**
 * Cross-browser Fullscreen Utilities
 * Supports standard Fullscreen API, WebKit prefixes, Mozilla prefixes, MS prefixes,
 * and Safari iOS native video fullscreen.
 */

export function getFullscreenElement(): Element | null {
  if (typeof document === 'undefined') return null;
  const doc = document as any;
  return (
    doc.fullscreenElement ||
    doc.webkitFullscreenElement ||
    doc.mozFullScreenElement ||
    doc.msFullscreenElement ||
    null
  );
}

export function isElementFullscreen(
  element: HTMLElement | null,
  videoElement?: HTMLVideoElement | null
): boolean {
  if (!element && !videoElement) return false;

  const fsElement = getFullscreenElement();
  if (fsElement) {
    if (
      element &&
      (fsElement === element ||
        element.contains(fsElement) ||
        fsElement.contains(element))
    ) {
      return true;
    }
    if (
      videoElement &&
      (fsElement === videoElement ||
        videoElement.contains(fsElement) ||
        fsElement.contains(videoElement))
    ) {
      return true;
    }
  }

  // iOS Safari native video fullscreen check
  if (videoElement && (videoElement as any).webkitDisplayingFullscreen) {
    return true;
  }

  return false;
}

export async function requestElementFullscreen(
  element: HTMLElement | null,
  videoElement?: HTMLVideoElement | null
): Promise<boolean> {
  if (!element && !videoElement) return false;

  try {
    const el = element as any;
    if (el?.requestFullscreen) {
      await el.requestFullscreen();
      return true;
    } else if (el?.webkitRequestFullscreen) {
      await el.webkitRequestFullscreen();
      return true;
    } else if (el?.mozRequestFullScreen) {
      await el.mozRequestFullScreen();
      return true;
    } else if (el?.msRequestFullscreen) {
      await el.msRequestFullscreen();
      return true;
    } else if (videoElement) {
      const vid = videoElement as any;
      if (typeof vid.webkitEnterFullscreen === 'function') {
        vid.webkitEnterFullscreen();
        return true;
      } else if (vid.requestFullscreen) {
        await vid.requestFullscreen();
        return true;
      }
    }
  } catch (err) {
    console.warn('Failed to enter fullscreen mode:', err);
    return false;
  }
  return false;
}

export async function exitDocumentFullscreen(
  videoElement?: HTMLVideoElement | null
): Promise<boolean> {
  if (typeof document === 'undefined') return false;
  const doc = document as any;

  try {
    // If video element is in iOS Safari native fullscreen
    if (videoElement) {
      const vid = videoElement as any;
      if (vid.webkitDisplayingFullscreen && typeof vid.webkitExitFullscreen === 'function') {
        vid.webkitExitFullscreen();
        return true;
      }
    }

    if (getFullscreenElement()) {
      if (doc.exitFullscreen) {
        await doc.exitFullscreen();
        return true;
      } else if (doc.webkitExitFullscreen) {
        await doc.webkitExitFullscreen();
        return true;
      } else if (doc.mozCancelFullScreen) {
        await doc.mozCancelFullScreen();
        return true;
      } else if (doc.msExitFullscreen) {
        await doc.msExitFullscreen();
        return true;
      }
    }
  } catch (err) {
    console.warn('Failed to exit fullscreen mode:', err);
    return false;
  }
  return false;
}

export function addFullscreenChangeListener(
  callback: () => void,
  videoElement?: HTMLVideoElement | null
): () => void {
  if (typeof document === 'undefined') return () => {};

  const handleEvent = () => {
    callback();
  };

  const doc = document;
  doc.addEventListener('fullscreenchange', handleEvent);
  doc.addEventListener('webkitfullscreenchange', handleEvent);
  doc.addEventListener('mozfullscreenchange', handleEvent);
  doc.addEventListener('MSFullscreenChange', handleEvent);

  if (videoElement) {
    videoElement.addEventListener('webkitbeginfullscreen', handleEvent);
    videoElement.addEventListener('webkitendfullscreen', handleEvent);
  }

  return () => {
    doc.removeEventListener('fullscreenchange', handleEvent);
    doc.removeEventListener('webkitfullscreenchange', handleEvent);
    doc.removeEventListener('mozfullscreenchange', handleEvent);
    doc.removeEventListener('MSFullscreenChange', handleEvent);
    if (videoElement) {
      videoElement.removeEventListener('webkitbeginfullscreen', handleEvent);
      videoElement.removeEventListener('webkitendfullscreen', handleEvent);
    }
  };
}
