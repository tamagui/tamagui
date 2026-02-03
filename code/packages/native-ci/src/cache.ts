import { existsSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { DEFAULT_KV_TTL_SECONDS, type Platform } from './constants'

export interface CacheOptions {
  platform: Platform
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
 * Save fingerprint mapping to Redis KV store.
 * Used to map pre-fingerprint hash to actual fingerprint for faster lookups.
 */
export async function saveFingerprintToKV(
  kv: RedisKVOptions,
  key: string,
  fingerprint: string,
  ttlSeconds = DEFAULT_KV_TTL_SECONDS
): Promise<void> {
  try {
    const response = await fetch(`${kv.url}/SETEX/${key}/${ttlSeconds}/${fingerprint}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error connecting to KV store: ${(error as Error).message}`)
    }
    throw new Error(`Failed to save fingerprint to KV: ${(error as Error).message}`)
  }
}

/**
 * Get fingerprint from Redis KV store.
 */
export async function getFingerprintFromKV(
  kv: RedisKVOptions,
  key: string
): Promise<string | null> {
  try {
    const response = await fetch(`${kv.url}/get/${key}`, {
      headers: {
        Authorization: `Bearer ${kv.token}`,
      },
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`)
    }

    const data = (await response.json()) as { result: string | null }
    return data.result === 'null' ? null : data.result
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error(`Network error connecting to KV store: ${(error as Error).message}`)
    }
    throw new Error(`Failed to get fingerprint from KV: ${(error as Error).message}`)
  }
}

/**
 * Extend TTL on a KV key.
 */
export async function extendKVTTL(
  kv: RedisKVOptions,
  key: string,
  ttlSeconds = DEFAULT_KV_TTL_SECONDS
): Promise<void> {
  try {
    await fetch(`${kv.url}/EXPIRE/${key}/${ttlSeconds}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${kv.token}`,
      },
    })
  } catch (error) {
    // Non-fatal - log but don't throw
    console.warn(`Failed to extend KV TTL: ${(error as Error).message}`)
  }
}

// Local file-based cache for testing

export interface LocalCacheOptions {
  cacheDir?: string
}

/**
 * Save cache data locally (for testing).
 * If filePath is a simple filename, it's saved directly in the current directory.
 */
export function saveCache(
  filePath: string,
  data: Record<string, unknown>,
  options: LocalCacheOptions = {}
): void {
  const { cacheDir } = options
  const cachePath = cacheDir
    ? join(process.cwd(), cacheDir, filePath)
    : join(process.cwd(), filePath)

  mkdirSync(dirname(cachePath), { recursive: true })
  writeFileSync(cachePath, JSON.stringify(data, null, 2))
}

/**
 * Load cache data locally (for testing).
 * If filePath is a simple filename, it's loaded from the current directory.
 */
export function loadCache<T extends Record<string, unknown>>(
  filePath: string,
  options: LocalCacheOptions = {}
): T | null {
  const { cacheDir } = options
  const cachePath = cacheDir
    ? join(process.cwd(), cacheDir, filePath)
    : join(process.cwd(), filePath)

  if (!existsSync(cachePath)) {
    return null
  }

  try {
    return JSON.parse(readFileSync(cachePath, 'utf-8'))
  } catch {
    return null
  }
}
