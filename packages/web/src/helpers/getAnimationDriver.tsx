import { getConfig } from '../config.js'

/**
 * @deprecated use the `useAnimationDriver` hook instead
 */
export function getAnimationDriver() {
  return getConfig().animations
}
