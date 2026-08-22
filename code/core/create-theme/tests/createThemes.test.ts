import { describe, expect, test } from 'bun:test'

import { createThemes } from '../src/createThemes'

const tokens = {
  color: {
    white: '#fff',
    black: '#000',
    gray: '#888',
    red: '#f00',
  },
} as const

describe('createThemes', () => {
  test('inherits recipes, keeps values local, and attaches shared and local children', () => {
    const themes = createThemes(
      tokens,
      {
        light: {
          scheme: 'light',
          tone: 'gray',
          values: { border: 'red' },
          children: {
            local: { tone: 'red' },
          },
        },
        dark: { scheme: 'dark', tone: 'gray' },
        children: {
          shared: { values: { color: '#123' } },
        },
      },
      {
        getTheme: ({ recipe }) => ({
          background: recipe.scheme === 'light' ? 'white' : 'black',
          color: recipe.tone === 'red' ? 'red' : 'gray',
          border: 'gray',
        }),
      }
    )

    expect(Object.keys(themes)).toEqual([
      'light',
      'light_shared',
      'light_local',
      'dark',
      'dark_shared',
    ])
    expect(themes.light.border).toBe('#f00')
    expect(themes.light_local).toEqual({
      background: '#fff',
      color: '#f00',
      border: '#888',
    })
    expect(themes.light_shared.color).toBe('#123')
  })

  test('deduplicates resolved maps and skips null definitions', () => {
    const themes = createThemes(
      tokens,
      {
        light: { scheme: 'light' },
        dark: { scheme: 'dark' },
        children: {
          inverse: ({ parent }) => ({
            scheme: parent.scheme === 'light' ? 'dark' : 'light',
          }),
          skipped: () => null,
        },
      },
      {
        getTheme: ({ recipe }) => ({
          background: recipe.scheme === 'light' ? 'white' : 'black',
        }),
      }
    )

    expect(themes.light_inverse).toBe(themes.dark)
    expect(themes.dark_inverse).toBe(themes.light)
    expect(themes).not.toHaveProperty('light_skipped')
    expect(themes).not.toHaveProperty('dark_skipped')
  })

  test('supports explicit themes without getTheme', () => {
    const themes = createThemes(tokens, {
      light: { values: { background: 'white' } },
      dark: { values: { background: 'rgb(1, 2, 3)' } },
    })

    expect(themes).toEqual({
      light: { background: '#fff' },
      dark: { background: 'rgb(1, 2, 3)' },
    })
  })

  test('reports invalid values with the nearest token', () => {
    expect(() =>
      createThemes(tokens, {
        light: { values: { background: 'whit' as any } },
        dark: { values: { background: 'black' } },
      })
    ).toThrow('Did you mean token "white"?')
  })

  test('requires exactly the light and dark roots', () => {
    expect(() =>
      createThemes(tokens, {
        light: {},
        dark: {},
        blue: {},
      } as any)
    ).toThrow('exactly the roots "light" and "dark"')
  })
})
