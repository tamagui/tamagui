import { describe, expect, test } from 'vitest'
import { createModifierRegistry, parseValue, type ModifierRegistryView } from '../tooling'
import { chaosAlphabet, constructCase, integer, mulberry32, pick } from './valueCorpus'

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { dark: {}, dark_blue: {} },
})

describe('deterministic constructed value fuzzing', () => {
  test('matches known splits and reports planted errors across 2,000 cases', () => {
    const random = mulberry32(0x5eedc0de)

    for (let caseIndex = 0; caseIndex < 2_000; caseIndex++) {
      const mode =
        caseIndex % 4 === 0 ? 'unregistered' : caseIndex % 4 === 1 ? 'invalid' : 'valid'
      const fuzzCase = constructCase(random, mode)
      const result = parseValue(fuzzCase.source, registry)
      const label = `case ${caseIndex}: ${JSON.stringify(fuzzCase.source)}`

      if (mode === 'valid') {
        expect(result.ok, label).toBe(true)
        if (result.ok) {
          expect(result.value, label).toEqual({
            base: fuzzCase.base,
            clauses: fuzzCase.clauses,
          })
        }
      } else if (mode === 'unregistered') {
        expect(result.ok, label).toBe(false)
        if (!result.ok) {
          expect(
            result.errors.some(
              (error) =>
                error.code === 'unregistered-modifier' &&
                error.modifier === fuzzCase.unregistered
            ),
            label
          ).toBe(true)
        }
      } else {
        expect(result.ok, label).toBe(false)
        if (!result.ok) {
          expect(
            result.errors.some((error) => error.code === 'invalid-character'),
            label
          ).toBe(true)
        }
      }
    }
  })
})

function assertStructuredResult(input: string, registry: ModifierRegistryView): void {
  const result = parseValue(input, registry)
  if (result.ok) {
    expect(result.value.base === null || typeof result.value.base === 'string').toBe(true)
    for (const clause of result.value.clauses) {
      expect(clause.payload.length, JSON.stringify(input)).toBeGreaterThan(0)
      for (const modifier of clause.modifiers) {
        expect(modifier.length, JSON.stringify(input)).toBeGreaterThan(0)
      }
    }
  } else {
    expect(result.errors.length, JSON.stringify(input)).toBeGreaterThan(0)
    for (const error of result.errors) {
      expect(typeof error.code).toBe('string')
      expect(Number.isInteger(error.index)).toBe(true)
      expect(error.index).toBeGreaterThanOrEqual(0)
      expect(error.index).toBeLessThanOrEqual(input.length)
      expect(typeof error.message).toBe('string')
      expect(error.message.length).toBeGreaterThan(0)
      if (error.modifier !== undefined) {
        expect(error.modifier.length).toBeGreaterThan(0)
      }
    }
  }
}

describe('deterministic parser chaos fuzzing', () => {
  test('never throws or returns malformed output across 2,000 strings', () => {
    const random = mulberry32(0xc0ffee42)

    for (let caseIndex = 0; caseIndex < 2_000; caseIndex++) {
      const length = integer(random, 81)
      let input = ''
      for (let index = 0; index < length; index++) {
        input += pick(random, chaosAlphabet)
      }
      expect(
        () => assertStructuredResult(input, registry),
        `case ${caseIndex}: ${JSON.stringify(input)}`
      ).not.toThrow()
    }
  })
})
