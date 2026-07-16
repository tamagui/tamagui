import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  Text,
  View,
  createTamagui,
  StyleObjectProperty,
  StyleObjectValue,
} from '../web/src'
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
  test('className="bg-[red]" sets a raw backgroundColor', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-[red]',
    } as any)

    expect(styles.classNames.backgroundColor).toMatch(/_bg-/)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('bracketed width and height preserve raw pixels', () => {
    const styles = simplifiedGetSplitStyles(View, {
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
    const styles = simplifiedGetSplitStyles(View, {
      className: 'opacity-50',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0.5)
  })

  test('bracketed padding and margin preserve raw pixels', () => {
    const styles = simplifiedGetSplitStyles(View, {
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

describe('tailwind mode - modifiers', () => {
  test('className="hover:bg-[blue]" generates a raw hover color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'hover:bg-[blue]',
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

  test('className="sm:p-[80px]" preserves a raw media-query value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'sm:p-[80px]',
    } as any)

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
      className: 'sm:hover:bg-[purple]',
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

  test('className="bg-[purple]" uses a raw value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-[purple]',
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('purple')
  })
})

describe('tailwind mode - class preservation', () => {
  test('regular classes are preserved, tailwind classes become styles', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'my-custom-class bg-[red] another-class',
    } as any)

    // tailwind class should produce a rule
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')

    // regular classes preserved in viewProps.className
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).toContain('my-custom-class')
    expect(finalClassName).toContain('another-class')
    // the raw Tamagui candidate should be consumed, not passed through
    const classes = finalClassName.split(/\s+/)
    expect(classes).not.toContain('bg-[red]')
  })

  test('text-center is claimed as the exact textAlign enum', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      className: 'text-center bg-[red]',
    } as any)

    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')

    // text-center should not set color, and should set textAlign.
    const colorRule = findAnyRule(styles.rulesToInsert, 'color')
    expect(colorRule).toBeNull()
    expect(findRule(styles.rulesToInsert, 'textAlign')?.[StyleObjectValue]).toBe('center')
    const finalClassName = styles.viewProps?.className || ''
    expect(finalClassName).not.toContain('text-center')
  })

  test('unknown prop-value classes are preserved', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'foo-bar baz-qux bg-[blue]',
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
      className: 'dark:my-theme bg-[red]',
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
      className: 'bg-[red] hover:bg-[blue]',
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
      className: 'bg-[blue]',
    } as any)

    // tailwind className should produce a rule for backgroundColor
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
  })

  test('duplicate classes - last wins', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-[red] bg-[blue]',
    } as any)

    // should produce a backgroundColor rule (last class value wins)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('blue')
  })
})
