#!/usr/bin/env bun
/**
 * function-level CPU self-time AND allocation attribution for the web hot path.
 *
 * profile-web-regressions.ts answers "v3 vs v2, which module group got slower".
 * this answers a different question: inside @tamagui/web, WHICH FUNCTIONS burn
 * time and WHICH LINES allocate, per render. it needs no v2 build.
 *
 * both profiles come from one production build with source maps, so every
 * frame maps back to a real src line.
 *
 * usage:
 *   bun code/comparisons/profile-hotpath.ts                       # runtime path, heavy
 *   bun code/comparisons/profile-hotpath.ts --scenario=group
 *   bun code/comparisons/profile-hotpath.ts --extract=1 --scenario=animated
 *   bun code/comparisons/profile-hotpath.ts --label=after --iterations=30
 */

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
import { acquireBenchmarkLock } from './shared/benchmarkLock'

const arg = (name: string, fallback: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3) ?? fallback

const SCENARIO = arg('scenario', 'heavy')
const FIXTURE_SCENARIO =
  SCENARIO === 'clause-string' || SCENARIO === 'hoc' ? 'flat' : SCENARIO
const WORKLOAD_QUERY = SCENARIO === 'hoc' ? '&workload=hoc' : ''
const EXTRACT = arg('extract', '0')
const ITERATIONS = Number.parseInt(arg('iterations', '20'), 10)
const WARMUPS = Number.parseInt(arg('warmups', '3'), 10)
const SCALE = arg('scale', '200')
const LABEL = arg('label', 'baseline')
const PORT = Number.parseInt(arg('port', '9131'), 10)
// 100us CPU sampling (default is 1000us) and 4KB heap sampling: enough
// resolution to separate individual helpers inside one render.
const CPU_SAMPLING_US = 100
const HEAP_SAMPLING_BYTES = 1024

const OUTPUT = arg(
  'output',
  join(
    import.meta.dir,
    'output',
    'hotpath',
    `${LABEL}-${SCENARIO}-extract${EXTRACT}.json`
  )
)

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

function normalizeSource(source: string) {
  const normalized = source.replaceAll('\\', '/')
  const marker = normalized.lastIndexOf('/code/')
  if (marker >= 0) return normalized.slice(marker + 1)
  const dependency = normalized.split('node_modules/').at(-1)
  if (dependency !== normalized) return `node_modules/${dependency}`
  return normalized.replace(/^(\.\.\/)+/, '')
}

async function waitForServer(port: number) {
  const start = Date.now()
  while (Date.now() - start < 60_000) {
    try {
      if ((await fetch(`http://127.0.0.1:${port}/`)).ok) return
    } catch {}
    await Bun.sleep(250)
  }
  throw new Error(`preview did not start on port ${port}`)
}

/** resolves a v8 callFrame to `path:line fnName`, memoized per frame identity. */
function makeResolver(sourceMapPath: string) {
  const traceMap = new TraceMap(readFileSync(sourceMapPath, 'utf8'))
  const cache = new Map<string, { key: string; source: string | null }>()
  return (frame: any) => {
    if (!frame) return { key: '(unknown)', source: null }
    const id = `${frame.url}:${frame.lineNumber}:${frame.columnNumber}:${frame.functionName}`
    const hit = cache.get(id)
    if (hit) return hit
    const fn = frame.functionName || '(anonymous)'
    let value: { key: string; source: string | null }
    if (!frame.url || frame.lineNumber < 0) {
      value = { key: `${fn} <${frame.url || 'native'}>`, source: null }
    } else {
      const original = originalPositionFor(traceMap, {
        line: frame.lineNumber + 1,
        column: Math.max(0, frame.columnNumber),
      })
      value = original?.source
        ? {
            key: `${normalizeSource(original.source)}:${original.line} ${original.name || fn}`,
            source: normalizeSource(original.source),
          }
        : { key: `${fn} <unmapped>`, source: null }
    }
    cache.set(id, value)
    return value
  }
}

function summarizeCpu(profile: any, resolve: ReturnType<typeof makeResolver>) {
  const nodes = new Map<number, any>(profile.nodes.map((n: any) => [n.id, n]))
  const selfByKey: Record<string, number> = {}
  const selfBySource: Record<string, number> = {}
  let totalUs = 0
  for (let i = 0; i < profile.samples.length; i++) {
    const us = profile.timeDeltas[i] ?? 0
    if (us <= 0) continue
    totalUs += us
    const { key, source } = resolve(nodes.get(profile.samples[i])?.callFrame)
    selfByKey[key] = (selfByKey[key] ?? 0) + us
    if (source) selfBySource[source] = (selfBySource[source] ?? 0) + us
  }
  return { totalUs, selfByKey, selfBySource }
}

