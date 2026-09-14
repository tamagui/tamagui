import type { AnimationDriverLike } from '../types'

function isAnimationDriver(value: unknown): value is AnimationDriverLike {
  if (typeof value !== 'object' || value === null) return false
  if ('isStub' in value && value.isStub === true) return true
  return 'useAnimations' in value && typeof value.useAnimations === 'function'
}

/**
 * Resolves a value that might be an animation driver or a multi-driver config
 * object like { default: motionDriver, css: cssDriver } into a driver.
 */
export function resolveAnimationDriver(
  driver: AnimationDriverLike | Record<string, AnimationDriverLike> | null | undefined
): AnimationDriverLike | null {
  if (!driver) return null
  // valid driver, including an explicit unsupported stub
  if (isAnimationDriver(driver)) {
    return driver
  }
  // multi-driver object - extract default
  if ('default' in driver && isAnimationDriver(driver.default)) {
    return driver.default
  }
  return null
}
