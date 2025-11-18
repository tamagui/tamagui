/**
 * Graceful fallback stub for @tamagui/bento when not available
 * This allows the site to run without bento installed
 */

// Stub exports that match the real bento package structure
export const CurrentRouteProvider = ({ children }: any) => children
export const Data = {} as any
export const Sections = {} as any
export const Components = {} as any

// Stub for data exports
export const listingData = {
  sections: [],
  data: {},
}

// Type exports (will be ignored at runtime)
export type { ComponentItemInfo } from './bento-types'

console.warn('⚠️  Using bento stub - bento components will not render')
