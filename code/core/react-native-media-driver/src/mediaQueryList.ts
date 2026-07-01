import type { MediaQueryList } from '@tamagui/web'
import { AccessibilityInfo, Dimensions } from 'react-native'

import { matchQuery } from './matchQuery'

type Orientation = 'landscape' | 'portrait'

type Listener = () => void

// detect prefers-reduced-motion queries so we can subscribe to
// AccessibilityInfo instead of Dimensions
// matches "(prefers-reduced-motion: reduce)" / "(prefers-reduced-motion: no-preference)"
const REDUCED_MOTION_RE = /\(\s*prefers-reduced-motion\s*:\s*([a-z-]+)\s*\)/i

// shared subscription to AccessibilityInfo so we set up a single native listener
// regardless of how many media queries use it
let reducedMotionEnabled = false
let reducedMotionInitialized = false
const reducedMotionListeners = new Set<() => void>()

function ensureReducedMotionSubscription() {
  if (reducedMotionInitialized) return
  reducedMotionInitialized = true
  AccessibilityInfo.isReduceMotionEnabled?.()
    .then((value) => {
      if (value !== reducedMotionEnabled) {
        reducedMotionEnabled = value
        reducedMotionListeners.forEach((cb) => cb())
      }
    })
    .catch(() => {})
  AccessibilityInfo.addEventListener?.('reduceMotionChanged', (value: boolean) => {
    if (value === reducedMotionEnabled) return
    reducedMotionEnabled = value
    reducedMotionListeners.forEach((cb) => cb())
  })
}

export class NativeMediaQueryList implements MediaQueryList {
  private listeners: Listener[] = []
  private reducedMotionExpected: 'reduce' | 'no-preference' | null = null

  private get orientation(): Orientation {
    const windowDimensions = Dimensions.get('window')
    return windowDimensions.height > windowDimensions.width ? 'portrait' : 'landscape'
  }

  constructor(private query: string) {
    const reducedMotionMatch = query.match(REDUCED_MOTION_RE)
    if (reducedMotionMatch) {
      // accessibility-driven query, ignore dimensions
      this.reducedMotionExpected = reducedMotionMatch[1] as 'reduce' | 'no-preference'
      ensureReducedMotionSubscription()
      return
    }
    this.notify()
    Dimensions.addEventListener('change', () => {
      this.notify()
    })
  }

  private notify() {
    this.listeners.forEach((listener) => {
      listener()
    })
  }

  addListener(listener: Listener): void {
    if (this.reducedMotionExpected) {
      reducedMotionListeners.add(listener)
      this.listeners.push(listener)
      return
    }
    this.listeners.push(listener)
  }

  removeListener(listener: Listener): void {
    if (this.reducedMotionExpected) {
      reducedMotionListeners.delete(listener)
    }
    const index = this.listeners.indexOf(listener)
    if (index !== -1) this.listeners.splice(index, 1)
  }

  match(query: string, { width, height }: { width: number; height: number }): boolean {
    const reducedMotionMatch = query.match(REDUCED_MOTION_RE)
    if (reducedMotionMatch) {
      const expected = reducedMotionMatch[1]
      return expected === 'reduce' ? reducedMotionEnabled : !reducedMotionEnabled
    }
    return matchQuery(query, {
      type: 'screen',
      orientation: height > width ? 'portrait' : 'landscape',
      'device-width': width,
      'device-height': height,
    })
  }

  get matches(): boolean {
    if (this.reducedMotionExpected) {
      return this.reducedMotionExpected === 'reduce'
        ? reducedMotionEnabled
        : !reducedMotionEnabled
    }
    const windowDimensions = Dimensions.get('window')
    const matches = matchQuery(this.query, {
      type: 'screen',
      orientation: this.orientation,
      ...windowDimensions,
      'device-width': windowDimensions.width,
      'device-height': windowDimensions.height,
    })
    return matches
  }
}
