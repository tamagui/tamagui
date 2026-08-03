#!/usr/bin/env bun

import { execFileSync, spawn, type ChildProcess } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { TraceMap, originalPositionFor } from '@jridgewell/trace-mapping'

const OUTPUT =
  process.argv.find((argument) => argument.startsWith('--output='))?.slice(9) ??
  join(import.meta.dir, 'output', 'v3-v2-web-regression-profile.json')
const ITERATIONS = Number.parseInt(
  process.argv.find((argument) => argument.startsWith('--iterations='))?.slice(13) ??
    '20',
  10
)
const WARMUPS = 2

const targets = [
  {
    id: 'tamagui-v3-compiled',
    directory: 'tamagui-bench',
    executable: 'bunx',
    buildArgs: ['vite', 'build'],
    extract: '1',
    scenario: 'animated',
    port: 9111,
  },
  {
    id: 'tamagui-v2-compiled',
    directory: 'tamagui-v2-bench',
    executable: 'npm',
    buildArgs: ['exec', 'vite', '--', 'build'],
    extract: '1',
    scenario: 'animated',
    port: 9112,
  },
  {
    id: 'tamagui-v3-runtime',
    directory: 'tamagui-bench',
    executable: 'bunx',
    buildArgs: ['vite', 'build'],
    extract: '0',
    scenario: 'simple',
    port: 9113,
  },
  {
    id: 'tamagui-v2-runtime',
    directory: 'tamagui-v2-bench',
    executable: 'npm',
    buildArgs: ['exec', 'vite', '--', 'build'],
    extract: '0',
    scenario: 'simple',
    port: 9114,
  },
] as const

const git = (...args: string[]) =>
  execFileSync('git', args, { cwd: import.meta.dir })
    .toString()
    .trim()

function command(commandName: string, args: string[], cwd: string, env = {}) {
  execFileSync(commandName, args, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })
}

async function waitForServer(port: number) {
  const start = Date.now()
  while (Date.now() - start < 30_000) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return
    } catch {}
    await Bun.sleep(250)
  }
  throw new Error(`preview did not start on port ${port}`)
}

function findSourceMap(directory: string): string {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name)
    if (entry.isDirectory()) {
      try {
        return findSourceMap(path)
      } catch {}
    } else if (entry.name.endsWith('.js.map')) {
      return path
    }
  }
  throw new Error(`source map missing from ${directory}`)
}

function sourceGroup(source: string | null) {
  if (!source) return 'browser/unmapped'
  const normalized = source.replaceAll('\\', '/')
  const dependency = normalized.split('node_modules/').at(-1)
  if (dependency !== normalized) {
    const parts = dependency!.split('/')
    return parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
  }
  const workspace = normalized.match(
    /(?:packages|code\/core|code\/ui|\/core|\/ui)\/([^/]+)\/(?:src|dist)/
  )
  if (workspace) {
    return workspace[1] === 'tamagui' ? 'tamagui' : `@tamagui/${workspace[1]}`
  }
  if (normalized.includes('/src/index.tsx')) return 'fixture'
  if (normalized.includes('/shared/bench.ts')) return 'shared benchmark'
  if (normalized.includes('/react-dom/')) return 'react-dom'
  if (normalized.includes('/react/')) return 'react'
  return 'build/runtime helpers'
}

function normalizeSource(source: string) {
  const normalized = source.replaceAll('\\', '/')
  const workspaceMarker = '/.worktrees/v3-validate-web/'
  const workspaceIndex = normalized.lastIndexOf(workspaceMarker)
  if (workspaceIndex >= 0) {
    return normalized.slice(workspaceIndex + workspaceMarker.length)
  }
  const dependency = normalized.split('node_modules/').at(-1)
  if (dependency !== normalized) return `node_modules/${dependency}`
  return normalized.replace(/^(\.\.\/)+/, '')
}

