import { describe, expect, test } from 'vitest'
import { splitBorderValue, type ParsedValue } from '..'

const colorTokens = new Set(['primary', 'color5'])

const value = (
  base: string | null,
  clauses: ParsedValue['clauses'] = []
): ParsedValue => ({
  base,
  clauses,
})

describe('the border family', () => {
  test('a full border value splits into width, style, and color per side', () => {
    const { entries, errors } = splitBorderValue(
      'border',
      value('2px solid green'),
      colorTokens
    )
    expect(errors).toEqual([])
    expect(entries.map((entry) => entry.property)).toEqual([
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'borderTopStyle',
      'borderRightStyle',
      'borderBottomStyle',
      'borderLeftStyle',
      'borderTopColor',
      'borderRightColor',
      'borderBottomColor',
      'borderLeftColor',
    ])
    expect(entries[0].value).toEqual({ base: '2px', clauses: [] })
    expect(entries[4].value).toEqual({ base: 'solid', clauses: [] })
    expect(entries[8].value).toEqual({ base: 'green', clauses: [] })
  })

  test('component order is free and missing components emit no program', () => {
    const { entries, errors } = splitBorderValue('border', value('dashed 1'), colorTokens)
    expect(errors).toEqual([])
    // bare numbers are the RN spelling of a width
    expect(entries.map((entry) => entry.property)).toEqual([
      'borderTopWidth',
      'borderRightWidth',
      'borderBottomWidth',
      'borderLeftWidth',
      'borderTopStyle',
      'borderRightStyle',
      'borderBottomStyle',
      'borderLeftStyle',
    ])
  })

  test('clauses split by component kind onto their own programs', () => {
    // border="1px solid gray hover:blue sm:2px"
    const { entries, errors } = splitBorderValue(
      'border',
      value('1px solid gray', [
        { modifiers: ['hover'], payload: 'blue' },
        { modifiers: ['sm'], payload: '2px' },
      ]),
      colorTokens
    )
    expect(errors).toEqual([])
    const byProp = Object.fromEntries(entries.map((e) => [e.property, e.value]))
    expect(byProp.borderTopWidth).toEqual({
      base: '1px',
      clauses: [{ modifiers: ['sm'], payload: '2px' }],
    })
    expect(byProp.borderTopColor).toEqual({
      base: 'gray',
      clauses: [{ modifiers: ['hover'], payload: 'blue' }],
    })
    expect(byProp.borderTopStyle).toEqual({ base: 'solid', clauses: [] })
  })

  test('per-side props target only their side; color tokens classify', () => {
    const { entries, errors } = splitBorderValue(
      'borderTop',
      value('thin dotted primary'),
      colorTokens
    )
    expect(errors).toEqual([])
    expect(entries.map((e) => e.property)).toEqual([
      'borderTopWidth',
      'borderTopStyle',
      'borderTopColor',
    ])
    expect(entries[2].value.base).toBe('primary')
  })

  test('outline splits to outline longhands and allows auto', () => {
    const { entries, errors } = splitBorderValue(
      'outline',
      value('2px auto currentColor'),
      colorTokens
    )
    expect(errors).toEqual([])
    expect(entries.map((e) => e.property)).toEqual([
      'outlineWidth',
      'outlineStyle',
      'outlineColor',
    ])
  })

  test('an unclassifiable or duplicate component is an error', () => {
    const unknown = splitBorderValue('border', value('2px wavy-nonsense'), colorTokens)
    expect(unknown.errors[0]?.code).toBe('unsupported-border-component')

    const duplicate = splitBorderValue('border', value('solid dotted'), colorTokens)
    expect(duplicate.errors[0]?.code).toBe('unsupported-border-component')
  })
})
