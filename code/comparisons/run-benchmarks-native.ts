#!/usr/bin/env bun
/**
 * Native bench orchestrator. Mirrors run-benchmarks.ts but drives an iOS simulator via
 * Expo Go: starts each framework's metro on its own port, deep-links to each scenario,
 * collects timings POSTed from the bench app to http://localhost:8091/result, writes a
 * comparison table to stdout (and optionally HTML).
 *
 * Prereqs:
 *   - Xcode + iOS simulator runtime installed
 *   - Expo Go installed on the target sim (the harness boots one if none is booted; the
 *     iPhone 16 Pro on this machine already has Expo Go from the conformance harness)
 *
 * Usage:
 *   bun code/comparisons/run-benchmarks-native.ts
 *   bun code/comparisons/run-benchmarks-native.ts --runs=3 --html
 *   bun code/comparisons/run-benchmarks-native.ts --only=tamagui   # subset
 *   bun code/comparisons/run-benchmarks-native.ts --udid=<UDID>    # pick a sim
 */
import { execFileSync, execSync, spawn, type ChildProcess } from 'child_process'
import { existsSync, mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const args = process.argv.slice(2)
const NUM_RUNS = parseInt(args.find((a) => a.startsWith('--runs='))?.split('=')[1] ?? '1')
const OUTPUT_HTML = args.includes('--html')
const ONLY = args.find((a) => a.startsWith('--only='))?.split('=')[1]
const UDID_ARG = args.find((a) => a.startsWith('--udid='))?.split('=')[1]
const SCENARIO_TIMEOUT_MS = 60_000
const COLD_BUNDLE_TIMEOUT_MS = 180_000
const HERE = import.meta.dir

const SCENARIOS = ['simple', 'rich', 'group', 'heavy', 'animated'] as const
type ScenarioId = (typeof SCENARIOS)[number]

const SCENARIO_LABELS: Record<ScenarioId, string> = {
  simple: 'Simple (static props)',
  rich: 'Rich (pseudo states)',
  group: 'Group hover',
  heavy: 'Heavy page (60)',
  animated: 'Animated (spring)',
}

interface BenchConfig {
  framework: string   // POST.framework matches this
  label: string       // column header in the table
  dir: string         // workspace dir under code/comparisons/
  port: number        // metro port
  skipScenarios?: ScenarioId[]
}

const BENCHMARKS: BenchConfig[] = [
  {
    // The native metro config doesn't run the tamagui babel plugin (no withTamagui), so this
    // is the pure runtime path — same baseline as web's "Tamagui (runtime, 200x)" column.
    // A compiled-native column requires wiring @tamagui/babel-plugin into metro; deferred.
    framework: 'tamagui',
    label: 'Tamagui (runtime)',
    dir: 'tamagui-bench-native',
    port: 8101,
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
      '-name', 'Expo Go.app',
      '-maxdepth', '4',
    ]).toString().trim()
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
}

