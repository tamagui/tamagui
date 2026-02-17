/**
 * Fallback press handling using React Native's usePressability
 * Split into separate file to avoid deep import warnings when RNGH is enabled
 *
 * NOTE: This hook must be called unconditionally in the parent to avoid
 * rules of hooks violations when disabled toggles. The `enabled` param
 * controls whether the pressability events are actually applied.
 */

import { composeEventHandlers } from '@tamagui/helpers'

const dontComposePressabilityKeys: Record<string, boolean> = {
  onBlur: true,
  onFocus: true,
}

// empty config for when disabled - usePressability still needs to be called
const emptyConfig = {}

let usePressability: any = null

export function useMainThreadPressEvents(events: any, viewProps: any, enabled = true) {
  usePressability =
    usePressability || require('react-native/Libraries/Pressability/usePressability').default

  // always call the hook to maintain consistent hook order
  const pressability = usePressability(enabled ? events : emptyConfig)

  if (enabled && pressability) {
    if (viewProps.hitSlop && events) {
      events.hitSlop = viewProps.hitSlop
    }
    for (const key in pressability) {
      const og = viewProps[key]
      const val = pressability[key]
      viewProps[key] =
        og && !dontComposePressabilityKeys[key] ? composeEventHandlers(og, val) : val
    }
  }
}
