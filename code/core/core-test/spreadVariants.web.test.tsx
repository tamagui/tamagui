import { beforeAll, describe, expect, test } from 'vitest'

import config from '../config-default'
import {
  View,
  Text,
  StyleObjectProperty,
  StyleObjectValue,
  createTamagui,
  styled,
  getConfig,
} from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

function findRuleValue(rulesToInsert: Record<string, any>, property: string): any {
  for (const rule of Object.values(rulesToInsert)) {
    if (rule[StyleObjectProperty] === property) {
      return rule[StyleObjectValue]
    }
  }
  return undefined
}

let lightTheme: any

beforeAll(() => {
  // @ts-ignore
  createTamagui(config.getDefaultTamaguiConfig())
  lightTheme = getConfig().themes.light
})

describe('spread variant: ...color (#3892)', () => {
  const StyledSvg = styled(
    View,
    {
      name: 'ColorSpread',
      variants: {
        color: {
          '...color': (val) => ({ stroke: val }),
        },
      } as const,
    },
    { accept: { stroke: 'color' } }
  )

  test('resolves color token ($white) to stroke', () => {
    const { viewProps } = simplifiedGetSplitStyles(StyledSvg, { color: '$white' })
    expect(viewProps.stroke).toBeDefined()
  })

  test('resolves theme value ($color) to stroke', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      StyledSvg,
      { color: '$color' },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(viewProps.stroke).toBeDefined()
  })

  test('does NOT produce CSS color property', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(StyledSvg, { color: '$white' })
    const rules = Object.values(rulesToInsert)
    expect(rules.find((r) => r[StyleObjectProperty] === 'color')).toBeUndefined()
  })

  test('exact variant value works alongside spread', () => {
    const Comp = styled(
      View,
      {
        name: 'ColorExact',
        variants: {
          color: {
            red: { stroke: 'red' },
            '...color': (val) => ({ stroke: val }),
          },
        } as const,
      },
      { accept: { stroke: 'color' } }
    )
    const { viewProps } = simplifiedGetSplitStyles(Comp, { color: 'red' })
    expect(viewProps.stroke).toBe('red')
  })
})

describe('spread variant: ...fontSize', () => {
  const Comp = styled(Text, {
    name: 'FontSizeSpread',
    variants: {
      textSize: {
        '...fontSize': (val, { font }) => ({
          fontSize: font?.size[val] || val,
        }),
      },
    } as const,
  })

  test('resolves fontSize token', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { textSize: '$1' })
    expect(findRuleValue(rulesToInsert, 'fontSize')).toBe('var(--f-size-1)')
  })
})

describe('spread variant: ...fontStyle', () => {
  const Comp = styled(Text, {
    name: 'FontStyleSpread',
    variants: {
      emphasis: {
        '...fontStyle': (val) => ({
          fontStyle: val,
        }),
      },
    } as const,
  })

  test('does not resolve plain values (not in getVariantDefinition tokenCats)', () => {
    const result = simplifiedGetSplitStyles(Comp, { emphasis: 'italic' })
    expect(result.style).toBeNull()
  })
})

describe('spread variant: ...fontTransform', () => {
  const Comp = styled(Text, {
    name: 'FontTransformSpread',
    variants: {
      casing: {
        '...fontTransform': (val) => ({
          textTransform: val,
        }),
      },
    } as const,
  })

  test('does not resolve plain values (not in getVariantDefinition tokenCats)', () => {
    const result = simplifiedGetSplitStyles(Comp, { casing: 'uppercase' })
    expect(result.style).toBeNull()
  })
})

describe('spread variant: ...letterSpacing', () => {
  const Comp = styled(Text, {
    name: 'LetterSpacingSpread',
    variants: {
      tracking: {
        '...letterSpacing': (val, { font }) => ({
          letterSpacing: font?.letterSpacing[val] || val,
        }),
      },
    } as const,
  })

  test('does not resolve font-level tokens (not in getVariantDefinition tokenCats)', () => {
    const result = simplifiedGetSplitStyles(Comp, { tracking: '$1' })
    expect(result.style).toBeNull()
  })
})

