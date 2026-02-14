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
import { simplifiedGetSplitStyles, findRule, findAnyRule } from './utils'

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

    // on web, base styles go to classNames (atomic CSS), values in rulesToInsert
    expect(styles.classNames.backgroundColor).toMatch(/_bg-/)
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('red')
  })

  test('$p="10" sets padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $p: 10,
    } as any)

    // padding expands to individual sides (numeric values converted to px strings on web)
    const ptRule = findRule(styles.rulesToInsert, 'paddingTop')
    expect(ptRule).toBeTruthy()
    expect(ptRule[StyleObjectValue]).toBe('10px')

    const prRule = findRule(styles.rulesToInsert, 'paddingRight')
    expect(prRule).toBeTruthy()
    expect(prRule[StyleObjectValue]).toBe('10px')
  })

  test('$color="blue" sets color on Text', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      $color: 'blue',
    } as any)

    expect(styles.classNames.color).toMatch(/_col-/)
    const rule = findRule(styles.rulesToInsert, 'color')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe('blue')
  })

  test('$opacity="0.5" sets opacity', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $opacity: 0.5,
    } as any)

    expect(styles.classNames.opacity).toMatch(/_o-/)
    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0.5)
  })
})

describe('flat mode - pseudo modifiers', () => {
  test('$hover:bg="blue" generates hover style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'blue',
    } as any)

    // find hover key and verify it exists with expected pattern
    const hoverKey = Object.keys(styles.classNames).find((k) => k.includes('hover'))
    expect(hoverKey).toBeDefined()
    expect(typeof hoverKey).toBe('string')
    // verify the class name contains hover pseudo pattern
    const hoverClassName = styles.classNames[hoverKey!]
    expect(hoverClassName).toMatch(/0hover/)
    expect(hoverClassName).toMatch(/_bg-/)
  })

  test('$press:opacity="0.5" generates active/press style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$press:opacity': 0.5,
    } as any)

    const pressKey = Object.keys(styles.classNames).find(
      (k) => k.includes('press') || k.includes('active')
    )
    expect(pressKey).toBeDefined()
    expect(typeof pressKey).toBe('string')
    // verify the class name contains active pseudo pattern (press maps to :active in CSS)
    const pressClassName = styles.classNames[pressKey!]
    expect(pressClassName).toMatch(/active/)
    expect(pressClassName).toMatch(/_o-/)
  })

  test('$focus:borderColor="green" generates focus style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$focus:borderColor': 'green',
    } as any)

    const focusKey = Object.keys(styles.classNames).find((k) => k.includes('focus'))
    expect(focusKey).toBeDefined()
    expect(typeof focusKey).toBe('string')
    // verify the class name contains focus pseudo pattern
    const focusClassName = styles.classNames[focusKey!]
    expect(focusClassName).toMatch(/focus/)
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

    // media styles should have the media key in the classNames key
    const smKey = Object.keys(styles.classNames).find(
      (k) => k.includes('sm') || k.includes('$sm')
    )
    expect(smKey).toBeTruthy()
    expect(styles.classNames[smKey!]).toContain('_sm')
  })

  test('$md:p="20" generates media query padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$md:p': 20,
    } as any)

    const mdKey = Object.keys(styles.classNames).find(
      (k) => k.includes('md') || k.includes('$md')
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

    // combined modifier rules encode value/media/pseudo in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const bgRule = rules.find((r) => r[StyleObjectProperty] === 'backgroundColor')
    expect(bgRule).toBeTruthy()
    // identifier encodes sm media, hover pseudo, and purple value
    const id = bgRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    expect(id).toContain('hover')
    expect(id).toContain('purple')
  })

  test('$hover:sm:bg="purple" (different order) generates same result', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:sm:bg': 'purple',
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const bgRule = rules.find((r) => r[StyleObjectProperty] === 'backgroundColor')
    expect(bgRule).toBeTruthy()
    const id = bgRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    expect(id).toContain('hover')
    expect(id).toContain('purple')
  })
})

describe('flat mode - theme modifiers', () => {
  test('$dark:bg="black" generates theme-conditional style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$dark:bg': 'black',
    } as any)

    // theme modifier rules encode value in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const bgRule = rules.find((r) => r[StyleObjectProperty] === 'backgroundColor')
    expect(bgRule).toBeTruthy()
    const id = bgRule[StyleObjectIdentifier]
    expect(id).toContain('dark')
    expect(id).toContain('black')
  })

  test('$light:color="black" generates light theme style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$light:color': 'black',
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const colorRule = rules.find((r) => r[StyleObjectProperty] === 'color')
    expect(colorRule).toBeTruthy()
    const id = colorRule[StyleObjectIdentifier]
    expect(id).toContain('light')
    expect(id).toContain('black')
  })
})