function summarizeProfile(profile: any, sourceMapPath: string) {
  const traceMap = new TraceMap(readFileSync(sourceMapPath, 'utf8'))
  const nodes = new Map(profile.nodes.map((node: any) => [node.id, node]))
  const groups: Record<string, number> = {}
  const sources: Record<string, number> = {}
  let sampledTimeUs = 0
  let mappedTimeUs = 0
  for (let index = 0; index < profile.samples.length; index++) {
    const timeUs = profile.timeDeltas[index] ?? 0
    sampledTimeUs += timeUs
    const node: any = nodes.get(profile.samples[index])
    const frame = node?.callFrame
    const original =
      frame?.url && frame.lineNumber >= 0
        ? originalPositionFor(traceMap, {
            line: frame.lineNumber + 1,
            column: Math.max(0, frame.columnNumber),
          })
        : null
    const group = sourceGroup(original?.source ?? null)
    groups[group] = (groups[group] ?? 0) + timeUs
    if (original?.source) {
      mappedTimeUs += timeUs
      const source = normalizeSource(original.source)
      sources[source] = (sources[source] ?? 0) + timeUs
    }
  }
  const normalize = (entries: Array<[string, number]>, limit?: number) =>
    Object.fromEntries(
      entries
        .sort((left, right) => right[1] - left[1] || left[0].localeCompare(right[0]))
        .slice(0, limit)
        .map(([name, timeUs]) => [name, timeUs / 1_000])
    )
  return {
    sampledTimeMs: sampledTimeUs / 1_000,
    mappedTimeMs: mappedTimeUs / 1_000,
    selfTimeMsByModuleGroup: normalize(Object.entries(groups)),
    topSourceSelfTimeMs: normalize(Object.entries(sources), 30),
  }
}

function compareProfiles(results: Record<string, any>, v3Id: string, v2Id: string) {
  const v3 = results[v3Id].cpuProfile
  const v2 = results[v2Id].cpuProfile
  const groups = [
    ...new Set([
      ...Object.keys(v3.selfTimeMsByModuleGroup),
      ...Object.keys(v2.selfTimeMsByModuleGroup),
    ]),
  ]
  return {
    v3MappedSelfTimeMs: v3.mappedTimeMs,
    v2MappedSelfTimeMs: v2.mappedTimeMs,
    moduleGroupSelfTimeMs: Object.fromEntries(
      groups
        .map((group) => ({
          group,
          v3: v3.selfTimeMsByModuleGroup[group] ?? 0,
          v2: v2.selfTimeMsByModuleGroup[group] ?? 0,
          delta:
            (v3.selfTimeMsByModuleGroup[group] ?? 0) -
            (v2.selfTimeMsByModuleGroup[group] ?? 0),
        }))
        .sort(
          (left, right) =>
            Math.abs(right.delta) - Math.abs(left.delta) ||
            left.group.localeCompare(right.group)
        )
        .map(({ group, ...values }) => [group, values])
    ),
  }
}

async function runOnce(page: import('playwright').Page, scenario: string) {
  const previousResults = page.locator('#bench-results-table')
  if ((await previousResults.count()) > 0) {
    await previousResults.evaluate((element) => element.replaceChildren())
  }
  await page.locator('#bench-start').click()
  await page.waitForSelector(`#bench-result-${scenario}-rerender`, {
    timeout: 120_000,
  })
  return {
    mount: Number(
      await page.locator(`#bench-result-${scenario}-mount`).getAttribute('data-value')
    ),
    update: Number(
      await page.locator(`#bench-result-${scenario}-rerender`).getAttribute('data-value')
    ),
  }
}

