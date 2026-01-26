import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectValue } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

// helper to get style value from either style object or rulesToInsert
function getStyleValue(
  styles: ReturnType<typeof simplifiedGetSplitStyles>,
  prop: string
): string | undefined {
  if (styles.style?.[prop]) {
    return styles.style[prop] as string
  }
  if (styles.rulesToInsert) {
    const rule = Object.values(styles.rulesToInsert).find(
      (r: any) => r[0] === prop
    ) as any
    return rule?.[StyleObjectValue]
  }
  return undefined
}

describe('shorthand variables - web', () => {
  // boxShadow/filter/backgroundImage support embedded $tokens which resolve to CSS vars

  test('boxShadow with $variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px $white',
    })
    const value = getStyleValue(styles, 'boxShadow')

    // CSS var format is --c-white (c- prefix for color tokens)
    expect(value).toMatch(/^0 0 10px var\(--.*white.*\)$/)
  })

  test('boxShadow with multiple tokens resolves all to CSS vars', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px $white, 0 0 20px $black',
    })
    const value = getStyleValue(styles, 'boxShadow')

    expect(value).toMatch(/var\(--.*white/)
    expect(value).toMatch(/var\(--.*black/)
    expect(value?.match(/var\(--/g)?.length).toBe(2)
  })

  test('boxShadow without variables passed through unchanged', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px red',
    })
    const value = getStyleValue(styles, 'boxShadow')

    expect(value).toBe('0 0 10px red')
  })

  test('boxShadow with unresolvable $variable keeps token string', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px $nonexistent',
    })
    const value = getStyleValue(styles, 'boxShadow')

    expect(value).toBe('0 0 10px $nonexistent')
  })

  test('boxShadow with dotted token path resolves', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px $color.white',
    })
    const value = getStyleValue(styles, 'boxShadow')

    // dotted paths like $color.white resolve to the token value
    expect(value).toMatch(/var\(--.*white/)
  })

  // backgroundImage - supports linear-gradient with tokens
  test('backgroundImage with $variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(to bottom, $white, $black)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(
      /linear-gradient\(to bottom, var\(--.*white.*\), var\(--.*black.*\)\)/
    )
  })

  test('backgroundImage with angle and multiple color stops', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(45deg, $black 0%, $white 50%, $black 100%)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(/linear-gradient\(45deg/)
    expect(value?.match(/var\(--/g)?.length).toBe(3)
  })

  test('backgroundImage without variables passed through unchanged', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(to bottom, red, blue)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toBe('linear-gradient(to bottom, red, blue)')
  })

  test('backgroundImage with unresolvable $variable keeps token string', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient($nonexistent, $white)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(/linear-gradient\(\$nonexistent, var\(--.*white/)
  })
})
