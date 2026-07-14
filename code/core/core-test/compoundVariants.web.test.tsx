process.env.TAMAGUI_TARGET = 'web'

import { render } from '@testing-library/react'
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
  StyleObjectProperty,
  StyleObjectValue,
  View,
  createStyledContext,
  createTamagui,
  normalizeStaticConfigStyles,
  styled,
} from '../web/src'
import { getDefaultTamaguiConfig } from '../config-default'
import { simplifiedGetSplitStyles } from './utils'

const packageTamaguiConfig = createPackageTamagui(getPackageDefaultTamaguiConfig('web'))
createTamagui(getDefaultTamaguiConfig('web'))

describe('compoundVariants - web', () => {
  const getRuleValue = (rulesToInsert: Record<string, any>, property: string) => {
    for (const rule of Object.values(rulesToInsert)) {
      if (rule[StyleObjectProperty] === property) {
        return rule[StyleObjectValue]
      }
    }
  }

  test('match defaults and explicit context keys, then yield to caller direct/style values', () => {
    const FrameContext = createStyledContext<{
      tone?: 'critical' | 'neutral'
    }>()

    const Frame = styled(
      View,
      {
        context: FrameContext,
        contextProps: ['tone'],
        backgroundColor: 'gray',
        hoverStyle: {
          opacity: 0.1,
          borderRadius: 1,
        },
        $sm: {
          marginTop: 1,
          paddingTop: 1,
        },
        variants: {
          size: {
            sm: {
              backgroundColor: 'blue',
              hoverStyle: {
                opacity: 0.3,
                borderRadius: 1.5,
              },
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
              hoverStyle: {
                borderRadius: 2,
              },
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
              hoverStyle: {
                opacity: 0.5,
              },
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
        componentState: {
          hover: true,
        },
        mediaState: {
          sm: true,
        },
        mergeDefaultProps: true,
      }
    )

    expect(compoundOnly.style?.backgroundColor).toBe('red')
    expect(compoundOnly.style?.opacity).toBe(0.5)
    expect(compoundOnly.style?.borderTopLeftRadius).toBe('2px')
    expect(compoundOnly.style?.marginTop).toBe('3px')
    expect(compoundOnly.style?.paddingTop).toBe('3px')
    expect(compoundOnly.viewProps.tone).toBeUndefined()

    const callerOverrides = simplifiedGetSplitStyles(
      Frame,
      {
        tone: 'critical',
        state: 'active',
        backgroundColor: 'green',
        hoverStyle: {
          opacity: 0.7,
        },
        $sm: {
          marginTop: 4,
        },
        style: {
          backgroundColor: 'black',
        },
      },
      {
        componentState: {
          hover: true,
        },
        mediaState: {
          sm: true,
        },
        mergeDefaultProps: true,
      }
    )

    expect(callerOverrides.style?.backgroundColor).toBe('black')
    expect(callerOverrides.style?.opacity).toBe(0.7)
    expect(callerOverrides.style?.borderTopLeftRadius).toBe('2px')
    expect(callerOverrides.style?.marginTop).toBe('4px')
    expect(callerOverrides.style?.paddingTop).toBe('3px')

    const permutedCaller = simplifiedGetSplitStyles(
      Frame,
      {
        style: {
          backgroundColor: 'black',
        },
        $sm: {
          marginTop: 4,
        },
        hoverStyle: {
          opacity: 0.7,
        },
        backgroundColor: 'green',
        state: 'active',
        tone: 'critical',
      },
      {
        componentState: {
          hover: true,
        },
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
    expect(result.style?.paddingTop).toBe('8px')
    expect(result.style?.borderTopLeftRadius).toBe('2px')
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
      paddingTop: '4px',
      minWidth: '2px',
      width: '20px',
      height: '10px',
      opacity: 0.5,
      backgroundColor: 'blue',
      borderTopWidth: '1px',
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
    const packageResolved = normalizeStaticConfigStyles(
      authored,
      packageTamaguiConfig as any
    )
    expect(packageResolved).not.toBe(resolved)
    expect(normalizeStaticConfigStyles(authored, packageTamaguiConfig as any)).toBe(
      packageResolved
    )
    expect(resolved.baseStyle).toMatchObject({
      padding: '$4',
      borderRadius: '$4',
      hoverStyle: { backgroundColor: 'red' },
      $sm: { margin: '$4' },
      enterStyle: { opacity: 0 },
      className: 'base-user',
    })
    expect(resolved.variants?.size?.sm).toMatchObject({
      height: '$8',
      paddingHorizontal: '$3',
      hoverStyle: { opacity: 0.5 },
      $sm: { marginTop: '$4' },
      enterStyle: { scale: 0.95 },
      className: 'simple-user',
    })
    expect(resolved.compoundVariants?.[0]?.style).toMatchObject({
      width: '$8',
      padding: '$0',
      hoverStyle: { backgroundColor: 'blue' },
      $sm: { marginBottom: '$4' },
      enterStyle: { opacity: 0.5 },
      className: 'compound-user',
    })

    const result = simplifiedGetSplitStyles(
      Frame,
      { className: 'caller-user' },
      { mergeDefaultProps: true }
    )
    expect(result.style?.paddingTop).toBe('var(--t-space-0)')
    expect(result.style?.width).toBe('var(--t-size-8)')
    expect(result.viewProps.className).toMatch(
      /base-user.*simple-user.*compound-user.*caller-user/
    )
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
    expect(nan.style?.transform).toBe('scale(2)')
  })

  test('later equal-specificity media wins without fractional importance bumps', () => {
    const compoundVariants = Array.from({ length: 1005 }, (_, index) => ({
      state: 'active' as const,
      style: {
        $sm: {
          marginTop: index,
        },
      },
    }))
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
          },
        }
      ).style?.marginTop
    ).toBe('1004px')
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
    ).toBe('2000px')
  })

  test('nested media/platform specificity remains numeric', () => {
    const Frame = styled(
      View,
      {},
      {
        acceptsClassName: false,
      }
    )
    const lowerSpecificityLast = simplifiedGetSplitStyles(
      Frame,
      {
        $sm: {
          $web: {
            marginTop: 2,
          },
        },
        $web: {
          marginTop: 1,
        },
      },
      {
        mediaState: {
          sm: true,
        },
      }
    )

    expect(
      lowerSpecificityLast.style?.marginTop ??
        getRuleValue(lowerSpecificityLast.rulesToInsert, 'marginTop')
    ).toBe('2px')
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
          $web: {
            marginTop: 1,
          },
        },
        $web: {
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

    expect(
      equalSpecificityLaterWins.style?.marginTop ??
        getRuleValue(equalSpecificityLaterWins.rulesToInsert, 'marginTop')
    ).toBe('2px')
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

    const { container } = render(
      <PackageTamaguiProvider config={packageTamaguiConfig} defaultTheme="light">
        <FrameContext.Provider tone="critical">
          <Frame
            state="active"
            id="compound-provider-frame"
            aria-label="unrelated-prop"
          />
        </FrameContext.Provider>
      </PackageTamaguiProvider>
    )

    const frame = container.querySelector('#compound-provider-frame') as HTMLElement
    expect(frame).toBeTruthy()
    expect(frame.getAttribute('tone')).toBeNull()
    expect(frame.getAttribute('aria-label')).toBe('unrelated-prop')
    expect(frame.style.backgroundColor).toBe('red')
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

  test('empty default contexts consume no runtime keys', () => {
    const FrameContext = createStyledContext<{
      tone?: 'critical' | 'neutral'
    }>({})
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

    expect(FrameContext.propKeys).toEqual([])
    expect(out.style?.backgroundColor).toBeUndefined()
  })

  test('present undefined default contexts consume the present runtime key', () => {
    const FrameContext = createStyledContext<{
      tone?: 'critical' | 'neutral'
    }>({
      tone: undefined,
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
    expect(out.style?.backgroundColor).toBeUndefined()
  })

  test('inherited compoundVariants apply parent first', () => {
    const Parent = styled(
      View,
      {
        variants: {
          tone: {
            active: {},
          },
        } as const,
        compoundVariants: [
          {
            tone: 'active',
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

    const Child = styled(
      Parent,
      {
        compoundVariants: [
          {
            tone: 'active',
            style: {
              opacity: 0.4,
            },
          },
        ],
      } as const,
      {
        acceptsClassName: false,
      }
    )

    expect(simplifiedGetSplitStyles(Child, { tone: 'active' }).style?.opacity).toBe(0.4)
    expect(
      Child.staticConfig.compoundVariants?.map((item) => item.style.opacity)
    ).toEqual([0.2, 0.4])
  })
})
