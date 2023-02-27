import { getConfig } from '../config.js'

export function getAnimationDriver() {
  return getConfig().animations
}
