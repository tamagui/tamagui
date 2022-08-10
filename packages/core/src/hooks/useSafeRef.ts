import { useRef } from 'react'

import { useIsomorphicLayoutEffect } from '../constants/platform'

// dai-shi 🙏
// https://dev.to/uhyo_/a-concurrent-mode-safe-version-of-useref-1325

type Raw<T> = {
  isRendering: boolean
  comittedValue: T
  currentValue: T
  ref: { current: T }
}

export const useSafeRef = <T>(initialValue: T) => {
  const rawRef = useRef<Raw<T>>()

  const raw: Raw<T> =
    rawRef.current ??
    (rawRef.current = {
      isRendering: true,
      comittedValue: initialValue,
      currentValue: initialValue,
      ref: {
        get current() {
          if (raw.isRendering) {
            return raw.currentValue
          } else {
            return raw.comittedValue
          }
        },
        set current(v) {
          if (!raw.isRendering) {
            raw.comittedValue = v
          }
          raw.currentValue = v
        },
      },
    })

  raw.isRendering = true
  Promise.resolve().then(() => (raw.isRendering = false))
  raw.currentValue = raw.comittedValue

  useIsomorphicLayoutEffect(() => {
    raw.comittedValue = raw.currentValue
  })

  return raw.ref
}
