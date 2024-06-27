import type { FillInFont, GenericFont } from '@tamagui/core'
import { createFont, getVariableValue, isWeb } from '@tamagui/core'

const LINE_HEIGHT = 1.2

export const createDmSerifDisplayFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => size,
    sizeSize = (size) => size,
  }: {
    sizeLineHeight?: (fontSize: number) => number
    sizeSize?: (size: number) => number
  } = {}
): FillInFont<A, keyof typeof defaultSizes> => {
  // merge to allow individual overrides
  const size = Object.fromEntries(
    Object.entries({
      ...defaultSizes,
      ...font.size,
    }).map(([k, v]) => [k, sizeSize(+v)])
  )
  return createFont({
    family: isWeb
      ? '"DM Serif Display", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : 'DM Serif Display',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [
        k,
        sizeLineHeight(getVariableValue(v) * LINE_HEIGHT),
      ])
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
  1: 11,
  2: 12,
  3: 13,
  4: 14,
  true: 14,
  5: 18,
  6: 22,
  7: 26,
  8: 30,
  9: 38,
  10: 46,
  11: 55,
  12: 62,
  13: 72,
  14: 92,
  15: 114,
  16: 134,
} as const
