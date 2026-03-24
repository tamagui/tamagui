import type { AnimationDriver } from '../types'

/**
 * Resolves a value that might be an AnimationDriver or a multi-driver config object
 * like { default: motionDriver, css: cssDriver } into an actual AnimationDriver.
 */
export function resolveAnimationDriver(
  driver: AnimationDriver | Record<string, AnimationDriver> | null | undefined
): AnimationDriver | null {
  if (!driver) return null
  // valid driver
  if (typeof (driver as any).useAnimations === 'function') {
    return driver as AnimationDriver
  }
  // multi-driver object - extract default
  if (
    'default' in driver &&
    typeof (driver as any).default?.useAnimations === 'function'
  ) {
    return (driver as any).default
  }
  return null
}
