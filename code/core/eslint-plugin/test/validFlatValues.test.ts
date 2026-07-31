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

const createEslint = (fix = false) =>
  new ESLint({
    fix,
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

const eslint = createEslint()

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
      '"green red" holds 2 values but "backgroundColor" takes one. A value written after a conditional joins that conditional\'s payload — write the base value before the first conditional.',
    ])
    expect(result.messages.every(({ fix }) => fix === undefined)).toBe(true)
  })

  test('autofixes only the grammar-canonical spelling and becomes idempotent', async () => {
    const fixturePath = new URL('./fixtures/noncanonical.tsx', import.meta.url).pathname
    const [unfixed] = await eslint.lintFiles([fixturePath])

    expect(unfixed.messages.map(({ message }) => message)).toEqual([
      'use the canonical flat value "red hover:blue"',
      'use the canonical flat value "red dark:blue"',
      'use the canonical flat value "4 sm:6"',
    ])
    expect(unfixed.messages.every(({ fix }) => fix !== undefined)).toBe(true)

    const [fixed] = await createEslint(true).lintFiles([fixturePath])
    expect(fixed.messages).toEqual([])
    expect(fixed.output).toBe(`import { styled, View } from 'tamagui'

const Frame = styled(View, {
  backgroundColor: "red hover:blue",
})

export function NoncanonicalFlatValues() {
  return <Frame bg="red dark:blue" p={"4 sm:6"} />
}
`)

    if (fixed.output === undefined) throw new Error('expected ESLint autofix output')
    const [rechecked] = await eslint.lintText(fixed.output, { filePath: fixturePath })
    expect(rechecked.messages).toEqual([])
  })
})
