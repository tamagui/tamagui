/**
 * Worker thread implementation for Tamagui extraction
 * Used by both piscina (async) and synckit (sync for babel)
 */

import type { BabelFileResult } from '@babel/core'
import { createExtractor } from './extractor/createExtractor'
import type {
  ExtractedResponse,
  ExtractToClassNamesProps,
} from './extractor/extractToClassNames'
import { extractToClassNames as extractToClassNamesImpl } from './extractor/extractToClassNames'
import { extractToNative as extractToNativeImpl } from './extractor/extractToNative'
import type { TamaguiOptions } from './types'

// Create extractors for web and native in worker
const webExtractor = createExtractor({ platform: 'web' })
const nativeExtractor = createExtractor({ platform: 'native' })

// Cache config loading to avoid reloading
const configCache: Map<string, Promise<any>> = new Map()

export interface ExtractToClassNamesTask {
  type: 'extractToClassNames'
  source: string
  sourcePath: string
  options: TamaguiOptions
  shouldPrintDebug: boolean | 'verbose'
}

export interface ExtractToNativeTask {
  type: 'extractToNative'
  sourceFileName: string
  sourceCode: string
  options: TamaguiOptions
}

export interface ClearCacheTask {
  type: 'clearCache'
}

export type WorkerTask = ExtractToClassNamesTask | ExtractToNativeTask | ClearCacheTask

export type WorkerResult =
  | { success: true; data: ExtractedResponse | null }
  | { success: true; data: BabelFileResult }
  | { success: false; error: string; stack?: string }

// Log worker PID once
let hasLoggedPID = false

/**
 * Main worker function that handles both extraction types
 * This is called by piscina for async usage
 */
export async function runTask(task: WorkerTask): Promise<WorkerResult> {
  try {
    if (task.type === 'extractToClassNames') {
      // Load web config if needed (with caching)
      if (!task.options.disableExtraction && !task.options['_disableLoadTamagui']) {
        const cacheKey = JSON.stringify({
          config: task.options.config,
          components: task.options.components,
        })

        if (!configCache.has(cacheKey)) {
          configCache.set(cacheKey, webExtractor.loadTamagui(task.options))
        }

        await configCache.get(cacheKey)
      }

      const result = await extractToClassNamesImpl({
        extractor: webExtractor,
        source: task.source,
        sourcePath: task.sourcePath,
        options: task.options,
        shouldPrintDebug: task.shouldPrintDebug,
      })

      return { success: true, data: result }
    }

    if (task.type === 'extractToNative') {
      // Load native config if needed (with caching)
      const cacheKey = JSON.stringify({
        config: task.options.config,
        components: task.options.components,
      })

      if (!configCache.has(cacheKey)) {
        configCache.set(cacheKey, nativeExtractor.loadTamagui(task.options))
      }

      await configCache.get(cacheKey)

      // extractToNative uses its own module-level extractor
      // This is for babel plugin which uses visitor pattern
      const result = extractToNativeImpl(
        task.sourceFileName,
        task.sourceCode,
        task.options
      )

      return { success: true, data: result }
    }

    if (task.type === 'clearCache') {
      // Clear config caches when files change
      configCache.clear()
      return { success: true, data: null }
    }

    return {
      success: false,
      error: `Unknown task type: ${(task as any).type}`,
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    }
  }
}

/**
 * For synckit compatibility - exports the runTask as default
 * Synckit will call this function synchronously using worker threads
 */
export default runTask
