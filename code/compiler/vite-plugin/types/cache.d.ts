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
    js: string;
    map: any;
    cssImport: string | null;
};
/**
 * Get the shared extraction cache
 */
export declare function getCache(): Record<string, CacheEntry>;
/**
 * Get a cached entry
 */
export declare function getCached(key: string): CacheEntry | undefined;
/**
 * Store an entry in the cache
 * Automatically clears cache if size limit exceeded
 */
export declare function setCache(key: string, entry: CacheEntry): void;
/**
 * Clear all cached entries
 */
export declare function clearCache(): void;
/**
 * Get the pending extractions map
 * Used to dedupe concurrent requests for the same file
 */
export declare function getPending(): Map<string, Promise<CacheEntry | null>>;
/**
 * Check if an extraction is already in progress for a key
 */
export declare function getPendingExtraction(key: string): Promise<CacheEntry | null> | undefined;
/**
 * Mark an extraction as in progress
 */
export declare function setPendingExtraction(key: string, promise: Promise<CacheEntry | null>): void;
/**
 * Clear a pending extraction
 */
export declare function clearPendingExtraction(key: string): void;
//# sourceMappingURL=cache.d.ts.map