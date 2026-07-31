import { describe, expect, test } from 'vitest'
import {
  canonicalizeStyleValue,
  createCandidatePropertyVocabulary,
  createModifierRegistry,
  diagnoseStyleValue,
  parseValue,
  type GrammarConfigView,
} from '..'

const config: GrammarConfigView = {
  shorthands: {
    bg: 'backgroundColor',
    p: 'padding',
  },
  mediaNames: ['sm'],
  themeNames: ['dark'],
  tokenNames: {
    color: ['red', 'blue', 'red-500'],
    fontSize: ['xl'],
    space: ['4', '6'],
  },
}

const registry = createModifierRegistry(config).registry
const candidates = createCandidatePropertyVocabulary(config)
const diagnose = (property: string, value: string) =>
  diagnoseStyleValue(property, value, { config, registry, candidates })

describe('tooling diagnostics', () => {
  test.each([
    [
      '  red   hover:blue  sm:dark:calc(1px + 2px)  ',
      'red hover:blue sm:dark:calc(1px + 2px)',
    ],
    [' hover:red   sm:blue ', 'hover:red sm:blue'],
    ['active:red   hover:rgb(1, 2, 3)', 'active:red hover:rgb(1, 2, 3)'],
  ])('canonical formatting round-trips the same IR', (input, canonical) => {
    const before = parseValue(input, registry)
    const formatted = canonicalizeStyleValue(input, registry)

    expect(before.ok).toBe(true)
    expect(formatted).toMatchObject({
      ok: true,
      value: canonical,
    })
    if (!before.ok || !formatted.ok) return

    const after = parseValue(formatted.value, registry)
    expect(after).toEqual(before)
    expect(formatted.parsed).toEqual(before.value)
    expect(canonicalizeStyleValue(formatted.value, registry)).toEqual(formatted)
  })

  test('canonical formatting refuses invalid grammar', () => {
    expect(canonicalizeStyleValue('red hver:blue', registry)).toEqual(
      parseValue('red hver:blue', registry)
    )
  })

  test('accepts the same configured program the runtime parser accepts', () => {
    expect(diagnose('bg', 'red hover:blue')).toEqual([])
    expect(diagnose('p', '4 sm:6')).toEqual([])
    expect(diagnose('fontSize', 'xl')).toEqual([])
  })

  test('returns the parser diagnostic for an invalid modifier', () => {
    expect(diagnose('bg', 'red hver:blue')).toEqual([
      {
        code: 'unregistered-modifier',
        index: 4,
        message: '"hver" is not a registered modifier',
      },
    ])
  })

  test('uses the shared target validator for a configured family mismatch', () => {
    expect(diagnose('fontSize', 'red-500')).toMatchObject([
      {
        code: 'candidate-property-mismatch',
        candidate: 'red-500',
        property: 'fontSize',
      },
    ])
    expect(diagnose('boxShadow', '0 0 4px red-500')).toEqual([])
  })

  test('reports obsolete v6 built-ins through the shared name tables', () => {
    expect(diagnose('color', 'backgroundHover hover:backgroundActive')).toEqual([
      {
        code: 'v6-theme-name-replaced',
        index: 0,
        candidate: 'backgroundHover',
        replacement: 'background-hover',
        message: '"backgroundHover" is not a v6 built-in name; use "background-hover"',
      },
      {
        code: 'v6-theme-name-removed',
        index: 0,
        candidate: 'backgroundActive',
        message: '"backgroundActive" was removed from the v6 built-in theme vocabulary',
      },
    ])
  })

  test('keeps an explicitly configured user name even when it matches an old built-in', () => {
    const customConfig: GrammarConfigView = {
      ...config,
      tokenNames: {
        ...config.tokenNames,
        color: ['red', 'blue', 'backgroundHover'],
      },
    }
    const customRegistry = createModifierRegistry(customConfig).registry

    expect(
      diagnoseStyleValue('color', 'backgroundHover', {
        config: customConfig,
        registry: customRegistry,
      })
    ).toEqual([])
  })
})
