/**
 * Fallback press handling using React Native's usePressability
 * Split into separate file to avoid deep import warnings when RNGH is enabled
 */

import { composeEventHandlers } from '@tamagui/helpers'

const dontComposePressabilityKeys: Record<string, boolean> = {
  onBlur: true,
  onFocus: true,
}

export function useMainThreadPressEvents(events: any, viewProps: any) {
  const usePressability =
    require('react-native/Libraries/Pressability/usePressability').default
  const pressability = usePressability(events)

  if (pressability) {
    if (viewProps.hitSlop) {
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
