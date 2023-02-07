import { useIsomorphicLayoutEffect } from '@tamagui/constants'
import { useRef } from 'react'

// dai-shi 🙏
// https://dev.to/uhyo_/a-concurrent-mode-safe-version-of-useref-1325
// probably can live without it though to save a bit of b

type Raw<T> = {
  hold: boolean
  next: T
  cur: T
  ref: { current: T }
}

export const useSafeRef = <T>(initialValue: T) => {
  const rawRef = useRef<Raw<T>>()
  if (!rawRef.current) {
    rawRef.current = {
      hold: true,
      next: initialValue,
      cur: initialValue,
      ref: {
        get current() {
          return raw.hold ? raw.cur : raw.next
        },
        set current(v) {
          if (!raw.hold) {
            raw.next = v
          }
          raw.cur = v
        },
      },
    }
  }

  const raw: Raw<T> = rawRef.current
  raw.hold = true
  raw.cur = raw.next
  useIsomorphicLayoutEffect(() => {
    raw.hold = false
    raw.next = raw.cur
  })

  return raw.ref
}
