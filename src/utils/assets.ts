/**
 * Helper to resolve public asset URLs (videos, music, photos) so they work
 * consistently across local dev, GitHub Pages subfolder deployments, and Cloud Run.
 */
export function getAssetUrl(path?: string): string {
  if (!path) return "";
  if (
    path.startsWith("http://") ||
    path.startsWith("https://") ||
    path.startsWith("data:") ||
    path.startsWith("blob:")
  ) {
    return path;
  }

  const cleanPath = path.startsWith("/") ? path.slice(1) : path;

  try {
    if (typeof window !== "undefined" && window.location) {
      let basePath = window.location.pathname;
      // Strip trailing filename if present (e.g. /girlfriend-day/index.html -> /girlfriend-day/)
      if (/\.[a-zA-Z0-9]+$/.test(basePath)) {
        basePath = basePath.substring(0, basePath.lastIndexOf("/") + 1);
      }
      if (!basePath.endsWith("/")) {
        basePath += "/";
      }
      return `${window.location.origin}${basePath}${cleanPath}`;
    }
  } catch (e) {
    console.warn("Error resolving asset URL:", e);
  }

  return `./${cleanPath}`;
}

