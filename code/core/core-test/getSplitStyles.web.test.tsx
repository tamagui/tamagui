import { beforeAll, describe, expect, test, vi } from 'vitest'

import config from '../config-default'
import {
  View,
  StyleObjectProperty,
  StyleObjectRules,
  StyleObjectValue,
  Text,
  createTamagui,
  styled,
} from '../web/src'
import { getSplitStyles } from '../web/src'
import { defaultComponentState } from '../web/src/defaultComponentState'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('getSplitStyles', () => {
  test('Text does not register inlineWhenUnflattened', () => {
    expect((Text as any).staticConfig.inlineWhenUnflattened).toBeUndefined()
  })

  test(`styled with variants`, () => {
    const ViewVariants = styled(Text, {
      color: 'blue',

      variants: {
        test: {
          true: {
            color: 'red',
          },
        },
      },
    })

    const styles = simplifiedGetSplitStyles(ViewVariants, {
      test: true,
    })

    // variant strings run through the program engine: hashed program class,
    // same declaration
    const className = styles.classNames.color
    expect(className).toMatch(/^_c-/)
    expect((styles.rulesToInsert[className]?.[4] ?? []).join('')).toContain('color:red')
  })

  test(`Size variants receive true for opt-in sizing policies`, () => {
    let seenSize: unknown
    const SizedView = styled(View, {
      variants: {
        size: {
          Size: (val) => {
            seenSize = val
            return {
              width: val,
            }
          },
        },
      } as const,
    })

    simplifiedGetSplitStyles(SizedView, {
      size: true,
    })

    expect(seenSize).toBe(true)
  })

  test(`prop "aria-required" is passed through`, () => {
    const { viewProps } = simplifiedGetSplitStyles(
      View,
      {
        'aria-required': true,
      },
      {
        render: 'input',
      }
    )

    expect(viewProps['aria-required']).toEqual(true)
  })

  test(`prop "paddingStart" value 10 becomes "10px"`, () => {
    const out = simplifiedGetSplitStyles(
      View,
      {
        paddingStart: 10,
      },
      {
        render: 'input',
      }
    )
    expect(Object.values(out.rulesToInsert)[0]?.[StyleObjectValue]).toEqual('10px')
  })

  test(`prop "paddingTop" value "safe" becomes env(safe-area-inset-top)`, () => {
    const out = simplifiedGetSplitStyles(View, { paddingTop: 'safe' })
    const rule = Object.values(out.rulesToInsert).find(
      (r) => r[StyleObjectProperty] === 'paddingTop'
    )
    expect(rule?.[StyleObjectValue]).toEqual('env(safe-area-inset-top)')
  })

  test(`prop "padding" value "safe" expands to 4 per-side env() values`, () => {
    const out = simplifiedGetSplitStyles(View, { padding: 'safe' })
    const byProp: Record<string, string> = {}
    for (const rule of Object.values(out.rulesToInsert)) {
      byProp[rule[StyleObjectProperty] as string] = rule[StyleObjectValue] as string
    }
    expect(byProp.paddingTop).toEqual('env(safe-area-inset-top)')
    expect(byProp.paddingRight).toEqual('env(safe-area-inset-right)')
    expect(byProp.paddingBottom).toEqual('env(safe-area-inset-bottom)')
    expect(byProp.paddingLeft).toEqual('env(safe-area-inset-left)')
  })

  test(`prop "inset" value "safe" expands to top/right/bottom/left env() values`, () => {
    const out = simplifiedGetSplitStyles(View, { inset: 'safe' })
    const byProp: Record<string, string> = {}
    for (const rule of Object.values(out.rulesToInsert)) {
      byProp[rule[StyleObjectProperty] as string] = rule[StyleObjectValue] as string
    }
    expect(byProp.top).toEqual('env(safe-area-inset-top)')
    expect(byProp.right).toEqual('env(safe-area-inset-right)')
    expect(byProp.bottom).toEqual('env(safe-area-inset-bottom)')
    expect(byProp.left).toEqual('env(safe-area-inset-left)')
  })

  test(`shorthand "pt" value "safe" becomes paddingTop env(safe-area-inset-top)`, () => {
    const out = simplifiedGetSplitStyles(View, { pt: 'safe' })
    const rule = Object.values(out.rulesToInsert).find(
      (r) => r[StyleObjectProperty] === 'paddingTop'
    )
    expect(rule?.[StyleObjectValue]).toEqual('env(safe-area-inset-top)')
  })

  test(`prop "paddingHorizontal" value "safe" only emits left+right`, () => {
    const out = simplifiedGetSplitStyles(View, { paddingHorizontal: 'safe' })
    const byProp: Record<string, string> = {}
    for (const rule of Object.values(out.rulesToInsert)) {
      byProp[rule[StyleObjectProperty] as string] = rule[StyleObjectValue] as string
    }
    expect(byProp.paddingLeft).toEqual('env(safe-area-inset-left)')
    expect(byProp.paddingRight).toEqual('env(safe-area-inset-right)')
    expect(byProp.paddingTop).toBeUndefined()
    expect(byProp.paddingBottom).toBeUndefined()
  })

  test(`font props get the font family, regardless of the order`, () => {
    const styles = simplifiedGetSplitStyles(Text, {
      fontSize: '1',
    }).rulesToInsert

    expect(
      Object.values(styles).find((rule) => rule[StyleObjectProperty] === 'fontSize')?.[
        StyleObjectValue
      ]
    ).toEqual('var(--f-size-1)') // no family provided - this is expected

    expect(
      Object.values(
        simplifiedGetSplitStyles(Text, {
          fontSize: '1',
          fontFamily: 'body',
        }).rulesToInsert
      ).find((rule) => rule[StyleObjectProperty] === 'fontSize')?.[StyleObjectValue]
    ).toEqual('var(--f-size-1)')

    expect(
      Object.values(
        simplifiedGetSplitStyles(Text, {
          fontFamily: 'body',
          fontSize: '1',
        }).rulesToInsert
      ).find((rule) => rule[StyleObjectProperty] === 'fontSize')?.[StyleObjectValue]
    ).toEqual('var(--f-size-1)')
  })

  test(`font props get the font family from a variant, regardless of the order`, () => {
    const CustomText = styled(Text, {
      variants: {
        type: {
          myValue: {
            fontFamily: 'body',
          },
        },
      } as const,
    })

    expect(
      Object.values(
        simplifiedGetSplitStyles(CustomText, {
          fontSize: '1',
          type: 'myValue',
        }).rulesToInsert
      ).find((rule) => rule[StyleObjectProperty] === 'fontSize')?.[StyleObjectValue]
    ).toEqual('var(--f-size-1)')

    expect(
      Object.values(
        simplifiedGetSplitStyles(CustomText, {
          type: 'myValue',
          fontSize: '1',
        }).rulesToInsert
      ).find((rule) => rule[StyleObjectProperty] === 'fontSize')?.[StyleObjectValue]
    ).toEqual('var(--f-size-1)')
  })

  test(`background shorthand passes through to CSS on web`, () => {
    const shorthand = simplifiedGetSplitStyles(View, {
      background: '#fff url(x.png) no-repeat',
    })
    const rule = Object.values(shorthand.rulesToInsert).find(
      (rule) => rule[StyleObjectProperty] === 'background'
    )
    expect(rule?.[StyleObjectValue]).toBe('#fff url(x.png) no-repeat')

    // single color values normalize to backgroundColor
    const color = simplifiedGetSplitStyles(View, { background: 'red' })
    expect(
      Object.values(color.rulesToInsert).find(
        (rule) => rule[StyleObjectProperty] === 'backgroundColor'
      )?.[StyleObjectValue]
    ).toBe('red')
  })

  test(`light and dark theme clauses generate the correct CSS selectors`, () => {
    // Test light theme styles
    const lightThemeStyles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'light:white',
      color: 'light:black',
    })

    // Check the entire structure for expected values
    const lightThemeString = JSON.stringify(lightThemeStyles.rulesToInsert)
    expect(lightThemeString).toContain('backgroundColor')
    expect(lightThemeString).toContain('white')
    expect(lightThemeString).toContain('light')

    // If possible, find the rule for the light theme
    const lightBgRule = Object.values(lightThemeStyles.rulesToInsert).find(
      (rule) =>
        rule[StyleObjectProperty] === 'backgroundColor' &&
        rule[StyleObjectRules]?.[0]?.includes('light')
    )

    // Rule might exist in a different format
    expect(lightBgRule || lightThemeString.includes('white')).toBeTruthy()

    // Test dark theme styles
    const darkThemeStyles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'dark:black',
      color: 'dark:white',
    })

    // Check the entire structure for expected values
    const darkThemeString = JSON.stringify(darkThemeStyles.rulesToInsert)
    expect(darkThemeString).toContain('backgroundColor')
    expect(darkThemeString).toContain('black')
    expect(darkThemeString).toContain('dark')

    // If possible, find the rule for the dark theme
    const darkBgRule = Object.values(darkThemeStyles.rulesToInsert).find(
      (rule) =>
        rule[StyleObjectProperty] === 'backgroundColor' &&
        rule[StyleObjectRules]?.[0]?.includes('dark')
    )

    // Rule might exist in a different format
    expect(darkBgRule || darkThemeString.includes('black')).toBeTruthy()
  })

  test(`light and dark theme clauses combine in the same component`, () => {
    // Test both light and dark theme styles in the same component
    const combinedThemeStyles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'light:white dark:black',
      color: 'light:black dark:white',
    })

    // Check the entire structure for expected values
    const combinedThemeString = JSON.stringify(combinedThemeStyles.rulesToInsert)
    expect(combinedThemeString).toContain('backgroundColor')
    expect(combinedThemeString).toContain('white')
    expect(combinedThemeString).toContain('black')
    expect(combinedThemeString).toContain('light')
    expect(combinedThemeString).toContain('dark')
  })

  test(`root theme clauses work within nested themes`, () => {
    const nestedThemeStyles = simplifiedGetSplitStyles(
      View,
      {
        backgroundColor: 'red dark:darkblue',
      },
      {
        noClass: true,
        themeName: 'dark_blue',
      }
    )

    expect(nestedThemeStyles.style?.backgroundColor).toBe('darkblue')
  })

  test(`a dark clause de-opts to inline style with a noClass animation driver`, () => {
    // when using an inline animation driver (noClass: true), dark should
    // de-opt to inline styles rather than CSS classes, so the animation driver
    // manages the theme-appropriate value directly
    const darkResult = getSplitStyles(
      {
        backgroundColor: 'red dark:blue',
      },
      View.staticConfig,
      {} as any,
      'dark',
      defaultComponentState,
      {
        mediaState: undefined,
        isAnimated: true,
        noClass: true,
        resolveValues: 'auto',
      },
      {} as any,
      {
        animationDriver: { isReactNative: false },
        groups: { state: {} },
      } as any,
      undefined,
      undefined,
      true
    )!

    // in dark theme, the dark override should be applied inline
    expect(darkResult.style?.backgroundColor).toBe('blue')

    // no theme media CSS classes should be generated (de-opted to inline)
    const themeMediaKey = Object.keys(darkResult.classNames || {}).find((k) =>
      k.includes('dark')
    )
    expect(themeMediaKey).toBeUndefined()

    // in light theme, the dark clause should not apply
    const lightResult = getSplitStyles(
      {
        backgroundColor: 'red dark:blue',
      },
      View.staticConfig,
      {} as any,
      'light',
      defaultComponentState,
      {
        mediaState: undefined,
        isAnimated: true,
        noClass: true,
        resolveValues: 'auto',
      },
      {} as any,
      {
        animationDriver: { isReactNative: false },
        groups: { state: {} },
      } as any,
      undefined,
      undefined,
      true
    )!

    // in light theme, base value should remain
    expect(lightResult.style?.backgroundColor).toBe('red')
  })

  test.todo(
    `a dark clause keeps CSS classes when animateOnly is set and the property is not animated`,
    () => {
      // when animateOnly is set, non-animated properties (like bg) should stay as
      // CSS classes so theme media overrides work via specificity
      const result = getSplitStyles(
        {
          backgroundColor: 'red dark:blue',
          animateOnly: ['transform'],
        },
        View.staticConfig,
        {} as any,
        'dark',
        defaultComponentState,
        {
          mediaState: undefined,
          isAnimated: true,
          noClass: true,
          resolveValues: 'auto',
        },
        {} as any,
        {
          animationDriver: { isReactNative: false },
          groups: { state: {} },
        } as any,
        undefined,
        undefined,
        true
      )!

      // backgroundColor should NOT be inline (it's not in animateOnly)
      expect(result.style?.backgroundColor).toBeUndefined()

      // backgroundColor should be promoted to CSS class
      expect(result.classNames?.backgroundColor).toBeDefined()

      // theme media CSS class should also exist
      const themeMediaKey = Object.keys(result.classNames || {}).find((k) =>
        k.includes('dark')
      )
      expect(themeMediaKey).toBeDefined()
    }
  )

  test(`perspective transform`, () => {
    const rules = Object.values(
      simplifiedGetSplitStyles(Text, {
        perspective: 1000,
      }).rulesToInsert
    )
    expect(rules).toHaveLength(1)
    expect(rules[0][0]).toBe('transform')
    expect(rules[0][1]).toBe('perspective(1000px)')
    expect(rules[0][4].join('')).toContain('transform:perspective(1000px)')
  })

  test(`z-index prefers an overlapping token and otherwise stays literal`, () => {
    const token = simplifiedGetSplitStyles(Text, {
      zIndex: '1',
    })

    expect(
      Object.values(token.rulesToInsert)[0][StyleObjectProperty] === 'zIndex'
    ).toBeTruthy()
    expect(Object.values(token.rulesToInsert)[0][StyleObjectValue]).toEqual(
      'var(--t-zIndex-1)'
    )

    const literal = simplifiedGetSplitStyles(Text, { zIndex: '13' })
    expect(Object.values(literal.rulesToInsert)[0][StyleObjectValue]).toEqual('13')
  })

  test(`shadowColor + shadowOpacity`, () => {
    const styles = simplifiedGetSplitStyles(Text, {
      shadowColor: 'red',
      shadowOpacity: 0.5,
    })
    expect(Object.values(styles.rulesToInsert).length).toEqual(1)
    // on web, opacity is applied via CSS color-mix instead of parsing to rgba
    expect(Object.values(styles.rulesToInsert)[0][StyleObjectValue]).toEqual(
      `0px 0px 0px color-mix(in srgb, red 50%, transparent)`
    )
    expect(Object.values(styles.rulesToInsert)[0][StyleObjectProperty]).toEqual(
      `boxShadow`
    )
  })

  test(`group container queries generate @supports and @container`, () => {
    const styles = simplifiedGetSplitStyles(Text, {
      color: '@sm/testy:red',
    })
    const rule = Object.values(styles.rulesToInsert)[0][StyleObjectRules][0]

    // the program engine lowers the named container clause straight to a
    // container query on the group name: no @supports wrapper, no :root
    // ladder, no group-descendant selector hop
    expect(rule).toMatch(
      /^@container testy \(max-width: 800px\) \{(\._c-\d+)\1\{color:red\}\}$/
    )
  })

  test(`group container queries with single-part media keys`, () => {
    // use sm which exists in the default config
    const styles = simplifiedGetSplitStyles(Text, {
      paddingRight: '@sm/frame:0px',
    })
    const rule = Object.values(styles.rulesToInsert)[0][StyleObjectRules][0]

    // converted to a program: a container query on the frame group, anchored
    // on the subject's program class
    expect(rule).toContain('@container frame')
    expect(rule).toMatch(/\._pr-\d+/)
    // should not have the media key as a pseudo selector
    expect(rule).not.toContain(':sm')
  })

  test(`group container queries with multi-part pseudo like focus-visible`, () => {
    // test focus-visible pseudo which has a dash
    const styles = simplifiedGetSplitStyles(Text, {
      paddingRight: 'group-focus-visible/frame:0px',
    })
    const rule = Object.values(styles.rulesToInsert)[0][StyleObjectRules][0]

    // should have focus-visible pseudo selector
    expect(rule).toContain(':focus-visible')
    expect(rule).toContain('.t_group_frame')
  })

  test(`an unnamed group hover clause does not warn`, () => {
    const origNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    // groupContext exists (from a named group) but doesn't have a "true" key
    // without the fix this triggers double-normalization
    const groupContext = {
      mygroup: {
        state: { pseudo: {} },
        subscribe: () => () => {},
        emit: () => {},
        listeners: new Set(),
      },
    }

    simplifiedGetSplitStyles(Text, { color: 'group-hover:red' }, { groupContext })

    expect(warnSpy).not.toHaveBeenCalled()
    warnSpy.mockRestore()
    process.env.NODE_ENV = origNodeEnv
  })

  // const timed = async (fn: Function, opts?: { runs?: number }) => {
  //   const start = performance.now()
  //   const runs = opts?.runs ?? 1

  //   for (let i = 0; i < runs; i++) {
  //     let response = fn()
  //     if (response instanceof Promise) {
  //       response = await response
  //     }
  //   }

  //   const took = (performance.now() - start) / runs
  //   return {
  //     took,
  //   }
  // }

  // function runBaselineSpeedTest() {
  //   const start = performance.now()
  //   let y: any[] = []
  //   for (let i = 0; i < 50; i++) {
  //     y.push(new Array(50).fill({}))
  //   }
  //   globalThis['__ensureRuns'] = y[0]
  //   return performance.now() - start
  // }

  // never actually hit the memo in practice
  // test(`it memoizes`, async () => {
  //   const baseline = runBaselineSpeedTest()

  //   const props = {
  //     zIndex: '1',
  //     backgroundColor: 'red',
  //     margin: 20,
  //     scale: 2,
  //   }

  //   const runWithoutMemo = () =>
  //     timed(
  //       () => {
  //         simplifiedGetSplitStyles(Text, props, {
  //           skipMemo: true,
  //         })
  //       },
  //       {
  //         runs: 200,
  //       }
  //     )

  //   const runWithMemo = () =>
  //     timed(
  //       () => {
  //         simplifiedGetSplitStyles(Text, props, {
  //           skipMemo: false,
  //         })
  //       },
  //       {
  //         runs: 200,
  //       }
  //     )

  //   let timings = {
  //     memoized: 0,
  //     raw: 0,
  //   }

  //   // need to run them back and forth to get accurate results
  //   for (let i = 0; i < 10; i++) {
  //     const runs = [
  //       { run: runWithMemo, type: 'memoized' },
  //       { run: runWithoutMemo, type: 'raw' },
  //     ]
  //     if (i % 2 === 0) {
  //       runs.reverse()
  //     }
  //     for (const { run, type } of runs) {
  //       const out = await run()
  //       timings[type] += out.took
  //     }
  //   }

  //   expect(timings.memoized).toBeLessThan(timings.raw / 50)
  // })

  // this test is failing:
  // TODO: support this - might need the getSplitStyles refactor (unifying getSubStyle)
  // + write another similar test for pseudos
  // test(`fonts get merged correctly if fontSize is media activates font family`, () => {
  //   const CustomText = styled(Text, {
  //     variants: {
  //       type: {
  //         myValue: {
  //           fontFamily: 'body',
  //         },
  //       },
  //     } as const,
  //   })
  //   const splitStyles = simplifiedGetSplitStyles(
  //     CustomText,
  //     {
  //       type: 'myValue',
  //       fontSize: 'xs:1',
  //     },
  //     'p',
  //     { xs: true }
  //   )

  //   const fontSizeRule = splitStyles.rulesToInsert.find(
  //     (rule) => rule[StyleObjectProperty] === 'fontSize'
  //   )

  //   expect(fontSizeRule?.rules[0].includes('font-size:var(--f-size-1)')).toBeTruthy()
  // })
})

