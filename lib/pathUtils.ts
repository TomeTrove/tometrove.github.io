/**
 * Gets the configured basePath from environment variable
 * This is set in .env.local (e.g., NEXT_PUBLIC_BASE_PATH=/tome-archives)
 *
 * Returns the basePath string (e.g., "/tome-archives" or "")
 */
export function getBasePath(): string {
  // Access the environment variable that was set in next.config.mjs
  // NEXT_PUBLIC_BASE_PATH is available in the browser
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return basePath;
}

/**
 * Constructs a full URL for opening in a new window
 * Automatically handles basePath configuration from env variable
 *
 * @param relativePath - The relative path (e.g., "/tools/viewer")
 * @returns The absolute URL with basePath prepended (e.g., "/tome-archives/tools/viewer")
 */
export function getAbsoluteUrl(relativePath: string): string {
  const basePath = getBasePath();
  return `${basePath}${relativePath}`;
}
