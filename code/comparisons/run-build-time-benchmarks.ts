#!/usr/bin/env bun

import { spawnSync } from 'child_process'
import { createHash } from 'crypto'
import {
  closeSync,
  existsSync,
  mkdirSync,
  mkdtempSync,
  openSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'fs'
import { arch, cpus, platform, release, tmpdir, totalmem } from 'os'
import { dirname, isAbsolute, join, relative } from 'path'
import { performance } from 'perf_hooks'
import { createRandom, shuffle, summarize } from './benchmark-statistics'
import { acquireBenchmarkLock } from './shared/benchmarkLock'

const repositoryRoot = join(import.meta.dir, '../..')
const args = process.argv.slice(2)
const samples = Number.parseInt(
  args.find((arg) => arg.startsWith('--samples='))?.slice('--samples='.length) ?? '5',
  10
)
const warmups = Number.parseInt(
  args.find((arg) => arg.startsWith('--warmups='))?.slice('--warmups='.length) ?? '1',
  10
)
const seed = Number.parseInt(
  args.find((arg) => arg.startsWith('--seed='))?.slice('--seed='.length) ?? '27003',
  10
)
const outputArgument =
  args.find((arg) => arg.startsWith('--output='))?.slice('--output='.length) ??
  'code/comparisons/output/build-time-benchmarks.json'
const outputPath = isAbsolute(outputArgument)
  ? outputArgument
  : join(repositoryRoot, outputArgument)
const selectedBundlers = new Set(
  (
    args.find((arg) => arg.startsWith('--bundlers='))?.slice('--bundlers='.length) ??
    'vite,metro'
  ).split(',')
)

if (!Number.isInteger(samples) || samples < 2)
  throw new Error('--samples must be at least 2')
if (!Number.isInteger(warmups) || warmups < 0)
  throw new Error('--warmups must be nonnegative')
if (!Number.isInteger(seed)) throw new Error('--seed must be an integer')
for (const bundler of selectedBundlers) {
  if (bundler !== 'vite' && bundler !== 'metro') {
    throw new Error(`unknown bundler: ${bundler}`)
  }
}

type Phase = 'warmup' | 'sample'
type CacheState = 'cold' | 'warm'

interface Arm {
  id: string
  version: 'v2' | 'v3'
  bundler: 'vite' | 'metro'
  project: string
  command: string
  commandArgs: (cacheState: CacheState, outputDirectory: string) => string[]
  env: Record<string, string>
  clearedForCold: string[]
  clearedBeforeEveryBuild: string[]
  versions: Record<string, string>
}

interface Trial {
  sequence: number
  phase: Phase
  round: number
  arm: string
  bundler: Arm['bundler']
  version: Arm['version']
  cacheState: CacheState
  milliseconds: number
}

function git(...gitArgs: string[]) {
  const result = spawnSync('git', gitArgs, { cwd: repositoryRoot, encoding: 'utf8' })
  if (result.status !== 0)
    throw new Error(result.stderr || `git ${gitArgs.join(' ')} failed`)
  return result.stdout.trim()
}

function commandVersion(command: string, commandArgs: string[]) {
  const result = spawnSync(command, commandArgs, { encoding: 'utf8' })
  if (result.status !== 0) {
    throw new Error(result.stderr || `${command} ${commandArgs.join(' ')} failed`)
  }
  return result.stdout.trim()
}

function sha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function packageVersion(project: string, packageName: string) {
  let current = join(repositoryRoot, project)
  while (true) {
    const packagePath = join(
      current,
      'node_modules',
      ...packageName.split('/'),
      'package.json'
    )
    if (existsSync(packagePath)) {
      return JSON.parse(readFileSync(packagePath, 'utf8')).version as string
    }
    const parent = dirname(current)
    if (parent === current || !parent.startsWith(repositoryRoot)) {
      throw new Error(`${project} cannot resolve ${packageName}`)
    }
    current = parent
  }
}

function fileReceipt(path: string) {
  const absolutePath = join(repositoryRoot, path)
  return {
    path,
    bytes: statSync(absolutePath).size,
    sha256: sha256(absolutePath),
  }
}

function verifyWebCorpus() {
  const files = ['src/index.tsx', 'src/tamagui.config.ts']
  const receipts = files.map((file) => {
    const v2Path = join(repositoryRoot, 'code/comparisons/tamagui-v2-bench', file)
    const v3Path = join(repositoryRoot, 'code/comparisons/tamagui-bench', file)
    const v2 = readFileSync(v2Path)
    const v3 = readFileSync(v3Path)
    if (!v2.equals(v3)) throw new Error(`web corpus differs between V2 and V3: ${file}`)
    return fileReceipt(`code/comparisons/tamagui-bench/${file}`)
  })
  return {
    byteIdenticalAcrossVersions: true,
    description: 'the production web benchmark application and Tamagui configuration',
    files: receipts,
    v2Mirrors: files.map((file) => `code/comparisons/tamagui-v2-bench/${file}`),
  }
}

function nativeCorpus() {
  const sharedFiles = [
    'code/comparisons/shared/native-compiled-bench.tsx',
    'code/comparisons/shared/native-bench-spec.ts',
    'code/compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx',
  ]
  return {
    byteIdenticalAcrossVersions: true,
    description:
      'the shared compiled native benchmark imported by both version-specific Expo entry modules',
    files: sharedFiles.map(fileReceipt),
    entryDifference:
      'the V2 and V3 App.tsx wrappers differ only in their framework receipt string and version-specific config import',
  }
}

const arms: Arm[] = [
  {
    id: 'vite-v3',
    version: 'v3',
    bundler: 'vite',
    project: 'code/comparisons/tamagui-bench',
    command: join(repositoryRoot, 'node_modules/.bin/vite'),
    commandArgs: (_cacheState, outputDirectory) => ['build', '--outDir', outputDirectory],
    env: { EXTRACT: '1' },
    clearedForCold: [
      'node_modules/.cache/tamagui',
      'node_modules/.vite',
      'project build output',
    ],
    clearedBeforeEveryBuild: ['project build output'],
    versions: {},
  },
  {
    id: 'vite-v2',
    version: 'v2',
    bundler: 'vite',
    project: 'code/comparisons/tamagui-v2-bench',
    command: join(
      repositoryRoot,
      'code/comparisons/tamagui-v2-bench/node_modules/.bin/vite'
    ),
    commandArgs: (_cacheState, outputDirectory) => ['build', '--outDir', outputDirectory],
    env: { EXTRACT: '1' },
    clearedForCold: [
      'project node_modules/.cache/tamagui',
      'project node_modules/.vite',
      'project build output',
    ],
    clearedBeforeEveryBuild: ['project build output'],
    versions: {},
  },
  {
    id: 'metro-v3',
    version: 'v3',
    bundler: 'metro',
    project: 'code/comparisons/tamagui-bench-native-compiled',
    command: join(repositoryRoot, 'node_modules/.bin/expo'),
    commandArgs: (cacheState, outputDirectory) => [
      'export',
      '--platform',
      'ios',
      '--output-dir',
      outputDirectory,
      '--max-workers',
      '4',
      ...(cacheState === 'cold' ? ['--clear'] : []),
    ],
    env: { NODE_ENV: 'production', EXPO_NO_TELEMETRY: '1' },
    clearedForCold: [
      'Metro transform and file-map caches via expo export --clear',
      'project node_modules/.cache/tamagui/metro-compiler',
      'project export output',
    ],
    clearedBeforeEveryBuild: ['project export output'],
    versions: {},
  },
  {
    id: 'metro-v2',
    version: 'v2',
    bundler: 'metro',
    project: 'code/comparisons/tamagui-v2-bench-native-compiled',
    command: join(repositoryRoot, 'node_modules/.bin/expo'),
    commandArgs: (cacheState, outputDirectory) => [
      'export',
      '--platform',
      'ios',
      '--output-dir',
      outputDirectory,
      '--max-workers',
      '4',
      ...(cacheState === 'cold' ? ['--clear'] : []),
    ],
    env: { NODE_ENV: 'production', EXPO_NO_TELEMETRY: '1' },
    clearedForCold: [
      'Metro transform and file-map caches via expo export --clear',
      'project node_modules/.cache/tamagui/metro-compiler when present',
      'project export output',
    ],
    clearedBeforeEveryBuild: ['project export output'],
    versions: {},
  },
].filter((arm) => selectedBundlers.has(arm.bundler))

for (const arm of arms) {
  const compilerPackage =
    arm.bundler === 'vite' ? '@tamagui/vite-plugin' : '@tamagui/metro-plugin'
  arm.versions = {
    compiler: packageVersion(arm.project, compilerPackage),
    bundler: packageVersion(arm.project, arm.bundler === 'vite' ? 'vite' : 'metro'),
    bundlerRunner: packageVersion(arm.project, arm.bundler === 'vite' ? 'vite' : 'expo'),
    react: packageVersion(arm.project, 'react'),
  }
  if (arm.version === 'v2' && arm.versions.compiler !== '2.6.2') {
    throw new Error(
      `${arm.id} must resolve ${compilerPackage}@2.6.2, got ${arm.versions.compiler}`
    )
  }
}

const scratchDirectory = mkdtempSync(join(tmpdir(), 'tamagui-build-time-'))
const logDirectory = join(scratchDirectory, 'logs')
mkdirSync(logDirectory)
const releaseLock = acquireBenchmarkLock('V2/V3 cold and warm Vite and Metro builds')

function clearColdState(arm: Arm) {
  const projectRoot = join(repositoryRoot, arm.project)
  if (arm.bundler === 'vite') {
    const dependencyRoot = arm.version === 'v2' ? projectRoot : repositoryRoot
    rmSync(join(dependencyRoot, 'node_modules/.cache/tamagui'), {
      recursive: true,
      force: true,
    })
    rmSync(join(dependencyRoot, 'node_modules/.vite'), { recursive: true, force: true })
  } else {
    rmSync(join(projectRoot, 'node_modules/.cache/tamagui/metro-compiler'), {
      recursive: true,
      force: true,
    })
  }
}

function runBuild(arm: Arm, cacheState: CacheState, sequence: number) {
  if (cacheState === 'cold') clearColdState(arm)
  const outputDirectory = join(scratchDirectory, `${arm.id}-${sequence}-${cacheState}`)
  rmSync(outputDirectory, { recursive: true, force: true })
  const logPath = join(logDirectory, `${arm.id}-${sequence}-${cacheState}.log`)
  const log = openSync(logPath, 'w')
  const start = performance.now()
  const result = spawnSync(arm.command, arm.commandArgs(cacheState, outputDirectory), {
    cwd: join(repositoryRoot, arm.project),
    env: { ...process.env, ...arm.env },
    stdio: ['ignore', log, log],
  })
  const milliseconds = performance.now() - start
  closeSync(log)
  if (result.status !== 0) {
    throw new Error(
      `${arm.id} ${cacheState} build failed with status ${result.status}; log: ${logPath}`
    )
  }
  return milliseconds
}

function quantile(values: readonly number[], percentile: number) {
  const sorted = [...values].sort((left, right) => left - right)
  const position = (sorted.length - 1) * percentile
  const lower = Math.floor(position)
  const fraction = position - lower
  const lowerValue = sorted[lower]!
  const upperValue = sorted[lower + 1] ?? lowerValue
  return lowerValue + (upperValue - lowerValue) * fraction
}

function statistics(values: readonly number[]) {
  const base = summarize(values)
  const sorted = [...values].sort((left, right) => left - right)
  return {
    ...base,
    median: quantile(values, 0.5),
    q1: quantile(values, 0.25),
    q3: quantile(values, 0.75),
    minimum: sorted[0]!,
    maximum: sorted.at(-1)!,
  }
}

try {
  const random = createRandom(seed)
  const trials: Trial[] = []
  let sequence = 0
  for (const phase of ['warmup', 'sample'] as const) {
    const rounds = phase === 'warmup' ? warmups : samples
    for (let round = 0; round < rounds; round++) {
      for (const arm of shuffle(arms, random)) {
        for (const cacheState of ['cold', 'warm'] as const) {
          const milliseconds = runBuild(arm, cacheState, sequence)
          trials.push({
            sequence,
            phase,
            round,
            arm: arm.id,
            bundler: arm.bundler,
            version: arm.version,
            cacheState,
            milliseconds,
          })
          console.log(
            `${phase} ${round + 1}/${rounds} ${arm.id} ${cacheState}: ${milliseconds.toFixed(1)} ms`
          )
          sequence++
        }
      }
    }
  }

  const summary = Object.fromEntries(
    arms.map((arm) => [
      arm.id,
      Object.fromEntries(
        (['cold', 'warm'] as const).map((cacheState) => [
          cacheState,
          statistics(
            trials
              .filter(
                (trial) =>
                  trial.phase === 'sample' &&
                  trial.arm === arm.id &&
                  trial.cacheState === cacheState
              )
              .map((trial) => trial.milliseconds)
          ),
        ])
      ),
    ])
  )
  const sourceDirtyBeforeOutput = git('status', '--porcelain').length > 0
  const report = {
    schemaVersion: 1,
    metadata: {
      generatedAt: new Date().toISOString(),
      commit: git('rev-parse', 'HEAD'),
      branch: git('branch', '--show-current'),
      sourceDirtyBeforeOutput,
      publicationQualification:
        'Baseline harness receipt only. Do not publish a compiler-speed claim from these results. The arms use their supported real bundlers and pinned package trees, so bundler versions and compiler versions both differ. Cold runs clear named software caches but do not flush the operating system filesystem cache. The owner must decide whether later measurements are quotable.',
      measurementBoundary:
        'wall-clock from spawning the production bundler command until that command exits after writing its complete build output; dependency installation is excluded',
      coldDefinition:
        'a new bundler process after removing the arm-specific compiler cache and bundler cache named in arms[].clearedForCold; Metro additionally receives expo export --clear; operating system filesystem caches are not flushed',
      warmDefinition:
        'a new bundler process immediately after the same arm cold build, preserving compiler, transform, dependency, and operating system filesystem caches; only the previous build output directory is absent',
      ordering:
        'one seeded PRNG shuffles arms independently in every warmup and retained round; each arm always runs cold then warm so warm cache provenance is exact',
      randomSeed: seed,
      machine: {
        platform: platform(),
        osRelease: release(),
        architecture: arch(),
        cpu: cpus()[0]?.model ?? 'unknown',
        logicalCpuCount: cpus().length,
        totalMemoryBytes: totalmem(),
      },
      tools: {
        bun: Bun.version,
        node: commandVersion('node', ['--version']),
      },
    },
    workload: {
      warmups,
      samples,
      web: verifyWebCorpus(),
      native: nativeCorpus(),
    },
    arms: arms.map(({ commandArgs: _commandArgs, env, ...arm }) => ({
      ...arm,
      command: relative(repositoryRoot, arm.command),
      environment: env,
    })),
    trials,
    summary,
  }
  mkdirSync(dirname(outputPath), { recursive: true })
  writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
  console.log(`wrote ${relative(repositoryRoot, outputPath)}`)
} finally {
  releaseLock()
  rmSync(scratchDirectory, { recursive: true, force: true })
}
