import { existsSync, readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, test } from 'vitest'

import { RSD_REFERENCE } from '../tables/compatibility'

type Feature = {
  id: string
  status: 'equivalent' | 'stronger' | 'intentional-difference' | 'partial'
  upstreamSources: string[]
  upstreamTests: string[]
  tamaguiSources: string[]
  tamaguiTests: string[]
  rationale: string
}

type InventoryEntry = {
  path: string
  lines: string
  active: number
  skipped: number
  status: Feature['status']
  severity: 'none' | 'P0' | 'P1' | 'P2'
  localEvidence: string[]
  note: string
}

const root = resolve(import.meta.dirname, '../../../../..')
const matrix = JSON.parse(
  readFileSync(resolve(import.meta.dirname, '../../strict-dom-parity.json'), 'utf8')
) as {
  reference: typeof RSD_REFERENCE & {
    repository: string
    legacyRepository: string
    auditedTestFiles: number
    auditedTestDeclarations: number
    activeTestDeclarations: number
    skippedTestDeclarations: number
    typeTestFiles: number
    manualPlatformFixtures: number
    inventoryCommand: string
  }
  execution: {
    inventoryIsMappingNotExecution: boolean
    upstream: Array<{
      status: string
      suitesPassed: number
      testsPassed: number
      testsSkipped: number
      snapshotsPassed: number
    }>
    realizedUpstreamCases: {
      passed: number
      skipped: number
      total: number
      snapshotsPassed: number
    }
    local: Array<{ status: string; testsPassed: number }>
    builds: Array<{ status: string }>
  }
  features: Feature[]
  upstreamTestInventory: InventoryEntry[]
  upstreamTypeTestInventory: Array<{
    path: string
    status: Feature['status']
    localEvidence: string[]
  }>
  upstreamManualInventory: Array<{
    path: string
    status: Feature['status']
    localEvidence: string[]
  }>
}

const localPath = (citation: string) => citation.replace(/:\d+(?:-\d+)?$/, '')

