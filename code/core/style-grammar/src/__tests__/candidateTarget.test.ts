import { describe, expect, test } from 'vitest'
import { resolveCandidateTarget } from '..'

const textFamily = {
  xl: [{ property: 'fontSize', value: 20 }],
  'red-500': [{ property: 'color', value: '#fb2c36' }],
} as const

describe('overloaded candidate family targets', () => {
  test('selects the contribution named by the authored prop', () => {
    expect(resolveCandidateTarget('fontSize', 'xl', textFamily.xl)).toEqual({
      ok: true,
      contribution: { property: 'fontSize', value: 20 },
    })
    expect(resolveCandidateTarget('color', 'red-500', textFamily['red-500'])).toEqual({
      ok: true,
      contribution: { property: 'color', value: '#fb2c36' },
    })
  })

  test('reports a mismatch instead of applying another property in the family', () => {
    expect(resolveCandidateTarget('fontSize', 'red-500', textFamily['red-500'])).toEqual({
      ok: false,
      diagnostic: {
        code: 'candidate-property-mismatch',
        candidate: 'red-500',
        property: 'fontSize',
        contributedProperties: ['color'],
        message: '"red-500" contributes to "color", not "fontSize"',
      },
    })
    expect(resolveCandidateTarget('color', 'xl', textFamily.xl)).toEqual({
      ok: false,
      diagnostic: {
        code: 'candidate-property-mismatch',
        candidate: 'xl',
        property: 'color',
        contributedProperties: ['fontSize'],
        message: '"xl" contributes to "fontSize", not "color"',
      },
    })
  })

  test('deduplicates family output and diagnoses an unresolved candidate', () => {
    expect(
      resolveCandidateTarget('borderColor', 'mixed', [
        { property: 'borderWidth', value: 1 },
        { property: 'borderWidth', value: 2 },
      ])
    ).toMatchObject({
      ok: false,
      diagnostic: {
        contributedProperties: ['borderWidth'],
      },
    })
    expect(resolveCandidateTarget('fontSize', 'missing', [])).toMatchObject({
      ok: false,
      diagnostic: {
        contributedProperties: [],
        message: '"missing" does not contribute to "fontSize"',
      },
    })
  })
})
