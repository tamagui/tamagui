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
  1: (scale * 11) as number,
  2: (scale * 12) as number,
  3: (scale * 13) as number,
  4: (scale * 14) as number,
  true: (scale * 14) as number,
  5: (scale * 16) as number,
  6: (scale * 18) as number,
  7: (scale * 20) as number,
  8: (scale * 23) as number,
  9: (scale * 30) as number,
  10: (scale * 46) as number,
  11: (scale * 55) as number,
  12: (scale * 62) as number,
  13: (scale * 72) as number,
  14: (scale * 92) as number,
  15: (scale * 114) as number,
  16: (scale * 134) as number,
} as const
