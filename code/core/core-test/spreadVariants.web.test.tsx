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
import { getStyleValue, simplifiedGetSplitStyles } from './utils'

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

describe('FontSize variant resolver', () => {
  const Comp = styled(Text, {
    displayName: 'FontSizeSpread',
    variants: {
      textSize: styled.dynamic<any>((val, { font }) => ({
        fontSize: font?.size[val] || val,
      })),
    } as const,
  })

  test('resolves fontSize token', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { textSize: '1' })
    expect(findRuleValue(rulesToInsert, 'fontSize')).toBe('var(--f-size-1)')
  })
})

describe('FontStyle variant resolver', () => {
  const Comp = styled(Text, {
    displayName: 'FontStyleSpread',
    variants: {
      emphasis: styled.dynamic<any>((val) => ({
        fontStyle: val,
      })),
    } as const,
  })

  test('resolves plain font style values', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { emphasis: 'italic' })
    expect(findRuleValue(rulesToInsert, 'fontStyle')).toBe('italic')
  })
})

describe('FontTransform variant resolver', () => {
  const Comp = styled(Text, {
    displayName: 'FontTransformSpread',
    variants: {
      casing: styled.dynamic<any>((val) => ({
        textTransform: val,
      })),
    } as const,
  })

  test('resolves plain text transform values', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { casing: 'uppercase' })
    expect(findRuleValue(rulesToInsert, 'textTransform')).toBe('uppercase')
  })
})

describe('FontLetterSpacing variant resolver', () => {
  const Comp = styled(Text, {
    displayName: 'LetterSpacingSpread',
    variants: {
      tracking: styled.dynamic<any>((val, { font }) => ({
        letterSpacing: font?.letterSpacing[val] || val,
      })),
    } as const,
  })

  test('resolves font letter-spacing tokens', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { tracking: '1' })
    expect(findRuleValue(rulesToInsert, 'letterSpacing')).toBe('var(--f-letterSpacing-1)')
  })
})

describe('FontLineHeight variant resolver', () => {
  const Comp = styled(Text, {
    displayName: 'LineHeightSpread',
    variants: {
      leading: styled.dynamic<any>((val, { font }) => ({
        lineHeight: font?.lineHeight[val] || val,
      })),
    } as const,
  })

  test('resolves font line-height tokens', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { leading: '1' })
    expect(findRuleValue(rulesToInsert, 'lineHeight')).toBe('var(--f-lineHeight-1)')
  })
})

describe('Radius variant resolver', () => {
  const Comp = styled(View, {
    displayName: 'RadiusSpread',
    variants: {
      rounding: styled.dynamic<any>((val) => ({ borderRadius: val })),
    } as const,
  })

  test('resolves radius token to borderRadius', () => {
    const result = simplifiedGetSplitStyles(Comp, { rounding: '4' })
    expect(getStyleValue(result, 'borderRadius')).toBe('var(--t-radius-4)')
  })
})

describe('Size variant resolver', () => {
  const Comp = styled(View, {
    displayName: 'SizeSpread',
    variants: {
      size: styled.dynamic<any>((val) => ({ height: val, width: val })),
    } as const,
  })

  test('resolves size token to height and width', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { size: '4' })
    expect(findRuleValue(rulesToInsert, 'height')).toBeDefined()
    expect(findRuleValue(rulesToInsert, 'width')).toBeDefined()
  })

  test('resolves to CSS variables on web', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { size: '4' })
    expect(findRuleValue(rulesToInsert, 'height')).toBe('var(--t-size-4)')
    expect(findRuleValue(rulesToInsert, 'width')).toBe('var(--t-size-4)')
  })
})

describe('Space variant resolver', () => {
  const Comp = styled(View, {
    displayName: 'SpaceSpread',
    variants: {
      spacing: styled.dynamic<any>((val) => ({ padding: val })),
    } as const,
  })

  test('resolves space token to padding', () => {
    const result = simplifiedGetSplitStyles(Comp, { spacing: '4' })
    expect(getStyleValue(result, 'padding')).toBe('var(--t-space-4)')
  })
})

describe('Theme variant resolver', () => {
  const Comp = styled(View, {
    displayName: 'ThemeSpread',
    variants: {
      look: styled.dynamic<any>((val) => ({
        backgroundColor: val,
      })),
    } as const,
  })

  test('resolves theme values', () => {
    const result = simplifiedGetSplitStyles(
      Comp,
      { look: 'background' },
      { theme: lightTheme, themeName: 'light' }
    )
    expect(getStyleValue(result, 'backgroundColor')).toBe('var(--background)')
  })
})

describe('ZIndex variant resolver', () => {
  const Comp = styled(View, {
    displayName: 'ZIndexSpread',
    variants: {
      layer: styled.dynamic<any>((val) => ({ zIndex: val })),
    } as const,
  })

  test('resolves overlapping zIndex token names', () => {
    const { rulesToInsert } = simplifiedGetSplitStyles(Comp, { layer: '1' })
    expect(findRuleValue(rulesToInsert, 'zIndex')).toBe('var(--t-zIndex-1)')
  })
})
