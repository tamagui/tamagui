/**
 * @tamagui/bento-or-not
 *
 * Smart proxy for @tamagui/bento:
 * - Checks if ~/bento exists locally
 * - If yes: re-exports from @tamagui/bento (installed from GitHub Packages in CI)
 * - If no: provides graceful stubs
 */

import { existsSync } from 'fs'
import { resolve } from 'path'

const BENTO_PATH = resolve(__dirname, '../../../../../bento')
const hasBento = existsSync(BENTO_PATH)

if (!hasBento && typeof process !== 'undefined' && process.env.NODE_ENV !== 'test') {
  console.warn('⚠️  @tamagui/bento not found - using stubs. Bento components will not render.')
}

// Try to load real bento, fall back to stubs
let bento: any = null

try {
  if (hasBento || (typeof process !== 'undefined' && process.env.CI)) {
    // In CI or if ~/bento exists locally
    bento = require('@tamagui/bento')
  }
} catch (error) {
  // Bento not available
}

// Export real bento or stubs
export const CurrentRouteProvider = bento?.CurrentRouteProvider ?? (({ children }: any) => children)
export const Data = bento?.Data ?? {}
export const Sections = bento?.Sections ?? {}
export const Components = bento?.Components ?? {}

// Re-export types if available
export type * from './types'
