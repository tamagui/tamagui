import { mkdtemp, readdir, rm } from 'node:fs/promises'
import { join } from 'node:path'

import { describe, expect, test } from 'vitest'

import { resolvedModuleId, sourceContentHash } from '@tamagui/compiler-core'

import {
  METRO_COMPILER_CACHE_VERSION,
  MetroCompilerCache,
  metroCompilerContentHash,
  type MetroCompilerCacheEntry,
} from '../src/compilerCache'
import { metroDiagnostic } from '../src/diagnostics'

describe('Metro compiler cache', () => {
  test('publishes optional diagnostic fields as valid stable JSON without blob churn', async () => {
    const root = await mkdtemp(join(import.meta.dirname, '.cache-fixture-'))
    const cache = new MetroCompilerCache(root)
    const source = 'export const value = 1\n'
    const id = resolvedModuleId('/fixture.ts')
    const entry = {
      schemaVersion: METRO_COMPILER_CACHE_VERSION,
      moduleId: id,
      compiledHash: metroCompilerContentHash(source),
      plan: {
        version: 1,
        id,
        target: 'native',
        inputHash: metroCompilerContentHash(source),
        sourceHash: sourceContentHash(source),
        projectGeneration: 'fixture-project',
        structuralPassHash: 'native-noop-v1',
        edits: [],
        css: '',
        diagnostics: [],
        dependencies: [],
        stats: { found: 0, lowered: 0, flattened: 0, styled: 0, bailed: 0 },
      },
      diagnostics: [
        metroDiagnostic('metro/resolve-failed', 'optional dependency omitted', {
          moduleId: '/fixture.ts',
        }),
      ],
    } satisfies MetroCompilerCacheEntry

    try {
      await cache.publish('ios', [entry], 'fixture-options')
      await cache.publish('ios', [entry], 'fixture-options')

      expect(await cache.validate()).toMatchObject({
        valid: true,
        diagnostics: [],
        generation: expect.any(String),
        moduleIds: [entry.moduleId],
        optionsHash: 'fixture-options',
      })
      expect(await cache.read(entry.moduleId, source)).toMatchObject({
        diagnostics: [{ code: 'metro/resolve-failed', moduleId: '/fixture.ts' }],
      })
      expect(
        await readdir(join(root, `v${METRO_COMPILER_CACHE_VERSION}`, 'blobs'))
      ).toHaveLength(1)
    } finally {
      await rm(root, { recursive: true, force: true })
    }
  })
})
