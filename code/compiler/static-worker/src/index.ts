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

export type { ExtractedResponse, TamaguiProjectInfo } from '@tamagui/static'
export type { TamaguiOptions } from '@tamagui/types'

export const getPragmaOptions = async (props: { source: string; path: string }) => {
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

// Use globalThis to share pool across module instances (Vite environments)
const POOL_KEY = '__tamagui_piscina_pool__'
const CLOSING_KEY = '__tamagui_piscina_closing__'
const TASK_COUNT_KEY = '__tamagui_piscina_task_count__'
const RECYCLING_KEY = '__tamagui_piscina_recycling__'

// recycle worker after this many tasks to prevent RSS bloat from V8 memory fragmentation
// Node.js worker threads don't release memory properly - see https://github.com/nodejs/node/issues/51868
// Lower threshold to recycle before hitting V8 memory limits
const MAX_TASKS_BEFORE_RECYCLE = 200

function getSharedPool(): Piscina | null {
  return (globalThis as any)[POOL_KEY] ?? null
}

function setSharedPool(pool: Piscina | null) {
  ;(globalThis as any)[POOL_KEY] = pool
}

function isClosing(): boolean {
  return (globalThis as any)[CLOSING_KEY] === true
}

function setClosing(value: boolean) {
  ;(globalThis as any)[CLOSING_KEY] = value
}

function isRecycling(): boolean {
  return (globalThis as any)[RECYCLING_KEY] === true
}

function setRecycling(value: boolean) {
  ;(globalThis as any)[RECYCLING_KEY] = value
}

function getTaskCount(): number {
  return (globalThis as any)[TASK_COUNT_KEY] ?? 0
}

function incrementTaskCount(): number {
  const count = getTaskCount() + 1
  ;(globalThis as any)[TASK_COUNT_KEY] = count
  return count
}

function resetTaskCount() {
  ;(globalThis as any)[TASK_COUNT_KEY] = 0
}

/**
 * Create a new Piscina pool instance
 */
function createPool(): Piscina {
  const pool = new Piscina({
    filename: getWorkerPath(),
    // Single worker for state consistency and simpler caching
    minThreads: 1,
    maxThreads: 1,
    // Never terminate due to idle - worker stays alive until close() or process exit
    // This prevents "Terminating worker thread" errors from Piscina during idle
    idleTimeout: Number.POSITIVE_INFINITY,
    // no resourceLimits - we rely on task-based recycling instead
    // V8 resourceLimits cause "Terminating worker thread" messages when hit
  })

  // Handle error events to prevent uncaught exceptions during pool destruction
  pool.on('error', (err) => {
    if (isClosing() || isRecycling()) return
    const message =
      err && typeof err === 'object' && 'message' in err ? String(err.message) : ''
    // Suppress termination errors (can still occur during explicit close/destroy)
    if (message.includes('Terminating worker thread')) return
    console.error('[tamagui] Worker pool error:', err)
  })

  return pool
}

/**
 * Get or create the Piscina worker pool
 */
function getPool(): Piscina {
  let pool = getSharedPool()
  if (!pool) {
    pool = createPool()
    setSharedPool(pool)
  }
  return pool
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
 * Recycle the worker pool to release RSS memory
 * Creates new pool, swaps immediately, then destroys old pool
 * V8 doesn't return memory to OS, so we need to restart the worker periodically
 */
async function recyclePool(options: TamaguiOptions): Promise<void> {
  if (isClosing() || isRecycling()) return

  const oldPool = getSharedPool()
  if (!oldPool) return

  setRecycling(true)

  const start = Date.now()

  try {
    // suppress "Terminating worker thread" messages during recycle
    const originalStderr = process.stderr.write.bind(process.stderr)
    const originalStdout = process.stdout.write.bind(process.stdout)
    const filter = (chunk: any, ...args: any[]) => {
      const str = typeof chunk === 'string' ? chunk : chunk?.toString?.() || ''
      if (str.includes('Terminating worker thread')) return true
      return false
    }
    process.stderr.write = ((chunk: any, ...args: any[]) => {
      if (filter(chunk)) return true
      return originalStderr(chunk, ...args)
    }) as any
    process.stdout.write = ((chunk: any, ...args: any[]) => {
      if (filter(chunk)) return true
      return originalStdout(chunk, ...args)
    }) as any

    // create new pool and swap immediately
    const newPool = createPool()
    setSharedPool(newPool)

    // warm up new pool with config (this caches it in the new worker)
    const warmupTask = {
      type: 'extractToClassNames',
      source: '// warmup',
      sourcePath: '__warmup__.tsx',
      options: {
        ...options,
        // skip the "built config" log on warmup since it's a recycle
        _skipBuildLog: true,
      },
      shouldPrintDebug: false,
    }

    await newPool.run(warmupTask, { name: 'runTask' })

    // destroy old pool - pending tasks will be rejected
    oldPool.removeAllListeners()
    oldPool.destroy().catch(() => {})

    // restore stderr/stdout after a delay
    setTimeout(() => {
      process.stderr.write = originalStderr
      process.stdout.write = originalStdout
    }, 500)

    console.log(`  ♻️  [tamagui] recycled worker pool (${Date.now() - start}ms)`)
  } finally {
    setRecycling(false)
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

  // check if we need to recycle the worker to prevent RSS bloat
  const count = incrementTaskCount()
  if (count >= MAX_TASKS_BEFORE_RECYCLE) {
    resetTaskCount()
    // recycle asynchronously with hot-swap to not block current request
    recyclePool(options).catch(() => {})
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

  // check if we need to recycle the worker to prevent RSS bloat
  const count = incrementTaskCount()
  if (count >= MAX_TASKS_BEFORE_RECYCLE) {
    resetTaskCount()
    // recycle asynchronously with hot-swap to not block current request
    recyclePool(options).catch(() => {})
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
      if (getSharedPool()) {
        // Fire and forget - errors are handled internally
        clearWorkerCache()
      }
    },
  }
}

/**
 * Clear the worker's config cache
 * Call this when config files change
 */
export async function clearWorkerCache(): Promise<void> {
  const pool = getSharedPool()
  if (!pool || isClosing()) return

  const task = { type: 'clearCache' }
  await pool.run(task, { name: 'runTask' })
}

/**
 * Clean up the worker pool on exit
 * Should be called when the build process completes
 */
export async function destroyPool(): Promise<void> {
  const pool = getSharedPool()
  if (pool) {
    setClosing(true)
    try {
      await pool.close()
    } finally {
      setSharedPool(null)
      setClosing(false)
    }
  }
}

/**
 * Get pool statistics for debugging
 */
export function getPoolStats() {
  const pool = getSharedPool()
  if (!pool) {
    return null
  }
  return {
    threads: pool.threads.length,
    queueSize: pool.queueSize,
    completed: pool.completed,
    duration: pool.duration,
    utilization: pool.utilization,
  }
}
