import { Dimensions } from 'react-native'

import { useIsomorphicLayoutEffect } from '../platform'
import { debounce } from './useDebounce'
import { useForceUpdate } from './useForceUpdate'

type WindowSize = [number, number]

const idFn = (_) => _
const getWindowSize = (): WindowSize => [
  Dimensions.get('window').width,
  Dimensions.get('window').height,
]

class WindowSizeStore {
  listeners = new Set<Function>()
  size = getWindowSize()

  update = () => {
    this.size = getWindowSize()
    this.listeners.forEach((x) => x())
  }
}

let store: WindowSizeStore | null = null

function createStore() {
  if (!store) {
    console.log('create store')
    store = new WindowSizeStore()
    Dimensions.addEventListener('change', debounce(store.update))
  }
}

export function useWindowSize({
  adjust = idFn,
}: {
  adjust?: (x: WindowSize) => WindowSize
} = {}): WindowSize {
  createStore()
  const size = store!.size
  const forceUpdate = useForceUpdate()

  useIsomorphicLayoutEffect(() => {
    store!.listeners.add(forceUpdate)
    return () => {
      store!.listeners.delete(forceUpdate)
    }
  }, [adjust])

  return adjust(size)
}
