process.env.TAMAGUI_TARGET = 'native'

import { render } from '@testing-library/react-native'
import {
  TamaguiProvider as PackageTamaguiProvider,
  View as PackageView,
  createStyledContext as createPackageStyledContext,
  createTamagui as createPackageTamagui,
  styled as packageStyled,
} from '@tamagui/core'
import { getDefaultTamaguiConfig as getPackageDefaultTamaguiConfig } from '@tamagui/config-default'
import { describe, expect, test } from 'vitest'

import { View, createStyledContext, createTamagui, styled } from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

const packageTamaguiConfig = createPackageTamagui(
  getPackageDefaultTamaguiConfig('native')
)
createTamagui(getDefaultTamaguiConfig('native'))

function findByTestID(node: any, testID: string): any {
  if (!node) return undefined
  if (Array.isArray(node)) {
    for (const child of node) {
      const found = findByTestID(child, testID)
      if (found) return found
    }
    return undefined
  }
  if (node.props?.testID === testID) {
    return node
  }
  return findByTestID(node.children, testID)
}

function flattenStyle(style: any): Record<string, any> {
  if (Array.isArray(style)) {
    return Object.assign({}, ...style.map(flattenStyle))
  }
  return style || {}
}

describe('compoundVariants - native', () => {
  test('applies matched compounds in the same forward pass as authored props', () => {
    const FrameContext = createStyledContext<{
      tone?: 'critical' | 'neutral'
    }>()

    const Frame = styled(
      View,
      {
        context: FrameContext,
        contextProps: ['tone'],
        backgroundColor: 'gray',
        marginTop: 'sm:1px',
        paddingTop: 'sm:1px',
        variants: {
          size: {
            sm: {
              backgroundColor: 'blue',
              marginTop: 'sm:2px',
              paddingTop: 'sm:2px',
            },
          },
          state: {
            active: {},
            selected: {},
          },
        } as const,
        defaultVariants: {
          size: 'sm',
        },
        compoundVariants: [
          {
            size: 'sm',
            tone: 'critical',
            state: ['active', 'selected'],
            style: {
              paddingTop: 'sm:3px',
            },
          },
          {
            size: 'sm',
            tone: 'critical',
            state: 'active',
            style: {
              backgroundColor: 'red',
              marginTop: 'sm:3px',
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    const compoundOnly = simplifiedGetSplitStyles(
      Frame,
      {
        tone: 'critical',
        state: 'active',
      },
      {
        mediaState: {
          sm: true,
        },
        mergeDefaultProps: true,
      }
    )

    expect(compoundOnly.style?.backgroundColor).toBe('red')
    expect(compoundOnly.style?.marginTop).toBe(3)
    expect(compoundOnly.style?.paddingTop).toBe(3)
    expect(compoundOnly.viewProps.tone).toBeUndefined()

    const callerOverrides = simplifiedGetSplitStyles(
      Frame,
      {
        tone: 'critical',
        state: 'active',
        backgroundColor: 'green',
        marginTop: 'sm:4px',
        style: {
          backgroundColor: 'black',
        },
      },
      {
        mediaState: {
          sm: true,
        },
        mergeDefaultProps: true,
      }
    )

    // config-first: 'black' resolves through the configured color token
    expect(callerOverrides.style?.backgroundColor).toBe('#000')
    expect(callerOverrides.style?.marginTop).toBe(4)
    expect(callerOverrides.style?.paddingTop).toBe(3)

    const compoundAfterEarlyCaller = simplifiedGetSplitStyles(
      Frame,
      {
        style: {
          backgroundColor: 'black',
        },
        marginTop: 'sm:4px',
        backgroundColor: 'green',
        state: 'active',
        tone: 'critical',
      },
      {
        mediaState: {
          sm: true,
        },
        mergeDefaultProps: true,
      }
    )

    expect(compoundAfterEarlyCaller.style?.backgroundColor).toBe('red')
    expect(compoundAfterEarlyCaller.style?.marginTop).toBe(3)
    expect(compoundAfterEarlyCaller.style?.paddingTop).toBe(3)
  })

  test('compound matchers use Object.is for scalars and readonly arrays', () => {
    const AmountFrame = styled(
      View,
      {
        variants: {
          amount: {
            number: () => ({}),
          },
        } as const,
        compoundVariants: [
          {
            amount: -0,
            style: {
              opacity: 0.3,
            },
          },
          {
            amount: [0] as readonly number[],
            style: {
              opacity: 0.2,
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    expect(simplifiedGetSplitStyles(AmountFrame, { amount: -0 }).style?.opacity).toBe(0.3)

    const NaNFrame = styled(
      View,
      {
        variants: {
          amount: {
            number: () => ({}),
          },
        } as const,
        compoundVariants: [
          {
            amount: Number.NaN,
            style: {
              opacity: 0.4,
            },
          },
          {
            amount: [Number.NaN] as readonly number[],
            style: {
              scale: 2,
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    const nan = simplifiedGetSplitStyles(NaNFrame, { amount: Number.NaN })
    expect(nan.style?.opacity).toBe(0.4)
    expect(nan.style?.transform).toEqual([{ scale: 2 }])
  })

  test('media declaration order wins independently of authored contribution order', () => {
    // The fixed key ranks md after sm. Even many later sm contributions cannot
    // displace an active md clause with a higher within-category rank.
    const compoundVariants = [
      {
        state: 'active' as const,
        style: {
          marginTop: 'md:2000px',
        },
      },
      ...Array.from({ length: 1005 }, (_, index) => ({
        state: 'active' as const,
        style: {
          marginTop: `sm:${index}px`,
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

    expect(
      simplifiedGetSplitStyles(
        Frame,
        {
          state: 'active',
        },
        {
          mediaState: {
            sm: true,
            md: true,
          },
        }
      ).style?.marginTop
    ).toBe(2000)
  })

  test('nested platform matrices preserve equal-specificity later-order behavior', () => {
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
        marginTop: 'sm:native:1px native:sm:2px',
      },
      {
        mediaState: {
          sm: true,
        },
      }
    )

    expect(equalSpecificityLaterWins.style?.marginTop).toBe(2)
  })

  test('real Provider supplies explicit context props without consuming host props', () => {
    const FrameContext = createPackageStyledContext<{
      tone?: 'critical' | 'neutral'
    }>()
    const Frame = packageStyled(
      PackageView,
      {
        context: FrameContext,
        contextProps: ['tone'],
        variants: {
          state: {
            active: {},
          },
        } as const,
        compoundVariants: [
          {
            tone: 'critical',
            state: 'active',
            style: {
              backgroundColor: 'red',
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    const tree = render(
      <PackageTamaguiProvider config={packageTamaguiConfig} defaultTheme="light">
        <FrameContext.Provider tone="critical">
          <Frame
            state="active"
            testID="compound-provider-frame"
            pointerEvents="box-none"
          />
        </FrameContext.Provider>
      </PackageTamaguiProvider>
    )

    const frame = findByTestID(tree.toJSON(), 'compound-provider-frame')
    expect(frame).toBeTruthy()
    // pointerEvents is a style on RN >= 0.71 (0b3b28cde9): the host receives
    // style.pointerEvents, not the deprecated View prop
    expect(flattenStyle(frame.props.style).pointerEvents).toBe('box-none')
    expect(frame.props.tone).toBeUndefined()
    expect(flattenStyle(frame.props.style).backgroundColor).toBe('red')
  })

  test('default-object contexts auto-enumerate consumed keys', () => {
    const FrameContext = createStyledContext({
      tone: 'critical' as 'critical' | 'neutral',
    })
    const Frame = styled(
      View,
      {
        context: FrameContext,
        variants: {
          state: {
            active: {},
          },
        } as const,
        compoundVariants: [
          {
            tone: 'critical',
            state: 'active',
            style: {
              backgroundColor: 'red',
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    const out = simplifiedGetSplitStyles(
      Frame,
      {
        state: 'active',
      },
      {
        mergeDefaultProps: true,
      }
    )

    expect(FrameContext.propKeys).toEqual(['tone'])
    expect(out.style?.backgroundColor).toBe('red')
  })
})
