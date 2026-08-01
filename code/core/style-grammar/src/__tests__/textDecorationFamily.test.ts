import { describe, expect, test } from 'vitest'
import {
  createModifierRegistry,
  parseValue,
  splitBorderValue,
  splitFontValue,
  splitTextDecorationValue,
} from '..'

const { registry } = createModifierRegistry({
  mediaNames: ['sm'],
  themeNames: { light: {}, dark: {} },
})

const colorTokens = new Set(['accent'])

function parsed(input: string) {
  const result = parseValue(input, registry)
  if (!result.ok) {
    throw new Error(`test input failed to parse: ${JSON.stringify(result.errors)}`)
  }
  return result.value
}

describe('text-decoration family', () => {
  test('splits line, style and color into per-longhand programs', () => {
    const split = splitTextDecorationValue(parsed('underline dotted accent'), colorTokens)
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      {
        property: 'textDecorationLine',
        value: { base: 'underline', clauses: [] },
      },
      {
        property: 'textDecorationStyle',
        value: { base: 'dotted', clauses: [] },
      },
      {
        property: 'textDecorationColor',
        value: { base: 'accent', clauses: [] },
      },
    ])
  })

  test('multiple line keywords accumulate into one list payload', () => {
    const split = splitTextDecorationValue(parsed('underline overline'), colorTokens)
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      {
        property: 'textDecorationLine',
        value: { base: 'underline overline', clauses: [] },
      },
    ])
  })

  test('clauses split per kind at their authored modifiers', () => {
    const split = splitTextDecorationValue(parsed('underline hover:none'), colorTokens)
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      {
        property: 'textDecorationLine',
        value: {
          base: 'underline',
          clauses: [{ modifiers: ['hover'], payload: 'none' }],
        },
      },
    ])
  })

  test('a thickness length errors so the whole value stays legacy', () => {
    const split = splitTextDecorationValue(parsed('underline 2px'), colorTokens)
    expect(split.errors).toEqual([
      { code: 'unsupported-text-decoration-component', component: '2px', where: 'base' },
    ])
  })
})

describe('logical border shorthands', () => {
  test('borderBlock splits into logical start/end longhands', () => {
    const split = splitBorderValue('borderBlock', parsed('1px solid accent'), colorTokens)
    expect(split.errors).toEqual([])
    expect(split.entries.map((entry) => entry.property)).toEqual([
      'borderBlockStartWidth',
      'borderBlockEndWidth',
      'borderBlockStartStyle',
      'borderBlockEndStyle',
      'borderBlockStartColor',
      'borderBlockEndColor',
    ])
  })

  test('borderInline splits into logical start/end longhands', () => {
    const split = splitBorderValue(
      'borderInline',
      parsed('2px dashed accent'),
      colorTokens
    )
    expect(split.errors).toEqual([])
    expect(split.entries.map((entry) => entry.property)).toEqual([
      'borderInlineStartWidth',
      'borderInlineEndWidth',
      'borderInlineStartStyle',
      'borderInlineEndStyle',
      'borderInlineStartColor',
      'borderInlineEndColor',
    ])
  })
})

describe('font shorthand', () => {
  const parsedFont = (input: string) => parsed(input)

  test('splits style, weight, size, line-height and family', () => {
    const split = splitFontValue(parsedFont('italic bold 16px/1.4 Arial, sans-serif'))
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      { property: 'fontStyle', value: { base: 'italic', clauses: [] } },
      { property: 'fontWeight', value: { base: 'bold', clauses: [] } },
      { property: 'fontSize', value: { base: '16px', clauses: [] } },
      { property: 'lineHeight', value: { base: '1.4', clauses: [] } },
      { property: 'fontFamily', value: { base: 'Arial, sans-serif', clauses: [] } },
    ])
  })

  test('size and family alone split without the optional heads', () => {
    const split = splitFontValue(parsedFont('14px serif'))
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      { property: 'fontSize', value: { base: '14px', clauses: [] } },
      { property: 'fontFamily', value: { base: 'serif', clauses: [] } },
    ])
  })

  test('legacy size and family sigils split before payload resolution', () => {
    const split = splitFontValue(parsedFont('$4 $body hover:$6 $heading'))
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      {
        property: 'fontSize',
        value: {
          base: '$4',
          clauses: [{ modifiers: ['hover'], payload: '$6' }],
        },
      },
      {
        property: 'fontFamily',
        value: {
          base: '$body',
          clauses: [{ modifiers: ['hover'], payload: '$heading' }],
        },
      },
    ])
  })

  test('quoted family names survive verbatim', () => {
    const split = splitFontValue(parsedFont('12px "Helvetica Neue", serif'))
    expect(split.errors).toEqual([])
    expect(split.entries).toEqual([
      { property: 'fontSize', value: { base: '12px', clauses: [] } },
      {
        property: 'fontFamily',
        value: { base: '"Helvetica Neue", serif', clauses: [] },
      },
    ])
  })

  test('ambiguous and system keywords error so the value stays legacy', () => {
    expect(splitFontValue(parsedFont('normal 12px serif')).errors).toEqual([
      { code: 'unsupported-font-component', component: 'normal', where: 'base' },
    ])
    expect(
      splitFontValue(parsedFont('caption')).errors.map((error) => error.code)
    ).toContain('unsupported-font-component')
  })
})
