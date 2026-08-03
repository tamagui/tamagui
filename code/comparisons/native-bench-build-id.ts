#!/usr/bin/env bun
import { execFileSync } from 'child_process'
import { createHash } from 'crypto'
import { readFileSync } from 'fs'
import { join } from 'path'

export const NATIVE_BENCH_FRAMEWORKS = [
  'tamagui-v2-runtime',
  'tamagui-v3-runtime',
  'tamagui-v2-compiled',
  'tamagui-v3-compiled',
] as const

export type NativeBenchFramework = (typeof NATIVE_BENCH_FRAMEWORKS)[number]

const comparisonRoot = import.meta.dir
const repositoryRoot = join(comparisonRoot, '../..')
const commonFiles = [
  'code/comparisons/native-bench-build-id.ts',
  'code/comparisons/run-native-v2-v3.ts',
  'code/comparisons/shared/native-bench-spec.ts',
  'code/comparisons/shared/native-tamagui-config.ts',
]
const fixtureFiles = {
  runtime: ['code/comparisons/shared/native-runtime-bench.ts'],
  compiled: [
    'code/comparisons/shared/native-compiled-bench.tsx',
    'code/compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx',
  ],
} as const
const appDirectories: Record<NativeBenchFramework, string> = {
  'tamagui-v2-runtime': 'tamagui-v2-bench-native',
  'tamagui-v3-runtime': 'tamagui-bench-native',
  'tamagui-v2-compiled': 'tamagui-v2-bench-native-compiled',
  'tamagui-v3-compiled': 'tamagui-bench-native-compiled',
}

export function nativeBenchBuildIdentity(framework: NativeBenchFramework) {
  const fixture = framework.endsWith('-compiled') ? 'compiled' : 'runtime'
  const appDirectory = `code/comparisons/${appDirectories[framework]}`
  const appFiles = [
    `${appDirectory}/App.tsx`,
    `${appDirectory}/app.json`,
    `${appDirectory}/index.js`,
    `${appDirectory}/metro.config.js`,
    `${appDirectory}/package.json`,
    `${appDirectory}/tamagui.config.ts`,
  ]
  if (fixture === 'compiled') appFiles.push(`${appDirectory}/babel.config.js`)
  if (framework.startsWith('tamagui-v2')) {
    appFiles.push(`${appDirectory}/package-lock.json`)
  }
  const files = [...commonFiles, ...fixtureFiles[fixture], ...appFiles].sort()
  const fileSha256 = Object.fromEntries(
    files.map((path) => [
      path,
      createHash('sha256')
        .update(readFileSync(join(repositoryRoot, path)))
        .digest('hex'),
    ])
  )
  const sourceCommit = execFileSync('git', ['rev-parse', 'HEAD'], {
    cwd: repositoryRoot,
  })
    .toString()
    .trim()
  const payload = { schemaVersion: 1, framework, fixture, sourceCommit, fileSha256 }
  return {
    ...payload,
    buildId: createHash('sha256').update(JSON.stringify(payload)).digest('hex'),
  }
}

if (import.meta.main) {
  const framework = process.argv
    .slice(2)
    .find((value) => value.startsWith('--framework='))
    ?.slice('--framework='.length) as NativeBenchFramework | undefined
  if (!framework || !NATIVE_BENCH_FRAMEWORKS.includes(framework)) {
    throw new Error(`--framework must be one of: ${NATIVE_BENCH_FRAMEWORKS.join(',')}`)
  }
  console.log(nativeBenchBuildIdentity(framework).buildId)
}