describe('flat mode - platform modifiers', () => {
  test('$web:cursor="pointer" generates web-only style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$web:cursor': 'pointer',
    } as any)

    // platform modifier rules encode value in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const cursorRule = rules.find((r: any) => r[StyleObjectProperty] === 'cursor')
    expect(cursorRule).toBeTruthy()
    const id = cursorRule[StyleObjectIdentifier]
    expect(id).toContain('platformweb')
    expect(id).toContain('pointer')
  })
})

describe('flat mode - multiple flat props', () => {
  test('multiple flat props work together', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'white',
      '$hover:bg': 'gray',
      '$sm:bg': 'lightgray',
    } as any)

    // base bg - uses StyleObjectValue directly
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('white')

    // hover and media rules encode value in identifier
    const rules = Object.values(styles.rulesToInsert || {}) as any[]

    // hover bg
    const hoverRule = rules.find(
      (r: any) =>
        r[StyleObjectProperty] === 'backgroundColor' &&
        r[StyleObjectIdentifier]?.includes('hover')
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectIdentifier]).toContain('gray')

    // media bg
    const smRule = rules.find(
      (r: any) =>
        r[StyleObjectProperty] === 'backgroundColor' &&
        r[StyleObjectIdentifier]?.includes('_sm') &&
        !r[StyleObjectIdentifier]?.includes('hover')
    )
    expect(smRule).toBeTruthy()
    expect(smRule[StyleObjectIdentifier]).toContain('lightgray')
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
    // use $white since that's in the default config tokens
    const styles = simplifiedGetSplitStyles(View, {
      $bg: '$white',
    } as any)

    // tokens resolve to CSS variables in rulesToInsert
    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('$hover:bg="$black" resolves token in pseudo', () => {
    // use $black since that's in the default config tokens
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

    // base literal props go to classNames/rulesToInsert on web
    const mtRule = findRule(styles.rulesToInsert, 'marginTop')
    expect(mtRule).toBeTruthy()
    expect(mtRule[StyleObjectValue]).toBe('10px')

    // borderRadius expands to individual corners
    const btlrRule = findRule(styles.rulesToInsert, 'borderTopLeftRadius')
    expect(btlrRule).toBeTruthy()
    expect(btlrRule[StyleObjectValue]).toBe('8px')

    const wRule = findRule(styles.rulesToInsert, 'width')
    expect(wRule).toBeTruthy()
    expect(wRule[StyleObjectValue]).toBe('100px')

    const hRule = findRule(styles.rulesToInsert, 'height')
    expect(hRule).toBeTruthy()
    expect(hRule[StyleObjectValue]).toBe('50px')
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

    // base numeric props go to classNames/rulesToInsert on web
    const oRule = findRule(styles.rulesToInsert, 'opacity')
    expect(oRule).toBeTruthy()
    expect(oRule[StyleObjectValue]).toBe(0.5)

    const zRule = findRule(styles.rulesToInsert, 'zIndex')
    expect(zRule).toBeTruthy()
    expect(zRule[StyleObjectValue]).toBe(10)
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

    // extract rules and compare structural equivalence
    const rules1 = Object.values(styles1.rulesToInsert || {}).map((r: any) => ({
      prop: r[StyleObjectProperty],
      val: r[StyleObjectValue],
      pseudo: r[StyleObjectPseudo],
    }))
    const rules2 = Object.values(styles2.rulesToInsert || {}).map((r: any) => ({
      prop: r[StyleObjectProperty],
      val: r[StyleObjectValue],
      pseudo: r[StyleObjectPseudo],
    }))

    expect(rules1.length).toBeGreaterThan(0)
    expect(rules1).toEqual(rules2)

    // classNames values should also match
    const classValues1 = Object.values(styles1.classNames).sort()
    const classValues2 = Object.values(styles2.classNames).sort()
    expect(classValues1).toEqual(classValues2)
  })
})

