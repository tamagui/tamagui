/**
 * @tamagui/static-worker
 *
 * Pure worker-based API for Tamagui static extraction.
 * All operations run in a worker thread for better performance and isolation.
 *
 * This package provides a clean async API that wraps @tamagui/static's worker
 * implementation without exposing any sync/legacy APIs.
 */

import type { TamaguiOptions } from '@tamagui/types'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import Piscina from 'piscina'

export type {
  ExtractedResponse,
  TamaguiProjectInfo,
} from '@tamagui/static'
export type { TamaguiOptions } from '@tamagui/types'

export const getPragmaOptions = async (props: {
  source: string
  path: string
}) => {
  const { default: Static } = await import('@tamagui/static')
  return Static.getPragmaOptions(props)
}

// Resolve worker path - works for both CJS and ESM
const getWorkerPath = () => {
  // In ESM
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    // This will need to resolve to the actual worker from static package
    const staticPackagePath = fileURLToPath(import.meta.resolve('@tamagui/static'))
    return resolve(dirname(staticPackagePath), 'worker.js')
  }

  // Fallback - assume static is installed
  return resolve(process.cwd(), 'node_modules/@tamagui/static/dist/worker.js')
}

let piscinaPool: Piscina | null = null

/**
 * Get or create the Piscina worker pool
 */
function getPool(): Piscina {
  if (!piscinaPool) {
    piscinaPool = new Piscina({
      filename: getWorkerPath(),
      // Single worker for state consistency and simpler caching
      minThreads: 1,
      maxThreads: 1,
      idleTimeout: 60000, // 60s - keep alive for config watching
    })
  }
  return piscinaPool
}

/**
 * Load Tamagui configuration in the worker thread
 * This is cached in the worker, so subsequent calls are fast
 */
export async function loadTamagui(options: Partial<TamaguiOptions>): Promise<any> {
  const pool = getPool()

  // Use extractToClassNames with a dummy request to trigger config loading
  // The worker will cache the config for subsequent requests
  const task = {
    type: 'extractToClassNames',
    source: '// dummy',
    sourcePath: '__dummy__.tsx',
    options: {
      components: ['tamagui'],
      ...options,
    },
    shouldPrintDebug: false,
  }

  try {
    await pool.run(task, { name: 'runTask' })
    return { success: true }
  } catch (error) {
    console.error('[static-worker] Error loading Tamagui config:', error)
    throw error
  }
}

/**
 * Extract Tamagui components to className-based CSS for web
 */
export async function extractToClassNames(params: {
  source: string | Buffer
  sourcePath?: string
  options: TamaguiOptions
  shouldPrintDebug?: boolean | 'verbose'
}): Promise<any> {
  const { source, sourcePath = '', options, shouldPrintDebug = false } = params

  if (typeof source !== 'string') {
    throw new Error('`source` must be a string of javascript')
  }

  const task = {
    type: 'extractToClassNames',
    source,
    sourcePath,
    options,
    shouldPrintDebug,
  }

  const pool = getPool()
  const result = (await pool.run(task, { name: 'runTask' })) as any

  if (!result.success) {
    throw new Error(
      `Worker error: ${result.error}${result.stack ? `\n${result.stack}` : ''}`
    )
  }

  return result.data
}

/**
 * Extract Tamagui components to React Native StyleSheet format
 */
export async function extractToNative(
  sourceFileName: string,
  sourceCode: string,
  options: TamaguiOptions
): Promise<any> {
  const task = {
    type: 'extractToNative',
    sourceFileName,
    sourceCode,
    options,
  }

  const pool = getPool()
  const result = (await pool.run(task, { name: 'runTask' })) as any

  if (!result.success) {
    throw new Error(
      `Worker error: ${result.error}${result.stack ? `\n${result.stack}` : ''}`
    )
  }

  return result.data
}

/**
 * Watch Tamagui config for changes and reload when it changes
 */
export async function watchTamaguiConfig(
  options: TamaguiOptions
): Promise<{ dispose: () => void } | undefined> {
  // For now, we'll use the static package's watcher directly
  // This could be improved to use worker-based watching
  const { default: Static } = await import('@tamagui/static')
  const watcher = await Static.watchTamaguiConfig(options)

  if (!watcher) {
    return
  }

  // Wrap the dispose to also clear worker cache
  const originalDispose = watcher.dispose
  return {
    dispose: () => {
      originalDispose()
      if (piscinaPool) {
        clearWorkerCache().catch((err) => {
          console.error('[static-worker] Error clearing cache:', err)
        })
      }
    },
  }
}

/**
 * Load Tamagui build configuration synchronously
 * This is only used for loading tamagui.build.ts config, not the full tamagui config
 */
export async function loadTamaguiBuildConfig(
  tamaguiOptions: Partial<TamaguiOptions> | undefined
): Promise<TamaguiOptions> {
  // Import from static package for this sync operation
  const { default: Static } = await import('@tamagui/static')

  return Static.loadTamaguiBuildConfigSync(tamaguiOptions)
}

/**
 * Clear the worker's config cache
 * Call this when config files change
 */
export async function clearWorkerCache(): Promise<void> {
  if (!piscinaPool) return

  const task = { type: 'clearCache' }
  await piscinaPool.run(task, { name: 'runTask' })
}

/**
 * Clean up the worker pool on exit
 * Should be called when the build process completes
 */
export async function destroyPool(): Promise<void> {
  if (piscinaPool) {
    await piscinaPool.destroy()
    piscinaPool = null
  }
}

/**
 * Get pool statistics for debugging
 */
export function getPoolStats() {
  if (!piscinaPool) {
    return null
  }
  return {
    threads: piscinaPool.threads.length,
    queueSize: piscinaPool.queueSize,
    completed: piscinaPool.completed,
    duration: piscinaPool.duration,
    utilization: piscinaPool.utilization,
  }
}
