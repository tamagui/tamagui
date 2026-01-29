import type { SafeAreaState, SafeAreaInsets, SafeAreaFrame } from './types'

const GLOBAL_KEY = '__tamagui_native_safe_area_state__'

function getGlobalState(): SafeAreaState {
  const g = globalThis as any
  if (!g[GLOBAL_KEY]) {
    g[GLOBAL_KEY] = {
      enabled: false,
      useSafeAreaInsets: null,
      useSafeAreaFrame: null,
      initialMetrics: null,
    }
  }
  return g[GLOBAL_KEY]
}

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
      return getGlobalState().enabled
    },
    get state() {
      return getGlobalState()
    },
    set(updates: Partial<SafeAreaState>) {
      Object.assign(getGlobalState(), updates)
    },
    getInsets() {
      const state = getGlobalState()
      if (!state.enabled || !state.initialMetrics) {
        return defaultInsets
      }
      return state.initialMetrics.insets
    },
    getFrame() {
      const state = getGlobalState()
      if (!state.enabled || !state.initialMetrics) {
        return defaultFrame
      }
      return state.initialMetrics.frame
    },
  }
}
