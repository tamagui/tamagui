#!/usr/bin/env bun

import { readFileSync, writeFileSync } from 'node:fs'

interface CompilerModule {
  id: string
  stats: {
    found: number
    lowered?: number
    legacyOptimized?: number
    flattened: number
    partial: number
    styled: number
    bailed: number
    notFlattened: number
  }
  diagnostics: Array<{ code: string; message: string; component?: string }>
}

interface CompilerReport {
  schemaVersion: 1
  modules: CompilerModule[]
}

interface LegacyCompilerModule {
  id: string
  stats: {
    found: number
    optimized: number
    flattened: number
    styled: number
  }
}

const args = process.argv.slice(2)
const inputPath = args.find((arg) => !arg.startsWith('--'))
const outputPath = args.find((arg) => arg.startsWith('--output='))?.split('=')[1]
const scope = args.find((arg) => arg.startsWith('--scope='))?.split('=')[1] ?? 'all'
const format =
  args.find((arg) => arg.startsWith('--format='))?.split('=')[1] ?? 'compiler-json'
const revision = args.find((arg) => arg.startsWith('--revision='))?.split('=')[1]
const bentoRevision = args
  .find((arg) => arg.startsWith('--bento-revision='))
  ?.split('=')[1]
const buildCommand = args.find((arg) => arg.startsWith('--build-command='))?.slice(16)

if (!inputPath || !outputPath) {
  throw new Error(
    'usage: bun summarize-compiler-stats.ts INPUT --format=compiler-json|legacy-jsonl ' +
      '--scope=all|homepage --output=OUTPUT'
  )
}
if (scope !== 'all' && scope !== 'homepage') {
  throw new Error(`unknown compiler scope: ${scope}`)
}
if (format !== 'compiler-json' && format !== 'legacy-jsonl') {
  throw new Error(`unknown compiler stats format: ${format}`)
}

const source = readFileSync(inputPath, 'utf8')
let compiler = 'v3'
let modules: CompilerModule[]

if (format === 'legacy-jsonl') {
  compiler = 'v2-legacy'
  const legacyModules = source
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LegacyCompilerModule)
  const uniqueModules = new Map<string, LegacyCompilerModule>()
  for (const module of legacyModules) {
    const previous = uniqueModules.get(module.id)
    if (previous && JSON.stringify(previous.stats) !== JSON.stringify(module.stats)) {
      throw new Error(`conflicting legacy compiler stats for module: ${module.id}`)
    }
    uniqueModules.set(module.id, module)
  }
  modules = [...uniqueModules.values()].map(({ id, stats }) => {
    const found = stats.found
    const notFlattened = found - stats.flattened
    return {
      id,
      stats: {
        found,
        legacyOptimized: stats.optimized,
        flattened: stats.flattened,
        partial: 0,
        styled: stats.styled,
        bailed: notFlattened,
        notFlattened,
      },
      diagnostics: [],
    }
  })
} else {
  const input = JSON.parse(source) as CompilerReport
  if (input.schemaVersion !== 1 || !Array.isArray(input.modules)) {
    throw new Error(`unsupported compiler stats report: ${inputPath}`)
  }
  modules = input.modules
}

const selector =
  scope === 'homepage'
    ? {
        id: 'tamagui.dev-homepage',
        include: ['app/(site)/index.tsx', 'features/site/home/**'],
      }
    : { id: 'all', include: ['**'] }
modules = modules.filter(
  ({ id }) =>
    scope === 'all' ||
    id === 'app/(site)/index.tsx' ||
    id.startsWith('features/site/home/')
)
const totals = {
  modules: modules.length,
  found: 0,
  ...(format === 'legacy-jsonl' ? { legacyOptimized: 0 } : { lowered: 0 }),
  flattened: 0,
  partial: 0,
  styled: 0,
  bailed: 0,
  notFlattened: 0,
  flattenRate: 0,
}
const bailoutCodes = new Map<string, number>()
const bailoutReasons = new Map<
  string,
  { code: string; message: string; component?: string; count: number }
>()

for (const module of modules) {
  for (const key of [
    'found',
    'flattened',
    'partial',
    'styled',
    'bailed',
    'notFlattened',
  ] as const) {
    totals[key] += module.stats[key]
  }
  if (format === 'legacy-jsonl') {
    totals.legacyOptimized! += module.stats.legacyOptimized!
  } else {
    totals.lowered! += module.stats.lowered!
  }
  for (const diagnostic of module.diagnostics) {
    bailoutCodes.set(diagnostic.code, (bailoutCodes.get(diagnostic.code) ?? 0) + 1)
    const key = JSON.stringify([
      diagnostic.code,
      diagnostic.message,
      diagnostic.component,
    ])
    const reason = bailoutReasons.get(key)
    if (reason) {
      reason.count++
    } else {
      bailoutReasons.set(key, { ...diagnostic, count: 1 })
    }
  }
}
totals.flattenRate = totals.found ? totals.flattened / totals.found : 0

const report = {
  schemaVersion: 1,
  compiler,
  source: {
    ...(revision ? { revision } : {}),
    ...(bentoRevision ? { dependencies: { bento: bentoRevision } } : {}),
    format,
    ...(buildCommand ? { buildCommand } : {}),
    ...(format === 'legacy-jsonl'
      ? {
          environment: bentoRevision
            ? 'Production build with the pinned real Bento source.'
            : 'Production build with the unavailable optional Bento package replaced by null stubs.',
          scopeQualification: bentoRevision
            ? 'Homepage parity uses the exact selector; full-site source scope differs across revisions.'
            : 'Full-site totals are environment-distorted; only the homepage selector is used for parity.',
        }
      : {}),
  },
  selector,
  ...(format === 'legacy-jsonl'
    ? {
        limitations: [
          'V2 legacy stats do not expose bailout diagnostics or partial flattening.',
          'styled declarations are separate from JSX candidates and are not part of found.',
          'legacyOptimized overlaps flattened and is not comparable to V3 lowered.',
        ],
      }
    : {}),
  totals,
  bailoutCodes: Object.fromEntries(
    [...bailoutCodes].sort(
      ([leftCode, leftCount], [rightCode, rightCount]) =>
        rightCount - leftCount || leftCode.localeCompare(rightCode)
    )
  ),
  bailoutReasons: [...bailoutReasons.values()].sort(
    (left, right) =>
      right.count - left.count ||
      left.code.localeCompare(right.code) ||
      left.message.localeCompare(right.message) ||
      (left.component ?? '').localeCompare(right.component ?? '')
  ),
  modules,
}

writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
console.log(
  `${selector.id}: ${totals.flattened}/${totals.found} flattened ` +
    `(${(totals.flattenRate * 100).toFixed(1)}%), ${totals.bailed} bailed`
)
