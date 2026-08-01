import { describe, expect, test } from 'vitest'
import { splitBackgroundValue, type ParsedValue } from '..'

describe('background family splitting', () => {
  test('splits the plan example into only its color and image programs', () => {
    const value: ParsedValue = {
      base: 'url(x.png) surface',
      clauses: [{ modifiers: ['hover'], payload: 'surface-hover' }],
    }

    expect(splitBackgroundValue(value, new Set(['surface', 'surface-hover']))).toEqual({
      entries: [
        {
          property: 'backgroundColor',
          value: {
            base: 'surface',
            clauses: [{ modifiers: ['hover'], payload: 'surface-hover' }],
          },
        },
        {
          property: 'backgroundImage',
          value: { base: 'url(x.png)', clauses: [] },
        },
      ],
      errors: [],
    })
  })

  test.each([
    ['configured token', 'surface', new Set(['surface'])],
    ['three-digit hex', '#abc', new Set<string>()],
    ['four-digit hex', '#abcd', new Set<string>()],
    ['six-digit hex', '#abcdef', new Set<string>()],
    ['eight-digit hex', '#abcdef80', new Set<string>()],
    ['color function', 'oklch(60% 0.2 20)', new Set<string>()],
    ['transparent', 'transparent', new Set<string>()],
    ['currentColor', 'currentColor', new Set<string>()],
    ['named CSS color', 'rebeccapurple', new Set<string>()],
  ])('recognizes %s as a color', (_label, base, tokens) => {
    expect(splitBackgroundValue({ base, clauses: [] }, tokens)).toEqual({
      entries: [
        {
          property: 'backgroundColor',
          value: { base, clauses: [] },
        },
      ],
      errors: [],
    })
  })

  test('keeps commas and whitespace inside gradient functions', () => {
    const gradient = 'linear-gradient(135deg, #f00, rgb(0 0 255))'
    expect(splitBackgroundValue({ base: gradient, clauses: [] }, new Set())).toEqual({
      entries: [
        {
          property: 'backgroundImage',
          value: { base: gradient, clauses: [] },
        },
      ],
      errors: [],
    })
  })

  test('creates a clause-only image program with a null base', () => {
    expect(
      splitBackgroundValue(
        {
          base: 'surface',
          clauses: [{ modifiers: ['hover'], payload: 'url(y.png)' }],
        },
        new Set(['surface'])
      )
    ).toEqual({
      entries: [
        {
          property: 'backgroundColor',
          value: { base: 'surface', clauses: [] },
        },
        {
          property: 'backgroundImage',
          value: {
            base: null,
            clauses: [{ modifiers: ['hover'], payload: 'url(y.png)' }],
          },
        },
      ],
      errors: [],
    })
  })

  test('recognizes a configured color token with an opacity suffix', () => {
    expect(
      splitBackgroundValue({ base: 'surface/50', clauses: [] }, new Set(['surface']))
    ).toEqual({
      entries: [
        {
          property: 'backgroundColor',
          value: { base: 'surface/50', clauses: [] },
        },
      ],
      errors: [],
    })
  })

  test('legacy sigils classify bare and qualified color tokens before resolution', () => {
    const value: ParsedValue = {
      base: '$surface',
      clauses: [{ modifiers: ['hover'], payload: '$color.surface-hover' }],
    }
    expect(splitBackgroundValue(value, new Set(['surface', 'surface-hover']))).toEqual({
      entries: [{ property: 'backgroundColor', value }],
      errors: [],
    })
  })

  test('reports unsupported components with their segment location', () => {
    expect(
      splitBackgroundValue(
        {
          base: 'cover',
          clauses: [{ modifiers: ['hover'], payload: 'center' }],
        },
        new Set()
      )
    ).toEqual({
      entries: [],
      errors: [
        {
          code: 'unsupported-bg-component',
          component: 'cover',
          where: 'base',
        },
        {
          code: 'unsupported-bg-component',
          component: 'center',
          where: 0,
        },
      ],
    })
  })

  test('reports every color after the first in one segment', () => {
    expect(
      splitBackgroundValue(
        { base: 'surface red #fff', clauses: [] },
        new Set(['surface'])
      )
    ).toEqual({
      entries: [
        {
          property: 'backgroundColor',
          value: { base: 'surface', clauses: [] },
        },
      ],
      errors: [
        {
          code: 'unsupported-bg-component',
          component: 'red',
          where: 'base',
        },
        {
          code: 'unsupported-bg-component',
          component: '#fff',
          where: 'base',
        },
      ],
    })
  })

  test('reports every image after the first in one segment', () => {
    expect(
      splitBackgroundValue({ base: 'url(a.png) url(b.png)', clauses: [] }, new Set())
    ).toEqual({
      entries: [
        {
          property: 'backgroundImage',
          value: { base: 'url(a.png)', clauses: [] },
        },
      ],
      errors: [
        {
          code: 'unsupported-bg-component',
          component: 'url(b.png)',
          where: 'base',
        },
      ],
    })
  })

  test('recognizes image-set and repeating gradients as image functions', () => {
    const value: ParsedValue = {
      base: 'image-set(url(a.png) 1x, url(b.png) 2x)',
      clauses: [
        {
          modifiers: ['dark'],
          payload: 'repeating-radial-gradient(red, blue 20px)',
        },
      ],
    }

    expect(splitBackgroundValue(value, new Set())).toEqual({
      entries: [
        {
          property: 'backgroundImage',
          value,
        },
      ],
      errors: [],
    })
  })
})
