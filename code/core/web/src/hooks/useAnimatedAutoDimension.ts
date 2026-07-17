import { isWeb, useIsomorphicLayoutEffect } from '@tamagui/constants'
import * as React from 'react'

// Generic "animate to/from `auto` (intrinsic size) by resolving to a measured pixel"
// capability that animation drivers opt into. The settled state stays intrinsic
// (`auto`, so the element keeps adapting to its content); a measured pixel value is
// substituted ONLY for the duration of the transition, then released back to `auto`.
//
// Drivers call this at the top of `useAnimations`, passing `targets` (the authored
// props, where `height: 'auto'` still lives literally) and the resolved `style` the
// driver applies. On web the CSS driver resolves dimensions to atomic classes, so the
// authored target is read from props and the pinned pixel is written back as an inline
// override (inline beats the class). Every driver already animates a numeric dimension
// and applies a static `auto`, so this hook only swaps `auto` <-> pixel at the right
// moments.
//
// RELEASE POLICY — duration timer:
//   We release the pinned pixel back to `auto` after `durationMs`. This matches the
//   "pixel only for the duration of the transition" contract and is driver-agnostic.
//   LIMITATION: for spring / variable-duration / interrupt-heavy animations a real
//   completion callback (CSS `transitionend`, Animated `.start(cb)`, reanimated
//   `withTiming` cb, Framer `.finished`) is more precise than a fixed timer. Wiring a
//   per-driver completion signal is a known follow-up; do not assume the timer is
//   universally exact.
//
// PLATFORM: web resolves the pixel with `scrollHeight`/`scrollWidth`, which report the
//   intrinsic content size without mutating any inline style. Measuring must NOT set
//   `height: auto` on the host: forcing a reflow at `auto` latches the CSS transition
//   baseline onto the intrinsic value, so the following pin-to-pixel would not animate.
//   Native (react-native) is a deliberate pass-through here: an imperative `measure()`
//   of a collapsed host returns 0, not the intrinsic target, so measure-to-pixel on
//   native needs a content-measure / off-screen pass and is the deferred follow-up.
//   On native this hook leaves `auto` untouched (settles instantly, never crashes).

const AUTO_KEYS = ['height', 'width'] as const
type AutoKey = (typeof AUTO_KEYS)[number]

// small buffer so the release fires just after the transition visually completes
const RELEASE_BUFFER_MS = 30

// applied value: a pinned pixel, intrinsic 'auto', or undefined = leave style alone
type Applied = number | 'auto' | undefined

function measureAutoWeb(host: HTMLElement, key: AutoKey): number {
  // read the intrinsic content size without touching inline style (see PLATFORM note).
  // with box-sizing: border-box (tamagui default) and no border/padding on the animated
  // wrapper, scroll size equals the border-box size `auto` would produce.
  return key === 'height' ? host.scrollHeight : host.scrollWidth
}

export function useAnimatedAutoDimension({
  style,
  targets,
  getHost,
  enabled,
  durationMs,
}: {
  style: Record<string, any>
  targets: Record<string, any>
  getHost: () => any
  enabled: boolean
  durationMs: number
}): Record<string, any> {
  // only the web path can measure synchronously; native passes through untouched
  const active = isWeb

  // per-key value to apply over the resolved style (undefined = leave the driver's
  // class/value in place)
  const [applied, setApplied] = React.useState<Record<string, Applied>>({})

  // seed the last-seen authored target so mount never animates
  const prevTarget = React.useRef<Record<string, any> | null>(null)
  if (prevTarget.current === null) {
    prevTarget.current = {}
    for (const k of AUTO_KEYS) prevTarget.current[k] = targets?.[k]
  }

  // pending cleanups (release timer / two-step rAF) per key
  const cleanups = React.useRef<Record<string, () => void>>({})

  useIsomorphicLayoutEffect(() => {
    if (!active) return
    const host = getHost() as HTMLElement | null

    for (const key of AUTO_KEYS) {
      const target = targets?.[key]
      const prev = prevTarget.current![key]
      if (target === prev) continue
      prevTarget.current![key] = target

      // cancel any in-flight release/two-step for this key
      cleanups.current[key]?.()
      delete cleanups.current[key]

      const isOpening = target === 'auto' && typeof prev === 'number'
      const isClosing = typeof target === 'number' && prev === 'auto'

      if ((!isOpening && !isClosing) || !enabled || !host) {
        // nothing auto-related, or can't measure: settle to intrinsic when the target
        // is 'auto', otherwise release the override and let the driver's own value ride
        setApplied((a) => ({ ...a, [key]: target === 'auto' ? 'auto' : undefined }))
        continue
      }

      // both directions use a two-step: paint the `from` pixel value first, then on a
      // later frame set the `to` value so the browser has a numeric baseline to tween
      // from (it cannot interpolate to/from `auto`, and a same-frame from->to swap is
      // coalesced into no transition). the intrinsic pixel is measured with scrollHeight.
      const px = measureAutoWeb(host, key)
      // opening: from prev(numeric, e.g. 0) -> px, then release to intrinsic auto.
      // closing: from px (current intrinsic) -> target(numeric, e.g. 0).
      const fromValue: Applied = isOpening ? (prev as number) : px
      const toValue: Applied = isOpening ? px : (target as number)

      setApplied((a) => ({ ...a, [key]: fromValue }))
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setApplied((a) => ({ ...a, [key]: toValue }))
          if (isOpening) {
            const timer = setTimeout(() => {
              setApplied((a) => ({ ...a, [key]: 'auto' }))
            }, durationMs + RELEASE_BUFFER_MS)
            cleanups.current[key] = () => clearTimeout(timer)
          }
        })
        cleanups.current[key] = () => cancelAnimationFrame(raf2)
      })
      cleanups.current[key] = () => cancelAnimationFrame(raf1)
    }
  })

  // clear timers on unmount
  React.useEffect(() => {
    return () => {
      const pending = cleanups.current
      for (const key in pending) pending[key]?.()
    }
  }, [])

  if (!active) return style

  // overlay applied values onto the resolved style (inline beats the atomic class)
  let out = style
  for (const key of AUTO_KEYS) {
    const value = applied[key]
    if (value === undefined) continue
    if (out === style) out = { ...style }
    out[key] = value
  }
  return out
}