describe('spread variant: ...lineHeight', () => {
  const Comp = styled(Text, {
    name: 'LineHeightSpread',
    variants: {
      leading: {
        '...lineHeight': (val, { font }) => ({
          lineHeight: font?.lineHeight[val] || val,
        }),
      },
    } as const,
  })

  test('does not resolve font-level tokens (not in getVariantDefinition tokenCats)', () => {
    const result = simplifiedGetSplitStyles(Comp, { leading: '$1' })
    expect(result.style).toBeNull()
  })
})

describe('spread variant: ...radius', () => {
  const Comp = styled(View, {
    name: 'RadiusSpread',
    variants: {
      rounding: {
        '...radius': (val) => ({ borderRadius: val }),
      },
    } as const,
  })

  test('resolves radius token to borderRadius', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { rounding: '$4' })
    expect(findRuleValue(rulesToInsert, 'borderTopLeftRadius')).toBe('var(--t-radius-4)')
  })
})

describe('spread variant: ...size', () => {
  const Comp = styled(View, {
    name: 'SizeSpread',
    variants: {
      size: {
        '...size': (val) => ({ height: val, width: val }),
      },
    } as const,
  })

  test('resolves size token to height and width', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { size: '$4' })
    expect(findRuleValue(rulesToInsert, 'height')).toBeDefined()
    expect(findRuleValue(rulesToInsert, 'width')).toBeDefined()
  })

  test('resolves to CSS variables on web', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { size: '$4' })
    expect(findRuleValue(rulesToInsert, 'height')).toBe('var(--t-size-4)')
    expect(findRuleValue(rulesToInsert, 'width')).toBe('var(--t-size-4)')
  })
})

describe('spread variant: ...space', () => {
  const Comp = styled(View, {
    name: 'SpaceSpread',
    variants: {
      spacing: {
        '...space': (val) => ({ padding: val }),
      },
    } as const,
  })

  test('resolves space token to padding', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { spacing: '$4' })
    expect(findRuleValue(rulesToInsert, 'paddingTop')).toBe('var(--t-space-4)')
  })
})

describe('spread variant: ...theme', () => {
  const Comp = styled(View, {
    name: 'ThemeSpread',
    variants: {
      look: {
        '...theme': (val) => ({
          backgroundColor: val,
        }),
      },
    } as const,
  })

  test('does not resolve theme values (not in getVariantDefinition tokenCats)', () => {
    const result = simplifiedGetSplitStyles(
      Comp,
      { look: '$background' },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(result.style).toBeNull()
  })
})

describe('spread variant: ...zIndex', () => {
  const Comp = styled(View, {
    name: 'ZIndexSpread',
    variants: {
      layer: {
        '...zIndex': (val) => ({ zIndex: val }),
      },
    } as const,
  })

  test('resolves zIndex token', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { layer: '$1' })
    expect(findRuleValue(rulesToInsert, 'zIndex')).toBe('var(--t-zIndex-1)')
  })
})

describe('spread variants combined', () => {
  const StyledSvg = styled(
    View,
    {
      name: 'CombinedSpread',
      variants: {
        color: {
          '...color': (val) => ({ stroke: val }),
        },
        size: {
          '...size': (val) => ({ height: val, width: val }),
        },
      } as const,
    },
    { accept: { stroke: 'color', height: 'size', width: 'size' } }
  )

  test('works together with theme values', () => {
    const { viewProps } = simplifiedGetSplitStyles(
      StyledSvg,
      { color: '$color', size: '$4' },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(viewProps.stroke).toBeDefined()
    expect(viewProps.height).toBeDefined()
    expect(viewProps.width).toBeDefined()
  })

  test('works together with token values', () => {
    const { viewProps } = simplifiedGetSplitStyles(StyledSvg, {
      color: '$white',
      size: '$4',
    })
    expect(viewProps.stroke).toBeDefined()
    expect(viewProps.height).toBeDefined()
    expect(viewProps.width).toBeDefined()
  })
})
