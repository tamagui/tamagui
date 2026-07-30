import { createGlobalState } from './globalState'
import type { SafeAreaState, SafeAreaInsets, SafeAreaFrame } from './types'

const state = createGlobalState<SafeAreaState>(`safe_area`, {
  didSetup: false,
  enabled: false,
  useSafeAreaInsets: null,
  useSafeAreaFrame: null,
  initialMetrics: null,
})

const subscriptions = createGlobalState(`safe_area_subscriptions`, {
  enabled: true,
  listeners: new Set<() => void>(),
})

const defaultInsets: SafeAreaInsets = { top: 0, right: 0, bottom: 0, left: 0 }
const defaultFrame: SafeAreaFrame = { x: 0, y: 0, width: 0, height: 0 }

export interface SafeAreaAccessor {
  readonly didSetup: boolean
  readonly isEnabled: boolean
  readonly state: SafeAreaState
  set(updates: Partial<SafeAreaState>): void
  subscribe(listener: () => void): () => void
  /** get the current insets snapshot */
  getInsets(): SafeAreaInsets
  /** get the current frame snapshot */
  getFrame(): SafeAreaFrame
}

const safeArea: SafeAreaAccessor = {
  get didSetup() {
    return state.get().didSetup
  },
  get isEnabled() {
    return state.get().enabled
  },
  get state() {
    return state.get()
  },
  set(updates) {
    const current = state.get()
    const previousMetrics = current.initialMetrics
    Object.assign(current, updates)
    if (updates.initialMetrics !== undefined && current.initialMetrics !== previousMetrics) {
      subscriptions.get().listeners.forEach((listener) => listener())
    }
  },
  subscribe(listener) {
    const listeners = subscriptions.get().listeners
    listeners.add(listener)
    return () => {
      listeners.delete(listener)
    }
  },
  getInsets() {
    const current = state.get()
    if (!current.enabled || !current.initialMetrics) {
      return defaultInsets
    }
    return current.initialMetrics.insets
  },
  getFrame() {
    const current = state.get()
    if (!current.enabled || !current.initialMetrics) {
      return defaultFrame
    }
    return current.initialMetrics.frame
  },
}

export function getSafeArea(): SafeAreaAccessor {
  return safeArea
}

export function hasSafeAreaSetup(): boolean {
  return state.get().didSetup
}
