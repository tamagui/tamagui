import type { FillInFont, GenericFont } from '@tamagui/core'
import { isWeb } from '@tamagui/core'
import {
  createSystemFont as createSystemFontBase,
  systemFontFamily,
} from '@tamagui/create-system-font'

export const createSystemFont = <A extends GenericFont>({
  font = {},
  sizeLineHeight = (size) => size + 10,
  sizeSize = (size) => size * 1,
}: {
  font?: Partial<A>
  sizeLineHeight?: (fontSize: number) => number
  sizeSize?: (size: number) => number
} = {}): FillInFont<A, keyof typeof defaultSizes> => {
  return createSystemFontBase({
    font,
    sizes: defaultSizes,
    family: isWeb ? systemFontFamily.web : systemFontFamily.native,
    sizeLineHeight,
    sizeSize,
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
    },
  }) as FillInFont<A, keyof typeof defaultSizes>
}

const defaultSizes = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 23,
  9: 30,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
} as const

export const fonts = {
  body: createSystemFont(),
  heading: createSystemFont({ sizeSize: (n) => n * 1.4 }),
}
