import { createSystemFont } from '@tamagui/create-system-font'
const isNative = process.env.TAMAGUI_TARGET === 'native'

export { createSystemFont }

// heading line height: native ~120%, web original
const headingLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.2 : size * 1.12 + 5)

// keep v5 font scales explicitly absolute. numeric font definitions also retain
// pixel units in v3; only authored numeric styles and numeric-string font values
// express line-height ratios. token creation preserves numeric values for arithmetic.
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
