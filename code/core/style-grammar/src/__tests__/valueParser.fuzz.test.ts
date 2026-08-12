import { describe, expect, test } from 'vitest'
import { createModifierRegistry, parseValue, type ModifierRegistryView } from '..'

type Random = () => number

function mulberry32(seed: number): Random {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function integer(random: Random, maximum: number): number {
  return Math.floor(random() * maximum)
}

function pick<T>(random: Random, values: readonly T[]): T {
  return values[integer(random, values.length)]
}

function chance(random: Random, probability = 0.5): boolean {
  return random() < probability
}

const registeredModifiers = [
  'hover',
  'press',
  'focus',
  'focus-visible',
  'disabled',
  'sm',
  'md',
  'dark',
  'ios',
  'native',
  'group-hover',
  'group-hover/card',
] as const

const unregisteredModifiers = [
  'hver',
  'tablet',
  'dark_blue',
  'mystery',
  'group-wobble',
] as const

const { registry } = createModifierRegistry({
  mediaNames: ['sm', 'md'],
  themeNames: { dark: {}, dark_blue: {} },
})

const whitespace = (random: Random): string =>
  pick(random, [' ', '  ', '\t', '\t\t', ' \t '])

function ident(random: Random): string {
  const syllables = ['red', 'surface', 'accent', 'custom', 'alpha', 'beta', 'value']
  const count = 1 + integer(random, 3)
  let value = pick(random, syllables)
  for (let index = 1; index < count; index++) {
    value += `-${pick(random, syllables)}`
  }
  return value
}

function numberValue(random: Random): string {
  const sign = chance(random, 0.2) ? '-' : ''
  const whole = integer(random, 200)
  const fraction = chance(random, 0.35) ? `.${integer(random, 100)}` : ''
  const unit = pick(random, ['', 'px', 'rem', 'em', '%', 'vh', 'deg'])
  return `${sign}${whole}${fraction}${unit}`
}

function hexColor(random: Random): string {
  const digits = '0123456789abcdef'
  const length = pick(random, [3, 4, 6, 8])
  let value = '#'
  for (let index = 0; index < length; index++) {
    value += digits[integer(random, digits.length)]
  }
  return value
}

function quotedString(random: Random): string {
  const quote = pick(random, ['"', "'"])
  const escapedQuote = `\\${quote}`
  const content = pick(random, [
    'a:b',
    '{inside};still-inside',
    `escaped ${escapedQuote} quote`,
    'https://example.test/a:b',
    'spaces  and\ttabs',
  ])
  return `${quote}${content}${quote}`
}

function urlValue(random: Random): string {
  const protocol = pick(random, ['http', 'https', 'custom'])
  const suffix = pick(random, [
    'a:b.png',
    'image.svg?q=a:b',
    'path;still-in-parens',
    'nested{brace}.png',
  ])
  return `url(${protocol}://example.test/${suffix})`
}

function escapedIdent(random: Random): string {
  return pick(random, [
    'custom\\:part',
    'safe\\;tail',
    'brace\\{value',
    'end\\}brace',
    'escaped\\ space',
  ])
}

function component(random: Random, depth = 0): string {
  const primitiveCount = 6
  const choice = integer(random, depth < 3 ? primitiveCount + 1 : primitiveCount)
  if (choice === 0) return ident(random)
  if (choice === 1) return numberValue(random)
  if (choice === 2) return hexColor(random)
  if (choice === 3) return quotedString(random)
  if (choice === 4) return urlValue(random)
  if (choice === 5) return escapedIdent(random)

  const name = pick(random, ['calc', 'min', 'color-mix', 'linear-gradient', 'var'])
  const argumentCount = 1 + integer(random, 3)
  const arguments_: string[] = []
  for (let index = 0; index < argumentCount; index++) {
    arguments_.push(component(random, depth + 1))
  }
  return `${name}(${arguments_.join(`,${whitespace(random)}`)})`
}

function componentValue(random: Random): string {
  const count = 1 + integer(random, 3)
  let value = component(random)
  for (let index = 1; index < count; index++) {
    value += whitespace(random) + component(random)
  }
  return value
}

interface ConstructedCase {
  source: string
  base: string | null
  clauses: Array<{ modifiers: string[]; payload: string }>
  unregistered?: string
  invalid?: string
}

function constructCase(
  random: Random,
  mode: 'valid' | 'unregistered' | 'invalid'
): ConstructedCase {
  let base = chance(random, 0.65) ? componentValue(random) : null
  const clauseCount =
    mode === 'unregistered' ? 1 + integer(random, 4) : integer(random, 5)
  const clauses: Array<{ modifiers: string[]; payload: string }> = []
  let unregistered: string | undefined

  for (let clauseIndex = 0; clauseIndex < clauseCount; clauseIndex++) {
    const modifierCount = 1 + integer(random, 3)
    const modifiers: string[] = []
    for (let modifierIndex = 0; modifierIndex < modifierCount; modifierIndex++) {
      modifiers.push(pick(random, registeredModifiers))
    }
    clauses.push({ modifiers, payload: componentValue(random) })
  }

  if (mode === 'unregistered') {
    const clause = clauses[integer(random, clauses.length)]
    const modifierIndex = integer(random, clause.modifiers.length)
    unregistered = pick(random, unregisteredModifiers)
    clause.modifiers[modifierIndex] = unregistered
  }

  let invalid: string | undefined
  if (mode === 'invalid') {
    invalid = pick(random, ['{', '}', ';'])
    if (base !== null && (clauses.length === 0 || chance(random))) {
      base += invalid
    } else if (clauses.length) {
      clauses[integer(random, clauses.length)].payload += invalid
    } else {
      base = `red${invalid}`
    }
  }

  let source = chance(random) ? whitespace(random) : ''
  if (base !== null) source += base
  for (let clauseIndex = 0; clauseIndex < clauses.length; clauseIndex++) {
    const clause = clauses[clauseIndex]
    if (base !== null || source.trim() || clauseIndex > 0) {
      source += whitespace(random)
    }
    source += clause.modifiers.join(':') + ':'
    if (chance(random)) source += whitespace(random)
    source += clause.payload
  }
  if (chance(random)) source += whitespace(random)

  return { source, base, clauses, unregistered, invalid }
}

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

const chaosAlphabet = [
  ...'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789',
  ':',
  '#',
  ';',
  '{',
  '}',
  '(',
  ')',
  '[',
  ']',
  ',',
  "'",
  '"',
  '\\',
  ' ',
  '\t',
  '\n',
  '/',
  '%',
  '.',
  '-',
  '_',
  '=',
  '&',
  '?',
  '!',
  '@',
  '+',
  '*',
  '~',
  '|',
  '^',
  '$',
]

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
