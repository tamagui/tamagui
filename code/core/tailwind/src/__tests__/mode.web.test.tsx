import { beforeAll, describe, expect, test } from 'vitest'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { StyleObjectValue, createTamagui } from '@tamagui/web'
import { StyleObjectRules } from '@tamagui/helpers'
import { Text, View } from '../index'
import { findRule, splitTailwindStyles } from './utils'

beforeAll(() => {
  createTamagui(getDefaultTamaguiConfig())
})

describe('tailwind package - basic className', () => {
  test('className="bg-[red]" sets a raw backgroundColor', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[red]',
    } as any)

    const className = styles.classNames.background
    expect(className).toMatch(/^_b-/)
    expect(
      (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    ).toContain('background-color:red')
  })

  test('bracketed width and height preserve raw pixels', () => {
    const styles = splitTailwindStyles(View, {
      className: 'w-[400px] h-[200px]',
    } as any)

    const wRule = findRule(styles.rulesToInsert, 'width')
    expect(wRule).toBeTruthy()
    expect(wRule[StyleObjectValue]).toBe('400px')

    const hRule = findRule(styles.rulesToInsert, 'height')
    expect(hRule).toBeTruthy()
    expect(hRule[StyleObjectValue]).toBe('200px')
  })

  test('className="opacity-50" sets opacity to 0.5', () => {
    const styles = splitTailwindStyles(View, {
      className: 'opacity-50',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0.5)
  })

  test('bracketed padding and margin preserve raw pixels', () => {
    const styles = splitTailwindStyles(View, {
      className: 'p-[40px] m-[20px]',
    } as any)

    const ptRule = findRule(styles.rulesToInsert, 'paddingTop')
    expect(ptRule).toBeTruthy()
    expect(ptRule[StyleObjectValue]).toBe('40px')

    const mtRule = findRule(styles.rulesToInsert, 'marginTop')
    expect(mtRule).toBeTruthy()
    expect(mtRule[StyleObjectValue]).toBe('20px')
  })
})

describe('tailwind package - modifiers', () => {
  test('className="hover:bg-[blue]" generates a raw hover color', () => {
    const styles = splitTailwindStyles(View, {
      className: 'hover:bg-[blue]',
    } as any)

    // the hover clause becomes a backgroundColor program block
    const className = styles.classNames.background
    expect(className).toMatch(/^_b-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain(':hover')
    expect(rules).toContain('background-color:blue')
  })

  test('className="sm:p-[80px]" preserves a raw media-query value', () => {
    const styles = splitTailwindStyles(View, {
      className: 'sm:p-[80px]',
    } as any)

    const className = styles.classNames.padding
    expect(className).toMatch(/^_p-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain('@media')
    expect(rules).toContain('80px')
  })

  test('className="sm:hover:bg-purple" generates combined modifier class', () => {
    const styles = splitTailwindStyles(View, {
      className: 'sm:hover:bg-[purple]',
    } as any)

    // combined modifiers nest the media query around the hover selector in
    // one program block
    const className = styles.classNames.background
    expect(className).toMatch(/^_b-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain('@media')
    expect(rules).toContain(':hover')
    expect(rules).toContain('purple')
  })
})

describe('tailwind package - token values', () => {
  test('className="bg-white" auto-resolves to CSS variable (token match)', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-white',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('className="hover:bg-black" auto-resolves token in hover', () => {
    const styles = splitTailwindStyles(View, {
      className: 'hover:bg-black',
    } as any)

    // black is a token - the hover clause resolves to a CSS variable inside
    // the program block
    const className = styles.classNames.background
    expect(className).toMatch(/^_b-/)
    const rules = (styles.rulesToInsert[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain(':hover')
    expect(rules).toContain('var(--')
  })

  test('className="bg-[purple]" uses a raw value', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[purple]',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('purple')
  })
})

describe('tailwind package - class preservation', () => {
  test('regular classes are preserved, tailwind classes become styles', () => {
    const styles = splitTailwindStyles(View, {
      className: 'my-custom-class bg-[red] another-class',
    } as any)

    // unknown classes flip the cascade-preserving switch: candidates evaluate
    // to inline style so author CSS classes keep their cascade position
    expect(styles.style?.backgroundColor).toBe('red')

    // regular classes preserved in viewProps.className
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('my-custom-class')
    expect(finalClassName).toContain('another-class')
    // the raw Tamagui candidate should be consumed, not passed through
    const classes = finalClassName.split(/\s+/)
    expect(classes).not.toContain('bg-[red]')
  })

  test('text-center is claimed as the exact textAlign enum', () => {
    const styles = splitTailwindStyles(Text, {
      className: 'text-center bg-[red]',
    } as any)

    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')

    // text-center should not set color, and should set textAlign.
    const colorRule = findRule(styles.rulesToInsert, 'color')
    expect(colorRule).toBeNull()
    expect(findRule(styles.rulesToInsert, 'textAlign')?.[StyleObjectValue]).toBe('center')
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).not.toContain('text-center')
  })

  test('unknown prop-value classes are preserved', () => {
    const styles = splitTailwindStyles(View, {
      className: 'foo-bar baz-qux bg-[blue]',
    } as any)

    // unknown classes present: candidate evaluates to inline style
    expect(styles.style?.backgroundColor).toBe('blue')

    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('foo-bar')
    expect(finalClassName).toContain('baz-qux')
  })

  test('dark: modifier with unknown prop is preserved', () => {
    const styles = splitTailwindStyles(View, {
      className: 'dark:my-theme bg-[red]',
    } as any)

    // unknown class present: candidate evaluates to inline style
    expect(styles.style?.backgroundColor).toBe('red')

    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('dark:my-theme')
  })
})

describe('tailwind package - edge cases', () => {
  test('className with only spaces produces no rules', () => {
    const styles = splitTailwindStyles(View, {
      className: '   ',
    } as any)

    const rules = Object.values(styles.rulesToInsert || {})
    expect(rules).toHaveLength(0)
  })

  test('empty className="" does not crash', () => {
    const styles = splitTailwindStyles(View, {
      className: '',
    } as any)

    expect(styles).toBeDefined()
  })

  test('malformed class "bg-" with no value does not crash', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-',
    } as any)

    expect(styles).toBeDefined()
    // should be treated as unknown class and preserved
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('bg-')
  })

  test('className + backgroundColor prop - className overrides', () => {
    const styles = splitTailwindStyles(View, {
      backgroundColor: 'red',
      className: 'bg-[blue]',
    } as any)

    // tailwind className should produce a rule for backgroundColor
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
  })

  test('duplicate classes - last wins', () => {
    const styles = splitTailwindStyles(View, {
      className: 'bg-[red] bg-[blue]',
    } as any)

    // should produce a backgroundColor rule (last class value wins)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('blue')
  })
})
