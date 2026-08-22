import { describe, expect, test } from 'vitest'
import {
  canonicalizeStyleValue,
  completeStyleValue,
  completeStyleValueAtCursor,
  createCandidatePropertyVocabulary,
  createGrammarConfigViewFromSerializedConfig,
  createModifierRegistry,
  diagnoseStyleValue,
  parseValue,
  type GrammarConfigView,
} from '../tooling'

const config: GrammarConfigView = {
  shorthands: {
    bg: 'backgroundColor',
    p: 'padding',
  },
  mediaNames: ['sm'],
  containerSizeNames: ['sm'],
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
        start: 4,
        end: 8,
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
        start: 0,
        end: 15,
        candidate: 'backgroundHover',
        replacement: 'background-hover',
        message: '"backgroundHover" is not a v6 built-in name; use "background-hover"',
      },
      {
        code: 'v6-theme-name-removed',
        index: 22,
        start: 22,
        end: 38,
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

  test('completes only configured candidates that target the authored property', () => {
    expect(completeStyleValue('bg', { config, registry, candidates })).toEqual([
      { value: 'blue', kind: 'configured' },
      { value: 'red', kind: 'configured' },
      { value: 'red-500', kind: 'configured' },
    ])
    expect(completeStyleValue('fontSize', { config, registry, candidates })).toEqual([
      { value: 'xl', kind: 'configured' },
    ])
    expect(completeStyleValue('display', { config, registry, candidates })).toEqual([
      { value: 'block', kind: 'keyword' },
      { value: 'flex', kind: 'keyword' },
      { value: 'grid', kind: 'keyword' },
      { value: 'inline', kind: 'keyword' },
      { value: 'inline-flex', kind: 'keyword' },
      { value: 'none', kind: 'keyword' },
    ])

    for (const property of ['bg', 'fontSize', 'display']) {
      for (const completion of completeStyleValue(property, {
        config,
        registry,
        candidates,
      })) {
        expect(diagnose(property, completion.value)).toEqual([])
      }
    }
  })

  test('projects completions from a legacy compiler artifact without metadata fields', () => {
    const serialized = createGrammarConfigViewFromSerializedConfig({
      shorthands: { bg: 'backgroundColor' },
      media: { sm: { maxWidth: 800 } },
      themes: {
        dark: {
          id: 'dark',
          surface: '#111',
        },
        light: {
          id: 'light',
          surface: '#fff',
        },
      },
      tokens: {
        color: {
          blue: '#00f',
        },
        space: {
          4: 16,
        },
      },
      fonts: {
        body: {
          size: {
            xl: 20,
          },
          lineHeight: {
            xl: 24,
          },
        },
      },
    })
    const serializedRegistry = createModifierRegistry(serialized).registry
    const options = { config: serialized, registry: serializedRegistry }

    expect(completeStyleValue('bg', options)).toEqual([
      { value: 'blue', kind: 'configured' },
      { value: 'surface', kind: 'configured' },
    ])
    expect(completeStyleValue('padding', options)).toEqual([
      { value: '4', kind: 'configured' },
    ])
    expect(completeStyleValue('fontSize', options)).toEqual([
      { value: 'xl', kind: 'configured' },
    ])
  })

  test('preserves legitimate theme names in a versioned values-only artifact', () => {
    const serialized = createGrammarConfigViewFromSerializedConfig(
      {
        shorthands: { bg: 'backgroundColor' },
        themes: {
          dark: {
            mode: 'dark',
          },
          light: {
            mode: 'light',
          },
        },
      },
      { themeFields: 'values-only' }
    )
    const serializedRegistry = createModifierRegistry(serialized).registry

    expect(
      completeStyleValue('bg', {
        config: serialized,
        registry: serializedRegistry,
      })
    ).toEqual([{ value: 'mode', kind: 'configured' }])
  })

  test('rejects a serialized theme format it does not understand', () => {
    expect(() =>
      createGrammarConfigViewFromSerializedConfig(
        {
          themes: {
            dark: {
              surface: '#111',
            },
          },
        },
        { themeFields: 'future-format' }
      )
    ).toThrow('unsupported serialized config themeFields format')
  })

  test('uses parser source spans for base, clause, and modifier completions', () => {
    const options = { config, registry, candidates }

    expect(completeStyleValueAtCursor('bg', '', 0, options)).toMatchObject({
      replaceStart: 0,
      replaceLength: 0,
      completions: [
        { value: 'blue', kind: 'configured' },
        { value: 'red', kind: 'configured' },
        { value: 'red-500', kind: 'configured' },
      ],
    })
    expect(completeStyleValueAtCursor('bg', 'red hover:b', 11, options)).toMatchObject({
      replaceStart: 10,
      replaceLength: 1,
      completions: expect.arrayContaining([{ value: 'blue', kind: 'configured' }]),
    })
    expect(completeStyleValueAtCursor('bg', 'red hover:', 10, options)).toMatchObject({
      replaceStart: 10,
      replaceLength: 0,
      completions: expect.arrayContaining([{ value: 'blue', kind: 'configured' }]),
    })
    expect(
      completeStyleValueAtCursor('bg', 'red hover:', 10, options)?.completions
    ).not.toEqual(expect.arrayContaining([expect.objectContaining({ kind: 'modifier' })]))
    expect(completeStyleValueAtCursor('bg', 'red sm:h', 8, options)).toMatchObject({
      replaceStart: 7,
      replaceLength: 1,
      completions: expect.arrayContaining([
        { value: 'hover', kind: 'modifier', insertText: 'hover:' },
      ]),
    })

    const partialModifier = completeStyleValueAtCursor('bg', 'red hov:blue', 7, options)
    expect(partialModifier).toMatchObject({
      replaceStart: 4,
      replaceLength: 3,
      completions: expect.arrayContaining([
        { value: 'hover', kind: 'modifier', insertText: 'hover' },
        { value: 'sm', kind: 'modifier', insertText: 'sm' },
        { value: 'dark', kind: 'modifier', insertText: 'dark' },
      ]),
    })

    expect(completeStyleValueAtCursor('bg', 'red hov:', 7, options)).toMatchObject({
      replaceStart: 4,
      replaceLength: 3,
      completions: expect.arrayContaining([
        { value: 'hover', kind: 'modifier', insertText: 'hover' },
      ]),
    })

    expect(completeStyleValueAtCursor('bg', 'red s', 5, options)).toMatchObject({
      replaceStart: 4,
      replaceLength: 1,
      completions: expect.arrayContaining([
        { value: 'sm', kind: 'modifier', insertText: 'sm:' },
      ]),
    })

    const appendedModifier = completeStyleValueAtCursor('bg', 'red ', 4, options)
    expect(appendedModifier).toMatchObject({
      replaceStart: 4,
      replaceLength: 0,
      completions: expect.arrayContaining([
        { value: '@sm', kind: 'modifier', insertText: '@sm:' },
        { value: 'group-hover', kind: 'modifier', insertText: 'group-hover:' },
        { value: 'hover', kind: 'modifier', insertText: 'hover:' },
      ]),
    })

    const deepChain = completeStyleValueAtCursor(
      'padding',
      '4 web:dark:@sm:sm:hover:',
      24,
      options
    )
    expect(deepChain).toMatchObject({
      replaceStart: 24,
      replaceLength: 0,
      completions: expect.arrayContaining([{ value: '4', kind: 'configured' }]),
    })
    expect(deepChain?.completions.filter((entry) => entry.kind === 'modifier')).toEqual(
      []
    )

    expect(
      completeStyleValueAtCursor(
        'padding',
        '4 sm:8 hover:9 dark:10 focus:11 ',
        32,
        options
      )
    ).toMatchObject({
      replaceStart: 32,
      replaceLength: 0,
      completions: expect.arrayContaining([
        { value: 'web', kind: 'modifier', insertText: 'web:' },
        { value: 'sm', kind: 'modifier', insertText: 'sm:' },
        { value: 'hover', kind: 'modifier', insertText: 'hover:' },
      ]),
    })
  })
})
