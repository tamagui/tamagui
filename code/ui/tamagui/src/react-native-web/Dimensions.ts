export type DisplayMetrics = {
  fontScale: number
  height: number
  scale: number
  width: number
}

type DimensionsValue = {
  window: DisplayMetrics
  screen: DisplayMetrics
}

type DimensionKey = 'window' | 'screen'
type DimensionEventListenerType = 'change'

const dimensions = {
  window: {
    fontScale: 1,
    height: 0,
    scale: 1,
    width: 0,
  },
  screen: {
    fontScale: 1,
    height: 0,
    scale: 1,
    width: 0,
  },
}

const listeners = {}

const canUseDOM = typeof window !== 'undefined'
let shouldInit = canUseDOM

function update() {
  if (!canUseDOM) {
    return
  }

  const win = window
  const docEl = win.document.documentElement

  dimensions.window = {
    fontScale: 1,
    height: docEl.clientHeight,
    scale: win.devicePixelRatio || 1,
    width: docEl.clientWidth,
  }

  dimensions.screen = {
    fontScale: 1,
    height: win.screen.height,
    scale: win.devicePixelRatio || 1,
    width: win.screen.width,
  }
}

function handleResize() {
  update()
  if (Array.isArray(listeners['change'])) {
    listeners['change'].forEach((handler) => handler(dimensions))
  }
}

export const Dimensions = {
  get(dimension: DimensionKey): DisplayMetrics {
    if (shouldInit) {
      shouldInit = false
      update()
    }
    if (dimensions[dimension] === undefined)
      throw new Error(`No dimension set for key ${dimension}`)
    return dimensions[dimension]
  },

  set(initialDimensions: DimensionsValue | null): void {
    if (initialDimensions) {
      if (canUseDOM) {
        throw new Error('Dimensions cannot be set in the browser')
      }
      if (initialDimensions.screen != null) {
        dimensions.screen = initialDimensions.screen
      }
      if (initialDimensions.window != null) {
        dimensions.window = initialDimensions.window
      }
    }
  },

  addEventListener(
    type: DimensionEventListenerType,
    handler: (dimensionsValue: DimensionsValue) => void
  ) {
    listeners[type] = listeners[type] || []
    listeners[type].push(handler)

    return {
      remove: () => {
        this.removeEventListener(type, handler)
      },
    }
  },

  removeEventListener(
    type: DimensionEventListenerType,
    handler: (dimensionsValue: DimensionsValue) => void
  ): void {
    if (Array.isArray(listeners[type])) {
      listeners[type] = listeners[type].filter((_handler) => _handler !== handler)
    }
  },
}

if (canUseDOM) {
  window.addEventListener('resize', handleResize, false)
}