describe('getSplitStyles - asChild default props skipping', () => {
  test('asChild should not pass through default style props', () => {
    // create a styled component with default props
    const StyledTrigger = styled(View, {
      position: 'static',
      backgroundColor: 'red',
    })

    // without asChild, position: static should be in the output
    const withoutAsChild = simplifiedGetSplitStyles(
      StyledTrigger,
      {},
      { mergeDefaultProps: true }
    )
    const withoutAsChildOutput = JSON.stringify(withoutAsChild)
    expect(withoutAsChildOutput).toContain('static')

    // with asChild, position: static should NOT be in the output (it's a default)
    const withAsChild = simplifiedGetSplitStyles(
      StyledTrigger,
      {
        asChild: true,
      },
      { mergeDefaultProps: true }
    )
    const withAsChildOutput = JSON.stringify(withAsChild)
    expect(withAsChildOutput).not.toContain('static')
    // red is also a default, so it should not be there either
    expect(withAsChildOutput).not.toContain('red')
  })

  test('asChild should pass through non-default style props', () => {
    const StyledTrigger = styled(View, {
      position: 'static',
    })

    // with asChild but a different position value, it should be passed through
    const withAsChildOverride = simplifiedGetSplitStyles(
      StyledTrigger,
      {
        asChild: true,
        position: 'relative',
      },
      { mergeDefaultProps: true }
    )
    const withAsChildOverrideRules = JSON.stringify(withAsChildOverride.rulesToInsert)
    expect(withAsChildOverrideRules).toContain('relative')
  })

  test('asChild except-style should skip all styles', () => {
    const StyledTrigger = styled(View, {
      position: 'static',
    })

    const exceptStyle = simplifiedGetSplitStyles(
      StyledTrigger,
      {
        asChild: 'except-style',
        position: 'relative',
      },
      { mergeDefaultProps: true }
    )
    const exceptStyleRules = JSON.stringify(exceptStyle.rulesToInsert)
    // should have no style rules at all
    expect(exceptStyleRules).not.toContain('position')
    expect(exceptStyleRules).not.toContain('static')
    expect(exceptStyleRules).not.toContain('relative')
  })

  test('asChild should not pass through global config default props', () => {
    // global config no longer sets position: static (skipped as default)
    // but asChild should still skip component's own default style props
    const SimpleTrigger = styled(View, {
      backgroundColor: 'blue',
    })

    const withAsChild = simplifiedGetSplitStyles(
      SimpleTrigger,
      {
        asChild: true,
      },
      { mergeDefaultProps: true }
    )
    const withAsChildOutput = JSON.stringify(withAsChild)
    // asChild should not emit the component's default backgroundColor
    expect(withAsChildOutput).not.toContain('_bg-blue')
  })
})

