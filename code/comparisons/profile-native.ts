#!/usr/bin/env bun
/**
 * Profile the Tamagui native bench harness (Hermes, iOS sim) for the time`...`
 * spans wired through createComponent.tsx, getSplitStyles.tsx, useThemeState.ts.
 *
 * Mirrors profile-getsplitstyles.ts (web) but drives an iOS simulator via Expo Go.
 * The bench app (App.tsx) sets globalThis.time = timer().start({quiet:true}) before
 * the first Tamagui render and POSTs the per-scenario time.print() output back to
 * this orchestrator at :8091.
 *
 * Usage:
 *   bun code/comparisons/profile-native.ts             # simple + group
 *   bun code/comparisons/profile-native.ts simple
 *   bun code/comparisons/profile-native.ts --udid=<UDID> simple group
 */
import { execFileSync, execSync, spawn, type ChildProcess } from 'child_process'
import { mkdirSync, writeFileSync } from 'fs'
import { join } from 'path'

const HERE = import.meta.dir
const UDID_ARG = process.argv.find((a) => a.startsWith('--udid='))?.split('=')[1]
const COMPILED = process.argv.includes('--compiled')
const BENCH_DIR = COMPILED ? 'tamagui-bench-native-compiled' : 'tamagui-bench-native'
const PORT = COMPILED ? 8104 : 8101
const HARNESS_PORT = 8091
const COLD_BUNDLE_TIMEOUT_MS = 240_000
const SCENARIO_TIMEOUT_MS = 90_000

const ALL_SCENARIOS = ['simple', 'themed', 'rich', 'group', 'heavy', 'animated'] as const
type Scenario = (typeof ALL_SCENARIOS)[number]

const targets =
  (process.argv.slice(2).filter((a) => !a.startsWith('--')) as Scenario[]) ?? []
const scenarios: Scenario[] = targets.length > 0 ? targets : ['simple', 'group']

interface Result {
  framework: string
  scenario: Scenario
  mount: number
  rerender: number
  profile?: string
}

let lastResult: Result | null = null
const harness = Bun.serve({
  port: HARNESS_PORT,
  async fetch(req) {
    if (req.method === 'POST') {
      try {
        const body = (await req.json()) as Result
        if (body && body.scenario) lastResult = body
      } catch {}
    }
    return new Response('ok', { headers: { 'access-control-allow-origin': '*' } })
  },
})

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
    if (!String(e?.stderr ?? '').includes('Booted')) throw e
  }
}

function killPort(port: number) {
  try {
    const pids = execSync(`lsof -ti:${port} 2>/dev/null`).toString().trim()
    if (pids)
      for (const pid of pids.split('\n')) {
        try {
          process.kill(parseInt(pid))
        } catch {}
      }
  } catch {}
}

async function waitForMetro(port: number, timeout = 60_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const res = await fetch(`http://localhost:${port}/status`)
      if (res.ok) return true
    } catch {}
    await new Promise((r) => setTimeout(r, 500))
  }
  return false
}

function startMetro(): ChildProcess {
  const cwd = join(HERE, BENCH_DIR)
  // PROFILE_CLEAR=1 forces a cold metro rebuild so freshly-edited workspace
  // packages (e.g. @tamagui/timer) are picked up instead of a stale cache.
  // PROD=1 builds a production JS bundle (NODE_ENV=production, no dev-only hooks
  // like useId / the dev visualizer effect, minified) — the honest shipped shape.
  // profile markers are gated out in prod, so this only yields mount/rerender.
  const baseArgs =
    process.env.PROD === '1' ? ['run', 'start', '--no-dev', '--minify'] : ['run', 'start']
  const startArgs =
    process.env.PROFILE_CLEAR === '1' ? [...baseArgs, '--clear'] : baseArgs
  const proc = spawn('bun', startArgs, {
    cwd,
    env: {
      ...process.env,
      BROWSER: 'none',
      EXPO_NO_TELEMETRY: '1',
      CI: '1',
    },
    stdio: 'pipe',
  })
  const logFile = join(HERE, `.metro-profile-tamagui.log`)
  const out = Bun.file(logFile)
  ;(async () => {
    const writer = out.writer()
    proc.stdout?.on('data', (d) => writer.write(d))
    proc.stderr?.on('data', (d) => writer.write(d))
    proc.on('close', () => writer.end())
  })()
  return proc
}

