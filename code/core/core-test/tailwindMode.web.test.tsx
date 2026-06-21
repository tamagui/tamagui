import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectProperty, StyleObjectValue } from '../web/src'
import { StyleObjectPseudo, StyleObjectIdentifier } from '@tamagui/helpers'
import { simplifiedGetSplitStyles, findRule, findAnyRule } from './utils'

beforeAll(() => {
  const defaultConfig = config.getDefaultTamaguiConfig()
  createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      styleMode: 'tailwind',
    },
  })
})

describe('tailwind mode - basic className', () => {
  test('className="bg-red" sets backgroundColor to "red"', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red',
    } as any)

    expect(styles.classNames.backgroundColor).toMatch(/_bg-/)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('className="w-100 h-50" sets width and height via tailwind scale (n*4px)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'w-100 h-50',
    } as any)

    // tailwind spacing/sizing scale: w-N → N * 0.25rem = N*4px
    const wRule = findRule(styles.rulesToInsert, 'width')
    expect(wRule).toBeTruthy()
    expect(wRule[StyleObjectValue]).toBe('400px')

    const hRule = findRule(styles.rulesToInsert, 'height')
    expect(hRule).toBeTruthy()
    expect(hRule[StyleObjectValue]).toBe('200px')
  })

  test('className="opacity-50" sets opacity to 0.5', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'opacity-50',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0.5)
  })

  test('className="p-10 m-5" sets padding and margin via tailwind scale (n*4px)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'p-10 m-5',
    } as any)

    // tailwind spacing scale: p-N → N * 0.25rem = N*4px
    const ptRule = findRule(styles.rulesToInsert, 'paddingTop')
    expect(ptRule).toBeTruthy()
    expect(ptRule[StyleObjectValue]).toBe('40px')

    const mtRule = findRule(styles.rulesToInsert, 'marginTop')
    expect(mtRule).toBeTruthy()
    expect(mtRule[StyleObjectValue]).toBe('20px')
  })
})

describe('tailwind mode - modifiers', () => {
  test('className="hover:bg-blue" generates hover atomic class with value "blue"', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:bg-blue',
    } as any)

    // verify the actual rule: backgroundColor=blue with hover pseudo
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('blue')
  })

  test('className="sm:p-20" generates media query class with tailwind-scaled value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:p-20',
    } as any)

    // media rules encode value in identifier; tailwind scale: 20 * 4 = 80px
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const smPadRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'paddingTop' &&
        r[StyleObjectIdentifier]?.includes('_sm')
    )
    expect(smPadRule).toBeTruthy()
    expect(smPadRule[StyleObjectIdentifier]).toContain('80px')
  })

  test('className="sm:hover:bg-purple" generates combined modifier class', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:hover:bg-purple',
    } as any)

    // combined modifier rules encode value/media/pseudo in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const combinedRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' &&
        r[StyleObjectIdentifier]?.includes('_sm') &&
        r[StyleObjectIdentifier]?.includes('hover')
    )
    expect(combinedRule).toBeTruthy()
    expect(combinedRule[StyleObjectIdentifier]).toContain('purple')
  })
})

describe('tailwind mode - token values', () => {
  test('className="bg-$white" is rejected ($ prefix invalid in class mode)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-$white',
    } as any)

    // $ prefix in class values is invalid — should be preserved as regular class
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeNull()
  })

  test('className="bg-white" auto-resolves to CSS variable (token match)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-white',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('className="hover:bg-black" auto-resolves token in hover', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:bg-black',
    } as any)

    // black is a token - verify rule resolves to CSS variable with hover pseudo
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toContain('var(--')
  })

  test('className="bg-purple" uses raw value (not a token)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-purple',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('purple')
  })
})

describe('tailwind mode - class preservation', () => {
  test('regular classes are preserved, tailwind classes become styles', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'my-custom-class bg-red another-class',
    } as any)

    // tailwind class should produce a rule
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')

    // regular classes preserved in viewProps.className
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('my-custom-class')
    expect(finalClassName).toContain('another-class')
    // the raw tailwind class 'bg-red' should be consumed, not passed through
    // (atomic class '_bg-red' may exist, so check for standalone 'bg-red')
    const classes = finalClassName.split(/\s+/)
    expect(classes).not.toContain('bg-red')
  })

  test('text-center is preserved (not misinterpreted as color)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'text-center bg-red',
    } as any)

    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')

    // text-center should NOT set color
    const colorRule = findAnyRule(styles.rulesToInsert, 'color')
    expect(colorRule).toBeNull()

    // text-center should be preserved
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('text-center')
  })

  test('unknown prop-value classes are preserved', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'foo-bar baz-qux bg-blue',
    } as any)

    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('blue')

    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('foo-bar')
    expect(finalClassName).toContain('baz-qux')
  })

  test('dark: modifier with unknown prop is preserved', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'dark:my-theme bg-red',
    } as any)

    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')

    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('dark:my-theme')
  })
})

