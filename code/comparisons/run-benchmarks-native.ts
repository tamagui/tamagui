#!/usr/bin/env bun
/**
 * Native bench orchestrator. Mirrors run-benchmarks.ts but drives an iOS simulator via
 * Expo Go: starts each framework's metro on its own port, deep-links to each scenario,
 * collects timings POSTed from the bench app to http://localhost:8091/result, writes a
 * comparison table to stdout and JSON, then generates HTML from that JSON.
 *
 * Prereqs:
 *   - Xcode + iOS simulator runtime installed
 *   - Expo Go installed on the target sim (the harness boots one if none is booted; the
 *     iPhone 16 Pro on this machine already has Expo Go from the conformance harness)
 *
 * Usage:
 *   bun code/comparisons/run-benchmarks-native.ts
 *   bun code/comparisons/run-benchmarks-native.ts --runs=3
 *   bun code/comparisons/run-benchmarks-native.ts --only=tamagui   # subset
 *   bun code/comparisons/run-benchmarks-native.ts --udid=<UDID>    # pick a sim
 */
import { execFileSync, execSync, spawn, type ChildProcess } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'
import { generateNativeBenchmarkHtml } from './generate-native-benchmark-html'

const args = process.argv.slice(2)
const NUM_RUNS = parseInt(args.find((a) => a.startsWith('--runs='))?.split('=')[1] ?? '1')
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1]
const UDID_ARG = args.find((a) => a.startsWith('--udid='))?.split('=')[1]
const SCENARIO_TIMEOUT_MS = 60_000
const COLD_BUNDLE_TIMEOUT_MS = 180_000
const HERE = import.meta.dir

const SCENARIOS = ['simple', 'themed', 'rich', 'group', 'heavy', 'animated'] as const
type ScenarioId = (typeof SCENARIOS)[number]

// --scenarios=rich,simple restricts the run to a subset (faster grind loop).
const SCENARIO_FILTER = args
  .find((a) => a.startsWith('--scenarios='))
  ?.split('=')[1]
  ?.split(',')
const ACTIVE_SCENARIOS: readonly ScenarioId[] = SCENARIO_FILTER
  ? SCENARIOS.filter((s) => SCENARIO_FILTER.includes(s))
  : SCENARIOS

const SCENARIO_LABELS: Record<ScenarioId, string> = {
  simple: 'Simple (static props)',
  themed: 'Themed (token bg → _withStableStyle)',
  rich: 'Rich (pseudo states)',
  group: 'Group hover',
  heavy: 'Heavy page (60)',
  animated: 'Animated (spring)',
}

interface BenchConfig {
  framework: string // POST.framework matches this
  label: string // column header in the table
  dir: string // workspace dir under code/comparisons/
  port: number // metro port
  skipScenarios?: ScenarioId[]
}

const BENCHMARKS: BenchConfig[] = [
  {
    framework: 'tamagui',
    label: 'Tamagui (runtime)',
    dir: 'tamagui-bench-native',
    port: 8101,
  },
  {
    framework: 'tamagui-compiled',
    label: 'Tamagui (compiled)',
    dir: 'tamagui-bench-native-compiled',
    port: 8104,
  },
  {
    framework: 'rn',
    label: 'React Native',
    dir: 'rn-bench-native',
    port: 8105,
  },
  {
    framework: 'nativewind',
    label: 'NativeWind v5',
    dir: 'nativewind-bench-native',
    port: 8102,
  },
  {
    framework: 'uniwind',
    label: 'Uniwind',
    dir: 'uniwind-bench-native',
    port: 8103,
    // uniwind on native doesn't expose hover/group-hover yet — those scenarios still record
    // the static styling cost, no skip.
  },
]

// ── simulator helpers ────────────────────────────────────

function bootedUdid(): string | null {
  if (UDID_ARG) return UDID_ARG
  try {
    const json = JSON.parse(
      execFileSync('xcrun', ['simctl', 'list', 'devices', 'booted', '-j']).toString()
    )
    for (const runtime of Object.values(json.devices) as any[]) {
      for (const d of runtime) if (d.state === 'Booted') return d.udid
    }
  } catch {}
  return null
}

