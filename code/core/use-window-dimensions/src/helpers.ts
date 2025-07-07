import { isClient } from '@tamagui/constants'
import type { WindowSize, WindowSizeListener } from './types'

export function getWindowSize(): WindowSize {
  if (!isClient) {
    return {
      width: 800,
      height: 600,
      scale: 1,
      fontScale: 1,
    }
  }
  const win = window
  const docEl = win.document.documentElement
  return {
    fontScale: 1,
    height: docEl.clientHeight,
    scale: win.devicePixelRatio || 1,
    width: docEl.clientWidth,
  }
}

const cbs = new Set<WindowSizeListener>()
let _raf = 0

if (isClient) {
  let frame = 0
  const onResize = () => {
    cancelAnimationFrame(_raf)
    _raf = requestAnimationFrame(() => {
      // throttle to every 4 frames
      if (++frame % 4 === 0) {
        cbs.forEach((cb) => cb(getWindowSize()))
      }
    })
  }

  window.addEventListener('resize', onResize)
}

export function subscribe(cb: WindowSizeListener): () => void {
  cbs.add(cb)
  return () => cbs.delete(cb)
}