describe('tailwind mode - disabled', () => {
  test('className is not processed when tailwind mode is off', () => {
    const defaultConfig = config.getDefaultTamaguiConfig()
    createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        styleMode: 'tamagui',
      },
    })

    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red hover:bg-blue',
    } as any)

    // no backgroundColor className or rule should be generated
    expect(styles.classNames.backgroundColor).toBeUndefined()
    const bgRule = findAnyRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeNull()

    // no hover classNames should exist
    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys).toHaveLength(0)
  })

  // restore config
  test('restore tailwind config', () => {
    const defaultConfig = config.getDefaultTamaguiConfig()
    createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        styleMode: 'tailwind',
      },
    })
  })
})

// helper for $platform-web rules — values land in the rule's CSS string (rules[0]) since
// the platform-media-style flow puts the value in the rule body, not in StyleObjectValue.
// returns the rule whose property matches AND whose rule CSS contains `prop:value` (the
// CSS body uses kebab-case so we convert before substring-matching).
function findPlatformWebRule(rulesToInsert: any, prop: string, cssValue: string) {
  const cssProp = prop.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)
  for (const rule of Object.values(rulesToInsert || {})) {
    const r = rule as any
    if (r[StyleObjectProperty] !== prop) continue
    const rules: string[] = r[4] || []
    if (rules.some((s) => s.includes(`${cssProp}:${cssValue}`))) return r
  }
  return null
}

describe('tailwind mode - web-only utilities ($platform-web routing)', () => {
  test('className="float-left" routes to $platform-web float:left', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-left',
    } as any)
    expect(findPlatformWebRule(styles.rulesToInsert, 'float', 'left')).toBeTruthy()
  })

  test('className="isolate" routes to $platform-web isolation:isolate', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'isolate',
    } as any)
    expect(findPlatformWebRule(styles.rulesToInsert, 'isolation', 'isolate')).toBeTruthy()
  })

  test('className="scroll-smooth snap-x" merges into one $platform-web payload', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'scroll-smooth snap-x',
    } as any)
    expect(
      findPlatformWebRule(styles.rulesToInsert, 'scrollBehavior', 'smooth')
    ).toBeTruthy()
    expect(findPlatformWebRule(styles.rulesToInsert, 'scrollSnapType', 'x')).toBeTruthy()
  })

  test('className="columns-2" routes parametric to $platform-web columns:2', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'columns-2',
    } as any)
    // columns:2 (numeric) — rule body should contain "columns:2"
    expect(findPlatformWebRule(styles.rulesToInsert, 'columns', '2')).toBeTruthy()
  })

  test('className="scroll-mt-4" routes to scrollMarginTop with tailwind scale (16)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'scroll-mt-4',
    } as any)
    expect(
      findPlatformWebRule(styles.rulesToInsert, 'scrollMarginTop', '16px')
    ).toBeTruthy()
  })

  test('className="indent-4" routes to textIndent with tailwind scale (16)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'indent-4',
    } as any)
    expect(findPlatformWebRule(styles.rulesToInsert, 'textIndent', '16px')).toBeTruthy()
  })

  test('className="appearance-none resize-y" produces both rules', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'appearance-none resize-y',
    } as any)
    expect(findPlatformWebRule(styles.rulesToInsert, 'appearance', 'none')).toBeTruthy()
    expect(findPlatformWebRule(styles.rulesToInsert, 'resize', 'vertical')).toBeTruthy()
  })

  test('className="mix-blend-multiply" routes to mixBlendMode:multiply', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'mix-blend-multiply',
    } as any)
    expect(
      findPlatformWebRule(styles.rulesToInsert, 'mixBlendMode', 'multiply')
    ).toBeTruthy()
  })

  test('className="place-content-center" routes to placeContent:center', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'place-content-center',
    } as any)
    expect(
      findPlatformWebRule(styles.rulesToInsert, 'placeContent', 'center')
    ).toBeTruthy()
  })

  test('className="contain-layout" routes to contain:layout', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'contain-layout',
    } as any)
    expect(findPlatformWebRule(styles.rulesToInsert, 'contain', 'layout')).toBeTruthy()
  })

  test('className="hover:isolate" with pseudo modifier falls through to className', () => {
    // pseudo + web-only-CSS isn't routed: the named pseudo style props don't dispatch
    // nested $platform-web, and inlining raw web-only CSS into hoverStyle would leak
    // onto native. the class is preserved on className for user-supplied tailwind CSS.
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:isolate',
    } as any)
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('hover:isolate')
  })

  test('unmapped web class like "float-bogus" stays in className', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-bogus',
    } as any)

    // not in static map; "float" isn't a tamagui style prop so falls through to regular classes
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('float-bogus')
  })
})

describe('tailwind mode - edge cases', () => {
  test('className with only spaces produces no rules', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: '   ',
    } as any)

    const rules = Object.values(styles.rulesToInsert || {})
    expect(rules).toHaveLength(0)
  })

  test('empty className="" does not crash', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: '',
    } as any)

    expect(styles).toBeDefined()
  })

  test('malformed class "bg-" with no value does not crash', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-',
    } as any)

    expect(styles).toBeDefined()
    // should be treated as unknown class and preserved
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('bg-')
  })

  test('className + backgroundColor prop - className overrides', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'red',
      className: 'bg-blue',
    } as any)

    // tailwind className should produce a rule for backgroundColor
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
  })

  test('duplicate classes - last wins', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red bg-blue',
    } as any)

    // should produce a backgroundColor rule (last class value wins)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('blue')
  })
})