function hasExpoGo(udid: string): boolean {
  const home = process.env.HOME!
  try {
    const out = execFileSync('find', [
      `${home}/Library/Developer/CoreSimulator/Devices/${udid}/data/Containers/Bundle/Application`,
      '-name',
      '*xpo*Go.app',
      '-maxdepth',
      '4',
    ])
      .toString()
      .trim()
    return out.length > 0
  } catch {
    return false
  }
}

function findSimWithExpoGo(): string | null {
  try {
    const json = JSON.parse(
      execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '-j']).toString()
    )
    const candidates: { udid: string; name: string }[] = []
    for (const devices of Object.values(json.devices) as any[]) {
      for (const d of devices as any[]) {
        if (d.isAvailable && d.deviceTypeIdentifier?.includes('iPhone')) {
          candidates.push({ udid: d.udid, name: d.name })
        }
      }
    }
    const withExpo = candidates.filter((c) => hasExpoGo(c.udid))
    if (withExpo.length === 0) return null
    // prefer iPhone 16 Pro (the conformance harness installs Expo Go on it)
    const pro = withExpo.find((c) => c.name === 'iPhone 16 Pro')
    return (pro ?? withExpo[0]).udid
  } catch {
    return null
  }
}

function bootSim(udid: string) {
  try {
    execFileSync('xcrun', ['simctl', 'boot', udid], { stdio: 'pipe' })
  } catch (e: any) {
    // already booted is fine
    if (!String(e?.stderr ?? '').includes('Booted')) {
      throw e
    }
  }
}

function openSimulatorApp() {
  // open the Simulator.app GUI so the user can see what's happening (and so window/orientation
  // events fire correctly). Idempotent.
  try {
    execSync('open -a Simulator', { stdio: 'pipe' })
  } catch {}
}

// ── result capture ───────────────────────────────────────

interface IncomingResult {
  framework: string
  scenario: ScenarioId
  mount: number
  rerender: number
  profile?: string
}

let lastResult: IncomingResult | null = null
const harness = Bun.serve({
  port: 8091,
  async fetch(req) {
    if (req.method === 'POST') {
      try {
        const body = (await req.json()) as IncomingResult
        if (body && body.scenario && SCENARIOS.includes(body.scenario)) {
          if (body.profile) {
            console.warn(
              `  ⚠ received profile data during benchmark for ${body.framework}/${body.scenario}`
            )
          }
          lastResult = body
        }
      } catch {}
    }
    return new Response('ok', { headers: { 'access-control-allow-origin': '*' } })
  },
})

// ── metro helpers ────────────────────────────────────────

function killPort(port: number) {
  try {
    const pids = execSync(`lsof -ti:${port} 2>/dev/null`).toString().trim()
    if (pids) {
      for (const pid of pids.split('\n')) {
        try {
          process.kill(parseInt(pid))
        } catch {}
      }
    }
  } catch {}
}

