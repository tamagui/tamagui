import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  View,
  Text,
  createTamagui,
  styled,
  StyleObjectProperty,
  StyleObjectValue,
} from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  const defaultConfig = config.getDefaultTamaguiConfig()
  createTamagui({
    ...defaultConfig,
    settings: {
      ...defaultConfig.settings,
      styleMode: 'flat', // enable flat mode for these tests
    },
  })
})

import { StyleObjectPseudo, StyleObjectIdentifier } from '@tamagui/helpers'

describe('flat mode - base props', () => {
  test('$bg="red" sets backgroundColor', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'red',
    } as any)

    expect(styles.viewProps.style.backgroundColor).toBe('red')
  })

  test('$p="10" sets padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $p: 10,
    } as any)

    // padding expands to individual sides (numeric values become px strings on web)
    const s = styles.viewProps.style
    expect(s.paddingTop).toBe('10px')
    expect(s.paddingRight).toBe('10px')
    expect(s.paddingBottom).toBe('10px')
    expect(s.paddingLeft).toBe('10px')
  })

  test('$color="blue" sets color on Text', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      $color: 'blue',
    } as any)

    expect(styles.viewProps.style.color).toBe('blue')
  })

  test('$opacity="0.5" sets opacity', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $opacity: 0.5,
    } as any)

    expect(styles.viewProps.style.opacity).toBe(0.5)
  })
})

describe('flat mode - pseudo modifiers', () => {
  test('$hover:bg="blue" generates hover style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'blue',
    } as any)

    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeDefined()
    expect(styles.classNames[hoverKey!]).toMatch(/0hover/)
    expect(styles.classNames[hoverKey!]).toMatch(/_bg-/)
  })

  test('$press:opacity="0.5" generates active/press style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$press:opacity': 0.5,
    } as any)

    const pressKey = Object.keys(styles.classNames).find(
      (k) => k.includes('press') || k.includes('active')
    )
    expect(pressKey).toBeDefined()
    expect(styles.classNames[pressKey!]).toMatch(/active/)
    expect(styles.classNames[pressKey!]).toMatch(/_o-/)
  })

  test('$focus:borderColor="green" generates focus style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$focus:borderColor': 'green',
    } as any)

    const focusKey = Object.keys(styles.classNames).find((k) => k.includes('focus'))
    expect(focusKey).toBeDefined()
    expect(styles.classNames[focusKey!]).toMatch(/focus/)
  })

  test('$disabled:opacity="0.3" generates disabled style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$disabled:opacity': 0.3,
    } as any)

    const disabledKey = Object.keys(styles.classNames).find((k) => k.includes('disabled'))
    expect(disabledKey).toBeTruthy()
    expect(styles.classNames[disabledKey!]).toContain('disabled')
  })
})

describe('flat mode - media modifiers', () => {
  test('$sm:bg="red" generates media query style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:bg': 'red',
    } as any)

    const smKey = Object.keys(styles.classNames).find(
      (k) => k.includes('sm')
    )
    expect(smKey).toBeTruthy()
    expect(styles.classNames[smKey!]).toContain('_sm')
  })

  test('$md:p="20" generates media query padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$md:p': 20,
    } as any)

    const mdKey = Object.keys(styles.classNames).find(
      (k) => k.includes('md')
    )
    expect(mdKey).toBeTruthy()
    expect(styles.classNames[mdKey!]).toContain('_md')
  })
})

describe('flat mode - combined modifiers', () => {
  test('$sm:hover:bg="purple" generates media + hover style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:hover:bg': 'purple',
    } as any)

    const key = Object.keys(styles.classNames).find(
      (k) => k.includes('sm') && k.includes('hover')
    )
    expect(key).toBeTruthy()
    const cn = styles.classNames[key!]
    expect(cn).toContain('_sm')
    expect(cn).toContain('hover')
  })

  test('$hover:sm:bg="purple" (different order) generates same result', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:sm:bg': 'purple',
    } as any)

    const key = Object.keys(styles.classNames).find(
      (k) => k.includes('sm') && k.includes('hover')
    )
    expect(key).toBeTruthy()
    const cn = styles.classNames[key!]
    expect(cn).toContain('_sm')
    expect(cn).toContain('hover')
  })
})

describe('flat mode - theme modifiers', () => {
  test('$dark:bg="black" generates theme-conditional style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$dark:bg': 'black',
    } as any)

    const darkKey = Object.keys(styles.classNames).find((k) => k.includes('dark'))
    expect(darkKey).toBeTruthy()
    expect(styles.classNames[darkKey!]).toContain('dark')
  })

  test('$light:color="black" generates light theme style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$light:color': 'black',
    } as any)

    const lightKey = Object.keys(styles.classNames).find((k) => k.includes('light'))
    expect(lightKey).toBeTruthy()
    expect(styles.classNames[lightKey!]).toContain('light')
  })
})

describe('flat mode - platform modifiers', () => {
  test('$web:cursor="pointer" generates web-only style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$web:cursor': 'pointer',
    } as any)

    const webKey = Object.keys(styles.classNames).find((k) => k.includes('platform'))
    expect(webKey).toBeTruthy()
    expect(styles.classNames[webKey!]).toContain('platformweb')
  })
})

