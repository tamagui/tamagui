import * as _ from 'lodash'
import { useEffect } from 'react'
import { Dimensions } from 'react-native'

import { useForceUpdate } from './useForceUpdate'

/** [width, height] */
type Size = [number, number]

const idFn = (_) => _
const getWindowSize = (): Size => [
  Dimensions.get('window').width,
  Dimensions.get('window').height,
]

// singleton for performance

class WindowSizeStore {
  listeners = new Set<Function>()
  size = getWindowSize()

  constructor() {
    Dimensions.addEventListener('change', this.update)
  }

  unmount() {
    Dimensions.removeEventListener('change', this.update)
    this.update.cancel()
  }

  update = _.throttle(() => {
    this.size = getWindowSize()
    this.listeners.forEach((x) => x())
  }, 350)
}

let store: any | null = null

export function useWindowSize({
  adjust = idFn,
}: {
  adjust?: (x: Size) => Size
} = {}): Size {
  store = store || new WindowSizeStore()
  const size = store.size
  const forceUpdate = useForceUpdate()

  useEffect(() => {
    store.listeners.add(forceUpdate)
    return () => {
      store.listeners.delete(forceUpdate)
    }
  }, [adjust])

  return adjust(size)
}
