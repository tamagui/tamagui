import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

import { describe, expect, test } from 'vitest'

import {
  checkStyleFiles,
  formatCheckResults,
  MissingConfigArtifactError,
} from '@tamagui/language-service/check'

const fixtureDirectory = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')
const projectRoot = join(fixtureDirectory, 'check-project')
const configPath = join(fixtureDirectory, 'tamagui.config.json')

describe('checkStyleFiles', () => {
  test('reports every diagnostic in a project with positions', () => {
    const result = checkStyleFiles({ root: projectRoot, configPath })
    expect(result.checkedFileCount).toBe(1)
    expect(result.diagnosticCount).toBe(3)

    const [file] = result.files
    expect(file.file).toBe('screen.tsx')
    expect(
      file.diagnostics.map((diagnostic) => ({
        code: diagnostic.code,
        text: file.source.slice(diagnostic.start, diagnostic.end),
      }))
    ).toEqual([
      { code: 'unregistered-modifier', text: 'hver' },
      { code: 'opacity-out-of-range', text: 'blue/150' },
      { code: 'candidate-property-mismatch', text: 'blue' },
    ])
  })

  test('formats readable code frames', () => {
    const result = checkStyleFiles({ root: projectRoot, configPath })
    const report = formatCheckResults(result, { color: false })
    expect(report).toContain('screen.tsx:4:8 error "hver" is not a registered modifier')
    expect(report).toContain("4 │   bg: 'hver:blue',")
    expect(report).toContain('^^^^')
    expect(report).toContain('✗ 3 problems in 1 file (1 checked)')
  })

  test('throws a helpful error without the config artifact', () => {
    expect(() => checkStyleFiles({ root: projectRoot })).toThrow(
      MissingConfigArtifactError
    )
  })
})
