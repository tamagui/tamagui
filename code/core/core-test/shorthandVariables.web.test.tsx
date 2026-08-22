import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  Text,
  View,
  createTamagui,
  styled,
  StyleObjectValue,
  StyleObjectRules,
} from '../web/src'
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
  // boxShadow/filter/backgroundImage support embedded tokens which resolve to CSS vars

  test('boxShadow with variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px white',
    })
    const value = getStyleValue(styles, 'boxShadow')

    // CSS var format is --c-white (c- prefix for color tokens)
    expect(value).toMatch(/^0 0 10px var\(--.*white.*\)$/)
  })

  test('boxShadow with multiple tokens resolves all to CSS vars', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px white, 0 0 20px black',
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

  test('boxShadow with unresolvable variable keeps token string', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px nonexistent',
    })
    const value = getStyleValue(styles, 'boxShadow')

    expect(value).toBe('0 0 10px nonexistent')
  })

  test('boxShadow with dotted token path resolves', () => {
    const styles = simplifiedGetSplitStyles(View, {
      boxShadow: '0 0 10px color.white',
    })
    const value = getStyleValue(styles, 'boxShadow')

    // dotted paths like color.white resolve to the token value
    expect(value).toMatch(/var\(--.*white/)
  })

  // backgroundImage - supports linear-gradient with tokens
  test('backgroundImage with variable resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(to bottom, white, black)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(
      /linear-gradient\(to bottom, var\(--.*white.*\), var\(--.*black.*\)\)/
    )
  })

  test('backgroundImage with angle and multiple color stops', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(45deg, black 0%, white 50%, black 100%)',
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

  test('backgroundImage with unresolvable variable keeps token string', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(nonexistent, white)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(/linear-gradient\(nonexistent, var\(--.*white/)
  })

  test('backgroundImage with token/NN opacity modifier resolves to color-mix', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundImage: 'linear-gradient(180deg, white/50, white/0)',
    })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(
      /linear-gradient\(180deg, color-mix\(in srgb, var\(--.*white.*\) 50%, transparent\), color-mix\(in srgb, var\(--.*white.*\) 0%, transparent\)\)/
    )
  })
})

describe('border shorthand - web', () => {
  // the border family splits the composite value into per-longhand programs

  test('border with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid red',
    })

    expect(getStyleValue(styles, 'borderTopWidth')).toBe('1px')
    expect(getStyleValue(styles, 'borderTopStyle')).toBe('solid')
    expect(getStyleValue(styles, 'borderTopColor')).toBe('red')
    expect(getStyleValue(styles, 'borderLeftColor')).toBe('red')
  })

  test('border with variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '2px dashed white',
    })
    expect(getStyleValue(styles, 'borderTopWidth')).toBe('2px')
    expect(getStyleValue(styles, 'borderTopStyle')).toBe('dashed')
    expect(getStyleValue(styles, 'borderTopColor')).toMatch(/var\(--.*white.*\)/)
  })

  test('border without variables splits into longhands unchanged', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid blue',
    })

    expect(getStyleValue(styles, 'borderTopWidth')).toBe('1px')
    expect(getStyleValue(styles, 'borderTopColor')).toBe('blue')
  })

  test('border "none" becomes border-style none per side', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'none',
    })

    expect(getStyleValue(styles, 'borderTopStyle')).toBe('none')
    expect(getStyleValue(styles, 'borderBottomStyle')).toBe('none')
  })
})

describe('outline shorthand - web', () => {
  // outline splits into width/style/color programs (like border)

  test('outline with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid red',
    })

    expect(getStyleValue(styles, 'outlineWidth')).toBe('2px')
    expect(getStyleValue(styles, 'outlineStyle')).toBe('solid')
    expect(getStyleValue(styles, 'outlineColor')).toBe('red')
  })

  test('outline with variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid white',
    })
    expect(getStyleValue(styles, 'outlineWidth')).toBe('2px')
    expect(getStyleValue(styles, 'outlineStyle')).toBe('solid')
    expect(getStyleValue(styles, 'outlineColor')).toMatch(/var\(--.*white.*\)/)
  })

  test('outline "none" becomes outline-style none', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: 'none',
    })

    expect(getStyleValue(styles, 'outlineStyle')).toBe('none')
  })
})

