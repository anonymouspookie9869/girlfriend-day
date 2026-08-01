import { useState, useEffect, useCallback } from "react";

/**
 * Default GitHub Raw content base URL fallback for media assets
 */
export const DEFAULT_GITHUB_CDN_BASE =
  "https://cdn.jsdelivr.net/gh/anonymouspookie9869/girlfriend-day@main/public";

/**
 * Normalizes any media URL: converts raw.githubusercontent.com URLs to jsDelivr CDN
 * so that browsers receive proper MIME types (image/jpeg, video/mp4, audio/mpeg) and byte ranges.
 */
export function normalizeMediaUrl(url?: string): string {
  if (!url) return "";

  // Convert raw.githubusercontent.com -> cdn.jsdelivr.net/gh
  if (url.includes("raw.githubusercontent.com")) {
    const match = url.match(/raw\.githubusercontent\.com\/([^/]+)\/([^/]+)\/([^/]+)\/(.+)/);
    if (match) {
      const [, user, repo, branch, path] = match;
      return `https://cdn.jsdelivr.net/gh/${user}/${repo}@${branch}/${path}`;
    }
  }

  return url;
}

/**
 * Converts a relative path into a jsDelivr GitHub CDN URL
 */
export function getGitHubCdnUrl(path?: string, cdnBase: string = DEFAULT_GITHUB_CDN_BASE): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return normalizeMediaUrl(path);
  }
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${cdnBase}${cleanPath}`;
}

/**
 * Helper to resolve public asset URLs (videos, music, photos).
 * Automatically converts GitHub raw URLs to jsDelivr CDN URLs.
 */
export function getAssetUrl(path?: string): string {
  if (!path) return "";
  const normalized = normalizeMediaUrl(path);
  if (
    normalized.startsWith("http://") ||
    normalized.startsWith("https://") ||
    normalized.startsWith("data:") ||
    normalized.startsWith("blob:")
  ) {
    return normalized;
  }

  const cleanPath = normalized.startsWith("/") ? normalized : `/${normalized}`;

  // Automatically route relative media assets to jsDelivr GitHub CDN to ensure Vercel and mobile deployments work perfectly
  if (
    cleanPath.startsWith("/photos/") ||
    cleanPath.startsWith("/videos/") ||
    cleanPath.startsWith("/music/")
  ) {
    return `${DEFAULT_GITHUB_CDN_BASE}${cleanPath}`;
  }

  return cleanPath;
}

/**
 * Preloads an image and resolves true if successful, false if failed.
 * Includes retry mechanism with configurable delay for mobile devices.
 */
export function preloadImage(
  url: string,
  retries: number = 2,
  delayMs: number = 800
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempted = 0;

    const attemptLoad = () => {
      const img = new Image();
      img.src = url;

      img.onload = () => resolve(true);

      img.onerror = () => {
        attempted++;
        if (attempted <= retries) {
          setTimeout(attemptLoad, delayMs);
        } else {
          resolve(false);
        }
      };
    };

    attemptLoad();
  });
}

/**
 * Checks if an audio URL can be loaded and played.
 * Includes retry mechanism with configurable delay for mobile devices.
 */
export function preloadAudio(
  url: string,
  retries: number = 2,
  delayMs: number = 800
): Promise<boolean> {
  return new Promise((resolve) => {
    let attempted = 0;

    const attemptLoad = () => {
      const audio = new Audio();
      audio.preload = "metadata";
      audio.src = url;

      const handleSuccess = () => {
        cleanup();
        resolve(true);
      };

      const handleError = () => {
        cleanup();
        attempted++;
        if (attempted <= retries) {
          setTimeout(attemptLoad, delayMs);
        } else {
          resolve(false);
        }
      };

      const cleanup = () => {
        audio.removeEventListener("canplaythrough", handleSuccess);
        audio.removeEventListener("loadedmetadata", handleSuccess);
        audio.removeEventListener("error", handleError);
      };

      audio.addEventListener("canplaythrough", handleSuccess, { once: true });
      audio.addEventListener("loadedmetadata", handleSuccess, { once: true });
      audio.addEventListener("error", handleError, { once: true });

      audio.load();
    };

    attemptLoad();
  });
}

/**
 * Unified loader that tries candidate URLs (primary + fallbacks + GitHub raw)
 * with retries to find a working asset URL.
 */
export async function loadMediaWithRetry(
  primaryUrl: string,
  fallbackUrls: string[] = [],
  options: {
    maxRetries?: number;
    retryDelayMs?: number;
    isAudio?: boolean;
    useGitHubFallback?: boolean;
  } = {}
): Promise<string> {
  const { maxRetries = 2, retryDelayMs = 800, isAudio = false, useGitHubFallback = true } = options;

  const candidates: string[] = [];

  if (primaryUrl) {
    candidates.push(getAssetUrl(primaryUrl));
  }

  fallbackUrls.forEach((fb) => {
    if (fb) candidates.push(getAssetUrl(fb));
  });

  if (useGitHubFallback && primaryUrl && !primaryUrl.startsWith("http")) {
    candidates.push(getGitHubCdnUrl(primaryUrl));
  }

  // Deduplicate candidate URLs
  const uniqueCandidates = Array.from(new Set(candidates));

  for (const candidateUrl of uniqueCandidates) {
    const isSuccess = isAudio
      ? await preloadAudio(candidateUrl, maxRetries, retryDelayMs)
      : await preloadImage(candidateUrl, maxRetries, retryDelayMs);

    if (isSuccess) {
      return candidateUrl;
    }
  }

  // Fallback to first candidate if validation checks fail
  return uniqueCandidates[0] || primaryUrl;
}

/**
 * Custom React Hook for loading images/audio with retry logic and fallback support
 */
export function useMediaLoader(
  primaryUrl?: string,
  fallbackUrls: string[] = [],
  options: {
    maxRetries?: number;
    retryDelayMs?: number;
    isAudio?: boolean;
    autoLoad?: boolean;
  } = {}
) {
  const { maxRetries = 2, retryDelayMs = 800, isAudio = false, autoLoad = true } = options;

  const [src, setSrc] = useState<string>(() => (primaryUrl ? getAssetUrl(primaryUrl) : ""));
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  const loadMedia = useCallback(async () => {
    if (!primaryUrl) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setIsError(false);

    try {
      const workingUrl = await loadMediaWithRetry(primaryUrl, fallbackUrls, {
        maxRetries,
        retryDelayMs,
        isAudio,
      });

      setSrc(workingUrl);
      setIsError(false);
    } catch {
      setIsError(true);
      setSrc(primaryUrl ? getAssetUrl(primaryUrl) : "");
    } finally {
      setIsLoading(false);
    }
  }, [primaryUrl, JSON.stringify(fallbackUrls), maxRetries, retryDelayMs, isAudio]);

  useEffect(() => {
    if (autoLoad) {
      loadMedia();
    }
  }, [autoLoad, loadMedia]);

  return {
    src,
    isLoading,
    isError,
    retry: loadMedia,
  };
}