describe('React Strict DOM parity matrix', () => {
  test('pins the same authoritative reference as executable conformance', () => {
    expect(matrix.reference.repository).toBe('https://github.com/react/react-strict-dom')
    expect(matrix.reference.legacyRepository).toBe(
      'https://github.com/facebook/react-strict-dom'
    )
    expect(matrix.reference.version).toBe(RSD_REFERENCE.version)
    expect(matrix.reference.commit).toBe(RSD_REFERENCE.commit)
    expect(matrix.reference.date).toBe(RSD_REFERENCE.date)
    expect(matrix.reference.auditedTestFiles).toBe(19)
    expect(matrix.reference.auditedTestDeclarations).toBe(304)
    expect(matrix.reference.activeTestDeclarations).toBe(302)
    expect(matrix.reference.skippedTestDeclarations).toBe(2)
    expect(matrix.reference.typeTestFiles).toBe(3)
    expect(matrix.reference.manualPlatformFixtures).toBe(1)
    expect(matrix.reference.inventoryCommand).toContain("rg -n '^\\s*(test|it)")
  })

  test('resolves every native DOM alias to native runtime and declarations', () => {
    for (const [manifest, expectedTypes] of [
      ['code/core/web/package.json', './types/dom/index.native.d.ts'],
      ['code/core/core/package.json', './types/dom.native.d.ts'],
      ['code/ui/tamagui/package.json', './types/dom.native.d.ts'],
    ] as const) {
      const packageJSON = JSON.parse(readFileSync(resolve(root, manifest), 'utf8'))
      const native = packageJSON.exports['./dom']['react-native']
      expect(native.types, manifest).toBe(expectedTypes)
      expect(native.default, manifest).toMatch(/dom(?:\/index)?\.native\.js$/)
      expect(existsSync(resolve(root, manifest, '..', native.types)), manifest).toBe(true)
      expect(existsSync(resolve(root, manifest, '..', native.default)), manifest).toBe(
        true
      )
    }
  })

  test('separates mapped declarations from the executed upstream result', () => {
    expect(matrix.execution.inventoryIsMappingNotExecution).toBe(true)
    expect(matrix.execution.upstream).toHaveLength(2)
    expect(matrix.execution.upstream.every(({ status }) => status === 'passed')).toBe(
      true
    )
    expect(matrix.execution.upstream.reduce((sum, row) => sum + row.testsPassed, 0)).toBe(
      matrix.execution.realizedUpstreamCases.passed
    )
    expect(
      matrix.execution.upstream.reduce((sum, row) => sum + row.testsSkipped, 0)
    ).toBe(matrix.execution.realizedUpstreamCases.skipped)
    expect(
      matrix.execution.realizedUpstreamCases.passed +
        matrix.execution.realizedUpstreamCases.skipped
    ).toBe(matrix.execution.realizedUpstreamCases.total)
    expect(
      matrix.execution.upstream.reduce((sum, row) => sum + row.snapshotsPassed, 0)
    ).toBe(matrix.execution.realizedUpstreamCases.snapshotsPassed)
    expect(matrix.execution.local.every(({ status }) => status === 'passed')).toBe(true)
    expect(matrix.execution.local.reduce((sum, row) => sum + row.testsPassed, 0)).toBe(
      116
    )
    expect(matrix.execution.builds).toHaveLength(6)
    expect(matrix.execution.builds.every(({ status }) => status === 'passed')).toBe(true)
  })

  test('derives the audited executable counts from a one-row-per-file inventory', () => {
    const paths = matrix.upstreamTestInventory.map(({ path }) => path)
    expect(paths).toHaveLength(matrix.reference.auditedTestFiles)
    expect(new Set(paths).size).toBe(paths.length)
    expect(matrix.upstreamTestInventory.reduce((sum, row) => sum + row.active, 0)).toBe(
      matrix.reference.activeTestDeclarations
    )
    expect(matrix.upstreamTestInventory.reduce((sum, row) => sum + row.skipped, 0)).toBe(
      matrix.reference.skippedTestDeclarations
    )
    expect(
      matrix.reference.activeTestDeclarations + matrix.reference.skippedTestDeclarations
    ).toBe(matrix.reference.auditedTestDeclarations)
    for (const row of matrix.upstreamTestInventory) {
      expect(row.path).not.toContain('__snapshots__')
      expect(row.path).not.toContain('__fixtures__')
      expect(row.path).not.toContain('__mocks__')
      expect(row.note.length, row.path).toBeGreaterThan(20)
      expect(row.severity === 'none', row.path).toBe(row.status !== 'partial')
      for (const evidence of row.localEvidence) {
        expect(existsSync(resolve(root, localPath(evidence))), evidence).toBe(true)
      }
    }
  })

  test('inventories type and manual evidence separately from executable counts', () => {
    expect(matrix.upstreamTypeTestInventory).toHaveLength(matrix.reference.typeTestFiles)
    expect(matrix.upstreamManualInventory).toHaveLength(
      matrix.reference.manualPlatformFixtures
    )
    for (const row of [
      ...matrix.upstreamTypeTestInventory,
      ...matrix.upstreamManualInventory,
    ]) {
      for (const evidence of row.localEvidence) {
        expect(existsSync(resolve(root, localPath(evidence))), evidence).toBe(true)
      }
    }
  })

  test('covers every audited upstream category exactly once', () => {
    const ids = matrix.features.map(({ id }) => id)
    expect(new Set(ids).size).toBe(ids.length)
    expect(ids).toEqual(
      expect.arrayContaining([
        'public-api-web',
        'public-api-native',
        'html-surface-and-types',
        'web-host-semantics',
        'native-backing-and-layout',
        'native-accessibility-and-props',
        'native-input-image',
        'events',
        'native-refs',
        'standalone-style-create',
        'style-composition',
        'web-pseudo-media-theme',
        'native-dynamic-style-context',
        'css-values-transforms-time',
        'babel-lowering',
        'postcss',
        'compat-native',
        'platform-app',
        'diagnostics-and-compatibility-ledger',
      ])
    )
  })

  test('gives every category upstream citations, local evidence and a rationale', () => {
    for (const feature of matrix.features) {
      expect(feature.upstreamSources.length, feature.id).toBeGreaterThan(0)
      expect(feature.upstreamTests.length, feature.id).toBeGreaterThan(0)
      expect(feature.tamaguiSources.length, feature.id).toBeGreaterThan(0)
      expect(feature.tamaguiTests.length, feature.id).toBeGreaterThan(0)
      expect(feature.rationale.length, feature.id).toBeGreaterThan(20)
      for (const citation of [...feature.upstreamSources, ...feature.tamaguiSources]) {
        expect(citation, feature.id).toMatch(/:\d+(?:-\d+)?$/)
      }
      for (const citation of feature.tamaguiSources) {
        const match = citation.match(/:(\d+)(?:-(\d+))?$/)!
        const lineCount = readFileSync(resolve(root, localPath(citation)), 'utf8').split(
          '\n'
        ).length
        expect(Number(match[1]), citation).toBeGreaterThanOrEqual(1)
        expect(Number(match[2] ?? match[1]), citation).toBeLessThanOrEqual(lineCount)
      }
      for (const citation of [...feature.tamaguiSources, ...feature.tamaguiTests]) {
        expect(existsSync(resolve(root, localPath(citation))), citation).toBe(true)
      }
    }
  })

  test('has no unclosed parity row in the declared scope', () => {
    expect(matrix.features.filter(({ status }) => status === 'partial')).toEqual([])
    expect(
      matrix.upstreamTestInventory.filter(({ status }) => status === 'partial')
    ).toEqual([])
    expect(
      matrix.upstreamManualInventory.filter(({ status }) => status === 'partial')
    ).toEqual([])
  })
})