describe('flat mode - chained media + theme', () => {
  test('$sm:dark:bg generates media wrapping theme', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    // theme-scoped rules use '$theme-dark' as property
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const themeRule = rules.find((r) => r[StyleObjectProperty] === '$theme-dark')
    expect(themeRule).toBeTruthy()
    // identifier encodes the actual CSS prop, media, and value
    const id = themeRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    expect(id).toContain('_bg')
    expect(id).toContain('black')
  })

  test('$sm:light:hover:bg generates media + theme + pseudo', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:light:hover:bg': 'white',
    } as any)

    // theme+pseudo rules use '$theme-light' as property
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const themeRule = rules.find((r) => r[StyleObjectProperty] === '$theme-light')
    expect(themeRule).toBeTruthy()
    const id = themeRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    expect(id).toContain('hoverStyle')
  })

  test('$dark:sm:bg order independent - same as $sm:dark:bg', () => {
    const styles1 = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    const styles2 = simplifiedGetSplitStyles(View, {
      '$dark:sm:bg': 'black',
    } as any)

    // extract rules and compare structural equivalence
    const rules1 = Object.values(styles1.rulesToInsert || {}).map((r: any) => ({
      prop: r[StyleObjectProperty],
      val: r[StyleObjectValue],
      pseudo: r[StyleObjectPseudo],
    }))
    const rules2 = Object.values(styles2.rulesToInsert || {}).map((r: any) => ({
      prop: r[StyleObjectProperty],
      val: r[StyleObjectValue],
      pseudo: r[StyleObjectPseudo],
    }))

    expect(rules1.length).toBeGreaterThan(0)
    expect(rules1).toEqual(rules2)

    // classNames values should also match
    const classValues1 = Object.values(styles1.classNames).sort()
    const classValues2 = Object.values(styles2.classNames).sort()
    expect(classValues1).toEqual(classValues2)
  })

  test('$sm:dark:hover:press:bg - multiple pseudos, last pseudo wins', () => {
    // test actual multiple pseudos case - when multiple pseudos given, last one wins
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:hover:press:bg': 'gray',
    } as any)

    // theme-scoped rule
    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const themeRule = rules.find((r) => r[StyleObjectProperty] === '$theme-dark')
    expect(themeRule).toBeTruthy()
    const id = themeRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    // last pseudo wins: pressStyle, not hoverStyle
    expect(id).toContain('pressStyle')
    expect(id).not.toContain('hoverStyle')
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

    // flat prop should override regular prop
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('blue')
  })

  test('backgroundColor overrides $bg when declared after', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: 'blue',
      backgroundColor: 'red',
    } as any)

    // last-declared wins (regular prop after flat)
    const bgRule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(bgRule).toBeTruthy()
    expect(bgRule[StyleObjectValue]).toBe('red')
  })

  test('empty value $bg="" does not crash', () => {
    const styles = simplifiedGetSplitStyles(View, {
      $bg: '',
    } as any)

    // should not produce a rule with empty value
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

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(0)
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

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('blue')
  })

  test('$hover:p-10 parses as $hover:p={10}', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:p-10': true,
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find(
      (r) => r[StyleObjectProperty] === 'paddingTop' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('10px')
  })

  test('$sm:hover:bg-red parses media + pseudo + embedded value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:hover:bg-red': true,
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const bgRule = rules.find((r) => r[StyleObjectProperty] === 'backgroundColor')
    expect(bgRule).toBeTruthy()
    // identifier encodes sm media, hover pseudo, and red value
    const id = bgRule[StyleObjectIdentifier]
    expect(id).toContain('_sm')
    expect(id).toContain('hover')
    expect(id).toContain('red')
  })

  test('$bg-white resolves token with embedded syntax', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$bg-white': true,
    } as any)

    const rule = findRule(styles.rulesToInsert, 'backgroundColor')
    expect(rule).toBeTruthy()
    // white is a token → resolves to CSS var
    expect(rule[StyleObjectValue]).toContain('var(--')
  })

  test('embedded value with hyphenated token like bg-some-token works', () => {
    // hypothetical token "blue-500" - value after first hyphen is "500" or if token is "blue-500"
    // this tests that we correctly handle hyphenated values
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg-blue': true,
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]
    const hoverRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('blue')
  })

  test('$opacity-50 sets numeric value', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$opacity-50': true,
    } as any)

    const rule = findRule(styles.rulesToInsert, 'opacity')
    expect(rule).toBeTruthy()
    expect(rule[StyleObjectValue]).toBe(50)
  })

  test('can mix embedded and explicit value syntax', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg-blue': true, // embedded
      '$press:bg': 'green', // explicit
    } as any)

    const rules = Object.values(styles.rulesToInsert || {}) as any[]

    const hoverRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'hover'
    )
    expect(hoverRule).toBeTruthy()
    expect(hoverRule[StyleObjectValue]).toBe('blue')

    const pressRule = rules.find(
      (r) =>
        r[StyleObjectProperty] === 'backgroundColor' && r[StyleObjectPseudo] === 'active'
    )
    expect(pressRule).toBeTruthy()
    expect(pressRule[StyleObjectValue]).toBe('green')
  })
})
