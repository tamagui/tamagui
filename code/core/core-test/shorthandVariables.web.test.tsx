import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import { Text, View, createTamagui, styled } from '../web/src'
import { getStyleValue, rulesForProperty, simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

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
  test('border with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid red',
    })
    expect(getStyleValue(styles, 'border')).toBe('1px solid red')
  })

  test('border with variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '2px dashed white',
    })
    expect(getStyleValue(styles, 'border')).toMatch(/^2px dashed var\(--.*white.*\)$/)
  })

  test('border without variables passes through unchanged', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid blue',
    })

    expect(getStyleValue(styles, 'border')).toBe('1px solid blue')
  })

  test('border "none" passes through', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'none',
    })

    expect(getStyleValue(styles, 'border')).toBe('none')
  })

  test('border with color function classifies it as the color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: '1px solid rgba(0, 0, 0, 0.1)',
    })

    expect(getStyleValue(styles, 'border')).toBe('1px solid rgba(0, 0, 0, 0.1)')
  })
})

describe('outline shorthand - web', () => {
  test('outline with width, style and color', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid red',
    })

    expect(getStyleValue(styles, 'outline')).toBe('2px solid red')
  })

  test('outline with variable color resolves to CSS var', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: '2px solid white',
    })
    expect(getStyleValue(styles, 'outline')).toMatch(/^2px solid var\(--.*white.*\)$/)
  })

  test('outline "none" becomes outline-style none', () => {
    const styles = simplifiedGetSplitStyles(View, {
      outline: 'none',
    })

    expect(getStyleValue(styles, 'outline')).toBe('none')
  })
})

describe('text-decoration shorthand - web', () => {
  test('textDecoration preserves the composite declaration', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      textDecoration: 'underline dotted red',
    })

    expect(getStyleValue(styles, 'textDecoration')).toBe('underline dotted red')
  })

  test('a hover clause lands on the line program', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      textDecoration: 'underline hover:none',
    })
    const rules = rulesForProperty(styles, 'textDecoration').join('')
    expect(rules).toContain('text-decoration:underline')
    expect(rules).toContain(':where(:hover){text-decoration:none}')
  })
})

describe('logical border shorthands - web', () => {
  test('borderBlock preserves the logical shorthand', () => {
    const styles = simplifiedGetSplitStyles(View, {
      borderBlock: '1px solid green',
    })

    expect(getStyleValue(styles, 'borderBlock')).toBe('1px solid green')
  })

  test('borderInline preserves the logical shorthand', () => {
    const styles = simplifiedGetSplitStyles(View, {
      borderInline: '2px dashed blue',
    })

    expect(getStyleValue(styles, 'borderInline')).toBe('2px dashed blue')
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
    expect(getStyleValue(styles, 'border')).toMatch(/^2px solid var\(--.*white/)
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
  test('border in sm emits one media declaration', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'sm:2px solid green',
    })

    const rules = rulesForProperty(styles, 'border').join('')
    expect(rules).toContain('@media')
    expect(rules).toContain('border:2px solid green')
  })

  test('border in sm with token resolves through the variable', () => {
    const styles = simplifiedGetSplitStyles(View, {
      border: 'sm:1px dashed white',
    })

    const rules = rulesForProperty(styles, 'border').join('')
    expect(rules).toContain('@media')
    expect(rules).toContain('var(--')
  })
})
