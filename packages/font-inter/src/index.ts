import { GenericFont, createFont, getVariableValue } from '@tamagui/core'
import { Platform } from 'react-native'

export const createInterFont = <A extends GenericFont<keyof typeof defaultSizes>>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => size + 10,
  }: {
    sizeLineHeight?: (fontSize: number) => number
  } = {}
): A => {
  // merge to allow individual overrides
  const size = {
    ...defaultSizes,
    ...font.size,
  }
  return createFont({
    family:
      Platform.OS == 'web'
        ? 'Inter, -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
        : 'Inter',
    lineHeight: Object.fromEntries(
      Object.entries(font.size || size).map(([k, v]) => [k, sizeLineHeight(getVariableValue(v))])
    ),
    weight: {
      4: '300',
    },
    letterSpacing: {
      4: 0,
    },
    ...(font as any),
    size,
  })
}

const defaultSizes = {
  1: 12,
  2: 13,
  3: 14,
  4: 16,
  5: 18,
  6: 19,
  7: 21,
  8: 26,
  9: 32,
  10: 45,
  11: 58,
  12: 64,
  13: 76,
  14: 102,
  15: 124,
  16: 144,
} as const
