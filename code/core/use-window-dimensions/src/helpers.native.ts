import { Dimensions } from 'react-native'
import type { WindowSize, WindowSizeListener } from './types'

export function getWindowSize(): WindowSize {
  return Dimensions.get('window')
}

const cbs = new Set<WindowSizeListener>()

let isListening = false
const ensureListening = () => {
  if (isListening) return
  isListening = true
  // lazy-register: on Hermes, evaluating Dimensions.addEventListener at module
  // top-level can fire before RN's Dimensions module finishes wiring up its
  // event interface, throwing ReferenceError. Defer until first subscriber.
  Dimensions.addEventListener('change', ({ window }) => {
    cbs.forEach((cb) => cb(window))
  })
}

export function subscribe(cb: WindowSizeListener): () => void {
  ensureListening()
  cbs.add(cb)
  return () => cbs.delete(cb)
}
