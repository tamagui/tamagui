import { describe, expect, test } from 'vitest'

import { formatParsedValue, mergeFlatValues } from '../mergeFlatValues'
import { parseValue } from '../valueParser'
import type { ModifierRegistryView } from '../valueTypes'

const registry: ModifierRegistryView = { get: () => 'state' }
const parse = (input: string) => {
  const res = parseValue(input, registry)
  if (!res.ok) throw new Error(`could not parse ${input}`)
  return res.value
}

describe('mergeFlatValues', () => {
  test('a later base does not erase an earlier clause', () => {
    // the ButtonUnstyled case: a styled child restating borderColor kept losing
    // the parent variant's press state entirely
    expect(mergeFlatValues('hover:transparent press:transparent', 'green')).toBe(
      'green hover:transparent press:transparent'
    )
  })

  test('a later clause replaces the earlier clause with the same condition', () => {
    expect(mergeFlatValues('red hover:blue', 'hover:green')).toBe('red hover:green')
  })

  test('clauses with different conditions both survive', () => {
    expect(mergeFlatValues('red hover:blue', 'press:green')).toBe(
      'red hover:blue press:green'
    )
  })

  test('a later base replaces an earlier base', () => {
    expect(mergeFlatValues('red hover:blue', 'green')).toBe('green hover:blue')
  })

  test('condition order within a clause does not defeat the match', () => {
    // the merge is keyed by the condition SET, not its spelling order
    expect(mergeFlatValues('a:b:red', 'b:a:green')).toBe('b:a:green')
  })

  test('values with no clauses take the cheap path and the later one wins', () => {
    expect(mergeFlatValues('red', 'green')).toBe('green')
    expect(mergeFlatValues('10px', '20px')).toBe('20px')
  })

  test('non-strings are left to the caller, later wins', () => {
    expect(mergeFlatValues(1, 2)).toBe(2)
    expect(mergeFlatValues('red', 4)).toBe(4)
    expect(mergeFlatValues(undefined, 'red')).toBe('red')
  })

  test('a colon inside a function or string is not a clause', () => {
    expect(mergeFlatValues('url(http://a/b.png)', 'url(http://c/d.png)')).toBe(
      'url(http://c/d.png)'
    )
  })

  test('an unparseable value falls back to the later one rather than throwing', () => {
    // an unterminated function is a parse error, not a merge input
    expect(mergeFlatValues('rgb(1,2,3', 'red')).toBe('red')
    expect(mergeFlatValues('red hover:blue', 'rgb(1,2,3')).toBe('rgb(1,2,3')
  })
})

describe('formatParsedValue', () => {
  test('round-trips a clause-bearing value', () => {
    const input = 'green hover:transparent press:transparent'
    expect(formatParsedValue(parse(input))).toBe(input)
  })

  test('prints a value that is only clauses', () => {
    expect(formatParsedValue(parse('hover:red'))).toBe('hover:red')
  })
})
