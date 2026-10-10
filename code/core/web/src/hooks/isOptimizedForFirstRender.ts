import { getSetting } from '../config'

// web defaults to 'updates': granular theme/media tracking so changes
// re-render only consumers. see isOptimizedForFirstRender.native.ts
export function isOptimizedForFirstRender(): boolean {
  return getSetting('optimizeFor') === 'first-render'
}
