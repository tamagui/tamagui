import { describe, expect, test } from 'bun:test'

import { createV5Theme, subtleChildrenThemes } from '@tamagui/config-v5'

const lightPalette = [
  '#ffffff',
  '#f8f8f8',
  '#eeeeee',
  '#dddddd',
  '#cccccc',
  '#bbbbbb',
  '#999999',
  '#777777',
  '#555555',
  '#333333',
  '#222222',
  '#111111',
]

const darkPalette = [...lightPalette].reverse()
const accentLight = Object.fromEntries(
  darkPalette.map((color, index) => [`accent${index + 1}`, color])
)
const accentDark = Object.fromEntries(
  lightPalette.map((color, index) => [`accent${index + 1}`, color])
)

describe('@tamagui/config-v5', () => {
  test('generates customized v5 themes through the public package API', () => {
    const themes = createV5Theme({
      lightPalette,
      darkPalette,
      accent: {
        light: accentLight,
        dark: accentDark,
      },
      childrenThemes: subtleChildrenThemes,
    })

    expect(Object.keys(themes)).toEqual(
      expect.arrayContaining([
        'light',
        'dark',
        'light_accent',
        'dark_accent',
        'light_blue',
        'dark_yellow',
      ])
    )
    expect(themes.light).toEqual(
      expect.objectContaining({
        color1: expect.any(String),
        color12: expect.any(String),
        accent1: expect.any(String),
        accent12: expect.any(String),
      })
    )
    expect(themes.light.yellow1).toBe(subtleChildrenThemes.yellow.light.yellow1)
    expect(themes.dark.blue12).toBe(subtleChildrenThemes.blue.dark.blue12)
  })
})
