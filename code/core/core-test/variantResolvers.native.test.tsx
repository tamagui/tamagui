import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { createTamagui, createVariantResolver, styled, View } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

function getOpacity(component: any, value: any) {
  const out = simplifiedGetSplitStyles(component, {
    kind: value,
  })
  return out.style?.opacity
}

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('TS-style variant resolvers - native', () => {
  test('matches TS-style resolver keys at runtime without helper dependency', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          'Size | number': (value) => ({
            opacity: value === '$4' ? 0.61 : 0.62,
          }),
        },
      } as const,
    })

    expect(getOpacity(Comp, '$4')).toBe(0.61)
    expect(getOpacity(Comp, 4)).toBe(0.62)
  })

  test('exact keys and any keep precedence for null', () => {
    const Comp = styled(View, {
      variants: {
        kind: {
          null: {
            opacity: 0.63,
          },
          any: createVariantResolver('any', () => ({
            opacity: 0.64,
          })),
        },
      } as const,
    })

    expect(getOpacity(Comp, null)).toBe(0.63)
    expect(getOpacity(Comp, { other: true })).toBe(0.64)
    expect(getOpacity(Comp, undefined)).toBeUndefined()
  })

  test('legacy true spread resolver receives default token', () => {
    let seenSize: unknown
    const Comp = styled(View, {
      variants: {
        kind: {
          '...size': (value) => {
            seenSize = value
            return {
              opacity: 0.65,
            }
          },
        },
      } as const,
    })

    expect(getOpacity(Comp, true)).toBe(0.65)
    expect(seenSize).toBe('$4')
  })
})
