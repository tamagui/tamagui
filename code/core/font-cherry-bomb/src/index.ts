import { isWeb } from '@tamagui/constants'
import type { FillInFont, GenericFont } from '@tamagui/core'
import { createFont, getVariableValue } from '@tamagui/core'

export const createCherryBombFont = <A extends GenericFont>(
  font: Partial<A> = {},
  {
    sizeLineHeight = (size) => size + 10,
    sizeSize = (size) => size * 1,
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
    }).map(([k, v]) => [k, Math.round(sizeSize(+v))])
  )
  return createFont({
    family: isWeb
      ? '"Cherry Bomb", -apple-system, system-ui, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif'
      : '"Cherry Bomb"',
    lineHeight: Object.fromEntries(
      Object.entries(size).map(([k, v]) => [
        k,
        Math.round(sizeLineHeight(getVariableValue(v))),
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

const scale = 1.6

const defaultSizes = {
  1: scale * 11,
  2: scale * 12,
  3: scale * 13,
  4: scale * 14,
  true: scale * 14,
  5: scale * 16,
  6: scale * 18,
  7: scale * 20,
  8: scale * 23,
  9: scale * 30,
  10: scale * 46,
  11: scale * 55,
  12: scale * 62,
  13: scale * 72,
  14: scale * 92,
  15: scale * 114,
  16: scale * 134,
} as const