/** heap sampling profile is a tree of {callFrame, selfSize, children}. */
function summarizeHeap(profile: any, resolve: ReturnType<typeof makeResolver>) {
  const selfByKey: Record<string, number> = {}
  const selfBySource: Record<string, number> = {}
  let totalBytes = 0
  const walk = (node: any) => {
    const bytes = node.selfSize ?? 0
    if (bytes > 0) {
      totalBytes += bytes
      const { key, source } = resolve(node.callFrame)
      selfByKey[key] = (selfByKey[key] ?? 0) + bytes
      if (source) selfBySource[source] = (selfBySource[source] ?? 0) + bytes
    }
    for (const child of node.children ?? []) walk(child)
  }
  walk(profile.head)
  return { totalBytes, selfByKey, selfBySource }
}

const rank = (map: Record<string, number>, limit: number, scale = 1) =>
  Object.entries(map)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([name, value]) => ({ name, value: Number((value / scale).toFixed(3)) }))

async function runOnce(page: any) {
  const previous = page.locator('#bench-results-table')
  if ((await previous.count()) > 0) {
    await previous.evaluate((el: any) => el.replaceChildren())
  }
  await page.locator('#bench-start').click()
  await page.waitForSelector(`#bench-result-${FIXTURE_SCENARIO}-rerender`, {
    timeout: 120_000,
  })
  return {
    mount: Number(
      await page
        .locator(`#bench-result-${FIXTURE_SCENARIO}-mount`)
        .getAttribute('data-value')
    ),
    update: Number(
      await page
        .locator(`#bench-result-${FIXTURE_SCENARIO}-rerender`)
        .getAttribute('data-value')
    ),
  }
}

