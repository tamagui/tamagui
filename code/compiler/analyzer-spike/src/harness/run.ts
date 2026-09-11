import { mkdir, writeFile } from 'node:fs/promises'
import { cpus } from 'node:os'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { spawnSync } from 'node:child_process'

import { yukuFactory, type CandidateFactory } from '@tamagui/compiler-core'
import { loadFixtureProject, loadHostFixtureProject } from '../fixture'
import { assertCandidateCorrectness } from './correctness'
import {
  measureCandidateMemory,
  measureCandidateTiming,
  type CandidateMeasurement,
  type MemoryMeasurement,
} from './measure'

const candidateNames = ['yuku'] as const
const workspaceRoot = resolve(dirname(fileURLToPath(import.meta.url)), '../..')
const evidencePath = resolve(workspaceRoot, 'evidence/results.json')

async function loadFactory(name: string): Promise<CandidateFactory> {
  if (name === 'yuku') {
    return yukuFactory
  }
  throw new Error(`Unknown analyzer candidate: ${name}`)
}

function runWorker<T>(factory: CandidateFactory, mode: 'timing' | 'memory'): T {
  const result = spawnSync(
    process.execPath,
    ['--expose-gc', fileURLToPath(import.meta.url), '--worker', mode, factory.name],
    { encoding: 'utf8', env: { ...process.env, TAMAGUI_E1_EVIDENCE_WORKER: '1' } }
  )
  if (result.status !== 0) {
    throw new Error(
      `${factory.name} measurement failed (${result.status})\n${result.stdout}\n${result.stderr}`
    )
  }
  const resultLine = result.stdout
    .split('\n')
    .find((line) => line.startsWith('TAMAGUI_E1_RESULT='))
  if (!resultLine) throw new Error(`${factory.name} measurement returned no result`)
  return JSON.parse(resultLine.slice('TAMAGUI_E1_RESULT='.length)) as T
}

async function main(): Promise<void> {
  const workerIndex = process.argv.indexOf('--worker')
  if (workerIndex !== -1) {
    const mode = process.argv[workerIndex + 1]
    const factory = await loadFactory(process.argv[workerIndex + 2] ?? '')
    const result =
      mode === 'timing'
        ? measureCandidateTiming(factory)
        : mode === 'memory'
          ? measureCandidateMemory(factory)
          : (() => {
              throw new Error(`Unknown measurement mode: ${mode}`)
            })()
    process.stdout.write(`TAMAGUI_E1_RESULT=${JSON.stringify(result)}\n`)
    return
  }

  const project = await loadFixtureProject()
  const hostProject = await loadHostFixtureProject()
  const factories = await Promise.all(candidateNames.map(loadFactory))
  const correctness = factories.map((factory) =>
    assertCandidateCorrectness(factory, project, hostProject)
  )
  const timings = factories.map((factory) =>
    runWorker<Omit<CandidateMeasurement, 'memory'>>(factory, 'timing')
  )
  const memories = factories.map((factory) =>
    runWorker<MemoryMeasurement>(factory, 'memory')
  )
  const measurements: CandidateMeasurement[] = timings.map((timing, index) => ({
    ...timing,
    memory: memories[index]!,
  }))

  const report = {
    schemaVersion: 1,
    environment: {
      platform: process.platform,
      arch: process.arch,
      runtime: process.release.name,
      runtimeVersion: process.version,
      bunVersion: (process.versions as Record<string, string | undefined>).bun ?? null,
      cpu: cpus()[0]?.model ?? 'unknown',
      cpuCount: cpus().length,
      command: 'bun --expose-gc src/harness/run.ts',
    },
    packageVersions: {
      yukuAnalyzer: '0.6.1',
      magicString: '0.30.21',
      traceMapping: '0.3.31',
    },
    thresholds: {
      correctnessAndMaps: 'absolute',
      warmP95Ms: 50,
      warmToColdMedianRatio: 0.25,
      yukuApi: 'public API only; no patch, fork, or internal imports',
    },
    correctness,
    measurements,
  }

  await mkdir(dirname(evidencePath), { recursive: true })
  await writeFile(evidencePath, `${JSON.stringify(report, null, 2)}\n`)
  process.stdout.write(`${JSON.stringify(report, null, 2)}\n`)
}

await main()