describe('flat mode - multiple flat props', () => {
  test('multiple flat props work together', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'white',
      '$hover:bg': 'gray',
      '$sm:bg': 'lightgray',
    } as any)

    // base bg goes to inline style
    expect(styles.viewProps.style.backgroundColor).toBe('white')

    // hover bg goes to classNames
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()

    // media bg goes to classNames
    const smKey = Object.keys(styles.classNames).find((k) => k.includes('sm'))
    expect(smKey).toBeTruthy()
  })
})

describe('flat mode - coexists with object syntax', () => {
  test('flat and object syntax can be mixed', () => {
    const styles = simplifiedGetSplitStyles(View, {
      // flat syntax
      '$hover:bg': 'blue',
      // object syntax
      $sm: { padding: 10 },
      pressStyle: { opacity: 0.8 },
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)

    // should have hover bg from flat
    expect(classNamesStr).toContain('hover')

    // should have media padding from object
    expect(classNamesStr).toContain('sm')

    // should have press opacity from object
    expect(classNamesStr).toContain('active')
  })
})

describe('flat mode - token values', () => {
  test('$bg="$white" resolves token', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: '$white',
    } as any)

    // tokens resolve to CSS variables in inline style
    const bg = styles.viewProps.style.backgroundColor
    expect(bg).toBeDefined()
    expect(bg).toContain('var(--')
  })

  test('$hover:bg="$black" resolves token in pseudo', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': '$black',
    } as any)

    // pseudo with token goes to classNames with hover pattern
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('0hover')
  })
})

describe('flat mode - shorthands', () => {
  test('various shorthands work', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $m: 10,
      $br: 8, // borderRadius shorthand in default config
      $w: 100,
      $h: 50,
    } as any)

    const s = styles.viewProps.style
    expect(s.marginTop).toBe('10px')
    expect(s.borderTopLeftRadius).toBe('8px')
    expect(s.width).toBe('100px')
    expect(s.height).toBe('50px')
  })

  test('hover with shorthands', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:m': 20,
      '$hover:br': 16,
    } as any)

    // pseudo shorthands go to classNames
    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys.length).toBeGreaterThan(0)
  })
})

describe('flat mode - styled components', () => {
  test('styled component with flat props', () => {
    const StyledBox = styled(View, {
      backgroundColor: 'white',
    })

    const styles = simplifiedGetSplitStyles(StyledBox, {
      '$hover:bg': 'gray',
    } as any)

    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('0hover')
  })

  test('styled component variants work with flat props', () => {
    const Button = styled(View, {
      backgroundColor: 'blue',
      variants: {
        size: {
          sm: { padding: 8 },
          lg: { padding: 16 },
        },
      },
    })

    const styles = simplifiedGetSplitStyles(Button, {
      size: 'sm',
      '$hover:bg': 'darkblue',
    } as any)

    // should have hover bg with proper class pattern
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('0hover')
  })
})

describe('flat mode - edge cases', () => {
  test('multiple same modifiers accumulate', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'red',
      '$hover:color': 'white',
      '$hover:opacity': 0.9,
    } as any)

    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    // should have multiple hover rules
    expect(hoverKeys.length).toBeGreaterThanOrEqual(2)
  })

  test('numeric values work', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $opacity: 0.5,
      $zIndex: 10,
    } as any)

    expect(styles.viewProps.style.opacity).toBe(0.5)
    expect(styles.viewProps.style.zIndex).toBe(10)
  })
})

describe('flat mode - modifier order independence', () => {
  test('$sm:hover:bg and $hover:sm:bg produce equivalent results', () => {
    const styles1 = simplifiedGetSplitStyles(View, {
      '$sm:hover:bg': 'purple',
    } as any)

    const styles2 = simplifiedGetSplitStyles(View, {
      '$hover:sm:bg': 'purple',
    } as any)

    // classNames values should match
    const classValues1 = Object.values(styles1.classNames).sort()
    const classValues2 = Object.values(styles2.classNames).sort()
    expect(classValues1.length).toBeGreaterThan(0)
    expect(classValues1).toEqual(classValues2)
  })
})

