import { getConfig } from '../config'

/**
 * @deprecated use the `useAnimationDriver` hook instead
 */
export function getAnimationDriver() {
  return getConfig().animations
}
