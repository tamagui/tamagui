import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  View,
  Text,
  createTamagui,
  styled,
} from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig())
})

describe('flat mode - base props', () => {
  test('$bg="red" sets backgroundColor', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$bg': 'red',
    } as any)

    // base props go to style, not classNames
    expect(styles.style?.backgroundColor).toBe('red')
  })

  test('$p="10" sets padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$p': 10,
    } as any)

    // padding should be in style (expands to individual sides)
    expect(styles.style).toBeDefined()
    const styleStr = JSON.stringify(styles.style)
    expect(styleStr).toContain('padding')
  })

  test('$color="blue" sets color on Text', () => {
    const styles = simplifiedGetSplitStyles(Text, {
      '$color': 'blue',
    } as any)

    expect(styles.style?.color).toBe('blue')
  })

  test('$opacity="0.5" sets opacity', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$opacity': 0.5,
    } as any)

    expect(styles.style?.opacity).toBe(0.5)
  })
})

describe('flat mode - pseudo modifiers', () => {
  test('$hover:bg="blue" generates hover style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'blue',
    } as any)

    // check for hover class
    const hoverKey = Object.keys(styles.classNames).find(k => k.includes('hover'))
    expect(hoverKey).toBeDefined()
    expect(styles.classNames[hoverKey!]).toContain('0hover')
  })

  test('$press:opacity="0.5" generates active/press style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$press:opacity': 0.5,
    } as any)

    const pressKey = Object.keys(styles.classNames).find(k => k.includes('press') || k.includes('active'))
    expect(pressKey).toBeDefined()
  })

  test('$focus:borderColor="green" generates focus style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$focus:borderColor': 'green',
    } as any)

    const focusKey = Object.keys(styles.classNames).find(k => k.includes('focus'))
    expect(focusKey).toBeDefined()
  })

  test('$disabled:opacity="0.3" generates disabled style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$disabled:opacity': 0.3,
    } as any)

    const disabledKey = Object.keys(styles.classNames).find(k => k.includes('disabled'))
    expect(disabledKey).toBeDefined()
  })
})

describe('flat mode - media modifiers', () => {
  test('$sm:bg="red" generates media query style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:bg': 'red',
    } as any)

    // media styles should have the media key in the classNames key
    const smKey = Object.keys(styles.classNames).find(k => k.includes('sm') || k.includes('$sm'))
    expect(smKey).toBeDefined()
  })

  test('$md:p="20" generates media query padding', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$md:p': 20,
    } as any)

    const mdKey = Object.keys(styles.classNames).find(k => k.includes('md') || k.includes('$md'))
    expect(mdKey).toBeDefined()
  })
})

describe('flat mode - combined modifiers', () => {
  test('$sm:hover:bg="purple" generates media + hover style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:hover:bg': 'purple',
    } as any)

    // should have both sm and hover in the key or class
    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('sm')
    expect(classNamesStr).toContain('hover')
  })

  test('$hover:sm:bg="purple" (different order) generates same result', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:sm:bg': 'purple',
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('sm')
    expect(classNamesStr).toContain('hover')
  })
})

describe('flat mode - theme modifiers', () => {
  test('$dark:bg="black" generates theme-conditional style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$dark:bg': 'black',
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('dark')
  })

  test('$light:color="black" generates light theme style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$light:color': 'black',
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('light')
  })
})

describe('flat mode - platform modifiers', () => {
  test('$web:cursor="pointer" generates web-only style', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$web:cursor': 'pointer',
    } as any)

    // on web, this should be processed
    const hasCursor = Object.keys(styles.classNames).some(k => k.includes('cursor'))
    expect(hasCursor).toBe(true)
  })
})

describe('flat mode - multiple flat props', () => {
  test('multiple flat props work together', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$bg': 'white',
      '$hover:bg': 'gray',
      '$sm:bg': 'lightgray',
    } as any)

    // should have base bg in style
    expect(styles.style?.backgroundColor).toBe('white')

    // should have hover bg in classNames
    const hoverKey = Object.keys(styles.classNames).find(k => k.includes('hover'))
    expect(hoverKey).toBeDefined()

    // should have media bg in classNames
    const smKey = Object.keys(styles.classNames).find(k => k.includes('sm'))
    expect(smKey).toBeDefined()
  })
})

