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

import {
  View,
  createStyledContext,
  createTamagui,
  normalizeStaticConfigStyles,
  styled,
} from '../web/src'
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
  test('match resolved defaults and context keys before caller direct/style props', () => {
    const FrameContext = createStyledContext<{
      tone?: 'critical' | 'neutral'
    }>()

    const Frame = styled(
      View,
      {
        context: FrameContext,
        contextProps: ['tone'],
        backgroundColor: 'gray',
        $sm: {
          marginTop: 1,
          paddingTop: 1,
        },
        variants: {
          size: {
            sm: {
              backgroundColor: 'blue',
              $sm: {
                marginTop: 2,
                paddingTop: 2,
              },
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
              $sm: {
                paddingTop: 3,
              },
            },
          },
          {
            size: 'sm',
            tone: 'critical',
            state: 'active',
            style: {
              backgroundColor: 'red',
              $sm: {
                marginTop: 3,
              },
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
        $sm: {
          marginTop: 4,
        },
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

    expect(callerOverrides.style?.backgroundColor).toBe('black')
    expect(callerOverrides.style?.marginTop).toBe(4)
    expect(callerOverrides.style?.paddingTop).toBe(3)

    const permutedCaller = simplifiedGetSplitStyles(
      Frame,
      {
        style: {
          backgroundColor: 'black',
        },
        $sm: {
          marginTop: 4,
        },
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

    expect(permutedCaller.style).toEqual(callerOverrides.style)
  })

  test('same-declaration base objects override normalized base classes', () => {
    const Frame = styled(
      View,
      'p-4 rounded-4',
      { padding: 8, borderRadius: 2 },
      { acceptsClassName: false }
    )
    const result = simplifiedGetSplitStyles(Frame, {}, { mergeDefaultProps: true })
    expect(result.style?.paddingTop).toBe(8)
    expect(result.style?.borderTopLeftRadius).toBe(2)
  })

  test('static strings share runtime precedence with objects and functions', () => {
    const FrameContext = createStyledContext({
      tone: 'critical' as 'critical' | 'neutral',
    })
    const Frame = styled(
      View,
      'p-[4px]',
      {
        context: FrameContext,
        minWidth: 2,
        variants: {
          size: {
            sm: 'w-[20px]',
          },
          mode: {
            solid: {
              borderWidth: 1,
            },
          },
          raised: {
            true: () => ({
              height: 10,
            }),
          },
        } as const,
        defaultVariants: {
          size: 'sm',
          mode: 'solid',
        },
        compoundVariants: [
          {
            size: ['sm'],
            tone: 'critical',
            style: 'bg-[red] opacity-[0.5]',
          },
          {
            mode: 'solid',
            style: {
              borderColor: 'green',
            },
          },
        ],
      },
      {
        acceptsClassName: false,
      }
    )

    const result = simplifiedGetSplitStyles(
      Frame,
      {
        raised: true,
        backgroundColor: 'blue',
      },
      {
        mergeDefaultProps: true,
      }
    )

    expect(result.style).toMatchObject({
      paddingTop: 4,
      minWidth: 2,
      width: 20,
      height: 10,
      opacity: 0.5,
      backgroundColor: 'blue',
      borderTopWidth: 1,
      borderTopColor: 'green',
    })
  })

  test('late static string resolution is immutable, idempotent, and preserves modifiers', () => {
    const Frame = styled(
      View,
      'p-4 rounded-4 hover:bg-[red] sm:m-4 enter:opacity-0 base-user',
      {
        padding: 8,
        borderRadius: 2,
        variants: {
          size: {
            sm: 'h-8 px-3 hover:opacity-50 sm:mt-4 enter:scale-95 simple-user',
          },
        } as const,
        defaultVariants: { size: 'sm' },
        compoundVariants: [
          {
            size: 'sm',
            style: 'w-8 p-0 hover:bg-[blue] sm:mb-4 enter:opacity-50 compound-user',
          },
        ],
      },
      { acceptsClassName: false }
    )
    const authored = Frame.staticConfig
    const resolved = normalizeStaticConfigStyles(authored)

    expect(authored.baseClassName).toContain('p-4')
    expect(authored.variants?.size?.sm).toBe(
      'h-8 px-3 hover:opacity-50 sm:mt-4 enter:scale-95 simple-user'
    )
    expect(authored.compoundVariants?.[0]?.style).toContain('w-8')
    expect(normalizeStaticConfigStyles(resolved)).toBe(resolved)
    expect(resolved.baseStyle).toMatchObject({
      padding: '$4',
      borderRadius: '$4',
      hoverStyle: { backgroundColor: 'red' },
      $sm: { margin: '$4' },
      enterStyle: { opacity: 0 },
    })
    expect(resolved.baseStyle?.className).toBeUndefined()
    expect(resolved.variants?.size?.sm).toMatchObject({
      height: '$8',
      paddingHorizontal: '$3',
      hoverStyle: { opacity: 0.5 },
      $sm: { marginTop: '$4' },
      enterStyle: { scale: 0.95 },
    })
    expect(resolved.variants?.size?.sm).not.toHaveProperty('className')
    expect(resolved.compoundVariants?.[0]?.style).toMatchObject({
      width: '$8',
      padding: '$0',
      hoverStyle: { backgroundColor: 'blue' },
      $sm: { marginBottom: '$4' },
      enterStyle: { opacity: 0.5 },
    })
    expect(resolved.compoundVariants?.[0]?.style).not.toHaveProperty('className')

    const result = simplifiedGetSplitStyles(
      Frame,
      { className: 'caller-user' },
      { mergeDefaultProps: true }
    )
    expect(result.style?.paddingTop).toBe(0)
    expect(result.style?.width).toBe(84)
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

  test('higher media specificity beats more than 1000 later lower media entries', () => {
    const compoundVariants = [
      {
        state: 'active' as const,
        style: {
          $md: {
            marginTop: 2000,
          },
        },
      },
      ...Array.from({ length: 1005 }, (_, index) => ({
        state: 'active' as const,
        style: {
          $sm: {
            marginTop: index,
          },
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
        $sm: {
          $native: {
            marginTop: 1,
          },
        },
        $native: {
          $sm: {
            marginTop: 2,
          },
        },
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
    expect(frame.props.pointerEvents).toBe('box-none')
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
