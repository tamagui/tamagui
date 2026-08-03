#!/usr/bin/env bun

import { execFileSync } from 'node:child_process'
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'

const output =
  process.argv.find((argument) => argument.startsWith('--output='))?.slice(9) ??
  join(import.meta.dir, 'output', 'benchmark-assertion-attribute-compiler-guard.json')

const variants = [
  {
    id: 'tamagui-v3-compiled',
    directory: 'tamagui-bench',
    executable: 'bunx',
    args: ['vite', 'build'],
    stats: 'json',
  },
  {
    id: 'tamagui-v2-compiled',
    directory: 'tamagui-v2-bench',
    executable: 'npm',
    args: ['exec', 'vite', '--', 'build'],
    stats: 'legacy-log',
  },
] as const

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: import.meta.dir })
    .toString()
    .trim()

function runVariant(
  variant: (typeof variants)[number],
  stripAssertionAttributes: boolean,
  temporaryRoot: string
) {
  const buildDirectory = join(
    temporaryRoot,
    `${variant.id}-${stripAssertionAttributes ? 'stripped' : 'instrumented'}`
  )
  const statsFile = `${buildDirectory}-compiler-stats.json`
  mkdirSync(buildDirectory, { recursive: true })
  const result = Bun.spawnSync(
    [variant.executable, ...variant.args, '--outDir', buildDirectory, '--emptyOutDir'],
    {
      cwd: join(import.meta.dir, variant.directory),
      env: {
        ...process.env,
        NODE_ENV: 'production',
        EXTRACT: '1',
        BENCH_STRIP_ASSERTION_ATTRIBUTES: stripAssertionAttributes ? '1' : '0',
        ...(variant.stats === 'json' && {
          TAMAGUI_COMPILER_STATS_FILE: statsFile,
        }),
      },
      stdout: 'pipe',
      stderr: 'pipe',
    }
  )
  const log = `${result.stdout.toString()}\n${result.stderr.toString()}`
  if (result.exitCode !== 0) {
    process.stderr.write(log)
    throw new Error(`${variant.id} production build failed`)
  }
  if (variant.stats === 'json') {
    const report = JSON.parse(readFileSync(statsFile, 'utf8'))
    const { found, flattened, partial, lowered, bailed } = report.totals
    return { found, flattened, partial, lowered, bailed }
  }
  const plainLog = Bun.stripANSI(log)
  const match = plainLog.match(/index\s+·\s+(\d+) found\s+·\s+(\d+) opt\s+·\s+(\d+) flat/)
  if (!match) {
    process.stderr.write(plainLog)
    throw new Error(`could not parse ${variant.id} compiler counters`)
  }
  return {
    found: Number(match[1]),
    legacyOptimized: Number(match[2]),
    flattened: Number(match[3]),
  }
}

const temporaryRoot = mkdtempSync(join(tmpdir(), 'tamagui-attribute-guard-'))
try {
  const results = Object.fromEntries(
    variants.map((variant) => {
      const withoutAttributes = runVariant(variant, true, temporaryRoot)
      const withAttributes = runVariant(variant, false, temporaryRoot)
      return [
        variant.id,
        {
          withoutAttributes,
          withAttributes,
          unchanged: JSON.stringify(withoutAttributes) === JSON.stringify(withAttributes),
          semantics:
            variant.stats === 'json'
              ? 'V3 compiler JSON counters'
              : 'V2 legacy build log; found includes styled and optimized overlaps flattened (styled is zero in this fixture)',
        },
      ]
    })
  )
  const passes = Object.values(results).every(({ unchanged }) => unchanged)
  const workload = JSON.parse(
    execFileSync(
      'bun',
      [join(import.meta.dir, 'run-benchmarks.ts'), '--verify-workload'],
      { cwd: import.meta.dir }
    ).toString()
  )
  mkdirSync(dirname(output), { recursive: true })
  writeFileSync(
    output,
    `${JSON.stringify(
      {
        schemaVersion: 1,
        metadata: {
          commit: git('rev-parse', 'HEAD'),
          branch: git('branch', '--show-current'),
          dirty: git('status', '--porcelain').length > 0,
          buildMode: 'production',
          workload,
        },
        assertion:
          'Removing only data-bench-* conformance selectors before Tamagui extraction leaves compiler counters unchanged.',
        results,
        passes,
      },
      null,
      2
    )}\n`
  )
  console.log(`Attribute compiler guard: ${output}`)
  if (!passes)
    throw new Error('data-bench assertion attributes changed compiler counters')
} finally {
  rmSync(temporaryRoot, { recursive: true, force: true })
}
