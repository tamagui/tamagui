import { describe, expect, test } from 'vitest'
import {
  expandToLonghands,
  longhandExpansionTable,
  mergeProgramValues,
  mergePrograms,
  type ParsedValue,
} from '../tooling'

const value = (base: string, clauses: ParsedValue['clauses'] = []): ParsedValue => ({
  base,
  clauses,
})

describe('per-longhand programs', () => {
  test('a later backgroundColor replaces only the pre-split color program', () => {
    const bgColor = value('surface', [{ modifiers: ['hover'], payload: 'surface-hover' }])
    const bgImage = value('url(x.png)')
    const color = value('red')

    const programs = mergePrograms([
      { prop: 'backgroundColor', value: bgColor },
      { prop: 'backgroundImage', value: bgImage },
      { prop: 'backgroundColor', value: color },
    ])

    expect([...programs.keys()]).toEqual(['backgroundImage', 'backgroundColor'])
    // the later base replaces the base clause; the hover clause survives
    expect(programs.get('backgroundColor')).toEqual({
      property: 'backgroundColor',
      value: { base: 'red', clauses: bgColor.clauses },
      sourceProp: 'backgroundColor',
    })
    expect(programs.get('backgroundImage')).toEqual({
      property: 'backgroundImage',
      value: bgImage,
      sourceProp: 'backgroundImage',
    })
  })

  test('paddingTop overrides only the top program from padding', () => {
    const padding = value('4')
    const top = value('2')

    const programs = mergePrograms([
      { prop: 'padding', value: padding },
      { prop: 'paddingTop', value: top },
    ])

    expect(programs.get('paddingTop')?.value).toBe(top)
    expect(programs.get('paddingRight')?.value).toBe(padding)
    expect(programs.get('paddingBottom')?.value).toBe(padding)
    expect(programs.get('paddingLeft')?.value).toBe(padding)
  })

  test('a later shorthand re-expands over an earlier longhand', () => {
    const top = value('2')
    const padding = value('4')

    const programs = mergePrograms([
      { prop: 'paddingTop', value: top },
      { prop: 'padding', value: padding },
    ])

    expect([...programs.keys()]).toEqual([
      'paddingTop',
      'paddingRight',
      'paddingBottom',
      'paddingLeft',
    ])
    expect(programs.get('paddingTop')).toEqual({
      property: 'paddingTop',
      value: padding,
      sourceProp: 'padding',
    })
  })

  test('resolves config shorthands before family expansion', () => {
    expect(expandToLonghands('p', { p: 'padding' })).toEqual(
      longhandExpansionTable.padding
    )

    const padding = value('4')
    const programs = mergePrograms([{ prop: 'p', value: padding }], {
      p: 'padding',
    })
    expect(programs.get('paddingLeft')?.sourceProp).toBe('p')
  })

  test('a prop with no family entry expands to itself', () => {
    expect(expandToLonghands('opacity')).toEqual(['opacity'])

    const opacity = value('0.5')
    expect(mergePrograms([{ prop: 'opacity', value: opacity }]).get('opacity')).toEqual({
      property: 'opacity',
      value: opacity,
      sourceProp: 'opacity',
    })
  })

  test('Map order follows the final authored order of winners', () => {
    const programs = mergePrograms([
      { prop: 'padding', value: value('4') },
      { prop: 'opacity', value: value('0.5') },
      { prop: 'paddingRight', value: value('2') },
      { prop: 'paddingTop', value: value('1') },
    ])

    expect([...programs.keys()]).toEqual([
      'paddingBottom',
      'paddingLeft',
      'opacity',
      'paddingRight',
      'paddingTop',
    ])
  })

  test('a later base replaces only the base clause; conditions survive (decision 21)', () => {
    const earlier = value('red', [
      { modifiers: ['hover'], payload: 'green' },
      { modifiers: ['dark'], payload: 'gray' },
    ])
    const replacement = value('blue')

    const program = mergePrograms([
      { prop: 'backgroundColor', value: earlier },
      { prop: 'backgroundColor', value: replacement },
    ]).get('backgroundColor')

    expect(program?.value.base).toBe('blue')
    expect(program?.value.clauses).toEqual(earlier.clauses)
  })

  test('a restated condition set replaces its clause and appends after survivors', () => {
    const earlier = value('red', [
      { modifiers: ['dark'], payload: 'gray' },
      { modifiers: ['hover'], payload: 'green' },
    ])
    const later: ParsedValue = {
      base: null,
      clauses: [{ modifiers: ['dark'], payload: 'black' }],
    }

    const program = mergePrograms([
      { prop: 'backgroundColor', value: earlier },
      { prop: 'backgroundColor', value: later },
    ]).get('backgroundColor')

    expect(program?.value.base).toBe('red')
    // dark was restated: its old clause is gone, the new one appends LAST so
    // it beats the surviving hover when both match
    expect(program?.value.clauses).toEqual([
      { modifiers: ['hover'], payload: 'green' },
      { modifiers: ['dark'], payload: 'black' },
    ])
  })

  test('state aliases restate the same normalized clause slot', () => {
    expect(
      mergeProgramValues(
        value('rest', [{ modifiers: ['active'], payload: 'old' }]),
        value('', [{ modifiers: ['press'], payload: 'new' }])
      ).clauses
    ).toEqual([{ modifiers: ['press'], payload: 'new' }])
  })

  test('condition-set equality is order-insensitive', () => {
    const earlier = value('red', [{ modifiers: ['dark', 'hover'], payload: 'green' }])
    const later: ParsedValue = {
      base: null,
      clauses: [{ modifiers: ['hover', 'dark'], payload: 'blue' }],
    }

    const program = mergePrograms([
      { prop: 'backgroundColor', value: earlier },
      { prop: 'backgroundColor', value: later },
    ]).get('backgroundColor')

    expect(program?.value.clauses).toEqual([
      { modifiers: ['hover', 'dark'], payload: 'blue' },
    ])
  })

  test('merging never mutates its inputs — program values may alias the parse cache', () => {
    const earlier: ParsedValue = {
      base: 'red',
      clauses: [
        { modifiers: ['dark', 'hover'], payload: 'a' },
        { modifiers: ['sm'], payload: 'b' },
      ],
    }
    const later: ParsedValue = {
      base: 'blue',
      clauses: [{ modifiers: ['hover', 'dark'], payload: 'c' }],
    }
    const earlierSnapshot = JSON.parse(JSON.stringify(earlier))
    const laterSnapshot = JSON.parse(JSON.stringify(later))

    mergeProgramValues(earlier, later)

    // the load-bearing invariant: inputs are never mutated, including the
    // modifiers arrays clauseSetKey sorts (it must sort a copy)
    expect(earlier).toEqual(earlierSnapshot)
    expect(later).toEqual(laterSnapshot)
    expect(earlier.clauses[0].modifiers).toEqual(['dark', 'hover'])
    expect(later.clauses[0].modifiers).toEqual(['hover', 'dark'])
  })
})
