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

describe('Color variant resolver (#3892)', () => {
  const StyledSvg = styled(
    View,
    {
      name: 'ColorSpread',
      variants: {
        color: {
          Color: (val) => ({ stroke: val }),
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
            Color: (val) => ({ stroke: val }),
          },
        } as const,
      },
      { accept: { stroke: 'color' } }
    )
    const { viewProps } = simplifiedGetSplitStyles(Comp, { color: 'red' })
    expect(viewProps.stroke).toBe('red')
  })
})

describe('FontSize variant resolver', () => {
  const Comp = styled(Text, {
    name: 'FontSizeSpread',
    variants: {
      textSize: {
        FontSize: (val, { font }) => ({
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

describe('FontStyle variant resolver', () => {
  const Comp = styled(Text, {
    name: 'FontStyleSpread',
    variants: {
      emphasis: {
        FontStyle: (val) => ({
          fontStyle: val,
        }),
      },
    } as const,
  })

  test('resolves plain font style values', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { emphasis: 'italic' })
    expect(findRuleValue(rulesToInsert, 'fontStyle')).toBe('italic')
  })
})

describe('FontTransform variant resolver', () => {
  const Comp = styled(Text, {
    name: 'FontTransformSpread',
    variants: {
      casing: {
        FontTransform: (val) => ({
          textTransform: val,
        }),
      },
    } as const,
  })

  test('resolves plain text transform values', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { casing: 'uppercase' })
    expect(findRuleValue(rulesToInsert, 'textTransform')).toBe('uppercase')
  })
})

describe('FontLetterSpacing variant resolver', () => {
  const Comp = styled(Text, {
    name: 'LetterSpacingSpread',
    variants: {
      tracking: {
        FontLetterSpacing: (val, { font }) => ({
          letterSpacing: font?.letterSpacing[val] || val,
        }),
      },
    } as const,
  })

  test('resolves font letter-spacing tokens', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { tracking: '$1' })
    expect(findRuleValue(rulesToInsert, 'letterSpacing')).toBe('var(--f-letterSpacing-1)')
  })
})

describe('FontLineHeight variant resolver', () => {
  const Comp = styled(Text, {
    name: 'LineHeightSpread',
    variants: {
      leading: {
        FontLineHeight: (val, { font }) => ({
          lineHeight: font?.lineHeight[val] || val,
        }),
      },
    } as const,
  })

  test('resolves font line-height tokens', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { leading: '$1' })
    expect(findRuleValue(rulesToInsert, 'lineHeight')).toBe('var(--f-lineHeight-1)')
  })
})

describe('Radius variant resolver', () => {
  const Comp = styled(View, {
    name: 'RadiusSpread',
    variants: {
      rounding: {
        Radius: (val) => ({ borderRadius: val }),
      },
    } as const,
  })

  test('resolves radius token to borderRadius', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { rounding: '$4' })
    expect(findRuleValue(rulesToInsert, 'borderTopLeftRadius')).toBe('var(--t-radius-4)')
  })
})

describe('Size variant resolver', () => {
  const Comp = styled(View, {
    name: 'SizeSpread',
    variants: {
      size: {
        Size: (val) => ({ height: val, width: val }),
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

describe('Space variant resolver', () => {
  const Comp = styled(View, {
    name: 'SpaceSpread',
    variants: {
      spacing: {
        Space: (val) => ({ padding: val }),
      },
    } as const,
  })

  test('resolves space token to padding', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { spacing: '$4' })
    expect(findRuleValue(rulesToInsert, 'paddingTop')).toBe('var(--t-space-4)')
  })
})

describe('Theme variant resolver', () => {
  const Comp = styled(View, {
    name: 'ThemeSpread',
    variants: {
      look: {
        Theme: (val) => ({
          backgroundColor: val,
        }),
      },
    } as const,
  })

  test('resolves theme values', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(
      Comp,
      { look: '$background' },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(findRuleValue(rulesToInsert, 'backgroundColor')).toBe('var(--background)')
  })
})

describe('ZIndex variant resolver', () => {
  const Comp = styled(View, {
    name: 'ZIndexSpread',
    variants: {
      layer: {
        ZIndex: (val) => ({ zIndex: val }),
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
          Color: (val) => ({ stroke: val }),
        },
        size: {
          Size: (val) => ({ height: val, width: val }),
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
