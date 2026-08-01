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

  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return cleanPath;
}

