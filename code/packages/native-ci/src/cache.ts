import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'

export interface CacheOptions {
  platform: 'ios' | 'android'
  fingerprint: string
  prefix?: string
}

export interface RedisKVOptions {
  url: string
  token: string
}

/**
 * Create a cache key for the native build.
 */
export function createCacheKey(options: CacheOptions): string {
  const { platform, fingerprint, prefix = 'native-build' } = options
  return `${prefix}-${platform}-${fingerprint}`
}

/**
 * Check if a cached build exists in GitHub Actions cache.
 * Returns true if the cache hit.
 */
export async function checkCache(cacheKey: string): Promise<boolean> {
  // This is a placeholder - actual cache checking is done via GitHub Actions
  // This function is useful for local testing with a file-based cache
  return false
}

/**
 * Save fingerprint mapping to Redis KV store.
 * Used to map pre-fingerprint hash to actual fingerprint for faster lookups.
 */
export async function saveFingerprintToKV(
  kv: RedisKVOptions,
  key: string,
  fingerprint: string,
  ttlSeconds = 2592000 // 30 days
): Promise<void> {
  const response = await fetch(`${kv.url}/SETEX/${key}/${ttlSeconds}/${fingerprint}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${kv.token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to save fingerprint to KV: ${response.statusText}`)
  }
}

/**
 * Get fingerprint from Redis KV store.
 */
export async function getFingerprintFromKV(
  kv: RedisKVOptions,
  key: string
): Promise<string | null> {
  const response = await fetch(`${kv.url}/get/${key}`, {
    headers: {
      Authorization: `Bearer ${kv.token}`,
    },
  })

  if (!response.ok) {
    throw new Error(`Failed to get fingerprint from KV: ${response.statusText}`)
  }

  const data = (await response.json()) as { result: string | null }
  return data.result === 'null' ? null : data.result
}

/**
 * Extend TTL on a KV key.
 */
export async function extendKVTTL(
  kv: RedisKVOptions,
  key: string,
  ttlSeconds = 2592000
): Promise<void> {
  await fetch(`${kv.url}/EXPIRE/${key}/${ttlSeconds}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${kv.token}`,
    },
  })
}

// Local file-based cache for testing

export interface LocalCacheOptions {
  cacheDir?: string
}

/**
 * Save cache data locally (for testing).
 */
export function saveCache(
  key: string,
  data: Record<string, unknown>,
  options: LocalCacheOptions = {}
): void {
  const { cacheDir = '.cache' } = options
  const cachePath = join(process.cwd(), cacheDir, `${key}.json`)

  mkdirSync(dirname(cachePath), { recursive: true })
  writeFileSync(cachePath, JSON.stringify(data, null, 2))
}

/**
 * Load cache data locally (for testing).
 */
export function loadCache<T extends Record<string, unknown>>(
  key: string,
  options: LocalCacheOptions = {}
): T | null {
  const { cacheDir = '.cache' } = options
  const cachePath = join(process.cwd(), cacheDir, `${key}.json`)

  if (!existsSync(cachePath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(cachePath, 'utf-8'))
  } catch {
    return null
  }
}
