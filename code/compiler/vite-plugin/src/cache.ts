/**
 * Shared cache for Tamagui vite plugin
 *
 * Uses globalThis to share state across vite environments (SSR, client, etc.)
 * This prevents duplicate babel transforms when both SSR and client process the same file.
 *
 * The cache stores compiled JS separately from CSS imports so that:
 * - SSR gets just the JS (no CSS import needed)
 * - Client gets JS + CSS import
 */

export type CacheEntry = {
  js: string
  map: any
  cssImport: string | null
}

const KEYS = {
  cache: '__tamagui_vite_cache__',
  size: '__tamagui_vite_cache_size__',
  pending: '__tamagui_vite_pending__',
} as const

// max cache size before clearing (~64MB)
const MAX_CACHE_SIZE = 67108864

function getGlobal<T>(key: string, defaultValue: T): T {
  if ((globalThis as any)[key] === undefined) {
    ;(globalThis as any)[key] = defaultValue
  }
  return (globalThis as any)[key]
}

function setGlobal<T>(key: string, value: T): void {
  ;(globalThis as any)[key] = value
}

/**
 * Get the shared extraction cache
 */
export function getCache(): Record<string, CacheEntry> {
  return getGlobal(KEYS.cache, {})
}

/**
 * Get a cached entry
 */
export function getCached(key: string): CacheEntry | undefined {
  return getCache()[key]
}

/**
 * Store an entry in the cache
 * Automatically clears cache if size limit exceeded
 */
export function setCache(key: string, entry: CacheEntry): void {
  const cache = getCache()
  const currentSize = getGlobal<number>(KEYS.size, 0)
  const newSize = currentSize + entry.js.length

  if (newSize > MAX_CACHE_SIZE) {
    clearCache()
  } else {
    setGlobal(KEYS.size, newSize)
  }

  cache[key] = entry
}

/**
 * Clear all cached entries
 */
export function clearCache(): void {
  setGlobal(KEYS.cache, {})
  setGlobal(KEYS.size, 0)
}

/**
 * Get the pending extractions map
 * Used to dedupe concurrent requests for the same file
 */
export function getPending(): Map<string, Promise<CacheEntry | null>> {
  return getGlobal(KEYS.pending, new Map())
}

/**
 * Check if an extraction is already in progress for a key
 */
export function getPendingExtraction(
  key: string
): Promise<CacheEntry | null> | undefined {
  return getPending().get(key)
}

/**
 * Mark an extraction as in progress
 */
export function setPendingExtraction(
  key: string,
  promise: Promise<CacheEntry | null>
): void {
  getPending().set(key, promise)
}

/**
 * Clear a pending extraction
 */
export function clearPendingExtraction(key: string): void {
  getPending().delete(key)
}
