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

  test('className="w-100 h-50" sets width=100px and height=50px', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'w-100 h-50',
    } as any)

    const wRule = findRule(styles.rulesToInsert, 'width')
    expect(wRule).toBeTruthy()
    expect(wRule[StyleObjectValue]).toBe('100px')

    const hRule = findRule(styles.rulesToInsert, 'height')
    expect(hRule).toBeTruthy()
    expect(hRule[StyleObjectValue]).toBe('50px')
  })

  test('className="opacity-50" sets opacity to 0.5', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'opacity-50',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0.5)
  })

  test('className="p-10 m-5" sets padding=10px and margin=5px', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'p-10 m-5',
    } as any)

    const ptRule = findRule(styles.rulesToInsert, 'paddingTop')
    expect(ptRule).toBeTruthy()
    expect(ptRule[StyleObjectValue]).toBe('10px')

    const mtRule = findRule(styles.rulesToInsert, 'marginTop')
    expect(mtRule).toBeTruthy()
    expect(mtRule[StyleObjectValue]).toBe('5px')
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

  test('className="sm:p-20" generates media query class with 20px', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:p-20',
    } as any)

    // media rules encode value in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const smPadRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'paddingTop' &&
        r[StyleObjectIdentifier]?.includes('_sm')
    )
    expect(smPadRule).toBeTruthy()
    expect(smPadRule[StyleObjectIdentifier]).toContain('20px')
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

// web-only tailwind utilities — CSS props RN can't render. They route through
// $platform-web so they work on web and silently no-op on native (instead of
// producing an invalid Tamagui prop that fails type checking or gets dropped).
//
// Important: platform-media rules embed both value AND the actual generated CSS
// in the rule entry's identifier + cssRule array (rule[4]). The
// rule[StyleObjectValue] slot (index 1) is undefined for these — we match on
// the rule's property and search the cssRule string for the expected output.
describe('tailwind mode - web-only utilities', () => {
  function findWebOnlyRule(rulesToInsert: any, property: string) {
    const rules = Object.values(rulesToInsert || {}) as any[]
    return rules.find((r) => r[StyleObjectProperty] === property) || null
  }
  function ruleCss(rule: any): string {
    // entry shape: [prop, value, identifier, pseudo, [cssText]]
    const css = rule?.[4]
    if (!css) return ''
    return Array.isArray(css) ? css.join(' ') : String(css)
  }

  test('float-left → $platform-web float:left', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-left',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'float')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('float:left')
    // not preserved as raw className
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName.split(/\s+/)).not.toContain('float-left')
  })

  test('clear-both → $platform-web clear:both', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'clear-both',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'clear')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('clear:both')
  })

  test('isolate → $platform-web isolation:isolate', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'isolate',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'isolation')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('isolation:isolate')
  })

  test('scroll-smooth → $platform-web scrollBehavior:smooth', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'scroll-smooth',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'scrollBehavior')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/scroll-behavior:\s*smooth/)
  })

  test('snap-start → $platform-web scrollSnapAlign:start', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'snap-start',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'scrollSnapAlign')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/scroll-snap-align:\s*start/)
  })

  test('resize-y → $platform-web resize:vertical', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'resize-y',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'resize')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('resize:vertical')
  })

  test('appearance-none → $platform-web appearance:none', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'appearance-none',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'appearance')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('appearance:none')
  })

  test('mix-blend-multiply → $platform-web mixBlendMode:multiply', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'mix-blend-multiply',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'mixBlendMode')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/mix-blend-mode:\s*multiply/)
  })

  test('contain-layout → $platform-web contain:layout', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'contain-layout',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'contain')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('contain:layout')
  })

  test('place-content-center → $platform-web placeContent:center', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'place-content-center',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'placeContent')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/place-content:\s*center/)
  })

  test('columns-2 → $platform-web columns:2', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'columns-2',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'columns')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/columns:\s*2/)
  })

  test('columns-sm → $platform-web columns:24rem (named width)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'columns-sm',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'columns')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('24rem')
  })

  test('backdrop-blur-md → $platform-web backdropFilter:blur(12px)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'backdrop-blur-md',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'backdropFilter')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toContain('blur(12px)')
  })

  test('touch-none → $platform-web touchAction:none', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'touch-none',
    } as any)
    const rule = findWebOnlyRule(styles.rulesToInsert, 'touchAction')
    expect(rule).toBeTruthy()
    expect(ruleCss(rule)).toMatch(/touch-action:\s*none/)
  })

  test('multiple web-only utilities all land', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-left clear-both isolate scroll-smooth',
    } as any)
    expect(findWebOnlyRule(styles.rulesToInsert, 'float')).toBeTruthy()
    expect(findWebOnlyRule(styles.rulesToInsert, 'clear')).toBeTruthy()
    expect(findWebOnlyRule(styles.rulesToInsert, 'isolation')).toBeTruthy()
    expect(findWebOnlyRule(styles.rulesToInsert, 'scrollBehavior')).toBeTruthy()
  })

  test('web-only and normal classes mix correctly', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-left bg-red p-4',
    } as any)
    expect(findWebOnlyRule(styles.rulesToInsert, 'float')).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'backgroundColor')).toBeTruthy()
    expect(findRule(styles.rulesToInsert, 'paddingTop')).toBeTruthy()
  })

  test('user-provided $platform-web is preserved when class adds to it', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'float-left',
      '$platform-web': { cursor: 'pointer' },
    } as any)
    // both should be present (merged)
    expect(findWebOnlyRule(styles.rulesToInsert, 'float')).toBeTruthy()
    expect(findWebOnlyRule(styles.rulesToInsert, 'cursor')).toBeTruthy()
  })

  test('non-prefix class is preserved (not over-eager)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'snap-foobar-baz',
    } as any)
    // not a recognized snap-* base — should not produce a scrollSnapAlign
    // rule from the web-only path; preserved as raw className.
    const rule = findWebOnlyRule(styles.rulesToInsert, 'scrollSnapAlign')
    expect(rule).toBeNull()
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('snap-foobar-baz')
  })
})
