import type { ThemeManager } from '../helpers/ThemeManager'

// web does nothing
export function shouldDeoptDueToParentScheme(manager?: ThemeManager) {
  return false
}
