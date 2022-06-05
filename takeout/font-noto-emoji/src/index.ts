import { GenericFont, createFont, getVariableValue, isWeb } from '@tamagui/core'

export const createNotoFont = <
  A extends GenericFont<keyof typeof defaultSizes>,
>(
  font: {
    [Key in keyof Partial<A>]?: Partial<A[Key]>
  } = {},
  {
    sizeLineHeight = (size) => size * 1.65 + 5,
    sizeSize = (size) => size * 1,
    webFallbackFonts = [
      '-apple-system',
      'system-ui',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      'Helvetica',
      'Arial',
      'sans-serif',
    ],
  }: {
    sizeLineHeight?: (fontSize: number) => number
    sizeSize?: (size: number) => number
    webFallbackFonts?: string[]
  } = {},
): GenericFont<keyof typeof defaultSizes> => {
  // merge to allow individual overrides
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)]),
  )
  return createFont({
    family: isWeb ? `Noto, ${webFallbackFonts.join(', ')}` : 'Noto',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [
        k,
        sizeLineHeight(getVariableValue(v)),
      ]),
    ),
    weight: {
      1: '400',
    },
    letterSpacing: {
      1: 0,
    },
    ...(font as any),
    size,
  })
}

const defaultSizes = {
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  5: 16,
  6: 18,
  7: 20,
  8: 24,
  9: 30,
  10: 42,
  11: 54,
  12: 64,
  13: 74,
  14: 80,
  15: 110,
  16: 126,
} as const
