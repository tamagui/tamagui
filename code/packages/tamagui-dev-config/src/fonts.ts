import { createCherryBombFont } from '@tamagui/font-cherry-bomb'
import { createFont } from '@tamagui/core'
import { createGenericFont } from './createGenericFont'

const isWeb = process.env.TAMAGUI_TARGET === 'web'

// Contrast variable font (100-900) for UI and text, paired with Inter italic
const contrastFamily = isWeb
  ? '"Contrast", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
  : 'System'

// JetBrains Mono, subset to latin + punctuation as a variable font (~19kb), is
// the only webfont left. it covers every weight from one file.
const monoFamily = isWeb
  ? '"JetBrains Mono", ui-monospace, "SFMono-Regular", "SF Mono", Menlo, Consolas, "Liberation Mono", monospace'
  : 'JetBrains Mono'

export const cherryBombFont = createCherryBombFont({
  // Cherry Bomb is a heavy rounded display face; fall back to heavy web-safe
  // faces so the brief pre-load flash looks close to the real thing instead of
  // thin default Arial.
  family: `"Cherry Bomb", "Arial Black", "Helvetica Neue", Helvetica, Arial, sans-serif`,
  // Cherry Bomb only ships weight 400 (so this doesn't change its look), but a
  // heavy weight makes the system fallback render bold instead of thin, much
  // closer to Cherry Bomb during the load flash.
  weight: {
    4: '800',
  },
  size: {
    true: 22.4,
  },
})

// one equation for the whole ramp instead of a hand-written table. each step is
// a little bigger than the one before it, from 9% at the UI sizes up to 19% at
// the display sizes, because small text wants roughly a point between steps and
// big text wants a proportion. the table this replaced had a cliff at the top:
// 30 to 44 between size 9 and 10, a 47% jump next to neighbours around 15%.
const sizes = () => {
  const out: Record<number | 'true', number> = { true: 14 }
  let px = 11
  for (let i = 1; i <= 16; i++) {
    out[i] = Math.round(px)
    px *= Math.min(1.19, 1.05 + i * 0.019)
  }
  return out
}

// 11 12 13 14 16 18 21 25 30 36 42 50 60 71 85 101
const size = sizes()

const lineHeights = (ratio: number, extra: number) =>
  Object.fromEntries(
    Object.entries(size).map(([k, v]) => [k, Math.round(v * ratio + extra)])
  ) as typeof size

export const headingFont = createFont({
  family: contrastFamily,
  size,
  // eases from 1.4 at label sizes down to 1.3 at display sizes
  lineHeight: lineHeights(1.25, 2),
  weight: { 1: '600' },
  letterSpacing: { 1: 0 },
})

export const bodyFont = createFont({
  family: contrastFamily,
  size,
  // the old curve was size * 1.2 plus a step that jumped from 8 to 12 at size
  // 20, so 18px came out at ratio 1.67 while 22px came out at 1.75: bigger text
  // ended up looser than smaller text. this is monotonic and lands 16px on 25px
  lineHeight: lineHeights(1.35, 3),
  weight: { 1: '400' },
  letterSpacing: { 1: 0 },
})

export const monoFont = createGenericFont(
  monoFamily,
  {
    weight: {
      1: '400',
    },
    size: {
      1: 11,
      2: 12,
      3: 13,
      4: 14,
      5: 16,
      6: 18,
      7: 20,
      8: 22,
      9: 24,
      10: 32,
      11: 46,
      12: 62,
      13: 72,
      14: 92,
      15: 114,
      16: 124,
    },
  },
  {
    sizeLineHeight: (x) => x * 1.5 + 2,
  }
)
