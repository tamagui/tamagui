import { describe, expect, test } from 'vitest'
import { modifierAliases, programClassName } from '..'

describe('alias spellings are one hash identity', () => {
  // class-level: EVERY registered alias must hash identically to its
  // canonical spelling, in simple, chained, and group-embedded positions —
  // two spellings lowering to identical rule text under different hashes
  // would mint duplicate rules
  test('every alias hashes like its canonical form', () => {
    for (const alias in modifierAliases) {
      const canonical = modifierAliases[alias]
      const value = (modifier: string) => ({
        base: 'red',
        clauses: [{ modifiers: [modifier], payload: 'blue' }],
      })
      expect(
        programClassName('backgroundColor', value(alias), 'r1'),
        alias
      ).toBe(programClassName('backgroundColor', value(canonical), 'r1'))

      const chained = (modifier: string) => ({
        base: null,
        clauses: [{ modifiers: ['dark', modifier], payload: 'blue' }],
      })
      expect(
        programClassName('backgroundColor', chained(alias), 'r1'),
        `dark:${alias}`
      ).toBe(programClassName('backgroundColor', chained(canonical), 'r1'))

      const grouped = (modifier: string) => ({
        base: null,
        clauses: [{ modifiers: [`group-${modifier}/card`], payload: 'blue' }],
      })
      expect(
        programClassName('backgroundColor', grouped(alias), 'r1'),
        `group-${alias}/card`
      ).toBe(programClassName('backgroundColor', grouped(canonical), 'r1'))
    }
    // and distinct conditions stay distinct
    expect(
      programClassName(
        'backgroundColor',
        { base: null, clauses: [{ modifiers: ['press'], payload: 'blue' }] },
        'r1'
      )
    ).not.toBe(
      programClassName(
        'backgroundColor',
        { base: null, clauses: [{ modifiers: ['hover'], payload: 'blue' }] },
        'r1'
      )
    )
  })
})
