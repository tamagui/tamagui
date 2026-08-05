process.env.TAMAGUI_TARGET = 'native'

import { beforeAll, describe, expect, test, vi } from 'vitest'

import { View, createTamagui, styled } from '../web/src'
import config from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

vi.mock('@tamagui/constants', async () => {
  const actual = await vi.importActual('@tamagui/constants')
  return {
    ...actual,
    currentPlatform: 'ios',
    isAndroid: false,
    isClient: true,
    isIos: true,
    isTV: false,
    isWeb: false,
  }
})

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig('native'))
})

describe('compoundVariants - iOS platform specificity', () => {
  test('platform specificity bump beats more than 1000 later lower-specific platform entries', () => {
    const compoundVariants = [
      {
        state: 'active' as const,
        style: {
          marginTop: 'ios:2000px',
        },
      },
      ...Array.from({ length: 1005 }, (_, index) => ({
        state: 'active' as const,
        style: {
          marginTop: `native:${index}px`,
        },
      })),
    ]
    const Frame = styled(
      View,
      {
        variants: {
          state: {
            active: {},
          },
        } as const,
        compoundVariants,
      } as const,
      {
        acceptsClassName: false,
      }
    )

    expect(simplifiedGetSplitStyles(Frame, { state: 'active' }).style?.marginTop).toBe(
      2000
    )
  })

  test('nested platform matrices preserve equal-order and higher-specificity behavior', () => {
    const Frame = styled(
      View,
      {},
      {
        acceptsClassName: false,
      }
    )
    const equalSpecificityLaterWins = simplifiedGetSplitStyles(
      Frame,
      {
        marginTop: 'sm:ios:1px ios:sm:2px',
      },
      {
        mediaState: {
          sm: true,
        },
      }
    )

    expect(equalSpecificityLaterWins.style?.marginTop).toBe(2)

    const higherSpecificityWins = simplifiedGetSplitStyles(
      Frame,
      {
        marginTop: 'ios:sm:2px native:sm:3px',
      },
      {
        mediaState: {
          sm: true,
        },
      }
    )

    expect(higherSpecificityWins.style?.marginTop).toBe(2)
  })
})
