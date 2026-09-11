import { getSetting } from '../config'

// native defaults to 'first-render': skip per-key theme/media tracking for
// the fastest initial render, theme/media changes re-render coarsely
export function isOptimizedForFirstRender(): boolean {
  return getSetting('optimizeFor') !== 'updates'
}
