import { getConfig } from '../conf'

export function getAnimationDriver() {
  return getConfig().animations
}
