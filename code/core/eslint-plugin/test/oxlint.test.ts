import { afterAll, describe, expect, test } from 'vitest'
import { spawnSync } from 'node:child_process'
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const packageDir = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const repositoryDir = resolve(packageDir, '../../..')
const temporaryDirectory = mkdtempSync(join(tmpdir(), 'tamagui-oxlint-plugin-'))
const configPath = join(temporaryDirectory, '.oxlintrc.json')
const oxlintPath = join(repositoryDir, 'node_modules/.bin/oxlint')

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
        specifier: join(packageDir, 'dist/esm/index.mjs'),
      },
    ],
    rules: {
      'tamagui/valid-flat-values': ['error', { config }],
    },
  })
)

afterAll(() => {
  rmSync(temporaryDirectory, { recursive: true })
})

function runOxlint(fixture: 'invalid.tsx' | 'valid.tsx') {
  const result = spawnSync(
    oxlintPath,
    [
      '--config',
      configPath,
      '--format',
      'json',
      join(packageDir, 'test/fixtures', fixture),
    ],
    { cwd: repositoryDir, encoding: 'utf8' }
  )
  const output = `${result.stdout}${result.stderr}`
  return {
    exitCode: result.status,
    output,
    diagnostics: JSON.parse(result.stdout) as {
      diagnostics: Array<{ code: string; message: string }>
    },
  }
}

describe('oxlint jsPlugins', () => {
  test('reports invalid flat values through the built plugin', () => {
    const result = runOxlint('invalid.tsx')

    expect(result.exitCode, result.output).toBe(1)
    expect(result.diagnostics.diagnostics).toContainEqual(
      expect.objectContaining({
        code: 'tamagui(valid-flat-values)',
        message: '"unknown" is not a registered modifier',
      })
    )
  })

  test('accepts valid flat values through the built plugin', () => {
    const result = runOxlint('valid.tsx')

    expect(result.exitCode, result.output).toBe(0)
    expect(result.diagnostics.diagnostics).toEqual([])
  })
})