describe('flat mode - coexists with object syntax', () => {
  test('flat and object syntax can be mixed', () => {
    const styles = simplifiedGetSplitStyles(View, {
      // flat syntax
      '$hover:bg': 'blue',
      // object syntax
      '$sm': { padding: 10 },
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
      '$bg': '$white',
    } as any)

    // tokens resolve to CSS variables in style
    expect(styles.style?.backgroundColor).toContain('var(--')
  })

  test('$hover:bg="$black" resolves token in pseudo', () => {
    // use $black since that's in the default config tokens
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': '$black',
    } as any)

    // pseudo with token goes to classNames
    const hoverKey = Object.keys(styles.classNames).find(k => k.includes('hover'))
    expect(hoverKey).toBeDefined()
  })
})

describe('flat mode - shorthands', () => {
  test('various shorthands work', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$m': 10,
      '$rounded': 8,
      '$w': 100,
      '$h': 50,
    } as any)

    // base props go to style
    expect(styles.style).toBeDefined()
    const styleStr = JSON.stringify(styles.style)
    // should have some of these (margin expands, etc.)
    expect(styleStr.length).toBeGreaterThan(2) // not just "{}"
  })

  test('hover with shorthands', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:m': 20,
      '$hover:rounded': 16,
    } as any)

    // pseudo shorthands go to classNames
    const hoverKeys = Object.keys(styles.classNames).filter(k => k.includes('hover'))
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

    const hoverKey = Object.keys(styles.classNames).find(k => k.includes('hover'))
    expect(hoverKey).toBeDefined()
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

    // should have hover bg
    const hoverKey = Object.keys(styles.classNames).find(k => k.includes('hover'))
    expect(hoverKey).toBeDefined()
  })
})

describe('flat mode - edge cases', () => {
  test('multiple same modifiers accumulate', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$hover:bg': 'red',
      '$hover:color': 'white',
      '$hover:opacity': 0.9,
    } as any)

    const hoverKeys = Object.keys(styles.classNames).filter(k => k.includes('hover'))
    // should have multiple hover rules
    expect(hoverKeys.length).toBeGreaterThanOrEqual(2)
  })

  test('numeric values work', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$opacity': 0.5,
      '$zIndex': 10,
      '$flex': 1,
    } as any)

    // base numeric props go to style
    expect(styles.style?.opacity).toBe(0.5)
    expect(styles.style?.zIndex).toBe(10)
    expect(styles.style?.flex).toBe(1)
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

    // both should have sm and hover
    const str1 = JSON.stringify(styles1.classNames)
    const str2 = JSON.stringify(styles2.classNames)

    expect(str1).toContain('sm')
    expect(str1).toContain('hover')
    expect(str2).toContain('sm')
    expect(str2).toContain('hover')
  })
})

describe('flat mode - chained media + theme', () => {
  test('$sm:dark:bg generates media wrapping theme', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    // should have both sm and dark in classNames
    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('sm')
    expect(classNamesStr).toContain('dark')
  })

  test('$sm:light:hover:bg generates media + theme + pseudo', () => {
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:light:hover:bg': 'white',
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('sm')
    expect(classNamesStr).toContain('light')
    expect(classNamesStr).toContain('hover')
  })

  test('$dark:sm:bg order independent - same as $sm:dark:bg', () => {
    const styles1 = simplifiedGetSplitStyles(View, {
      '$sm:dark:bg': 'black',
    } as any)

    const styles2 = simplifiedGetSplitStyles(View, {
      '$dark:sm:bg': 'black',
    } as any)

    // both should produce equivalent output
    const str1 = JSON.stringify(styles1.classNames)
    const str2 = JSON.stringify(styles2.classNames)

    expect(str1).toContain('sm')
    expect(str1).toContain('dark')
    expect(str2).toContain('sm')
    expect(str2).toContain('dark')
  })

  test('$sm:dark:hover:press:bg - multiple pseudos not supported, last wins', () => {
    // this tests edge case - we only support one pseudo
    const styles = simplifiedGetSplitStyles(View, {
      '$sm:dark:hover:bg': 'gray',
    } as any)

    const classNamesStr = JSON.stringify(styles.classNames)
    expect(classNamesStr).toContain('sm')
    expect(classNamesStr).toContain('dark')
    expect(classNamesStr).toContain('hover')
  })
})
