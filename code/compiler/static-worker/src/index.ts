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
  // Piscina needs the actual file path, not the module resolution
  // Use the CommonJS .js version which works for piscina
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    const workerPath = fileURLToPath(import.meta.resolve('@tamagui/static/worker'))
    // Replace .mjs with .js for CommonJS compatibility
    return workerPath.replace(/\.mjs$/, '.js')
  }

  // Fallback for CJS
  return require.resolve('@tamagui/static/worker').replace(/\.mjs$/, '.js')
}

let piscinaPool: Piscina | null = null
let isClosing = false

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

    // Handle error events to prevent uncaught exceptions during pool destruction
    // Piscina emits 'error' events when workers are terminated and there are no pending tasks
    // Without this handler, Node.js throws the error as an uncaught exception
    piscinaPool.on('error', (err) => {
      // suppress termination errors during shutdown
      if (isClosing) {
        return
      }
      // Log other errors for debugging
      console.error('[tamagui] Worker pool error:', err)
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
    const errorMessage = [
      `[tamagui-extract] Error processing file: ${sourcePath || '(unknown)'}`,
      ``,
      result.error,
      result.stack ? `\n${result.stack}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    throw new Error(errorMessage)
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
    const errorMessage = [
      `[tamagui-extract] Error processing file: ${sourceFileName || '(unknown)'}`,
      ``,
      result.error,
      result.stack ? `\n${result.stack}` : '',
    ]
      .filter(Boolean)
      .join('\n')

    throw new Error(errorMessage)
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
        // Fire and forget - errors are handled internally
        clearWorkerCache()
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
  if (!piscinaPool || isClosing) return

  const task = { type: 'clearCache' }
  await piscinaPool.run(task, { name: 'runTask' })
}

/**
 * Clean up the worker pool on exit
 * Should be called when the build process completes
 */
export async function destroyPool(): Promise<void> {
  if (piscinaPool) {
    isClosing = true
    try {
      await piscinaPool.destroy()
    } catch (err) {
      // Only ignore worker termination errors during shutdown
      // Re-throw any other errors as they may be legitimate issues
      if (err && typeof err === 'object' && 'message' in err) {
        const message = String(err.message)
        if (!message.includes('Terminating worker thread')) {
          throw err
        }
      }
    } finally {
      piscinaPool = null
      isClosing = false
    }
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