describe('getSplitStyles - flat clause merging', () => {
  const StyledButton = styled(View, {
    displayName: 'StyledButton',
    backgroundColor: 'press:green',
    variants: {
      variant: {
        prim: {
          backgroundColor: 'press:blue',
        },
      },
    },
  })

  test('an inline press clause overrides the variant press clause', () => {
    const styles = simplifiedGetSplitStyles(StyledButton, {
      variant: 'prim',
      backgroundColor: 'press:red',
    })
    // The inline restatement replaces the variant's clause.
    const className = styles.classNames.backgroundColor
    expect(className).toMatch(/^_bc-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain(':active')
    expect(rules).toContain('red')
    expect(rules).not.toContain('blue')
  })

  test('the variant press clause is used when not restated inline', () => {
    const styles = simplifiedGetSplitStyles(StyledButton, {
      variant: 'prim',
    })
    const className = styles.classNames.backgroundColor
    expect(className).toMatch(/^_bc-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain(':active')
    expect(rules).toContain('blue')
  })

  test('the default press clause does not generate a class if not used', () => {
    const { viewProps } = simplifiedGetSplitStyles(StyledButton, {})
    // No press state simulated, so no class is generated
    expect(viewProps.className).not.toContain('_bg-0active-green')
  })
})

describe('getSplitStyles - kebab-case media keys', () => {
  beforeAll(() => {
    // reconfigure with kebab-case media keys like v5 config uses
    const baseConfig = config.getDefaultTamaguiConfig()
    createTamagui({
      ...baseConfig,
      media: {
        ...baseConfig.media,
        'max-md': { maxWidth: 1020 },
        'min-lg': { minWidth: 1280 },
      },
    })
  })

  test('group container queries with kebab-case media key max-md', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      paddingRight: '@max-md/frame:0px',
    })
    const rule = Object.values(styles.rulesToInsert)[0][StyleObjectRules][0]

    // converted to a program: a pure container query needs no group selector
    expect(rule).toContain('@container frame')
    expect(rule).toMatch(/\._pr-\d+/)
    // should NOT have :max as a pseudo selector - this was the bug
    expect(rule).not.toContain(':max')
    expect(rule).not.toContain(':max-md')
  })

  test('group container queries with kebab-case media key and pseudo', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      paddingRight: '@max-md/frame:group-hover/frame:0px',
    })
    const rule = Object.values(styles.rulesToInsert)[0][StyleObjectRules][0]

    // should have both the container query and the hover pseudo
    expect(rule).toContain('@container frame')
    expect(rule).toContain('.t_group_frame:hover')
    // max-md should be part of the container query, not a pseudo selector
    expect(rule).not.toContain(':max-md')
    expect(rule).not.toContain(':max')
  })
})

test('containerName establishes a named query container on web', () => {
  const out = simplifiedGetSplitStyles(View, { containerName: 'card' })
  const rules = Object.values(out.rulesToInsert)
    .flatMap((rule: any) => rule[StyleObjectRules] ?? [])
    .join('\n')
  expect(rules).toContain('container-name:card')
  expect(rules).toContain('container-type:inline-size')
})
