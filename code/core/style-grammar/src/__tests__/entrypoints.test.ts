import { describe, expect, test } from 'vitest'
import { grammarTable, migrateLegacyTransition, parseCandidate } from '../tooling'

describe('package entry points', () => {
  test('tooling exposes candidate parsing', () => {
    expect(
      parseCandidate('sm:p-4', {
        mediaNames: ['sm'],
        tokenNames: { space: ['4'] },
      })
    ).toMatchObject({
      modifiers: ['sm'],
      rawValue: '4',
      entry: { prop: 'padding', tokenCategory: 'space' },
    })
  })

  test('tooling exposes documentation and migration helpers', () => {
    expect(grammarTable).toContain('| `p-<value>` |')
    expect(migrateLegacyTransition('quick', new Set(['quick']))).toMatchObject({
      ok: true,
      value: {
        entries: [{ timing: { type: 'preset', name: 'quick' } }],
      },
    })
  })
})
