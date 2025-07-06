import { Dimensions } from 'react-native'
import type { WindowSize, WindowSizeListener } from './types'

export function getWindowSize(): WindowSize {
  return Dimensions.get('window')
}

const cbs = new Set<WindowSizeListener>()

Dimensions.addEventListener('change', ({ window }) => {
  cbs.forEach((cb) => cb(window))
})

export function subscribe(cb: WindowSizeListener): () => void {
  cbs.add(cb)
  return () => cbs.delete(cb)
}