async function main() {
  const releaseLock = acquireBenchmarkLock(`profile-hotpath ${LABEL} ${SCENARIO}`)
  const cwd = join(import.meta.dir, 'tamagui-bench')
  const outDir = mkdtempSync(join(tmpdir(), 'tamagui-hotpath-'))
  let preview: ChildProcess | undefined
  try {
    execFileSync(
      'bunx',
      ['vite', 'build', '--sourcemap', '--outDir', outDir, '--emptyOutDir'],
      { cwd, env: { ...process.env, NODE_ENV: 'production', EXTRACT }, stdio: 'inherit' }
    )
    preview = spawn(
      'bunx',
      [
        'vite',
        'preview',
        '--host',
        '127.0.0.1',
        '--port',
        String(PORT),
        '--strictPort',
        '--outDir',
        outDir,
      ],
      { cwd, env: process.env, stdio: 'ignore' }
    )
    await waitForServer(PORT)

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } })
    const page = await context.newPage()
    await page.goto(
      `http://127.0.0.1:${PORT}/?scenario=${FIXTURE_SCENARIO}&scale=${SCALE}${WORKLOAD_QUERY}`,
      {
        waitUntil: 'networkidle',
      }
    )

    for (let i = 0; i < WARMUPS; i++) await runOnce(page)

    // host elements under the runner ~= one per rendered tamagui component on
    // the runtime path; the denominator for per-render numbers. counted on a
    // throwaway page in behaviorValidation mode, which holds the tree mounted
    // long enough to read it (the normal run unmounts the runner when done).
    const countPage = await context.newPage()
    await countPage.goto(
      `http://127.0.0.1:${PORT}/?scenario=${FIXTURE_SCENARIO}&scale=${SCALE}&behaviorValidation=1${WORKLOAD_QUERY}`,
      { waitUntil: 'networkidle' }
    )
    await countPage.locator('#bench-start').click()
    await countPage.waitForSelector('[data-bench-scenario-item]', { timeout: 60_000 })
    const hostsPerMount = await countPage.evaluate(
      () => document.querySelectorAll('[data-bench-runner-seed] *').length
    )
    await countPage.close()

    const resolve = makeResolver(findSourceMap(outDir))
    const session = await context.newCDPSession(page)

    // ── CPU ──
    await session.send('Profiler.enable')
    await session.send('Profiler.setSamplingInterval', { interval: CPU_SAMPLING_US })
    await session.send('Profiler.start')
    const timings: Array<{ mount: number; update: number }> = []
    for (let i = 0; i < ITERATIONS; i++) timings.push(await runOnce(page))
    const { profile: cpuProfile } = await session.send('Profiler.stop')
    await session.send('Profiler.disable')
    const cpu = summarizeCpu(cpuProfile, resolve)

    // ── allocation ──
    await session.send('HeapProfiler.enable')
    // v8 drops samples for collected objects by default, which reports only
    // RETAINED bytes. per-render allocation is the question here, so ask for
    // the garbage too.
    await session.send('HeapProfiler.startSampling', {
      samplingInterval: HEAP_SAMPLING_BYTES,
      includeObjectsCollectedByMajorGC: true,
      includeObjectsCollectedByMinorGC: true,
    })
    for (let i = 0; i < ITERATIONS; i++) await runOnce(page)
    const { profile: heapProfile } = await session.send('HeapProfiler.stopSampling')
    await session.send('HeapProfiler.disable')
    const heap = summarizeHeap(heapProfile, resolve)

    await session.detach()
    await browser.close()

    const mounts = timings.map((t) => t.mount).sort((a, b) => a - b)
    const updates = timings.map((t) => t.update).sort((a, b) => a - b)
    const median = (xs: number[]) => xs[Math.floor(xs.length / 2)]

    const result = {
      label: LABEL,
      scenario: SCENARIO,
      fixtureScenario: FIXTURE_SCENARIO,
      extract: EXTRACT,
      scale: Number(SCALE),
      iterations: ITERATIONS,
      warmups: WARMUPS,
      cpuSamplingUs: CPU_SAMPLING_US,
      heapSamplingBytes: HEAP_SAMPLING_BYTES,
      commit: execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
        cwd: import.meta.dir,
      })
        .toString()
        .trim(),
      hostsPerMount,
      // one iteration = one mount + one re-render of the whole scenario
      rendersPerIteration: hostsPerMount * 2,
      timings: {
        mountMedianMs: median(mounts),
        mountMinMs: mounts[0],
        updateMedianMs: median(updates),
        updateMinMs: updates[0],
        raw: timings,
      },
      allocation: {
        totalSampledBytes: heap.totalBytes,
        bytesPerIteration: Math.round(heap.totalBytes / ITERATIONS),
        bytesPerRender: Number(
          (heap.totalBytes / ITERATIONS / (hostsPerMount * 2)).toFixed(1)
        ),
        bySourceBytesPerIteration: rank(heap.selfBySource, 25, ITERATIONS),
        byFrameBytesPerIteration: rank(heap.selfByKey, 40, ITERATIONS),
      },
      cpu: {
        totalSampledMs: Number((cpu.totalUs / 1000).toFixed(2)),
        msPerIteration: Number((cpu.totalUs / 1000 / ITERATIONS).toFixed(3)),
        bySourceMsPerIteration: rank(cpu.selfBySource, 25, ITERATIONS * 1000),
        byFrameMsPerIteration: rank(cpu.selfByKey, 40, ITERATIONS * 1000),
      },
    }

    mkdirSync(dirname(OUTPUT), { recursive: true })
    writeFileSync(OUTPUT, `${JSON.stringify(result, null, 2)}\n`)

    console.log(
      `\n══ ${LABEL} · ${SCENARIO} · extract=${EXTRACT} · scale=${SCALE} · ${ITERATIONS} iters ══`
    )
    console.log(
      `mount median ${result.timings.mountMedianMs}ms  update median ${result.timings.updateMedianMs}ms`
    )
    console.log(
      `allocation ${result.allocation.bytesPerIteration} bytes/iteration, ${result.allocation.bytesPerRender} bytes/render over ${result.rendersPerIteration} renders (sampled @${HEAP_SAMPLING_BYTES}B)`
    )
    console.log(
      `cpu ${result.cpu.msPerIteration}ms/iteration (sampled @${CPU_SAMPLING_US}us)\n`
    )
    console.log('── allocation bytes/iteration by source ──')
    for (const r of result.allocation.bySourceBytesPerIteration) {
      console.log(`${String(Math.round(r.value)).padStart(9)}  ${r.name}`)
    }
    console.log('\n── allocation bytes/iteration by frame ──')
    for (const r of result.allocation.byFrameBytesPerIteration) {
      console.log(`${String(Math.round(r.value)).padStart(9)}  ${r.name}`)
    }
    console.log('\n── cpu self ms/iteration by source ──')
    for (const r of result.cpu.bySourceMsPerIteration) {
      console.log(`${r.value.toFixed(3).padStart(9)}  ${r.name}`)
    }
    console.log('\n── cpu self ms/iteration by frame ──')
    for (const r of result.cpu.byFrameMsPerIteration) {
      console.log(`${r.value.toFixed(3).padStart(9)}  ${r.name}`)
    }
    console.log(`\n(written to ${OUTPUT})`)
  } finally {
    preview?.kill('SIGTERM')
    rmSync(outDir, { recursive: true, force: true })
    releaseLock()
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
