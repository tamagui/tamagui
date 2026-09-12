import { createCherryBombFont } from '@tamagui/font-cherry-bomb'
import { createInterFont } from '@tamagui/font-inter'
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

export const headingFont = createInterFont(
  {
    family: contrastFamily,
    size: {
      true: 14,
      5: 13,
      6: 15,
      9: 30,
      10: 44,
    },
    transform: {
      6: 'uppercase',
      7: 'none',
    },
    weight: {
      6: '400',
      7: '700',
    },
    color: {
      6: 'color-focus',
      7: 'color',
    },
    letterSpacing: {
      5: 2,
      6: 1,
      7: 0,
      8: 0,
      9: 0,
      10: 0,
      11: 0,
      12: 0,
      14: 0,
      15: 0,
    },
  },
  { sizeLineHeight: (size) => Math.round(size * 1.1 + (size < 30 ? 10 : 5)) }
)

export const bodyFont = createInterFont(
  {
    family: contrastFamily,
    size: {
      true: 14,
    },
    weight: {
      1: '400',
    },
  },
  {
    sizeSize: (size) => Math.round(size),
    // the old curve was size * 1.2 plus a step that jumped from 8 to 12 at size
    // 20, so 18px came out at ratio 1.67 while 22px came out at 1.75: bigger
    // text ended up looser than smaller text, and docs body at 16px sat at 27px
    // which reads airy. this is monotonic and lands 16px on 25px
    sizeLineHeight: (size) => Math.round(size * 1.35 + 3),
  }
)

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