let linkCounter = 0
function deepLink(udid: string, scenario: Scenario) {
  const fw = COMPILED ? 'tamagui-compiled' : 'tamagui'
  const url = `exp://127.0.0.1:${PORT}/--/?case=${scenario}&fw=${fw}&profile=1&n=${linkCounter++}`
  execFileSync('xcrun', ['simctl', 'openurl', udid, url])
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

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

function acceptExpoOpenPrompt(udid: string) {
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
    tapExpoProjectRow(udid, text, BENCH_DIR)
  } catch {}
}

async function runScenario(
  udid: string,
  scenario: Scenario,
  isFirst: boolean
): Promise<Result | null> {
  lastResult = null
  deepLink(udid, scenario)
  await sleep(600)
  acceptExpoOpenPrompt(udid)
  const deadline = Date.now() + (isFirst ? COLD_BUNDLE_TIMEOUT_MS : SCENARIO_TIMEOUT_MS)
  // re-deep-link periodically in case the first launch hit a transient bundle
  // error (e.g. "styled is not a function" before metro fully resolves the
  // workspace) — the second bundle then sees no deep-link and shows the
  // default "case picker" state with no profile output.
  const RELINK_INTERVAL_MS = isFirst ? 20_000 : 10_000
  let nextRelink = Date.now() + RELINK_INTERVAL_MS
  while (Date.now() < deadline) {
    if (lastResult && lastResult.scenario === scenario) return lastResult
    if (Date.now() >= nextRelink) {
      deepLink(udid, scenario)
      await sleep(600)
      acceptExpoOpenPrompt(udid)
      nextRelink = Date.now() + RELINK_INTERVAL_MS
    }
    await sleep(200)
  }
  return null
}

async function main() {
  let udid = bootedUdid()
  if (udid && !hasExpoGo(udid)) udid = null
  if (!udid) {
    const target = findSimWithExpoGo()
    if (!target) {
      console.error('No iOS sim with Expo Go found.')
      process.exit(1)
    }
    udid = target
    console.log(`Booting sim ${udid}...`)
    bootSim(udid)
  }
  try {
    execSync('open -a Simulator', { stdio: 'pipe' })
  } catch {}
  console.log(`Using sim ${udid}`)

  killPort(PORT)
  const metro = startMetro()
  console.log('Starting metro...')
  const ok = await waitForMetro(PORT, 60_000)
  if (!ok) {
    console.error(`metro did not start on :${PORT}`)
    try {
      metro.kill('SIGTERM')
    } catch {}
    harness.stop()
    process.exit(1)
  }
  console.log('Metro up. Deep-linking scenarios...')

  const outDir = join(HERE, 'output', 'profile-native')
  mkdirSync(outDir, { recursive: true })

  try {
    let isFirst = true
    for (const s of scenarios) {
      console.log(`\n--- ${s} ---`)
      const r = await runScenario(udid, s, isFirst)
      isFirst = false
      if (!r) {
        console.log(`  TIMEOUT`)
        continue
      }
      console.log(`  mount=${r.mount.toFixed(1)}ms rerender=${r.rerender.toFixed(1)}ms`)
      if (r.profile) {
        const path = join(outDir, `${s}.txt`)
        writeFileSync(
          path,
          `mount=${r.mount.toFixed(1)}ms rerender=${r.rerender.toFixed(1)}ms\n\n${r.profile}\n`
        )
        console.log(`  wrote ${path}`)
      } else {
        console.log(`  (no profile data)`)
      }
      await sleep(800)
    }
  } finally {
    try {
      metro.kill('SIGTERM')
    } catch {}
    await sleep(500)
    killPort(PORT)
    harness.stop()
  }
}

main().catch((e) => {
  console.error(e)
  harness.stop()
  process.exit(1)
})
