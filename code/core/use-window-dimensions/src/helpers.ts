import { isClient } from '@tamagui/constants'
import { initialValue } from './initialValue'
import type { WindowSize, WindowSizeListener } from './types'

let lastSize: WindowSize = initialValue
let docEl: HTMLElement | null = null

export function getWindowSize(): WindowSize {
  if (!isClient) {
    return initialValue
  }

  docEl ||= window.document.documentElement

  const nextSize: WindowSize = {
    fontScale: 1,
    height: docEl.clientHeight,
    scale: window.devicePixelRatio || 1,
    width: docEl.clientWidth,
  }

  if (
    nextSize.height !== lastSize.height ||
    nextSize.width !== lastSize.width ||
    nextSize.scale !== lastSize.scale
  ) {
    lastSize = nextSize
    return nextSize
  }

  return lastSize
}

const cbs = new Set<WindowSizeListener>()

if (isClient) {
  let lastUpdate = Date.now()
  let tm
  const USER_MAX_MS = process.env.TAMAGUI_USE_WINDOW_DIMENSIONS_MAX_UPDATE_MS
  const updateMaxMs = USER_MAX_MS ? +USER_MAX_MS : 100

  function flushUpdate() {
    lastUpdate = Date.now()
    cbs.forEach((cb) => cb(getWindowSize()))
  }

  const onResize = () => {
    clearTimeout(tm)

    // only update every few frames
    const timeSinceLast = Date.now() - lastUpdate
    if (timeSinceLast < updateMaxMs) {
      setTimeout(() => {
        flushUpdate()
      }, updateMaxMs - timeSinceLast)
    } else {
      flushUpdate()
    }
  }

  window.addEventListener('resize', onResize)
}

export function subscribe(cb: WindowSizeListener): () => void {
  cbs.add(cb)
  return () => cbs.delete(cb)
}
