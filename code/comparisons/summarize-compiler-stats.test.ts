import { afterEach, expect, test } from 'bun:test'
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'

const temporaryDirectories: string[] = []

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { recursive: true, force: true })
  }
})

test('legacy stats keep styled separate and deduplicate identical module rows', () => {
  const directory = mkdtempSync(join(tmpdir(), 'compiler-stats-summary-'))
  temporaryDirectories.push(directory)
  const input = join(directory, 'stats.jsonl')
  const output = join(directory, 'summary.json')
  const row = JSON.stringify({
    id: 'features/site/home/Example.tsx',
    stats: { found: 3, optimized: 2, flattened: 2, styled: 2 },
  })
  writeFileSync(input, `${row}\n${row}\n`)

  const result = Bun.spawnSync([
    process.execPath,
    join(import.meta.dir, 'summarize-compiler-stats.ts'),
    input,
    '--format=legacy-jsonl',
    '--scope=all',
    `--output=${output}`,
  ])

  expect(result.exitCode).toBe(0)
  const report = JSON.parse(readFileSync(output, 'utf8'))
  expect(report.totals).toEqual({
    modules: 1,
    found: 3,
    legacyOptimized: 2,
    flattened: 2,
    partial: 0,
    styled: 2,
    bailed: 1,
    notFlattened: 1,
    flattenRate: 2 / 3,
  })
  expect(report.modules[0].stats).not.toHaveProperty('lowered')
})