let lastResult: IncomingResult | null = null
const harness = Bun.serve({
  port: 8091,
  async fetch(req) {
    if (req.method === 'POST') {
      try {
        const body = (await req.json()) as IncomingResult
        if (body && body.scenario && SCENARIOS.includes(body.scenario)) {
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
  // expo start --port=N — same flag the conformance harness uses
  const proc = spawn('bun', ['run', 'start'], {
    cwd,
    env: { ...process.env, BROWSER: 'none', EXPO_NO_TELEMETRY: '1', CI: '1' },
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

async function runOneScenario(
  udid: string,
  port: number,
  bench: BenchConfig,
  scenario: ScenarioId,
  isFirst: boolean
): Promise<{ mount: number; rerender: number } | null> {
  lastResult = null
  deepLink(udid, port, scenario, bench.framework)
  const deadline = Date.now() + (isFirst ? COLD_BUNDLE_TIMEOUT_MS : SCENARIO_TIMEOUT_MS)
  while (Date.now() < deadline) {
    if (
      lastResult &&
      lastResult.scenario === scenario &&
      lastResult.framework === bench.framework
    ) {
      return { mount: lastResult.mount, rerender: lastResult.rerender }
    }
    await sleep(200)
  }
  return null
}

async function runFramework(
  udid: string,
  bench: BenchConfig
): Promise<Record<ScenarioId, { mount: number; rerender: number } | null>> {
  const results: Record<ScenarioId, { mount: number; rerender: number } | null> = {
    simple: null, rich: null, group: null, heavy: null, animated: null,
  }
  let metro: ChildProcess | null = null
  try {
    killPort(bench.port)
    metro = startMetro(bench.dir, bench.port)
    const ok = await waitForMetro(bench.port, 60_000)
    if (!ok) {
      console.log(`  ⚠ metro for ${bench.label} did not start on :${bench.port}`)
      return results
    }
    let isFirst = true
    for (const s of SCENARIOS) {
      if (bench.skipScenarios?.includes(s)) {
        process.stdout.write(`    ${s}: skip\n`)
        continue
      }
      const r = await runOneScenario(udid, bench.port, bench, s, isFirst)
      isFirst = false
      results[s] = r
      if (r) {
        process.stdout.write(
          `    ${s.padEnd(8)} mount=${r.mount.toFixed(1)}ms rerender=${r.rerender.toFixed(1)}ms\n`
        )
      } else {
        process.stdout.write(`    ${s.padEnd(8)} TIMEOUT\n`)
      }
      // small settle between scenarios
      await sleep(300)
    }
  } finally {
    if (metro) {
      try {
        metro.kill('SIGTERM')
      } catch {}
    }
    // give the OS a beat to release the port, then force-kill anything still on it
    await sleep(500)
    killPort(bench.port)
    await sleep(500)
  }
  return results
}

function averageResults(
  runs: Record<ScenarioId, { mount: number; rerender: number } | null>[]
): Record<ScenarioId, { mount: number; rerender: number } | null> {
  const avg: Record<ScenarioId, { mount: number; rerender: number } | null> = {
    simple: null, rich: null, group: null, heavy: null, animated: null,
  }
  for (const s of SCENARIOS) {
    const mounts = runs.map((r) => r[s]?.mount).filter((n): n is number => typeof n === 'number')
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
      mounts.shift(); mounts.pop()
      rerenders.shift(); rerenders.pop()
    }
    avg[s] = {
      mount: mounts.reduce((a, b) => a + b, 0) / mounts.length,
      rerender: rerenders.reduce((a, b) => a + b, 0) / rerenders.length,
    }
  }
  return avg
}

// ── reporting ────────────────────────────────────────────

type AllResults = Record<string, Record<ScenarioId, { mount: number; rerender: number } | null>>

function printTable(results: AllResults) {
  const labels = Object.keys(results)
  const colW = 18
  console.log('')
  const sep = '═'
  console.log('╔' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╗')
  console.log(
    '║' + ' Mount (ms)'.padEnd(22) + labels.map((f) => f.padStart(colW) + ' ').join('') + '║'
  )
  console.log('╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣')
  const fmt = (v: { mount: number; rerender: number } | null, getField: 'mount' | 'rerender') => {
    if (!v) return 'skip'.padStart(colW)
    return v[getField].toFixed(1).padStart(colW)
  }
  for (const s of SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = labels.map((f) => fmt(results[f][s], 'mount'))
    console.log('║' + label + vals.join(' ') + ' ║')
  }
  console.log('╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣')
  console.log(
    '║' + ' Re-render (ms)'.padEnd(22) + labels.map((f) => f.padStart(colW) + ' ').join('') + '║'
  )
  console.log('╠' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╣')
  for (const s of SCENARIOS) {
    const label = SCENARIO_LABELS[s].padEnd(22)
    const vals = labels.map((f) => fmt(results[f][s], 'rerender'))
    console.log('║' + label + vals.join(' ') + ' ║')
  }
  console.log('╚' + sep.repeat(22) + labels.map(() => sep.repeat(colW + 1)).join('') + '╝')
  console.log(`  ${NUM_RUNS} run(s) on iOS sim, 200 items per scenario (60 for heavy)\n`)
}

function generateHtml(results: AllResults): string {
  const labels = Object.keys(results)
  const fmt = (
    v: { mount: number; rerender: number } | null,
    f: 'mount' | 'rerender'
  ) => (v ? `<span class="value">${v[f].toFixed(1)}</span>` : `<span class="ratio">skip</span>`)
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Native Benchmark Comparison (iOS)</title>
<style>
  body { font-family: system-ui; background: #0a0a0a; color: #eee; padding: 40px; max-width: 900px; margin: 0 auto; }
  h1 { font-size: 24px; margin-bottom: 4px; }
  .sub { color: #888; font-size: 13px; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; font-size: 13px; }
  th, td { padding: 8px 12px; text-align: right; border-bottom: 1px solid #222; }
  th:first-child, td:first-child { text-align: left; }
  th { background: #141414; color: #888; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
  tr:hover td { background: #141414; }
  .section-header td { font-weight: 600; background: #1a1a1a; border-top: 2px solid #333; }
  .ratio { font-size: 11px; color: #888; }
  .value { font-weight: 600; font-family: monospace; color: #eee; }
</style>
</head>
<body>
<h1>Native Benchmark Comparison (iOS)</h1>
<p class="sub">200/60 components · ${NUM_RUNS} run(s) · iOS simulator via Expo Go</p>
<table>
<thead><tr><th>Scenario</th>${labels.map((f) => `<th>${f}</th>`).join('')}</tr></thead>
<tbody>
<tr class="section-header"><td colspan="${labels.length + 1}">Mount (ms)</td></tr>
${SCENARIOS.map((s) => `<tr><td>${SCENARIO_LABELS[s]}</td>${labels.map((f) => `<td>${fmt(results[f][s], 'mount')}</td>`).join('')}</tr>`).join('\n')}
<tr class="section-header"><td colspan="${labels.length + 1}">Re-render (ms)</td></tr>
${SCENARIOS.map((s) => `<tr><td>${SCENARIO_LABELS[s]}</td>${labels.map((f) => `<td>${fmt(results[f][s], 'rerender')}</td>`).join('')}</tr>`).join('\n')}
</tbody>
</table>
</body>
</html>`
}

// ── main ─────────────────────────────────────────────────

async function main() {
  console.log(`\n🏁 Running native benchmarks (${NUM_RUNS} run(s))...\n`)

  // pick sim — booted is fine ONLY if it has Expo Go; otherwise find one that does and boot it
  let udid = bootedUdid()
  if (udid && !hasExpoGo(udid)) {
    console.log(`  Sim ${udid} is booted but has no Expo Go. Switching to a sim with Expo Go...`)
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
    ? BENCHMARKS.filter((b) => b.framework === ONLY || b.dir.includes(ONLY))
    : BENCHMARKS
  // dedupe entries that share a dir+port (e.g. tamagui + tamagui-runtime in the same app)
  // — we still run them as separate columns but only start metro once.
  const allResults: AllResults = {}

  // group by dir so we boot one metro per app
  const groups = new Map<string, BenchConfig[]>()
  for (const b of benchmarks) {
    if (!existsSync(join(HERE, b.dir))) {
      console.log(`  ⚠ ${b.label}: dir ${b.dir} doesn't exist — skipping`)
      continue
    }
    const arr = groups.get(b.dir) ?? []
    arr.push(b)
    groups.set(b.dir, arr)
  }

  for (const [dir, group] of groups) {
    console.log(`▶ ${dir} (port ${group[0].port})`)
    for (const bench of group) {
      console.log(`  ${bench.label}`)
      const perRun: Record<ScenarioId, { mount: number; rerender: number } | null>[] = []
      for (let i = 0; i < NUM_RUNS; i++) {
        if (NUM_RUNS > 1) console.log(`    run #${i + 1}`)
        try {
          const r = await runFramework(udid!, bench)
          perRun.push(r)
        } catch (e: any) {
          console.error(`    ! ${bench.label} error: ${e?.message ?? e}`)
        }
      }
      allResults[bench.label] =
        NUM_RUNS >= 3
          ? averageResults(perRun)
          : (perRun[perRun.length - 1] ?? {
              simple: null, rich: null, group: null, heavy: null, animated: null,
            })
    }
  }

  if (Object.keys(allResults).length === 0) {
    console.log('\nNo results collected.')
    harness.stop()
    process.exit(1)
  }

  printTable(allResults)

  // always write JSON
  const outDir = join(HERE, 'output')
  mkdirSync(outDir, { recursive: true })
  writeFileSync(
    join(outDir, 'benchmarks-native.json'),
    JSON.stringify(allResults, null, 2)
  )
  console.log(`  JSON: ${join(outDir, 'benchmarks-native.json')}`)

  if (OUTPUT_HTML) {
    const html = generateHtml(allResults)
    const outPath = join(outDir, 'benchmarks-native.html')
    writeFileSync(outPath, html)
    console.log(`  HTML: ${outPath}\n`)
  }

  harness.stop()
}

main().catch((e) => {
  console.error(e)
  harness.stop()
  process.exit(1)
})
