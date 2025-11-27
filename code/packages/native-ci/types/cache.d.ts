import { type Platform } from './constants';
export interface CacheOptions {
    platform: Platform;
    fingerprint: string;
    prefix?: string;
}
export interface RedisKVOptions {
    url: string;
    token: string;
}
/**
 * Create a cache key for the native build.
 */
export declare function createCacheKey(options: CacheOptions): string;
/**
 * Save fingerprint mapping to Redis KV store.
 * Used to map pre-fingerprint hash to actual fingerprint for faster lookups.
 */
export declare function saveFingerprintToKV(kv: RedisKVOptions, key: string, fingerprint: string, ttlSeconds?: number): Promise<void>;
/**
 * Get fingerprint from Redis KV store.
 */
export declare function getFingerprintFromKV(kv: RedisKVOptions, key: string): Promise<string | null>;
/**
 * Extend TTL on a KV key.
 */
export declare function extendKVTTL(kv: RedisKVOptions, key: string, ttlSeconds?: number): Promise<void>;
export interface LocalCacheOptions {
    cacheDir?: string;
}
/**
 * Save cache data locally (for testing).
 */
export declare function saveCache(key: string, data: Record<string, unknown>, options?: LocalCacheOptions): void;
/**
 * Load cache data locally (for testing).
 */
export declare function loadCache<T extends Record<string, unknown>>(key: string, options?: LocalCacheOptions): T | null;
//# sourceMappingURL=cache.d.ts.map