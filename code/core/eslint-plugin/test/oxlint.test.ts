import { afterAll, describe, expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { copyFileSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { legacyPartComposite, programEligibility } from '@tamagui/style-grammar/tooling'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryDir = resolve(packageDir, '../../..')
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'tamagui-oxlint-plugin-'))
const configPath = join(temporaryDirectory, '.oxlintrc.json')
const strictConfigPath = join(temporaryDirectory, '.oxlintrc.strict.json')
const oxlintPath = join(repositoryDir, 'node_modules/.bin/oxlint')
const pluginPath = join(packageDir, 'dist/esm/index.mjs')

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

writeFileSync(
  configPath,
  JSON.stringify({
    jsPlugins: [
      {
        name: 'tamagui',
        specifier: pluginPath,
      },
    ],
    rules: {
      'tamagui/valid-flat-values': ['error', { config }],
    },
  })
)

writeFileSync(
  strictConfigPath,
  JSON.stringify({
    jsPlugins: [
      {
        name: 'tamagui',
        specifier: pluginPath,
      },
    ],
    rules: {
      'tamagui/valid-flat-values': ['error', { config, strictPayloads: true }],
    },
  })
)

afterAll(() => {
  rmSync(temporaryDirectory, { recursive: true, force: true })
})

function runOxlint(
  filePath: string,
  options: {
    configPath?: string
    fix?: boolean
  } = {}
) {
  const args = ['--config', options.configPath ?? configPath, '--format', 'json']
  if (options.fix) {
    args.push('--fix')
  }
  args.push(filePath)

  const result = spawnSync(oxlintPath, args, {
    cwd: repositoryDir,
    encoding: 'utf8',
  })
  const output = `${result.stdout}${result.stderr}`
  let diagnostics: Array<{ code: string; message: string }> = []
  try {
    const parsed = JSON.parse(result.stdout) as {
      diagnostics?: Array<{ code: string; message: string }>
    }
    diagnostics = parsed.diagnostics ?? []
  } catch {
    // non-json output on catastrophic failure
  }
  return {
    exitCode: result.status,
    output,
    diagnostics,
  }
}

describe('valid-flat-values', () => {
  test('accepts real source whose static values match the configured grammar', () => {
    const result = runOxlint(join(packageDir, 'test/fixtures/valid.tsx'))

    expect(result.exitCode, result.output).toBe(0)
    expect(result.diagnostics).toEqual([])
  })

  test('reports shared grammar diagnostics on real source', () => {
    const fixturePath = join(packageDir, 'test/fixtures/invalid.tsx')
    const result = runOxlint(fixturePath)

    expect(result.exitCode, result.output).toBe(1)
    expect(result.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'tamagui(valid-flat-values)',
        message: '"unknown" is not a registered modifier',
      })
    )
    expect(result.diagnostics.map(({ message }) => message)).toEqual([
      '"unknown" is not a registered modifier',
      '"hver" is not a registered modifier',
      '"red-500" contributes to "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "borderInlineStartColor", "borderInlineEndColor", "borderBlockStartColor", "borderBlockEndColor", "outlineColor", "color", "textDecorationColor", "textShadowColor", not "fontSize"',
      '"backgroundHover" is not a v6 built-in name; use "background-hover"',
      '"backgroundActive" was removed from the v6 built-in theme vocabulary',
      '"green red" holds 2 values but "backgroundColor" takes one. A value written after a conditional joins that conditional\'s payload — write the base value before the first conditional.',
      '"red" contributes to "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "borderInlineStartColor", "borderInlineEndColor", "borderBlockStartColor", "borderBlockEndColor", "outlineColor", "color", "textDecorationColor", "textShadowColor", not "paddingRight"',
      '"red" contributes to "backgroundColor", "borderColor", "borderTopColor", "borderRightColor", "borderBottomColor", "borderLeftColor", "borderInlineStartColor", "borderInlineEndColor", "borderBlockStartColor", "borderBlockEndColor", "outlineColor", "color", "textDecorationColor", "textShadowColor", not "paddingLeft"',
    ])

    const copyPath = join(temporaryDirectory, 'invalid-copy.tsx')
    const originalContent = readFileSync(fixturePath, 'utf8')
    copyFileSync(fixturePath, copyPath)
    const fixedResult = runOxlint(copyPath, { fix: true })
    expect(fixedResult.exitCode).toBe(1)
    expect(readFileSync(copyPath, 'utf8')).toBe(originalContent)
  })

  test('reports every clause-bearing prop the runtime keeps on the legacy path', () => {
    const entries = Object.entries(legacyPartComposite)
    const source = `import { View } from 'tamagui'
export const Fixture = () => (
  <View
    ${entries.map(([prop]) => `${prop}="base hover:next"`).join('\n    ')}
  />
)
`
    const filePath = join(temporaryDirectory, 'eligibility.tsx')
    writeFileSync(filePath, source)

    for (const [prop] of entries) {
      expect(programEligibility(prop)).toBe('legacy-part')
    }

    const result = runOxlint(filePath)
    expect(result.exitCode, result.output).toBe(1)
    expect(result.diagnostics.map(({ message }) => message)).toEqual(
      entries.map(
        ([prop, composite]) =>
          `conditional values are not supported on part prop "${prop}"; move the condition onto \`${composite}\``
      )
    )

    const fixedResult = runOxlint(filePath, { fix: true })
    expect(fixedResult.exitCode).toBe(1)
    expect(readFileSync(filePath, 'utf8')).toBe(source)
  })

  test('autofixes only the grammar-canonical spelling and becomes idempotent', () => {
    const fixturePath = join(packageDir, 'test/fixtures/noncanonical.tsx')
    const filePath = join(temporaryDirectory, 'noncanonical.tsx')
    copyFileSync(fixturePath, filePath)

    const unfixed = runOxlint(filePath)
    expect(unfixed.exitCode, unfixed.output).toBe(1)
    expect(unfixed.diagnostics.map(({ message }) => message)).toEqual([
      'use the canonical flat value "red hover:blue"',
      'use the canonical flat value "red dark:blue"',
      'use the canonical flat value "4 sm:6"',
    ])

    const fixed = runOxlint(filePath, { fix: true })
    expect(fixed.exitCode, fixed.output).toBe(0)
    expect(fixed.diagnostics).toEqual([])
    expect(readFileSync(filePath, 'utf8')).toBe(`import { styled, View } from 'tamagui'

const Frame = styled(View, {
  backgroundColor: "red hover:blue",
})

export function NoncanonicalFlatValues() {
  return <Frame bg="red dark:blue" p={"4 sm:6"} />
}
`)

    const rechecked = runOxlint(filePath)
    expect(rechecked.exitCode, rechecked.output).toBe(0)
    expect(rechecked.diagnostics).toEqual([])
  })

  test('reports unknown values when strictPayloads is enabled', () => {
    const source = `import { View } from 'tamagui'
export const Fixture = () => (
  <View bg="redd" p="$4" animation="quick" />
)
`
    const filePath = join(temporaryDirectory, 'strict.tsx')
    writeFileSync(filePath, source)

    const result = runOxlint(filePath, { configPath: strictConfigPath })
    expect(result.exitCode, result.output).toBe(1)
    expect(result.diagnostics.map(({ message }) => message)).toEqual([
      'unknown value "redd" for bg; did you mean "red"?',
      'v3 tokens have no "$" prefix, write "4" not "$4"',
      '"animation" was removed in v3; use "transition=" instead',
    ])
  })
})