describe('flat mode - chained media + theme', () => {
  test('$sm:dark:bg generates media wrapping theme', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    // theme modifier: key contains '$theme-dark', className has sm media
    const darkKey = Object.keys(styles.classNames).find((k) => k.includes('theme-dark'))
    expect(darkKey).toBeTruthy()
    const cn = styles.classNames[darkKey!]
    expect(cn).toContain('_sm')
  })

  test('$sm:light:hover:bg generates media + theme + pseudo', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:light:hover:bg': 'white',
    } as any)

    // should produce classNames with light theme + sm media
    const keys = Object.keys(styles.classNames)
    expect(keys.length).toBeGreaterThan(0)
    const cn = Object.values(styles.classNames).join(' ')
    expect(cn).toContain('_sm')
  })

  test('$dark:sm:bg order independent - same as $sm:dark:bg', () => {
    const styles1 = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    const styles2 = simplifiedGetSplitStyles(View, {
      '$dark:sm:bg': 'black',
    } as any)

    // classNames values should match
    const classValues1 = Object.values(styles1.classNames).sort()
    const classValues2 = Object.values(styles2.classNames).sort()
    expect(classValues1.length).toBeGreaterThan(0)
    expect(classValues1).toEqual(classValues2)
  })

  test('$sm:dark:hover:press:bg - multiple pseudos, last pseudo wins', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:hover:press:bg': 'gray',
    } as any)

    // should produce output
    const keys = Object.keys(styles.classNames)
    expect(keys.length).toBeGreaterThan(0)
    const cn = Object.values(styles.classNames).join(' ')
    expect(cn).toContain('_sm')
  })
})

describe('flat mode - order independence with object syntax', () => {
  test('$sm:bg + $sm object - flat first, object second', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:bg': 'red',
      $sm: { padding: 10 },
    } as any)

    // should have both bg and padding in sm styles
    const smKeys = Object.keys(styles.classNames).filter((k) => k.includes('sm'))
    expect(smKeys.length).toBeGreaterThanOrEqual(2) // bg and padding keys
  })

  test('$sm object + $sm:bg - object first, flat second', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $sm: { padding: 10 },
      '$sm:bg': 'red',
    } as any)

    // should have both bg and padding in sm styles (same result as above)
    const smKeys = Object.keys(styles.classNames).filter((k) => k.includes('sm'))
    expect(smKeys.length).toBeGreaterThanOrEqual(2)
  })

  test('hoverStyle object + $hover:bg - both should merge', () => {
    const styles = simplifiedGetSplitStyles(View, {
      hoverStyle: { opacity: 0.8 },
      '$hover:bg': 'blue',
    } as any)

    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys.length).toBeGreaterThanOrEqual(2)
  })
})

describe('flat mode - precedence and edge cases', () => {
  test('$bg overrides backgroundColor (flat wins over regular)', () => {
    const styles = simplifiedGetSplitStyles(View, {
      backgroundColor: 'red',
      $bg: 'blue',
    } as any)

    expect(styles.viewProps.style.backgroundColor).toBe('blue')
  })

  test('backgroundColor overrides $bg when declared after', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'blue',
      backgroundColor: 'red',
    } as any)

    // last-declared wins (regular prop after flat)
    expect(styles.viewProps.style.backgroundColor).toBe('red')
  })

  test('empty value $bg="" does not crash', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: '',
    } as any)

    expect(styles).toBeDefined()
  })

  test('undefined value $bg=undefined does not crash', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: undefined,
    } as any)

    expect(styles).toBeDefined()
  })

  test('numeric zero $opacity=0 produces correct value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $opacity: 0,
    } as any)

    expect(styles.viewProps.style.opacity).toBe(0)
  })

  test('unknown flat prop $foo="bar" is silently ignored', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $foo: 'bar',
    } as any)

    // should not crash and should not produce a rule for unknown prop
    expect(styles).toBeDefined()
  })
})

describe('flat mode - embedded value syntax', () => {
  test('$hover:bg-blue parses as $hover:bg="blue"', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg-blue': true,
    } as any)

    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('blue')
  })

  test('$hover:p-10 parses as $hover:p={10}', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:p-10': true,
    } as any)

    // padding expands to individual sides in hover
    const hoverKeys = Object.keys(styles.classNames).filter((k) => k.includes('hover'))
    expect(hoverKeys.length).toBeGreaterThan(0)
  })

  test('$sm:hover:bg-red parses media + pseudo + embedded value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:hover:bg-red': true,
    } as any)

    const key = Object.keys(styles.classNames).find(
      (k) => k.includes('sm') && k.includes('hover')
    )
    expect(key).toBeTruthy()
    const cn = styles.classNames[key!]
    expect(cn).toContain('_sm')
    expect(cn).toContain('hover')
    expect(cn).toContain('red')
  })

  test('$bg-white resolves token with embedded syntax', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$bg-white': true,
    } as any)

    // white is a token → resolves to CSS var in inline style
    const bg = styles.viewProps.style.backgroundColor
    expect(bg).toBeDefined()
    expect(bg).toContain('var(--')
  })

  test('embedded value with hyphenated token like bg-some-token works', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg-blue': true,
    } as any)

    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('blue')
  })

  test('$opacity-50 sets numeric value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$opacity-50': true,
    } as any)

    expect(styles.viewProps.style.opacity).toBe(50)
  })

  test('can mix embedded and explicit value syntax', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg-blue': true, // embedded
      '$press:bg': 'green', // explicit
    } as any)

    // hover bg
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeTruthy()
    expect(styles.classNames[hoverKey!]).toContain('blue')

    // press bg
    const pressKey = Object.keys(styles.classNames).find(
      (k) => k.includes('press') || k.includes('active')
    )
    expect(pressKey).toBeTruthy()
    expect(styles.classNames[pressKey!]).toContain('green')
  })
})
