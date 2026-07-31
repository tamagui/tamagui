import parser from '@typescript-eslint/parser'
import { ESLint } from 'eslint'
import { describe, expect, test } from 'vitest'
import plugin from '../src'

const config = {
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

const eslint = new ESLint({
  overrideConfigFile: true,
  overrideConfig: [
    {
      files: ['**/*.tsx'],
      languageOptions: {
        parser,
        parserOptions: {
          ecmaFeatures: { jsx: true },
          sourceType: 'module',
        },
      },
      plugins: {
        tamagui: plugin,
      },
      rules: {
        'tamagui/valid-flat-values': ['error', { config }],
      },
    },
  ],
})

describe('valid-flat-values', () => {
  test('accepts real source whose static values match the configured grammar', async () => {
    const [result] = await eslint.lintFiles([
      new URL('./fixtures/valid.tsx', import.meta.url).pathname,
    ])

    expect(result.messages).toEqual([])
  })

  test('reports shared grammar diagnostics on real source', async () => {
    const [result] = await eslint.lintFiles([
      new URL('./fixtures/invalid.tsx', import.meta.url).pathname,
    ])

    expect(result.messages.map(({ message }) => message)).toEqual([
      '"unknown" is not a registered modifier',
      '"hver" is not a registered modifier',
      '"red-500" contributes to "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "color", not "fontSize"',
      '"backgroundHover" is not a v6 built-in name; use "background-hover"',
      '"backgroundActive" was removed from the v6 built-in theme vocabulary',
    ])
    expect(result.messages.every(({ fix }) => fix === undefined)).toBe(true)
  })
})
