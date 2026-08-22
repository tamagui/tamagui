import { describe, expect, test } from 'vitest'
import {
  annotateStyleValue,
  createCandidatePropertyVocabulary,
  createModifierRegistry,
  diagnoseStyleValue,
  type GrammarConfigView,
} from '../tooling'

const config: GrammarConfigView = {
  shorthands: {
    bg: 'backgroundColor',
    p: 'padding',
    rounded: 'borderRadius',
  },
  mediaNames: ['sm'],
  containerSizeNames: ['sm'],
  themeNames: ['dark'],
  tokenNames: {
    color: ['red', 'blue', 'accent-background'],
    space: ['4', '6', 'lg'],
    radius: ['xl'],
  },
}

const registry = createModifierRegistry(config).registry
const candidates = createCandidatePropertyVocabulary(config)
const options = { config, registry, candidates }
const annotate = (property: string, value: string) =>
  annotateStyleValue(property, value, options)

describe('annotateStyleValue', () => {
  test('classifies tokens, modifiers, and clause ownership', () => {
    const input = 'red hover:blue sm:dark:accent-background'
    expect(annotate('bg', input)).toEqual([
      {
        kind: 'token',
        start: 0,
        end: 3,
        text: 'red',
        modifiers: [],
        tokenCategory: 'color',
        property: 'backgroundColor',
      },
      {
        kind: 'modifier',
        start: 4,
        end: 9,
        text: 'hover',
        modifierKind: 'state',
      },
      {
        kind: 'token',
        start: 10,
        end: 14,
        text: 'blue',
        modifiers: ['hover'],
        tokenCategory: 'color',
        property: 'backgroundColor',
      },
      {
        kind: 'modifier',
        start: 15,
        end: 17,
        text: 'sm',
        modifierKind: 'media',
      },
      {
        kind: 'modifier',
        start: 18,
        end: 22,
        text: 'dark',
        modifierKind: 'theme',
      },
      {
        kind: 'token',
        start: 23,
        end: 40,
        text: 'accent-background',
        modifiers: ['sm', 'dark'],
        tokenCategory: 'color',
        property: 'backgroundColor',
      },
    ])
  })

  test('resolves bare numbers only for numeric categories', () => {
    expect(annotate('p', '4 sm:6')).toMatchObject([
      { kind: 'token', text: '4', tokenCategory: 'space', property: 'padding' },
      { kind: 'modifier', text: 'sm' },
      { kind: 'token', text: '6', tokenCategory: 'space', modifiers: ['sm'] },
    ])
    // color binds no numeric category, so a bare number stays literal CSS
    expect(annotate('bg', '4')).toEqual([])
  })

  test('carries the authored opacity suffix', () => {
    expect(annotate('bg', 'red/50')).toEqual([
      {
        kind: 'token',
        start: 0,
        end: 6,
        text: 'red/50',
        modifiers: [],
        tokenCategory: 'color',
        property: 'backgroundColor',
        opacity: 50,
      },
    ])
  })

  test('classifies style keywords and CSS-wide keywords', () => {
    expect(annotate('display', 'flex')).toEqual([
      {
        kind: 'keyword',
        start: 0,
        end: 4,
        text: 'flex',
        modifiers: [],
        property: 'display',
      },
    ])
    expect(annotate('bg', 'inherit')).toMatchObject([
      { kind: 'keyword', text: 'inherit' },
    ])
  })

  test('reports unresolved idents and hex colors as identifiers', () => {
    expect(annotate('bg', '#ff0000 hover:rebeccapurple')).toMatchObject([
      { kind: 'identifier', text: '#ff0000', modifiers: [] },
      { kind: 'modifier', text: 'hover' },
      { kind: 'identifier', text: 'rebeccapurple', modifiers: ['hover'] },
    ])
  })

  test('annotates candidates inside function arguments but never url bodies', () => {
    const gradient = annotate('backgroundImage', 'linear-gradient(45deg, red, blue)')
    expect(gradient).toMatchObject([
      { kind: 'identifier', text: 'red' },
      { kind: 'identifier', text: 'blue' },
    ])
    expect(annotate('backgroundImage', 'url(red.png)')).toEqual([])
  })

  test('marks a resolved candidate that misses the target as identifier', () => {
    // 'red' resolves as a color but padding is not among its contributions
    expect(annotate('p', 'red')).toMatchObject([
      { kind: 'identifier', text: 'red', tokenCategory: 'color' },
    ])
    expect(annotate('p', 'red')[0]?.property).toBeUndefined()
  })

  test('keeps annotating while the author is mid-clause', () => {
    expect(annotate('bg', 'red hover:')).toMatchObject([
      { kind: 'token', text: 'red' },
      { kind: 'modifier', text: 'hover' },
    ])
  })
})

describe('diagnostic spans', () => {
  const diagnose = (property: string, value: string) =>
    diagnoseStyleValue(property, value, options)

  test('locates a family mismatch at the candidate', () => {
    const input = 'sm:xl'
    expect(diagnose('p', input)).toMatchObject([
      {
        code: 'candidate-property-mismatch',
        candidate: 'xl',
        start: 3,
        end: 5,
      },
    ])
  })

  test('reports an out-of-range opacity with its span', () => {
    expect(diagnose('bg', 'hover:red/150')).toMatchObject([
      {
        code: 'opacity-out-of-range',
        candidate: 'red',
        start: 6,
        end: 13,
      },
    ])
  })

  test('reports a valid opacity suffix on a non-color token', () => {
    expect(diagnose('p', '4 lg/50')).toMatchObject([
      {
        code: 'opacity-on-non-color',
        candidate: 'lg',
        start: 2,
        end: 7,
      },
    ])
  })

  test('never flags slash forms on unresolved idents', () => {
    // grid-area style CSS: `a/2` is legal slash syntax, not an opacity attempt
    expect(diagnose('bg', 'a/2')).toEqual([])
    expect(diagnose('bg', 'red hover:blue')).toEqual([])
  })

  test('accepts a valid color opacity without diagnostics', () => {
    expect(diagnose('bg', 'red/50 hover:blue/25')).toEqual([])
  })

  test('spans an empty clause payload at the trailing colon', () => {
    expect(diagnose('bg', 'red hover:')).toMatchObject([
      { code: 'empty-payload', start: 9, end: 10 },
    ])
  })
})
