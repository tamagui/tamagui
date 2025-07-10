import type { WindowSize } from './types'

/**
 * SSR safe useWindowDimensions
 */
export const initialValue: WindowSize = {
  width: 800,
  height: 600,
  scale: 1,
  fontScale: 1,
}

export function configureInitialWindowDimensions(next: WindowSize): void {
  Object.assign(initialValue, next)
}
