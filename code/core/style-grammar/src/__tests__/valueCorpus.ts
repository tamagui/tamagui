// The deterministic value corpus.
//
// One generator, two consumers: the grammar's own fuzz test parses these
// strings with `parseValue`, and the cross-implementation agreement test in
// `core-test` runs the same strings through the runtime scanners that
// re-implement the same grammar. A payload shape added here is exercised by
// both, which is the point: a second implementation of a grammar is only an
// oracle for the first if they see the same inputs.

export type Random = () => number

export function mulberry32(seed: number): Random {
  let state = seed
  return () => {
    state |= 0
    state = (state + 0x6d2b79f5) | 0
    let value = Math.imul(state ^ (state >>> 15), 1 | state)
    value = (value + Math.imul(value ^ (value >>> 7), 61 | value)) ^ value
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

export function integer(random: Random, maximum: number): number {
  return Math.floor(random() * maximum)
}

export function pick<T>(random: Random, values: readonly T[]): T {
  return values[integer(random, values.length)]
}

export function chance(random: Random, probability = 0.5): boolean {
  return random() < probability
}

export const registeredModifiers = [
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

export const unregisteredModifiers = [
  'hver',
  'tablet',
  'dark_blue',
  'mystery',
  'group-wobble',
] as const

export const whitespace = (random: Random): string =>
  pick(random, [' ', '  ', '\t', '\t\t', ' \t '])

export function ident(random: Random): string {
  const syllables = ['red', 'surface', 'accent', 'custom', 'alpha', 'beta', 'value']
  const count = 1 + integer(random, 3)
  let value = pick(random, syllables)
  for (let index = 1; index < count; index++) {
    value += `-${pick(random, syllables)}`
  }
  return value
}

export function numberValue(random: Random): string {
  const sign = chance(random, 0.2) ? '-' : ''
  const whole = integer(random, 200)
  const fraction = chance(random, 0.35) ? `.${integer(random, 100)}` : ''
  const unit = pick(random, ['', 'px', 'rem', 'em', '%', 'vh', 'deg'])
  return `${sign}${whole}${fraction}${unit}`
}

export function hexColor(random: Random): string {
  const digits = '0123456789abcdef'
  const length = pick(random, [3, 4, 6, 8])
  let value = '#'
  for (let index = 0; index < length; index++) {
    value += digits[integer(random, digits.length)]
  }
  return value
}

export function quotedString(random: Random): string {
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

export function urlValue(random: Random): string {
  const protocol = pick(random, ['http', 'https', 'custom'])
  const suffix = pick(random, [
    'a:b.png',
    'image.svg?q=a:b',
    'path;still-in-parens',
    'nested{brace}.png',
  ])
  return `url(${protocol}://example.test/${suffix})`
}

export type EscapeMode = boolean | 'delimiter-free'

export function escapedIdent(random: Random, mode: EscapeMode = true): string {
  const escaped = ['custom\\:part', 'escaped\\ space']
  // an escaped `;`, `{` or `}` is ordinary payload content to the grammar, and
  // the web lowering's injection guard refuses it outright, which is a pinned
  // divergence rather than something a generated corpus should assert about
  if (mode !== 'delimiter-free') {
    escaped.push('safe\\;tail', 'brace\\{value', 'end\\}brace')
  }
  return pick(random, escaped)
}

export function component(
  random: Random,
  depth = 0,
  allowEscapes: EscapeMode = true
): string {
  const primitiveCount = 6
  const choice = integer(random, depth < 3 ? primitiveCount + 1 : primitiveCount)
  if (choice === 0) return ident(random)
  if (choice === 1) return numberValue(random)
  if (choice === 2) return hexColor(random)
  if (choice === 3) return quotedString(random)
  if (choice === 4) return urlValue(random)
  if (choice === 5) {
    return allowEscapes ? escapedIdent(random, allowEscapes) : ident(random)
  }

  const name = pick(random, ['calc', 'min', 'color-mix', 'linear-gradient', 'var'])
  const argumentCount = 1 + integer(random, 3)
  const arguments_: string[] = []
  for (let index = 0; index < argumentCount; index++) {
    arguments_.push(component(random, depth + 1, allowEscapes))
  }
  return `${name}(${arguments_.join(`,${whitespace(random)}`)})`
}

export function componentValue(random: Random, allowEscapes: EscapeMode = true): string {
  const count = 1 + integer(random, 3)
  let value = component(random, 0, allowEscapes)
  for (let index = 1; index < count; index++) {
    value += whitespace(random) + component(random, 0, allowEscapes)
  }
  return value
}

export interface ConstructedCase {
  source: string
  base: string | null
  clauses: Array<{ modifiers: string[]; payload: string }>
  unregistered?: string
  invalid?: string
}

export interface ConstructOptions {
  /** the modifier pool clauses draw from */
  modifiers?: readonly string[]
  /** exclusive upper bound on the clause count */
  maxClauses?: number
  /** inclusive upper bound on the modifiers in one clause chain */
  maxModifiersPerClause?: number
  /**
   * give every clause a distinct single modifier, drawn without replacement.
   * The agreement corpus needs this: it activates one clause at a time by
   * putting its modifier's condition into the component state, and a repeated
   * or overlapping modifier would activate two clauses at once and hand the
   * winner to clause precedence instead of to the scanner under test.
   */
  distinctSingleModifiers?: boolean
  /**
   * Emit `custom\\:part`-style escaped identifiers.
   *
   * `'delimiter-free'` keeps them but drops the ones that escape a `;`, `{` or
   * `}`. Every scanner reads those the same way and the web lowering then
   * refuses the value at its injection guard, so they are a divergence one
   * pinned case states better than a thousand generated ones.
   */
  escapes?: EscapeMode
}

export function constructCase(
  random: Random,
  mode: 'valid' | 'unregistered' | 'invalid',
  options: ConstructOptions = {}
): ConstructedCase {
  const pool = options.modifiers ?? registeredModifiers
  const maxClauses = options.maxClauses ?? 5
  const maxModifiers = options.maxModifiersPerClause ?? 3
  const escapes = options.escapes ?? true

  let base = chance(random, 0.65) ? componentValue(random, escapes) : null
  let clauseCount =
    mode === 'unregistered'
      ? 1 + integer(random, maxClauses - 1)
      : integer(random, maxClauses)
  const clauses: Array<{ modifiers: string[]; payload: string }> = []
  let unregistered: string | undefined

  if (options.distinctSingleModifiers) {
    // deterministic shuffle, then take a prefix: no replacement, no retry loop
    const shuffled = [...pool]
    for (let index = shuffled.length - 1; index > 0; index--) {
      const swap = integer(random, index + 1)
      const held = shuffled[index]
      shuffled[index] = shuffled[swap]
      shuffled[swap] = held
    }
    clauseCount = Math.min(clauseCount, shuffled.length)
    for (let clauseIndex = 0; clauseIndex < clauseCount; clauseIndex++) {
      clauses.push({
        modifiers: [shuffled[clauseIndex]],
        payload: componentValue(random, escapes),
      })
    }
  } else {
    for (let clauseIndex = 0; clauseIndex < clauseCount; clauseIndex++) {
      const modifierCount = 1 + integer(random, maxModifiers)
      const modifiers: string[] = []
      for (let modifierIndex = 0; modifierIndex < modifierCount; modifierIndex++) {
        modifiers.push(pick(random, pool))
      }
      clauses.push({ modifiers, payload: componentValue(random, escapes) })
    }
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

export const chaosAlphabet: readonly string[] = [
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
