import { isAndroid, isIos, isWeb } from '@tamagui/constants'
import { getNativePortalState } from '@tamagui/native-portal'

/**
 * Check if teleport is enabled (best portal option - preserves React context)
 */
export const isTeleportEnabled = () => {
  const state = getNativePortalState()
  return state.enabled && state.type === 'teleport'
}

/**
 * Check if we need to manually re-propagate React context through portals.
 * When teleport is enabled, context is automatically preserved.
 * Otherwise, on native platforms we need to manually forward context.
 */
export const needsPortalRepropagation = () => {
  if (isWeb) return false
  if (isTeleportEnabled()) return false
  // native without teleport needs repropagation
  return isAndroid || isIos
}

// web-only portal host tracking
export const allPortalHosts = new Map<string, HTMLElement>()
export const portalListeners: Record<string, Set<Function>> = {}
