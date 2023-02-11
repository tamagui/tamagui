import { getConfig } from '../config'

export function getAnimationDriver() {
  return getConfig().animations
}
