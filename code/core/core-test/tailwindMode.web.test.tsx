import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui } from '../web/src'
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

describe('tailwind mode - basic className', () => {
  test('className="bg-red" sets backgroundColor', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-red',
    } as any)

    expect(styles.style?.backgroundColor).toBe('red')
  })

  test('className="w-100 h-50" sets width and height', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'w-100 h-50',
    } as any)

    expect(styles.style?.width).toBe('100px')
    expect(styles.style?.height).toBe('50px')
  })

  test('className="opacity-50" sets opacity to 0.5', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'opacity-50',
    } as any)

    expect(styles.style?.opacity).toBe(0.5)
  })

  test('className="p-10 m-5" sets padding and margin', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'p-10 m-5',
    } as any)

    expect(styles.style?.paddingTop).toBe('10px')
    expect(styles.style?.marginTop).toBe('5px')
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

    // token values resolve to CSS variables
    expect(styles.style?.backgroundColor).toContain('var(--')
  })

  test('className="bg-white" auto-resolves to token (no $ needed)', () => {
    // without $ prefix, should still resolve if token exists
    const styles = simplifiedGetSplitStyles(View, {
      className: 'bg-white',
    } as any)

    // should resolve to CSS variable since $white is a token
    expect(styles.style?.backgroundColor).toContain('var(--')
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
    expect(styles.style?.backgroundColor).toBe('purple')
  })
})

describe('tailwind mode - mixed with regular classes', () => {
  test('processes tailwind classes and preserves regular', () => {
    const styles = simplifiedGetSplitStyles(View, {
      className: 'my-custom-class bg-red another-class',
    } as any)

    // tailwind class should be processed into style
    expect(styles.style?.backgroundColor).toBe('red')
    // note: viewProps.className is only built when TAMAGUI_TARGET=web
    // in unit tests we verify the style processing works
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
