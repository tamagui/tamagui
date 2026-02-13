import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectProperty, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  const defaultConfig = config.getDefaultTamaguiConfig()
  createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      styleMode: 'tailwind', // enable tailwind mode for these tests
    },
  })
})

// helper to find a rule by property name in rulesToInsert
function findRule(rulesToInsert: any, prop: string) {
  for (const rule of Object.values(rulesToInsert || {})) {
    if ((rule as any)[StyleObjectProperty] === prop) {
      return rule as any
    }
  }
  return null
}

describe('tailwind mode - basic className', () => {
  test('className="bg-red" sets backgroundColor', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red',
    } as any)

    // on web, styles go to classNames (atomic CSS), values in rulesToInsert
    expect(styles.classNames.backgroundColor).toMatch(/_bg-/)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('className="w-100 h-50" sets width and height', () => {
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

  test('className="p-10 m-5" sets padding and margin', () => {
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
  test('className="hover:bg-blue" sets hover background', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:bg-blue',
    } as any)

    // hover goes to classNames as atomic CSS
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeDefined()
    expect(typeof hoverKey).toBe('string')
    const hoverClassName = styles.classNames[hoverKey!]
    expect(hoverClassName).toMatch(/0hover/)
    expect(hoverClassName).toMatch(/_bg-/)
  })

  test('className="sm:p-20" sets media query padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:p-20',
    } as any)

    // media queries go to classNames
    const smKey = Object.keys(styles.classNames).find((k) => k.includes('sm'))
    expect(smKey).toBeDefined()
    expect(typeof smKey).toBe('string')
    const smClassName = styles.classNames[smKey!]
    expect(smClassName).toMatch(/_sm/)
    // should contain padding-related class
    expect(smClassName).toMatch(/_p/)
  })

  test('className="sm:hover:bg-purple" sets combined modifier', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:hover:bg-purple',
    } as any)

    // verify both sm media and hover pseudo are present
    const smHoverKey = Object.keys(styles.classNames).find(
      (k) => k.includes('sm') && k.includes('hover')
    )
    expect(smHoverKey).toBeDefined()
    expect(typeof smHoverKey).toBe('string')
    const className = styles.classNames[smHoverKey!]
    expect(className).toMatch(/_sm/)
    expect(className).toMatch(/hover/)
    expect(className).toMatch(/_bg-/)
  })
})

describe('tailwind mode - token values', () => {
  test('className="bg-$white" uses token value (explicit $)', () => {
    // explicit $ prefix always works
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-$white',
    } as any)

    // token values resolve to CSS variables in rulesToInsert
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('className="bg-white" auto-resolves to token (no $ needed)', () => {
    // without $ prefix, should still resolve if token exists
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-white',
    } as any)

    // should resolve to CSS variable since $white is a token
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('className="hover:bg-black" uses token in hover (no $ needed)', () => {
    // use black since that's in the default config tokens
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:bg-black',
    } as any)

    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
  })

  test('className="bg-notAToken" uses raw value', () => {
    // if value doesn't match a token, use it as raw CSS
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-purple',
    } as any)

    // should be raw CSS value, not a variable
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('purple')
  })
})

describe('tailwind mode - class preservation', () => {
  test('regular classes are preserved in className', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'my-custom-class bg-red another-class',
    } as any)

    // tailwind class should be processed into rulesToInsert
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')

    // regular classes should be preserved (not transformed or dropped)
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('my-custom-class')
    expect(finalClassName).toContain('another-class')
  })

  test('text-center is preserved (not misinterpreted as color)', () => {
    // "text-center" should NOT become color: center
    const styles = simplifiedGetSplitStyles(View, {
      className: 'text-center bg-red',
    } as any)

    // bg-red should be processed
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()

    // text-center should NOT set color
    expect(styles.classNames.color).toBeUndefined()

    // text-center should be preserved in className
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('text-center')
  })

  test('unknown prop-value classes are preserved', () => {
    // "foo-bar" is not a known tailwind pattern, should be preserved
    const styles = simplifiedGetSplitStyles(View, {
      className: 'foo-bar baz-qux bg-blue',
    } as any)

    // bg-blue should be processed
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()

    // unknown classes should be preserved
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('foo-bar')
    expect(finalClassName).toContain('baz-qux')
  })

  test('dark: modifier classes without valid prop are preserved', () => {
    // "dark:my-theme" is not a valid tailwind class, should be preserved
    const styles = simplifiedGetSplitStyles(View, {
      className: 'dark:my-theme bg-red',
    } as any)

    // bg-red should be processed
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()

    // dark:my-theme should be preserved (not processed as dark mode style)
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('dark:my-theme')
  })
})

describe('tailwind mode - disabled', () => {
  test('className is not processed when tailwind mode disabled', () => {
    // create new config without tailwind mode
    const defaultConfig = config.getDefaultTamaguiConfig()
    createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        styleMode: 'flat', // not tailwind, just flat
      },
    })

    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red hover:bg-blue',
    } as any)

    // className should not be processed into style when tailwind disabled
    // bg-red should NOT become backgroundColor: 'red'
    expect(styles.style?.backgroundColor).toBeUndefined()
  })
})
