import { describe, expect, test } from 'vitest'
import { modifierAliases, parseGroupModifier, programClassName } from '../tooling'

describe('alias spellings are one hash identity', () => {
  // class-level: every registered alias must hash identically to its canonical
  // spelling in each position where that alias is registered. Two spellings
  // lowering to identical rule text under different hashes would mint duplicate
  // rules.
  test('every alias hashes like its canonical form', () => {
    for (const alias in modifierAliases) {
      const canonical = modifierAliases[alias]
      const value = (modifier: string) => ({
        base: 'red',
        clauses: [{ modifiers: [modifier], payload: 'blue' }],
      })
      expect(programClassName('backgroundColor', value(alias), 'r1'), alias).toBe(
        programClassName('backgroundColor', value(canonical), 'r1')
      )

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
      const group = parseGroupModifier(`group-${alias}/card`)
      if (canonical === 'enter' || canonical === 'exit') {
        expect(group, `group-${alias}/card`).toBeNull()
      } else {
        expect(group, `group-${alias}/card`).not.toBeNull()
        expect(
          programClassName('backgroundColor', grouped(alias), 'r1'),
          `group-${alias}/card`
        ).toBe(programClassName('backgroundColor', grouped(canonical), 'r1'))
      }
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

  test('reordered and duplicate modifiers share their clause identity', () => {
    const value = (modifiers: string[]) => ({
      base: null,
      clauses: [{ modifiers, payload: 'blue' }],
    })
    const canonical = programClassName('backgroundColor', value(['dark', 'hover']), 'r1')
    expect(programClassName('backgroundColor', value(['hover', 'dark']), 'r1')).toBe(
      canonical
    )
    expect(
      programClassName('backgroundColor', value(['dark', 'hover', 'hover']), 'r1')
    ).toBe(canonical)
  })
})
