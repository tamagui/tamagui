import { createSystemFont } from '@tamagui/create-system-font'
const isNative = process.env.TAMAGUI_TARGET === 'native'

export { createSystemFont }

// heading line height: native ~120%, web original
const headingLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.2 : size * 1.12 + 5)

// pin the v5 font size + lineHeight scales to exact "Npx" strings. numbers are
// reserved for the v6 multiplier semantics; px strings mean "exact pixels" and
// are normalized back to numbers (with a needsPx flag) at token creation, so
// rendering is identical to the previous numeric config. the numeric type is
// preserved via cast to avoid widening every font-size consumer.
const toPxScale = <T extends Record<string, number>>(obj: T): T =>
  Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, typeof v === 'number' ? `${v}px` : v])
  ) as unknown as T

const pinFontToPx = <F extends { size: any; lineHeight?: any }>(font: F): F => ({
  ...font,
  size: toPxScale(font.size),
  ...(font.lineHeight ? { lineHeight: toPxScale(font.lineHeight) } : null),
})

export const fonts = {
  body: pinFontToPx(createSystemFont()),
  heading: pinFontToPx(
    createSystemFont({
      font: {
        weight: {
          0: '600',
          6: '700',
          9: '800',
        },
      },
      sizeLineHeight: headingLineHeight,
    })
  ),
}

export type V5Fonts = typeof fonts
