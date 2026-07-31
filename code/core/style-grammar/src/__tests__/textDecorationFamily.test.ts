import { describe, expect, test } from 'vitest'
import {
  createModifierRegistry,
  parseValue,
  splitBorderValue,
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
