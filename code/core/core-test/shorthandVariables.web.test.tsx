import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { View, createTamagui, StyleObjectValue, StyleObjectRules } from '../web/src'
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

describe('border shorthand - web', () => {
  // border shorthand passed through as CSS string on web

  test('border with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid red',
    })
    const value = getStyleValue(styles, 'border')

    expect(value).toBe('1px solid red')
  })

  test('border with $variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '2px dashed $white',
    })
    const value = getStyleValue(styles, 'border')

    expect(value).toMatch(/2px dashed var\(--.*white.*\)/)
  })

  test('border without variables passed through unchanged', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid blue',
    })
    const value = getStyleValue(styles, 'border')

    expect(value).toBe('1px solid blue')
  })

  test('border "none" passed through', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'none',
    })
    const value = getStyleValue(styles, 'border')

    expect(value).toBe('none')
  })
})

describe('outline shorthand - web', () => {
  // outline shorthand passed through as CSS string on web

  test('outline with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid red',
    })
    const value = getStyleValue(styles, 'outline')

    expect(value).toBe('2px solid red')
  })

  test('outline with $variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid $white',
    })
    const value = getStyleValue(styles, 'outline')

    expect(value).toMatch(/2px solid var\(--.*white.*\)/)
  })

  test('outline "none" passed through', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: 'none',
    })
    const value = getStyleValue(styles, 'outline')

    expect(value).toBe('none')
  })
})

describe('border shorthand with media queries - web', () => {
  test('border in $sm generates className with media key', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $sm: { border: '2px solid green' },
    })

    // on web, $sm should generate a className with media key
    expect(styles.hasMedia).toBe(true)
    expect(styles.classNames?.['border-sm']).toBeDefined()
    // classname contains _sm_ marker
    expect(styles.classNames?.['border-sm']).toContain('_sm_')
  })

  test('border in $sm with token generates className', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $sm: { border: '1px dashed $white' },
    })

    expect(styles.hasMedia).toBe(true)
    expect(styles.classNames?.['border-sm']).toBeDefined()
  })
})
