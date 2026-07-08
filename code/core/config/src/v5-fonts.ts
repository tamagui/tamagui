import { createSystemFont } from '@tamagui/create-system-font'
const isNative = process.env.TAMAGUI_TARGET === 'native'

export { createSystemFont }

// heading line height: native ~120%, web original
const headingLineHeight = (size: number) =>
  Math.round(isNative ? size * 1.2 : size * 1.12 + 5)

export const fonts = {
  body: createSystemFont(),
  heading: createSystemFont({
    font: {
      weight: {
        0: '600',
        6: '700',
        9: '800',
      },
    },
    sizeLineHeight: headingLineHeight,
  }),
}

export type V5Fonts = typeof fonts