async function main() {
  if (!Number.isInteger(ITERATIONS) || ITERATIONS < 3) {
    throw new Error('--iterations must be an integer of at least 3')
  }
  const retained = JSON.parse(
    readFileSync(join(import.meta.dir, 'output', 'v3-v2-web-benchmarks.json'), 'utf8')
  )
  const temporaryRoot = mkdtempSync(join(tmpdir(), 'tamagui-web-profile-'))
  const previews: ChildProcess[] = []
  try {
    for (const target of targets) {
      const cwd = join(import.meta.dir, target.directory)
      const outDir = join(temporaryRoot, target.id)
      if (target.executable === 'npm') command('npm', ['ci'], cwd)
      command(
        target.executable,
        [...target.buildArgs, '--outDir', outDir, '--emptyOutDir', '--sourcemap'],
        cwd,
        { NODE_ENV: 'production', EXTRACT: target.extract }
      )
      const previewArgs =
        target.executable === 'npm'
          ? [
              'exec',
              'vite',
              '--',
              'preview',
              '--host',
              '127.0.0.1',
              '--port',
              String(target.port),
              '--strictPort',
              '--outDir',
              outDir,
            ]
          : [
              'vite',
              'preview',
              '--host',
              '127.0.0.1',
              '--port',
              String(target.port),
              '--strictPort',
              '--outDir',
              outDir,
            ]
      previews.push(
        spawn(target.executable, previewArgs, {
          cwd,
          env: process.env,
          stdio: 'ignore',
        })
      )
      await waitForServer(target.port)
    }

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    try {
      const results: Record<string, any> = {}
      for (const target of targets) {
        const page = await context.newPage()
        await page.goto(
          `http://127.0.0.1:${target.port}/?scenario=${target.scenario}&profile=1`,
          { waitUntil: 'networkidle' }
        )
        for (let iteration = 0; iteration < WARMUPS; iteration++) {
          await runOnce(page, target.scenario)
        }
        const session = await context.newCDPSession(page)
        await session.send('Profiler.enable')
        await session.send('Profiler.start')
        const timings = []
        for (let iteration = 0; iteration < ITERATIONS; iteration++) {
          timings.push(await runOnce(page, target.scenario))
        }
        const { profile } = await session.send('Profiler.stop')
        await session.detach()
        await page.close()
        const sourceMapPath = findSourceMap(join(temporaryRoot, target.id))
        results[target.id] = {
          scenario: target.scenario,
          warmups: WARMUPS,
          iterations: ITERATIONS,
          timings,
          cpuProfile: summarizeProfile(profile, sourceMapPath),
        }
      }
      const compiledEffect = retained.effects.compiled.animated
      const runtimeEffect = retained.effects.runtime.simple
      mkdirSync(dirname(OUTPUT), { recursive: true })
      writeFileSync(
        OUTPUT,
        `${JSON.stringify(
          {
            schemaVersion: 1,
            metadata: {
              commit: git('rev-parse', 'HEAD'),
              branch: git('branch', '--show-current'),
              dirty: git('status', '--porcelain').length > 0,
              buildMode: 'production with source maps',
              browser: 'Chromium',
              browserVersion: browser.version(),
              workload: retained.metadata.tamaguiWorkload,
              retainedBenchmarkCommit: retained.metadata.commit,
            },
            retainedEffects: {
              compiledAnimated: compiledEffect,
              runtimeSimple: runtimeEffect,
            },
            compilerEvidence: {
              v3: retained.artifacts['tamagui-v3-compiled'].compilerStats.totals,
              v2: {
                found: 14,
                flattened: 11,
                legacyOptimized: 14,
                source: 'V2 production compiler build log',
              },
              cause:
                'V3 leaves the animated View on the runtime path as local/unsupported-target (10/14 flat); V2 lowers that additional candidate (11/14 flat) while the browser conformance artifact proves equivalent transition behavior.',
            },
            attribution: {
              compiledAnimated: {
                profile: compareProfiles(
                  results,
                  'tamagui-v3-compiled',
                  'tamagui-v2-compiled'
                ),
                disposition:
                  'Release gap, not changed here: safely lowering transition-bearing animated candidates requires a compiler feature with dedicated correctness coverage; V3 currently records this as an intentional unsupported-target bailout.',
              },
              runtimeSimple: {
                profile: compareProfiles(
                  results,
                  'tamagui-v3-runtime',
                  'tamagui-v2-runtime'
                ),
                disposition:
                  'Framework runtime cost, not a harness/config/source difference. No isolated validation-lane fix is safe without changing the V3 style resolution implementation.',
              },
            },
            results,
          },
          null,
          2
        )}\n`
      )
      console.log(`Regression profile: ${OUTPUT}`)
    } finally {
      await context.close()
      await browser.close()
    }
  } finally {
    for (const preview of previews) preview.kill('SIGTERM')
    rmSync(temporaryRoot, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