describe('text-decoration shorthand - web', () => {
  test('textDecoration splits into line, style and color programs', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      textDecoration: 'underline dotted red',
    })

    expect(getStyleValue(styles, 'textDecorationLine')).toBe('underline')
    expect(getStyleValue(styles, 'textDecorationStyle')).toBe('dotted')
    expect(getStyleValue(styles, 'textDecorationColor')).toBe('red')
  })

  test('a hover clause lands on the line program', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      textDecoration: 'underline hover:none',
    })
    const className = styles.classNames?.textDecorationLine
    const rules = (styles.rulesToInsert?.[className]?.[StyleObjectRules] ?? []).join('')
    expect(rules).toContain('text-decoration-line:underline')
    expect(rules).toContain(':hover{text-decoration-line:none}')
  })
})

describe('logical border shorthands - web', () => {
  test('borderBlock splits into logical start/end longhand programs', () => {
    const styles = simplifiedGetSplitStyles(View, {
      borderBlock: '1px solid green',
    })

    expect(getStyleValue(styles, 'borderBlockStartWidth')).toBe('1px')
    expect(getStyleValue(styles, 'borderBlockEndStyle')).toBe('solid')
    expect(getStyleValue(styles, 'borderBlockStartColor')).toBe('green')
  })

  test('borderInline splits into logical start/end longhand programs', () => {
    const styles = simplifiedGetSplitStyles(View, {
      borderInline: '2px dashed blue',
    })

    expect(getStyleValue(styles, 'borderInlineStartWidth')).toBe('2px')
    expect(getStyleValue(styles, 'borderInlineEndColor')).toBe('blue')
  })
})

describe('tokens in variant styles - web', () => {
  test('boxShadow with embedded token in variant resolves to CSS var', () => {
    const Comp = styled(View, {
      variants: {
        floating: {
          true: {
            boxShadow: '0 20px 40px white',
          },
        },
      } as const,
    })
    const styles = simplifiedGetSplitStyles(Comp, { floating: true })
    const value = getStyleValue(styles, 'boxShadow')

    // token should resolve, not remain as literal white
    expect(value).toMatch(/var\(--.*white/)
  })

  test('border with embedded token in variant resolves to CSS var', () => {
    const Comp = styled(View, {
      variants: {
        outlined: {
          true: {
            border: '2px solid white',
          },
        },
      } as const,
    })
    const styles = simplifiedGetSplitStyles(Comp, { outlined: true })
    expect(getStyleValue(styles, 'borderTopWidth')).toBe('2px')
    expect(getStyleValue(styles, 'borderTopStyle')).toBe('solid')
    expect(getStyleValue(styles, 'borderTopColor')).toMatch(/var\(--.*white/)
  })

  test('backgroundImage with embedded tokens in variant resolves', () => {
    const Comp = styled(View, {
      variants: {
        gradient: {
          true: {
            backgroundImage: 'linear-gradient(to bottom, white, black)',
          },
        },
      } as const,
    })
    const styles = simplifiedGetSplitStyles(Comp, { gradient: true })
    const value = getStyleValue(styles, 'backgroundImage')

    expect(value).toMatch(/var\(--.*white/)
    expect(value).toMatch(/var\(--.*black/)
  })
})

describe('border shorthand with media queries - web', () => {
  test('border in sm splits into per-longhand media programs', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'sm:2px solid green',
    })

    // the border family splits the composite into width/style/color programs
    const widthClass = styles.classNames?.borderTopWidth
    expect(widthClass).toMatch(/^_btw-/)
    const widthRules = (styles.rulesToInsert?.[widthClass]?.[4] ?? []).join('')
    expect(widthRules).toContain('@media')
    expect(widthRules).toContain('border-top-width:2px')

    const styleRules = (
      styles.rulesToInsert?.[styles.classNames?.borderTopStyle]?.[4] ?? []
    ).join('')
    expect(styleRules).toContain('border-top-style:solid')

    const colorRules = (
      styles.rulesToInsert?.[styles.classNames?.borderTopColor]?.[4] ?? []
    ).join('')
    expect(colorRules).toContain('border-top-color:green')
  })

  test('border in sm with token resolves through the variable', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'sm:1px dashed white',
    })

    const colorRules = (
      styles.rulesToInsert?.[styles.classNames?.borderTopColor]?.[4] ?? []
    ).join('')
    expect(colorRules).toContain('@media')
    expect(colorRules).toContain('var(--')
  })
})
