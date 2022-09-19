import { debounce } from '@tamagui/use-debounce'
import { useForceUpdate } from '@tamagui/use-force-update'
import { useEffect, useLayoutEffect } from 'react'
import { Dimensions, Platform } from 'react-native'

const isWeb = process.env.TAMAGUI_TARGET === 'web' ? true : Platform?.OS === 'web'
const isServer = isWeb && typeof window === 'undefined'
const useIsomorphicLayoutEffect = isServer ? useEffect : useLayoutEffect

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
    store = new WindowSizeStore()
    Dimensions.addEventListener('change', debounce(store.update, 32))
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
