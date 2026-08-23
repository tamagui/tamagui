import { describe, expect, test } from 'vitest'

import { mergeFlatValues } from '../mergeFlatValues'
import { formatParsedValue } from '../toolingFormat'
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

  test('aliases and duplicate modifiers share their canonical slot', () => {
    expect(mergeFlatValues('red active:blue', 'press:green')).toBe('red press:green')
    expect(mergeFlatValues('red hover:hover:blue', 'hover:green')).toBe('red hover:green')
  })

  test('named and unnamed group aliases preserve the later spelling', () => {
    expect(mergeFlatValues('group-active:red', 'group-press:blue')).toBe(
      'group-press:blue'
    )
    expect(
      mergeFlatValues(
        'red group-active:blue group-active/card:gray',
        'group-press:green group-press/card:black'
      )
    ).toBe('red group-press:green group-press/card:black')
    expect(mergeFlatValues('group-press/card:red', 'group-press/dialog:blue')).toBe(
      'group-press/card:red group-press/dialog:blue'
    )
  })

  test('surviving earlier clauses and later clauses keep authored order', () => {
    expect(
      mergeFlatValues(
        'black hover:red focus:orange disabled:gray',
        'white focus:yellow press:green'
      )
    ).toBe('white hover:red disabled:gray focus:yellow press:green')
  })

  test('keeps the prior normalized boundary between a modifier and its payload', () => {
    expect(mergeFlatValues('red hover: blue', 'green')).toBe('green hover:blue')
    expect(mergeFlatValues('red hover: /* reason */ blue', 'green')).toBe(
      'green hover:/* reason */ blue'
    )
  })

  test('duplicate clauses within one authored value remain in authored order', () => {
    expect(mergeFlatValues('hover:red hover:blue', 'black')).toBe(
      'black hover:red hover:blue'
    )
    expect(mergeFlatValues('hover:red', 'hover:blue hover:green')).toBe(
      'hover:blue hover:green'
    )
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

  test('a malformed value returns the later authored value unchanged', () => {
    // an unterminated function is a parse error, not a merge input
    expect(mergeFlatValues('rgb(1,2,3', 'red')).toBe('red')
    expect(mergeFlatValues('red hover:blue', 'rgb(1,2,3')).toBe('rgb(1,2,3')
    expect(mergeFlatValues('red hover:', 'green press:blue')).toBe('green press:blue')
    expect(mergeFlatValues('red hover:blue', 'green press:')).toBe('green press:')
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
