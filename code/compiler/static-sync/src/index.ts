/**
 * @tamagui/static-sync
 *
 * Synchronous API for Tamagui static extraction using synckit.
 * Wraps @tamagui/static's worker implementation to provide sync APIs
 * required by Babel plugins which cannot use async functions.
 *
 * This package uses synckit to convert async worker calls into synchronous ones.
 */

import type { BabelFileResult } from '@babel/core'
import type { TamaguiOptions } from '@tamagui/types'
import { createSyncFn } from 'synckit'
import { fileURLToPath } from 'node:url'

export type {
  ExtractedResponse,
  TamaguiProjectInfo,
} from '@tamagui/static'
export type { TamaguiOptions } from '@tamagui/types'

// Resolve worker path - works for both CJS and ESM
const getWorkerPath = () => {
  // Use the CommonJS .js version which works for synckit
  if (typeof import.meta !== 'undefined' && import.meta.url) {
    const workerPath = fileURLToPath(import.meta.resolve('@tamagui/static/worker'))
    // Replace .mjs with .js for CommonJS compatibility
    return workerPath.replace(/\.mjs$/, '.js')
  }

  // Fallback for CJS
  return require.resolve('@tamagui/static/worker').replace(/\.mjs$/, '.js')
}

// Create sync function that calls the worker's runTask function
const runTaskSync = createSyncFn(getWorkerPath(), {
  timeout: 60000, // 60s timeout for sync operations
})

export const getPragmaOptions = (props: {
  source: string
  path: string
}) => {
  // This doesn't need worker, just use static directly
  const { default: Static } = require('@tamagui/static')
  return Static.getPragmaOptions(props)
}

/**
 * Load Tamagui build configuration synchronously
 * This is only used for loading tamagui.build.ts config
 */
export function loadTamaguiBuildConfigSync(
  tamaguiOptions: Partial<TamaguiOptions> | undefined
): TamaguiOptions {
  // Import from static package for this sync operation
  const { default: Static } = require('@tamagui/static')
  return Static.loadTamaguiBuildConfigSync(tamaguiOptions)
}

/**
 * Extract Tamagui components to className-based CSS for web (synchronous)
 */
export function extractToClassNamesSync(params: {
  source: string | Buffer
  sourcePath?: string
  options: TamaguiOptions
  shouldPrintDebug?: boolean | 'verbose'
}): any {
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

  const result = runTaskSync(task) as any

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
 * Extract Tamagui components to React Native StyleSheet format (synchronous)
 */
export function extractToNativeSync(
  sourceFileName: string,
  sourceCode: string,
  options: TamaguiOptions
): BabelFileResult {
  const task = {
    type: 'extractToNative',
    sourceFileName,
    sourceCode,
    options,
  }

  const result = runTaskSync(task) as any

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
 * Get babel plugin that uses synchronous extraction
 */
export function getBabelPlugin() {
  // We need to wrap the babel plugin to use sync extraction
  const { default: Static } = require('@tamagui/static')
  return Static.getBabelPlugin()
}
