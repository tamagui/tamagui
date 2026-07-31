import { describe, expect, test } from 'vitest'
import {
  createCandidatePropertyVocabulary,
  createModifierRegistry,
  diagnoseStyleValue,
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