async function waitForMetro(port: number, timeout = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      // Expo metro responds at GET /status with a 200
      const res = await fetch(`http://localhost:${port}/status`)
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

function startMetro(dir: string, port: number): ChildProcess {
  const cwd = join(HERE, dir)
  // BENCH_CLEAR=1 forces a cold metro rebuild so a freshly-rebuilt compiler
  // The shared compiler is actually applied instead of using a stale cache.
  // PROD=1 builds a production JS bundle (NODE_ENV=production, no dev-only hooks
  // like useId / the dev visualizer effect, minified) — the honest shipped shape.
  const prodArgs = process.env.PROD === '1' ? ['--no-dev', '--minify'] : []
  const startArgs = [
    'run',
    'start',
    ...prodArgs,
    ...(process.env.BENCH_CLEAR === '1' ? ['--clear'] : []),
  ]
  // expo start --port=N — same flag the conformance harness uses
  const proc = spawn('bun', startArgs, {
    cwd,
    env: {
      ...process.env,
      BROWSER: 'none',
      EXPO_NO_TELEMETRY: '1',
      CI: '1',
      EXPO_PUBLIC_TAMAGUI_BENCH_PROFILE: '0',
    },
    stdio: 'pipe',
  })
  // tee stderr to a log file so failures are debuggable
  const logFile = join(HERE, `.metro-${dir}.log`)
  const out = Bun.file(logFile)
  ;(async () => {
    const writer = out.writer()
    proc.stdout?.on('data', (d) => writer.write(d))
    proc.stderr?.on('data', (d) => writer.write(d))
    proc.on('close', () => writer.end())
  })()
  return proc
}

// ── benchmark runner ─────────────────────────────────────

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
let linkCounter = 0

function deepLink(udid: string, port: number, scenario: ScenarioId, framework: string) {
  const url = `exp://127.0.0.1:${port}/--/?case=${scenario}&fw=${framework}&n=${linkCounter++}`
  execFileSync('xcrun', ['simctl', 'openurl', udid, url])
}

function snapshotText(out: string) {
  try {
    const parsed = JSON.parse(out)
    return parsed.content?.map((entry: any) => entry.text).join('\n') || out
  } catch {
    return out
  }
}

function tapExpoProjectRow(udid: string, text: string, projectName: string) {
  if (!text.includes('DEVELOPMENT SERVERS') && !text.includes('RECENTLY OPENED')) {
    return false
  }
  const labelIndex = text.indexOf(`"AXLabel" : "${projectName}"`)
  if (labelIndex === -1) return false

  const before = text.slice(Math.max(0, labelIndex - 1200), labelIndex)
  const frameMatches = [
    ...before.matchAll(
      /"frame" : \{\s+"y" : ([\d.]+),\s+"x" : ([\d.]+),\s+"width" : ([\d.]+),\s+"height" : ([\d.]+)/g
    ),
  ]
  const match = frameMatches[frameMatches.length - 1]
  if (!match) return false

  const y = Number(match[1])
  const x = Number(match[2])
  const width = Number(match[3])
  const height = Number(match[4])

  execFileSync(
    'xcodebuildmcp',
    [
      'ui-automation',
      'tap',
      '--simulator-id',
      udid,
      '--x',
      String(Math.round(x + width / 2)),
      '--y',
      String(Math.round(y + height / 2)),
    ],
    { stdio: 'ignore' }
  )
  return true
}

function acceptExpoOpenPrompt(udid: string, projectName: string) {
  try {
    const out = execFileSync(
      'xcodebuildmcp',
      ['simulator', 'snapshot-ui', '--simulator-id', udid, '--output', 'json'],
      { stdio: ['ignore', 'pipe', 'ignore'] }
    ).toString()
    const text = snapshotText(out)
    if (text.includes('Open in “Expo Go”?')) {
      execFileSync(
        'xcodebuildmcp',
        ['ui-automation', 'tap', '--simulator-id', udid, '--x', '269', '--y', '481'],
        { stdio: 'ignore' }
      )
      return
    }
    tapExpoProjectRow(udid, text, projectName)
  } catch {}
}

async function runOneScenario(
  udid: string,
  port: number,
  bench: BenchConfig,
  scenario: ScenarioId,
  isFirst: boolean
): Promise<{ mount: number; rerender: number } | null> {
  lastResult = null
  deepLink(udid, port, scenario, bench.framework)
  await sleep(600)
  acceptExpoOpenPrompt(udid, bench.dir)
  const deadline = Date.now() + (isFirst ? COLD_BUNDLE_TIMEOUT_MS : SCENARIO_TIMEOUT_MS)
  const relinkInterval = isFirst ? 20_000 : 10_000
  let nextRelink = Date.now() + relinkInterval
  while (Date.now() < deadline) {
    if (
      lastResult &&
      lastResult.scenario === scenario &&
      lastResult.framework === bench.framework
    ) {
      return { mount: lastResult.mount, rerender: lastResult.rerender }
    }
    if (Date.now() >= nextRelink) {
      deepLink(udid, port, scenario, bench.framework)
      await sleep(600)
      acceptExpoOpenPrompt(udid, bench.dir)
      nextRelink = Date.now() + relinkInterval
    }
    await sleep(200)
  }
  return null
}

type RunResult = Record<ScenarioId, { mount: number; rerender: number } | null>

const emptyRun = (): RunResult => ({
  simple: null,
  themed: null,
  rich: null,
  group: null,
  heavy: null,
  animated: null,
})

// measure all scenarios for a bench whose metro is ALREADY running. coldFirst marks
// the very first deep-link to this app (cold bundle → longer timeout).
async function measureScenarios(
  udid: string,
  bench: BenchConfig,
  coldFirst: boolean,
  indent = '    '
): Promise<RunResult> {
  const results = emptyRun()
  let isFirst = coldFirst
  for (const s of ACTIVE_SCENARIOS) {
    if (bench.skipScenarios?.includes(s)) {
      process.stdout.write(`${indent}${s}: skip\n`)
      continue
    }
    const r = await runOneScenario(udid, bench.port, bench, s, isFirst)
    isFirst = false
    results[s] = r
    if (r) {
      process.stdout.write(
        `${indent}${s.padEnd(8)} mount=${r.mount.toFixed(1)}ms rerender=${r.rerender.toFixed(1)}ms\n`
      )
    } else {
      process.stdout.write(`${indent}${s.padEnd(8)} TIMEOUT\n`)
    }
    await sleep(300)
  }
  return results
}

function startMetroFor(bench: BenchConfig): ChildProcess {
  killPort(bench.port)
  return startMetro(bench.dir, bench.port)
}

async function stopMetro(metro: ChildProcess | null, port: number) {
  if (metro) {
    try {
      metro.kill('SIGTERM')
    } catch {}
  }
  await sleep(500)
  killPort(port)
  await sleep(500)
}

function averageResults(
  runs: Record<ScenarioId, { mount: number; rerender: number } | null>[]
): Record<ScenarioId, { mount: number; rerender: number } | null> {
  const avg: Record<ScenarioId, { mount: number; rerender: number } | null> = {
    simple: null,
    themed: null,
    rich: null,
    group: null,
    heavy: null,
    animated: null,
  }
  for (const s of ACTIVE_SCENARIOS) {
    const mounts = runs
      .map((r) => r[s]?.mount)
      .filter((n): n is number => typeof n === 'number')
    const rerenders = runs
      .map((r) => r[s]?.rerender)
      .filter((n): n is number => typeof n === 'number')
    if (mounts.length === 0) {
      avg[s] = null
      continue
    }
    if (mounts.length >= 3) {
      mounts.sort((a, b) => a - b)
      rerenders.sort((a, b) => a - b)
      mounts.shift()
      mounts.pop()
      rerenders.shift()
      rerenders.pop()
    }
    avg[s] = {
      mount: mounts.reduce((a, b) => a + b, 0) / mounts.length,
      rerender: rerenders.reduce((a, b) => a + b, 0) / rerenders.length,
    }
  }
  return avg
}

// ── reporting ────────────────────────────────────────────

type AllResults = Record<
  string,
  Record<ScenarioId, { mount: number; rerender: number } | null>
>

// framework ÷ vanilla-RN, per scenario. >1 means slower than raw RN (e.g. 2.5 = 2.5× RN).
function computeRatio(fw: RunResult, rn: RunResult): RunResult {
  const out = emptyRun()
  for (const s of ACTIVE_SCENARIOS) {
    const f = fw[s]
    const r = rn[s]
    if (f && r && r.mount > 0 && r.rerender > 0) {
      out[s] = { mount: f.mount / r.mount, rerender: f.rerender / r.rerender }
    }
  }
  return out
}

function printRatioTable(ratios: Record<string, RunResult>) {
  const labels = Object.keys(ratios)
  const colW = 18
  const sep = '═'
  const line = (c: string) =>
    console.log(
      c[0] + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + c[1]
    )
  console.log(
    '\n  × vanilla React Native (lower = closer to raw RN; interleaved per run)'
  )
  line('╔╗')
  console.log(
    '║' +
      ' Mount ×RN'.padEnd(22) +
      labels.map((f) => f.padStart(colW) + ' ').join('') +
      '║'
  )
  line('╠╣')
  const fmt = (v: { mount: number; rerender: number } | null, k: 'mount' | 'rerender') =>
    (v ? `${v[k].toFixed(2)}×` : 'skip').padStart(colW)
  for (const s of ACTIVE_SCENARIOS) {
    console.log(
      '║' +
        SCENARIO_LABELS[s].padEnd(22) +
        labels.map((f) => fmt(ratios[f][s], 'mount')).join(' ') +
        ' ║'
    )
  }
  line('╠╣')
  console.log(
    '║' +
      ' Re-render ×RN'.padEnd(22) +
      labels.map((f) => f.padStart(colW) + ' ').join('') +
      '║'
  )
  line('╠╣')
  for (const s of ACTIVE_SCENARIOS) {
    console.log(
      '║' +
        SCENARIO_LABELS[s].padEnd(22) +
        labels.map((f) => fmt(ratios[f][s], 'rerender')).join(' ') +
        ' ║'
    )
  }
  line('╚╝')
}

function printTable(results: AllResults) {
  const labels = Object.keys(results)
  const colW = 18
  console.log('')
  const sep = '═'
  console.log(
    '╔' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╗'
  )
  console.log(
    '║' +
      ' Mount (ms)'.padEnd(22) +
      labels.map((f) => f.padStart(colW) + ' ').join('') +
      '║'
  )
  console.log(
    '╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣'
  )
  const fmt = (
    v: { mount: number; rerender: number } | null,
    getField: 'mount' | 'rerender'
  ) => {
    if (!v) return 'skip'.padStart(colW)
    return v[getField].toFixed(1).padStart(colW)
  }
  for (const s of ACTIVE_SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = labels.map((f) => fmt(results[f][s], 'mount'))
    console.log('║' + label + vals.join(' ') + ' ║')
  }
  console.log(
    '╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣'
  )
  console.log(
    '║' +
      ' Re-render (ms)'.padEnd(22) +
      labels.map((f) => f.padStart(colW) + ' ').join('') +
      '║'
  )
  console.log(
    '╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣'
  )
  for (const s of ACTIVE_SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = labels.map((f) => fmt(results[f][s], 'rerender'))
    console.log('║' + label + vals.join(' ') + ' ║')
  }
  console.log(
    '╚' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╝'
  )
  console.log(`  ${NUM_RUNS} run(s) on iOS sim, 200 items per scenario (60 for heavy)\n`)
}

async function main() {
  console.log(`\n🏁 Running native benchmarks (${NUM_RUNS} run(s))...\n`)

  // pick sim — booted is fine ONLY if it has Expo Go; otherwise find one that does and boot it
  let udid = bootedUdid()
  if (udid && !hasExpoGo(udid)) {
    console.log(
      `  Sim ${udid} is booted but has no Expo Go. Switching to a sim with Expo Go...`
    )
    udid = null
  }
  if (!udid) {
    const target = findSimWithExpoGo()
    if (!target) {
      console.error('No iOS sim with Expo Go found. Install Expo Go on a sim and re-run.')
      console.error('Hint: boot a sim, install Expo Go via the App Store, then re-run.')
      process.exit(1)
    }
    udid = target
    console.log(`  Booting sim ${udid}...`)
    bootSim(udid)
  }
  openSimulatorApp()
  console.log(`  Using sim ${udid}\n`)

  // filter
  const benchmarks = ONLY
    ? BENCHMARKS.filter((b) => b.framework === ONLY || b.dir === ONLY)
    : BENCHMARKS
  const allResults: AllResults = {}
  // per-framework ratio vs vanilla RN measured INTERLEAVED (same run, matched host load).
  // absolute ms drifts heavily with sim/host load; the framework÷RN ratio cancels it,
  // so the ratio is the real, comparable metric.
  const ratios: Record<string, RunResult> = {}

  const exists = (b: BenchConfig) => existsSync(join(HERE, b.dir))
  const rnBench = BENCHMARKS.find((b) => b.framework === 'rn')
  const hasRnBaseline = rnBench && exists(rnBench)
  // every non-RN framework we're benchmarking (RN is the interleaved baseline, not a column to race)
  const fwBenches = benchmarks.filter((b) => b.framework !== 'rn' && exists(b))

  // keep ONE rn metro up the whole session so we can interleave an rn measurement
  // right after each framework run without paying app-switch metro restarts.
  let rnMetro: ChildProcess | null = null
  let rnCold = true
  const rnAllRuns: RunResult[] = []
  if (hasRnBaseline) {
    console.log(`▶ ${rnBench!.dir} (baseline metro, port ${rnBench!.port})`)
    rnMetro = startMetroFor(rnBench!)
    if (!(await waitForMetro(rnBench!.port, 60_000))) {
      console.log(`  ⚠ rn baseline metro did not start; continuing without ratios`)
      await stopMetro(rnMetro, rnBench!.port)
      rnMetro = null
    }
  }

  try {
    for (const bench of fwBenches) {
      console.log(`▶ ${bench.label} (port ${bench.port})`)
      let metro: ChildProcess | null = null
      const fwPerRun: RunResult[] = []
      const rnPerRun: RunResult[] = []
      try {
        metro = startMetroFor(bench)
        if (!(await waitForMetro(bench.port, 60_000))) {
          console.log(`  ⚠ metro for ${bench.label} did not start`)
          continue
        }
        let fwCold = true
        for (let i = 0; i < NUM_RUNS; i++) {
          if (NUM_RUNS > 1) console.log(`  run #${i + 1} — ${bench.label}`)
          fwPerRun.push(await measureScenarios(udid!, bench, fwCold))
          fwCold = false
          if (rnMetro) {
            if (NUM_RUNS > 1) console.log(`  run #${i + 1} — vanilla RN (baseline)`)
            const rn = await measureScenarios(udid!, rnBench!, rnCold, '      rn ')
            rnCold = false
            rnPerRun.push(rn)
            rnAllRuns.push(rn)
          }
        }
      } catch (e: any) {
        console.error(`  ! ${bench.label} error: ${e?.message ?? e}`)
      } finally {
        await stopMetro(metro, bench.port)
      }
      allResults[bench.label] =
        fwPerRun.length >= 3 ? averageResults(fwPerRun) : (fwPerRun.at(-1) ?? emptyRun())
      if (rnPerRun.length) {
        const fwAvg = allResults[bench.label]
        const rnAvg = rnPerRun.length >= 3 ? averageResults(rnPerRun) : rnPerRun.at(-1)!
        ratios[bench.label] = computeRatio(fwAvg, rnAvg)
      }
    }
  } finally {
    if (rnMetro) await stopMetro(rnMetro, rnBench!.port)
  }

  if (hasRnBaseline && rnAllRuns.length) {
    allResults[rnBench!.label] =
      rnAllRuns.length >= 3 ? averageResults(rnAllRuns) : rnAllRuns.at(-1)!
  }

  if (Object.keys(allResults).length === 0) {
    console.log('\nNo results collected.')
    harness.stop()
    process.exit(1)
  }

  printTable(allResults)
  if (Object.keys(ratios).length) printRatioTable(ratios)

  // always write JSON
  const outDir = join(HERE, 'output')
  mkdirSync(outDir, { recursive: true })
  const jsonPath = join(outDir, 'benchmarks-native.json')
  const htmlPath = join(outDir, 'benchmarks-native.html')
  writeFileSync(jsonPath, JSON.stringify(allResults, null, 2))
  generateNativeBenchmarkHtml(jsonPath, htmlPath)
  console.log(`  JSON: ${jsonPath}`)
  console.log(`  HTML: ${htmlPath}\n`)

  harness.stop()
}

main().catch((e) => {
  console.error(e)
  harness.stop()
  process.exit(1)
})
