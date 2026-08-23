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
  createComponent,
  createStyledContext,
  createTamagui,
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
        opacity: 'hover:0.1',
        borderRadius: 'hover:1px',
        marginTop: 'sm:1px',
        paddingTop: 'sm:1px',
        variants: {
          size: {
            sm: {
              backgroundColor: 'blue',
              opacity: 'hover:0.3',
              borderRadius: 'hover:1.5px',
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
              borderRadius: 'hover:2px',
              paddingTop: 'sm:3px',
            },
          },
          {
            size: 'sm',
            tone: 'critical',
            state: 'active',
            style: {
              backgroundColor: 'red',
              opacity: 'hover:0.5',
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
    expect(compoundOnly.style?.borderTopLeftRadius).toBe(2)
    expect(compoundOnly.style?.marginTop).toBe(3)
    expect(compoundOnly.style?.paddingTop).toBe(3)
    expect(compoundOnly.viewProps.tone).toBeUndefined()

    const callerOverrides = simplifiedGetSplitStyles(
      Frame,
      {
        tone: 'critical',
        state: 'active',
        backgroundColor: 'green',
        opacity: 'hover:0.7',
        marginTop: 'sm:4px',
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

    // config-first: 'black' resolves through the configured color token
    expect(callerOverrides.style?.backgroundColor).toBe('#000')
    expect(callerOverrides.style?.opacity).toBe(0.7)
    expect(callerOverrides.style?.borderTopLeftRadius).toBe(2)
    expect(callerOverrides.style?.marginTop).toBe(4)
    expect(callerOverrides.style?.paddingTop).toBe(3)

    const compoundAfterEarlyCaller = simplifiedGetSplitStyles(
      Frame,
      {
        style: {
          backgroundColor: 'black',
        },
        marginTop: 'sm:4px',
        opacity: 'hover:0.7',
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

    expect(compoundAfterEarlyCaller.style?.backgroundColor).toBe('red')
    expect(compoundAfterEarlyCaller.style?.opacity).toBe(0.5)
    expect(compoundAfterEarlyCaller.style?.borderTopLeftRadius).toBe(2)
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
    expect(nan.style?.transform).toBe('scale(2)')
  })

  test('base style values do not satisfy compound selectors', () => {
    const Frame = createComponent({
      ...View.staticConfig,
      acceptsClassName: false,
      baseStyle: {
        tone: 'active',
      },
      variants: {
        tone: {
          active: {},
        },
      },
      compoundVariants: [
        {
          tone: 'active',
          style: {
            opacity: 0.5,
          },
        },
      ],
    } as any)

    expect(simplifiedGetSplitStyles(Frame, {}).style?.opacity).toBeUndefined()
  })

  test('absent and present undefined selectors anchor at different positions', () => {
    const Frame = styled(
      View,
      {
        compoundVariants: [
          {
            tone: undefined,
            style: {
              opacity: 0.5,
            },
          },
        ],
      } as any,
      {
        acceptsClassName: false,
      }
    )

    expect(simplifiedGetSplitStyles(Frame, { opacity: 0.8 }).style?.opacity).toBe(0.8)
    expect(
      simplifiedGetSplitStyles(Frame, { opacity: 0.8, tone: undefined }).style?.opacity
    ).toBe(0.5)
  })

  test('functional variant reentry preserves the outer compound frame', () => {
    const Inner = styled(
      View,
      {
        compoundVariants: [
          {
            inner: 'active',
            style: {
              opacity: 0.25,
            },
          },
        ],
      } as any,
      {
        acceptsClassName: false,
      }
    )
    let innerOpacity: number | undefined
    const Outer = styled(
      View,
      {
        variants: {
          tone: {
            active: {},
          },
          trigger: {
            go: () => {
              innerOpacity = simplifiedGetSplitStyles(Inner, {
                inner: 'active',
              }).style?.opacity
              return {}
            },
          },
        },
        compoundVariants: [
          {
            tone: 'active',
            trigger: 'go',
            style: {
              opacity: 0.75,
            },
          },
        ],
      } as any,
      {
        acceptsClassName: false,
      }
    )

    const out = simplifiedGetSplitStyles(Outer, {
      tone: 'active',
      trigger: 'go',
    })

    expect(innerOpacity).toBe(0.25)
    expect(out.style?.opacity).toBe(0.75)
  })

  test('later equal-specificity media wins without fractional importance bumps', () => {
    const compoundVariants = Array.from({ length: 1005 }, (_, index) => ({
      state: 'active' as const,
      style: {
        marginTop: `sm:${index}px`,
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
    ).toBe(1004)
  })

  test('getter reentry can grow the arena while an outer 1005-compound frame is live', () => {
    const Inner = styled(
      View,
      {
        compoundVariants: [
          {
            inner: 'active',
            style: {
              opacity: 0.25,
            },
          },
        ],
      } as any,
      {
        acceptsClassName: false,
      }
    )
    const compounds = Array.from({ length: 1005 }, (_, index) => ({
      tone: 'active',
      trigger: 'go',
      style: {
        marginTop: index,
      },
    }))
    const Outer = styled(
      View,
      {
        compoundVariants: compounds,
      } as any,
      {
        acceptsClassName: false,
      }
    )
    let reads = 0
    let innerOpacity: number | undefined
    const props: Record<string, any> = {
      tone: 'active',
    }
    Object.defineProperty(props, 'trigger', {
      enumerable: true,
      get() {
        reads++
        if (reads === 1) {
          innerOpacity = simplifiedGetSplitStyles(Inner, {
            inner: 'active',
          }).style?.opacity
        }
        return 'go'
      },
    })

    const out = simplifiedGetSplitStyles(Outer, props)

    expect(reads).toBe(1)
    expect(innerOpacity).toBe(0.25)
    expect(out.style?.marginTop).toBe(1004)
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

  test('deeper matching clauses win across authored order', () => {
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
        marginTop: 'sm:web:2px web:1px',
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
    ).toBe(2)
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
        marginTop: 'sm:web:1px web:sm:2px',
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
    ).toBe(2)
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
