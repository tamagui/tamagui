import { createGlobalState } from './globalState'
import type { SafeAreaState, SafeAreaInsets, SafeAreaFrame } from './types'

const state = createGlobalState<SafeAreaState>(`safe_area`, {
  enabled: false,
  useSafeAreaInsets: null,
  useSafeAreaFrame: null,
  initialMetrics: null,
})

const defaultInsets: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 }
const defaultFrame: SafeAreaFrame = { x: 0, y: 0, width: 0, height: 0 }

export interface SafeAreaAccessor {
  readonly isEnabled: boolean
  readonly state: SafeAreaState
  set(updates: Partial<SafeAreaState>): void
  /** Get initial insets (non-reactive, for style resolution) */
  getInsets(): SafeAreaInsets
  /** Get initial frame (non-reactive) */
  getFrame(): SafeAreaFrame
}

export function getSafeArea(): SafeAreaAccessor {
  return {
    get isEnabled() {
      return state.get().enabled
    },
    get state() {
      return state.get()
    },
    set(updates: Partial<SafeAreaState>) {
      Object.assign(state.get(), updates)
    },
    getInsets() {
      const s = state.get()
      if (!s.enabled || !s.initialMetrics) {
        return defaultInsets
      }
      return s.initialMetrics.insets
    },
    getFrame() {
      const s = state.get()
      if (!s.enabled || !s.initialMetrics) {
        return defaultFrame
      }
      return s.initialMetrics.frame
    },
  }
}
