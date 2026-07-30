import { describe, expect, test } from 'vitest'
import {
  expandToLonghands,
  longhandExpansionTable,
  mergePrograms,
  type ParsedValue,
} from '..'

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
    expect(programs.get('backgroundColor')).toEqual({
      property: 'backgroundColor',
      value: color,
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

  test('replacement drops the earlier program and all of its clauses', () => {
    const earlier = value('red', [
      { modifiers: ['hover'], payload: 'green' },
      { modifiers: ['dark'], payload: 'gray' },
    ])
    const replacement = value('blue')

    const program = mergePrograms([
      { prop: 'backgroundColor', value: earlier },
      { prop: 'backgroundColor', value: replacement },
    ]).get('backgroundColor')

    expect(program?.value).toBe(replacement)
    expect(program?.value.clauses).toEqual([])
    expect(program?.value).not.toBe(earlier)
  })
})
