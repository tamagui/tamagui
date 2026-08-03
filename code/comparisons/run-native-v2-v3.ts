#!/usr/bin/env bun
/**
 * V2/V3 unflattened runtime benchmark on one iOS simulator.
 *
 * Release apps are the default and the only publishable evidence path. Expo Go
 * remains available for harness development, but the report labels it separately.
 *
 * Usage:
 *   bun code/comparisons/run-native-v2-v3.ts --udid=<UDID>
 *   bun code/comparisons/run-native-v2-v3.ts --udid=<UDID> --samples=12 --warmups=2 --seed=73129
 *   bun code/comparisons/run-native-v2-v3.ts --udid=<UDID> --transport=expo-go
 */
import { execFileSync, spawn, type ChildProcess } from 'child_process'
import { createHash } from 'crypto'
import { closeSync, mkdirSync, openSync, readFileSync, writeFileSync } from 'fs'
import { arch, cpus, platform, release, totalmem } from 'os'
import { dirname, join } from 'path'
import {
  createRandom,
  median,
  shuffle,
  summarize,
  type Statistic,
} from './benchmark-statistics'
import {
  nativeBenchBuildIdentity,
  type NativeBenchFramework,
} from './native-bench-build-id'
import {
  NATIVE_COMPILED_FIXTURE_VERSION,
  NATIVE_COMPILED_SCENARIOS,
  type NativeCompiledScenario,
  NATIVE_RUNTIME_FIXTURE_VERSION,
  NATIVE_RUNTIME_SCENARIOS,
  type NativeRuntimeScenario,
} from './shared/native-bench-spec'

const args = process.argv.slice(2)
const smoke = args.includes('--smoke')
const arg = (name: string) =>
  args.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3)
const samples = Number.parseInt(arg('samples') ?? (smoke ? '0' : '12'), 10)
const warmups = Number.parseInt(arg('warmups') ?? (smoke ? '1' : '2'), 10)
const seed = Number.parseInt(arg('seed') ?? `${Date.now()}`, 10)
const transport = arg('transport') ?? 'release'
const udid = arg('udid')
const scenarioFilter = arg('scenarios')?.split(',')
const allScenarios = [
  ...new Set([...NATIVE_RUNTIME_SCENARIOS, ...NATIVE_COMPILED_SCENARIOS]),
]
const scenarios = scenarioFilter
  ? allScenarios.filter((scenario) => scenarioFilter.includes(scenario))
  : allScenarios
const here = import.meta.dir
const repositoryRoot = join(here, '../..')
const outputPath = arg('output') ?? join(here, 'output', 'benchmarks-native-v2-v3.json')
const markdownPath = outputPath.replace(/\.json$/, '.md')
const compilerEvidencePath = arg('compiler-evidence')
const resultPort = 8091
const scenarioTimeoutMs = 60_000

type Metric = 'mount' | 'update' | 'remount'
type ScenarioId = NativeRuntimeScenario | NativeCompiledScenario
type FrameworkId = NativeBenchFramework

interface BenchConfig {
  id: FrameworkId
  name: string
  version: string
  dir: string
  port: number
  scheme: string
  bundleIdentifier: string
  fixture: 'runtime' | 'compiled'
  fixtureVersion: number
  scenarios: readonly ScenarioId[]
}

const benchmarks: readonly BenchConfig[] = [
  {
    id: 'tamagui-v2-runtime',
    name: 'Tamagui V2 runtime',
    version: '2.6.2',
    dir: 'tamagui-v2-bench-native',
    port: 8106,
    scheme: 'tgv2benchnative',
    bundleIdentifier: 'dev.tamagui.v2benchnative',
    fixture: 'runtime',
    fixtureVersion: NATIVE_RUNTIME_FIXTURE_VERSION,
    scenarios: NATIVE_RUNTIME_SCENARIOS,
  },
  {
    id: 'tamagui-v3-runtime',
    name: 'Tamagui V3 runtime',
    version: 'workspace',
    dir: 'tamagui-bench-native',
    port: 8101,
    scheme: 'tgbenchnative',
    bundleIdentifier: 'dev.tamagui.benchnative',
    fixture: 'runtime',
    fixtureVersion: NATIVE_RUNTIME_FIXTURE_VERSION,
    scenarios: NATIVE_RUNTIME_SCENARIOS,
  },
  {
    id: 'tamagui-v2-compiled',
    name: 'Tamagui V2 compiled',
    version: '2.6.2',
    dir: 'tamagui-v2-bench-native-compiled',
    port: 8107,
    scheme: 'tgv2benchnativecompiled',
    bundleIdentifier: 'dev.tamagui.v2benchnative.compiled',
    fixture: 'compiled',
    fixtureVersion: NATIVE_COMPILED_FIXTURE_VERSION,
    scenarios: NATIVE_COMPILED_SCENARIOS,
  },
  {
    id: 'tamagui-v3-compiled',
    name: 'Tamagui V3 compiled',
    version: 'workspace',
    dir: 'tamagui-bench-native-compiled',
    port: 8104,
    scheme: 'tgbenchnativecompiled',
    bundleIdentifier: 'dev.tamagui.benchnative.compiled',
    fixture: 'compiled',
    fixtureVersion: NATIVE_COMPILED_FIXTURE_VERSION,
    scenarios: NATIVE_COMPILED_SCENARIOS,
  },
]

const comparisons = [
  {
    id: 'runtime-v3-vs-v2',
    name: 'runtime V3 versus V2',
    left: 'tamagui-v2-runtime',
    right: 'tamagui-v3-runtime',
    scenarios: NATIVE_RUNTIME_SCENARIOS,
  },
  {
    id: 'compiled-v3-vs-v2',
    name: 'compiled V3 versus V2',
    left: 'tamagui-v2-compiled',
    right: 'tamagui-v3-compiled',
    scenarios: NATIVE_COMPILED_SCENARIOS,
  },
  {
    id: 'v2-compiled-vs-runtime',
    name: 'V2 compiler effect',
    left: 'tamagui-v2-runtime',
    right: 'tamagui-v2-compiled',
    scenarios: ['simple'] as const,
  },
  {
    id: 'v3-compiled-vs-runtime',
    name: 'V3 compiler effect',
    left: 'tamagui-v3-runtime',
    right: 'tamagui-v3-compiled',
    scenarios: ['simple'] as const,
  },
] as const

type ComparisonId = (typeof comparisons)[number]['id']

interface IncomingResult {
  framework: FrameworkId
  buildId: string
  scenario: ScenarioId
  run: string
  fixtureVersion: number
  mount: number
  update: number
  remount: number
  behaviorSignature?: Record<string, unknown>
}

interface Trial extends IncomingResult {
  sequence: number
  phase: 'warmup' | 'sample'
  round: number
}

interface Distribution extends Statistic {
  median: number
  minimum: number
  maximum: number
}

interface Effect {
  pairedSamples: number
  rightMinusLeft: Distribution
  ratioOfMeans: number
  percentDifference: number
  medianPairedPercentDifference: number
  cohensDz: number | null
}

interface CompilerEvidence {
  fixture: { sha256: string }
  dynamicFixture: {
    sha256: string
    v2: { stats: { optimized: number; flattened: number } }
    v3: { stats: { flattened: number; bailed: number } }
  }
  v2: {
    packages: { tamagui: string; babelPlugin: string }
    stats: { flattened: number }
  }
  v3: { stats: { flattened: number } }
  [key: string]: unknown
}

interface BenchmarkReport {
  schemaVersion: 2
  metadata: Record<string, unknown>
  frameworks: readonly Omit<BenchConfig, 'dir' | 'port' | 'scheme' | 'scenarios'>[]
  comparisons: readonly {
    id: ComparisonId
    name: string
    left: FrameworkId
    right: FrameworkId
    scenarios: readonly ScenarioId[]
  }[]
  workload: {
    fixtureVersions: { runtime: number; compiled: number }
    itemCount: number
    heavyAndComponentCount: number
    cases: Array<{ framework: FrameworkId; scenarios: readonly ScenarioId[] }>
    samples: number
    warmups: number
  }
  trials: Trial[]
  summary: Record<FrameworkId, Partial<Record<ScenarioId, Record<Metric, Distribution>>>>
  effects: Record<ComparisonId, Partial<Record<ScenarioId, Record<Metric, Effect>>>>
}

if (!udid)
  throw new Error('--udid is required so a run cannot silently move to another simulator')
if (!Number.isInteger(samples) || (smoke ? samples !== 0 : samples < 5)) {
  if (smoke) throw new Error('--smoke requires zero retained samples')
  throw new Error('--samples must be an integer of at least 5')
}
if (!Number.isInteger(warmups) || warmups < 1) {
  throw new Error('--warmups must be a positive integer')
}
if (!Number.isInteger(seed)) throw new Error('--seed must be an integer')
if (transport !== 'release' && transport !== 'expo-go') {
  throw new Error('--transport must be release or expo-go')
}
if (transport === 'release' && !compilerEvidencePath) {
  throw new Error('--compiler-evidence is required for Release measurements')
}
if (
  scenarios.length === 0 ||
  scenarios.length !== (scenarioFilter?.length ?? scenarios.length)
) {
  throw new Error(`--scenarios must contain only: ${allScenarios.join(',')}`)
}

function git(...gitArgs: string[]) {
  return execFileSync('git', gitArgs, { cwd: repositoryRoot }).toString().trim()
}

function sha256(path: string) {
  return createHash('sha256').update(readFileSync(path)).digest('hex')
}

function readJson(path: string) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function distribution(values: readonly number[]): Distribution {
  return {
    ...summarize(values),
    median: median(values),
    minimum: Math.min(...values),
    maximum: Math.max(...values),
  }
}

function simulatorMetadata() {
  const deviceSets = JSON.parse(
    execFileSync('xcrun', ['simctl', 'list', 'devices', 'available', '-j']).toString()
  ).devices as Record<string, Array<{ udid: string; name: string; state: string }>>
  for (const [runtimeIdentifier, devices] of Object.entries(deviceSets)) {
    const device = devices.find((candidate) => candidate.udid === udid)
    if (!device) continue
    const runtime = JSON.parse(
      execFileSync('xcrun', ['simctl', 'list', 'runtimes', '-j']).toString()
    ).runtimes.find((candidate: any) => candidate.identifier === runtimeIdentifier)
    return {
      kind: 'ios-simulator',
      realDevice: false,
      udid,
      name: device.name,
      state: device.state,
      runtimeIdentifier,
      runtimeVersion: runtime?.version ?? 'unknown',
      runtimeBuild: runtime?.buildversion ?? 'unknown',
    }
  }
  throw new Error(`simulator ${udid} is not available`)
}

function ensureInstalled(bundleIdentifier: string) {
  try {
    return execFileSync(
      'xcrun',
      ['simctl', 'get_app_container', udid!, bundleIdentifier, 'app'],
      { stdio: 'pipe' }
    )
      .toString()
      .trim()
  } catch {
    throw new Error(
      `${bundleIdentifier} is not installed on ${udid}; build both Release apps with the commands in code/comparisons/NATIVE_V2_V3.md`
    )
  }
}

function hasExpoGo() {
  try {
    const apps = JSON.parse(
      execFileSync('xcrun', ['simctl', 'listapps', udid!, '-j']).toString()
    )
    return Object.keys(apps).some((bundleIdentifier) => bundleIdentifier.includes('Expo'))
  } catch {
    return false
  }
}

async function waitForMetro(port: number) {
  const deadline = Date.now() + 90_000
  while (Date.now() < deadline) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/status`)
      if (response.ok) return
    } catch {}
    await Bun.sleep(500)
  }
  throw new Error(`Metro did not become ready on port ${port}`)
}

function startMetro(bench: BenchConfig) {
  const logPath = join(here, `.metro-${bench.dir}.log`)
  const descriptor = openSync(logPath, 'w')
  const executable = bench.id.startsWith('tamagui-v2') ? 'npm' : 'bun'
  const startArgs =
    executable === 'npm'
      ? ['run', 'start', '--', '--no-dev', '--minify', '--clear']
      : ['run', 'start', '--no-dev', '--minify', '--clear']
  const child = spawn(executable, startArgs, {
    cwd: join(here, bench.dir),
    env: {
      ...process.env,
      BROWSER: 'none',
      CI: '1',
      EXPO_NO_TELEMETRY: '1',
      NODE_ENV: 'production',
    },
    stdio: ['ignore', descriptor, descriptor],
  })
  closeSync(descriptor)
  return child
}

const waiters = new Map<
  string,
  {
    framework: FrameworkId
    scenario: ScenarioId
    resolve(result: IncomingResult): void
    reject(error: Error): void
  }
>()
const expectedBuildIdentities = Object.fromEntries(
  benchmarks.map((bench) => [bench.id, nativeBenchBuildIdentity(bench.id)])
) as Record<FrameworkId, ReturnType<typeof nativeBenchBuildIdentity>>
const runtimeBehaviorSignatures = new Map<FrameworkId, Record<string, unknown>>()
const resultServer = Bun.serve({
  port: resultPort,
  async fetch(request) {
    if (request.method !== 'POST')
      return new Response('method not allowed', { status: 405 })
    try {
      const result = (await request.json()) as IncomingResult
      const waiter = waiters.get(result.run)
      if (!waiter) return new Response('stale result', { status: 409 })
      const bench = benchmarks.find((candidate) => candidate.id === result.framework)
      if (
        !bench ||
        result.framework !== waiter.framework ||
        result.buildId !== expectedBuildIdentities[bench.id].buildId ||
        result.scenario !== waiter.scenario ||
        !bench.scenarios.includes(result.scenario) ||
        !scenarios.includes(result.scenario) ||
        result.fixtureVersion !== bench.fixtureVersion ||
        !Number.isFinite(result.mount) ||
        !Number.isFinite(result.update) ||
        !Number.isFinite(result.remount) ||
        (bench.fixture === 'runtime' && !result.behaviorSignature)
      ) {
        waiter.reject(new Error(`invalid result for run ${result.run}`))
        waiters.delete(result.run)
        return new Response('invalid result', { status: 400 })
      }
      if (bench.fixture === 'runtime') {
        const signature = result.behaviorSignature!
        const previous = runtimeBehaviorSignatures.get(result.framework)
        if (previous && JSON.stringify(previous) !== JSON.stringify(signature)) {
          waiter.reject(
            new Error(`runtime behavior signature changed for ${result.framework}`)
          )
          waiters.delete(result.run)
          return new Response('invalid result', { status: 400 })
        }
        runtimeBehaviorSignatures.set(result.framework, signature)
      }
      waiter.resolve(result)
      waiters.delete(result.run)
      return new Response('ok')
    } catch (error) {
      return new Response(String(error), { status: 400 })
    }
  },
})

let linkCounter = 0
async function measure(bench: BenchConfig, scenario: ScenarioId, run: string) {
  const result = new Promise<IncomingResult>((resolve, reject) => {
    waiters.set(run, { framework: bench.id, scenario, resolve, reject })
  })
  const deadline = Date.now() + scenarioTimeoutMs
  let nextOpen = 0
  try {
    while (Date.now() < deadline) {
      if (Date.now() >= nextOpen) {
        const params = new URLSearchParams({
          case: scenario,
          fw: bench.id,
          run,
          attempt: String(linkCounter++),
        })
        const url =
          transport === 'release'
            ? `${bench.scheme}://bench?${params}`
            : `exp://127.0.0.1:${bench.port}/--/?${params}`
        execFileSync('xcrun', ['simctl', 'openurl', udid!, url])
        nextOpen = Date.now() + 10_000
      }
      const settled = await Promise.race([
        result.then((value) => ({ value })),
        Bun.sleep(200).then(() => null),
      ])
      if (settled) return settled.value
    }
    throw new Error(`timed out waiting for ${bench.id}/${scenario}/${run}`)
  } finally {
    waiters.delete(run)
  }
}

function buildSummary(trials: readonly Trial[]) {
  const summary = {} as BenchmarkReport['summary']
  for (const bench of benchmarks) {
    summary[bench.id] = {}
    for (const scenario of bench.scenarios.filter((candidate) =>
      scenarios.includes(candidate)
    )) {
      const retained = trials.filter(
        (trial) =>
          trial.phase === 'sample' &&
          trial.framework === bench.id &&
          trial.scenario === scenario
      )
      summary[bench.id][scenario] = {
        mount: distribution(retained.map((trial) => trial.mount)),
        update: distribution(retained.map((trial) => trial.update)),
        remount: distribution(retained.map((trial) => trial.remount)),
      }
    }
  }
  return summary
}

function buildEffects(
  trials: readonly Trial[],
  summary: BenchmarkReport['summary']
): BenchmarkReport['effects'] {
  const effects = {} as BenchmarkReport['effects']
  for (const comparison of comparisons) {
    effects[comparison.id] = {}
    for (const scenario of comparison.scenarios.filter((candidate) =>
      scenarios.includes(candidate)
    )) {
      effects[comparison.id][scenario] = {} as Record<Metric, Effect>
      for (const metric of ['mount', 'update', 'remount'] as const) {
        const left = trials
          .filter(
            (trial) =>
              trial.phase === 'sample' &&
              trial.framework === comparison.left &&
              trial.scenario === scenario
          )
          .sort((left, right) => left.round - right.round)
        const right = trials
          .filter(
            (trial) =>
              trial.phase === 'sample' &&
              trial.framework === comparison.right &&
              trial.scenario === scenario
          )
          .sort((left, right) => left.round - right.round)
        const differences = right.map(
          (trial, index) => trial[metric] - left[index]![metric]
        )
        const pairedPercentDifferences = right.map(
          (trial, index) =>
            ((trial[metric] - left[index]![metric]) / left[index]![metric]) * 100
        )
        const differenceDistribution = distribution(differences)
        const leftMean = summary[comparison.left][scenario]![metric].mean
        const rightMean = summary[comparison.right][scenario]![metric].mean
        effects[comparison.id][scenario]![metric] = {
          pairedSamples: differences.length,
          rightMinusLeft: differenceDistribution,
          ratioOfMeans: rightMean / leftMean,
          percentDifference: ((rightMean - leftMean) / leftMean) * 100,
          medianPairedPercentDifference: median(pairedPercentDifferences),
          cohensDz:
            differenceDistribution.standardDeviation === 0
              ? null
              : differenceDistribution.mean / differenceDistribution.standardDeviation,
        }
      }
    }
  }
  return effects
}

function generateMarkdown(report: BenchmarkReport) {
  const rows: string[] = []
  for (const comparison of report.comparisons) {
    for (const scenario of comparison.scenarios) {
      for (const metric of ['mount', 'update', 'remount'] as const) {
        const left = report.summary[comparison.left][scenario]![metric]
        const right = report.summary[comparison.right][scenario]![metric]
        const effect = report.effects[comparison.id][scenario]![metric]
        rows.push(
          `| ${comparison.name} | ${scenario} | ${metric} | ${left.mean.toFixed(2)} ± ${left.standardDeviation.toFixed(2)} | ${right.mean.toFixed(2)} ± ${right.standardDeviation.toFixed(2)} | ${effect.percentDifference >= 0 ? '+' : ''}${effect.percentDifference.toFixed(1)}% | ${effect.rightMinusLeft.ci95.low.toFixed(2)} to ${effect.rightMinusLeft.ci95.high.toFixed(2)} | ${effect.cohensDz?.toFixed(2) ?? 'n/a'} |`
        )
      }
    }
  }
  return `# V2/V3 native runtime and compiler benchmark

Generated ${report.metadata.generatedAt}. The JSON beside this file is authoritative and retains every warmup and sample.

| Comparison | Scenario | Metric | Left mean ± SD (ms) | Right mean ± SD (ms) | Right delta | Paired difference 95% CI (ms) | Cohen's dz |
| --- | --- | --- | ---: | ---: | ---: | ---: | ---: |
${rows.join('\n')}

## Method

- ${report.workload.warmups} warmup rounds and ${report.workload.samples} retained rounds.
- Every round contains every framework/scenario case once in seeded randomized order.
- Runtime and compiler comparisons each use one shared versioned fixture. All four apps use Expo 55, React 19.1, React Native 0.83.2, and the same simulator.
- The V2 apps use npm 2.6.2 artifacts. The V3 apps use workspace source at ${report.metadata.sourceCommit}.
- Transport: ${report.metadata.transport}. Hardware evidence: iOS Simulator, not a physical device.

## Limitations

- Simulator measurements include host scheduling noise and do not establish physical-device startup, memory, GPU, or energy parity.
- The mount, stable-key style update, and keyed remount timers start before React reconciliation and end in a layout effect. They include JavaScript render/reconciliation and the synchronous native commit boundary, but not the next fully drawn frame.
- V2 and V3 runtime apps use their supported token and conditional-style spelling. The shared runtime fixture keeps resolved styles, element counts, component hierarchy, React Native/Expo versions, and measurement code equivalent.
- Each runtime app executes raw-style, token, active pseudo, active group, and Button behavior gates before timing. The runner requires identical V2/V3 resolved native-style signatures.
- The compiler fixture uses byte-identical JSX with raw numeric/RGB styles. The evidence gate applies both compiler outputs and structurally asserts expected host styles plus preserved stable-key style updates.
- Compiled fixture updates change opacity on identical React Native wrappers so static Tamagui candidates remain fully eligible for both compilers. Treat compiled update as a native commit control; compiler effects come from mount, keyed remount, coverage, and output behavior.
- Compiler coverage is a representative synthetic fixture. The runtime component case exercises real Tamagui Button code, but this campaign does not claim compiler coverage for a production application corpus.
`
}

async function main() {
  const sim = simulatorMetadata()
  if (sim.state !== 'Booted') {
    throw new Error(
      `simulator ${udid} is ${sim.state}; boot it explicitly with xcodebuildmcp simulator-management boot --simulator-id ${udid}`
    )
  }

  const metros: ChildProcess[] = []
  const releaseArtifacts: Record<string, unknown> = {}
  let compilerEvidence: CompilerEvidence | null = null
  if (transport === 'release') {
    compilerEvidence = readJson(compilerEvidencePath!)
    const compiledFixtureSha256 = sha256(
      join(here, 'shared', 'native-compiled-bench.tsx')
    )
    const dynamicFixtureSha256 = sha256(
      join(
        repositoryRoot,
        'code/compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx'
      )
    )
    if (
      compilerEvidence.fixture?.sha256 !== compiledFixtureSha256 ||
      compilerEvidence.dynamicFixture?.sha256 !== dynamicFixtureSha256 ||
      compilerEvidence.v2?.packages?.tamagui !== '2.6.2' ||
      compilerEvidence.v2?.packages?.babelPlugin !== '2.6.2' ||
      compilerEvidence.v2?.stats?.flattened < 1 ||
      compilerEvidence.v3?.stats?.flattened < 1 ||
      compilerEvidence.dynamicFixture?.v2?.stats?.optimized < 1 ||
      compilerEvidence.dynamicFixture?.v3?.stats?.flattened !== 3 ||
      compilerEvidence.dynamicFixture?.v3?.stats?.bailed !== 0
    ) {
      throw new Error('compiler evidence does not match this fixture and V2/V3 build')
    }
    for (const bench of benchmarks) {
      const appPath = ensureInstalled(bench.bundleIdentifier)
      const bundlePath = execFileSync('find', [
        appPath,
        '-name',
        'main.jsbundle',
        '-print',
        '-quit',
      ])
        .toString()
        .trim()
      if (!bundlePath) {
        throw new Error(
          `${bench.bundleIdentifier} has no embedded main.jsbundle; rebuild it with configuration Release`
        )
      }
      releaseArtifacts[bench.id] = {
        bundleIdentifier: bench.bundleIdentifier,
        mainBundleSha256: sha256(bundlePath),
        mainBundleBytes: readFileSync(bundlePath).byteLength,
      }
    }
  } else {
    if (!hasExpoGo()) {
      throw new Error(
        `Expo Go is not installed on ${udid}; release transport is preferred`
      )
    }
    for (const bench of benchmarks) {
      const metro = startMetro(bench)
      metros.push(metro)
      await waitForMetro(bench.port)
    }
  }

  const random = createRandom(seed)
  const tasks = benchmarks.flatMap((bench) =>
    bench.scenarios
      .filter((scenario) => scenarios.includes(scenario))
      .map((scenario) => ({ bench, scenario }))
  )
  const trials: Trial[] = []
  let sequence = 0
  try {
    const phases = smoke ? (['warmup'] as const) : (['warmup', 'sample'] as const)
    for (const phase of phases) {
      const rounds = phase === 'warmup' ? warmups : samples
      console.log(`Recording ${rounds} ${phase} round${rounds === 1 ? '' : 's'}...`)
      for (let round = 0; round < rounds; round++) {
        for (const task of shuffle(tasks, random)) {
          const run = `${phase}-${round}-${sequence}`
          const result = await measure(task.bench, task.scenario, run)
          trials.push({ sequence, phase, round, ...result })
          sequence++
          process.stdout.write('.')
          await Bun.sleep(250)
        }
        console.log(` ${round + 1}/${rounds}`)
      }
    }

    const v2RuntimeBehavior = runtimeBehaviorSignatures.get('tamagui-v2-runtime')
    const v3RuntimeBehavior = runtimeBehaviorSignatures.get('tamagui-v3-runtime')
    if (
      !v2RuntimeBehavior ||
      !v3RuntimeBehavior ||
      JSON.stringify(v2RuntimeBehavior) !== JSON.stringify(v3RuntimeBehavior)
    ) {
      throw new Error(
        `V2/V3 runtime behavior signatures differ: ${JSON.stringify({ v2RuntimeBehavior, v3RuntimeBehavior })}`
      )
    }
    if (smoke) {
      console.log(`Warmup-only smoke passed: ${trials.length} cases`)
      console.log(
        `Release build identities: ${JSON.stringify(Object.fromEntries(Object.entries(expectedBuildIdentities).map(([framework, identity]) => [framework, identity.buildId])))}`
      )
      console.log(`Runtime behavior: ${JSON.stringify(v2RuntimeBehavior)}`)
      return
    }

    const v2RuntimeRoot = join(here, 'tamagui-v2-bench-native')
    const v2CompiledRoot = join(here, 'tamagui-v2-bench-native-compiled')
    const v2RuntimeLock = readJson(join(v2RuntimeRoot, 'package-lock.json'))
    const v2CompiledLock = readJson(join(v2CompiledRoot, 'package-lock.json'))
    const packageNames = [
      'expo',
      'expo-linking',
      'react',
      'react-dom',
      'react-native',
      'react-native-safe-area-context',
      'tamagui',
      '@tamagui/config',
    ]
    const installedPackageVersions = Object.fromEntries(
      benchmarks.map((bench) => {
        const packageRoot = bench.id.startsWith('tamagui-v2')
          ? join(here, bench.dir)
          : repositoryRoot
        const versions = Object.fromEntries(
          packageNames.map((packageName) => [
            packageName,
            readJson(
              join(packageRoot, 'node_modules', ...packageName.split('/'), 'package.json')
            ).version,
          ])
        )
        if (bench.fixture === 'compiled') {
          versions['@tamagui/metro-plugin'] = readJson(
            join(packageRoot, 'node_modules', '@tamagui', 'metro-plugin', 'package.json')
          ).version
        }
        return [bench.id, versions]
      })
    )
    const summary = buildSummary(trials)
    const selectedComparisons = comparisons
      .map((comparison) => ({
        ...comparison,
        scenarios: comparison.scenarios.filter((scenario) =>
          scenarios.includes(scenario)
        ),
      }))
      .filter((comparison) => comparison.scenarios.length > 0)
    const report: BenchmarkReport = {
      schemaVersion: 2,
      metadata: {
        generatedAt: new Date().toISOString(),
        sourceCommit: git('rev-parse', 'HEAD'),
        sourceBranch: git('branch', '--show-current'),
        sourceDirtyBeforeOutput: git('status', '--porcelain').length > 0,
        fixtureGitBlobs: {
          spec: git('hash-object', 'code/comparisons/shared/native-bench-spec.ts'),
          runtime: git('hash-object', 'code/comparisons/shared/native-runtime-bench.ts'),
          compiled: git(
            'hash-object',
            'code/comparisons/shared/native-compiled-bench.tsx'
          ),
          dynamicCompiled: git(
            'hash-object',
            'code/compiler/static-tests/fixtures/native-compiled-dynamic-corpus.tsx'
          ),
          config: git('hash-object', 'code/comparisons/shared/native-tamagui-config.ts'),
        },
        v2Reference: {
          packageVersion: '2.6.2',
          gitTag: 'v2.6.2',
          gitTagCommit: git('rev-list', '-n', '1', 'v2.6.2'),
          originMainCommitAtRun: git('rev-parse', 'origin/main'),
        },
        v2PackageLocks: {
          runtimeSha256: sha256(join(v2RuntimeRoot, 'package-lock.json')),
          compiledSha256: sha256(join(v2CompiledRoot, 'package-lock.json')),
        },
        v2Artifacts: {
          tamaguiIntegrity: v2RuntimeLock.packages['node_modules/tamagui'].integrity,
          configIntegrity:
            v2RuntimeLock.packages['node_modules/@tamagui/config'].integrity,
          reactDomIntegrity: v2RuntimeLock.packages['node_modules/react-dom'].integrity,
          safeAreaContextIntegrity:
            v2RuntimeLock.packages['node_modules/react-native-safe-area-context']
              .integrity,
          metroPluginIntegrity:
            v2CompiledLock.packages['node_modules/@tamagui/metro-plugin'].integrity,
          babelPluginIntegrity:
            v2CompiledLock.packages['node_modules/@tamagui/babel-plugin'].integrity,
        },
        installedPackageVersions,
        releaseBuildIdentities: expectedBuildIdentities,
        runtimeBehaviorSignature: v2RuntimeBehavior,
        compilerEvidence: compilerEvidence
          ? {
              sha256: sha256(compilerEvidencePath!),
              report: compilerEvidence,
            }
          : null,
        releaseArtifacts,
        transport:
          transport === 'release'
            ? 'standalone Release apps with embedded production JavaScript bundles'
            : 'Expo Go with --no-dev --minify production JavaScript bundles',
        buildMode: 'production',
        randomSeed: seed,
        order: 'one seeded PRNG shuffles every warmup and retained round',
        simulator: sim,
        host: {
          platform: platform(),
          osRelease: release(),
          architecture: arch(),
          cpu: cpus()[0]?.model ?? 'unknown',
          logicalCpuCount: cpus().length,
          totalMemoryBytes: totalmem(),
        },
        tools: {
          bun: Bun.version,
          node: process.version,
          xcodebuildmcp: execFileSync('xcodebuildmcp', ['--version']).toString().trim(),
        },
      },
      frameworks: benchmarks.map(
        ({ id, name, version, bundleIdentifier, fixture, fixtureVersion }) => ({
          id,
          name,
          version,
          bundleIdentifier,
          fixture,
          fixtureVersion,
        })
      ),
      comparisons: selectedComparisons,
      workload: {
        fixtureVersions: {
          runtime: NATIVE_RUNTIME_FIXTURE_VERSION,
          compiled: NATIVE_COMPILED_FIXTURE_VERSION,
        },
        itemCount: 200,
        heavyAndComponentCount: 60,
        cases: benchmarks.map((bench) => ({
          framework: bench.id,
          scenarios: bench.scenarios.filter((scenario) => scenarios.includes(scenario)),
        })),
        samples,
        warmups,
      },
      trials,
      summary,
      effects: buildEffects(trials, summary),
    }
    mkdirSync(dirname(outputPath), { recursive: true })
    writeFileSync(outputPath, `${JSON.stringify(report, null, 2)}\n`)
    writeFileSync(markdownPath, generateMarkdown(report))
    console.log(`JSON: ${outputPath}`)
    console.log(`Markdown: ${markdownPath}`)
  } finally {
    for (const metro of metros) metro.kill('SIGTERM')
    resultServer.stop()
  }
}

main().catch((error) => {
  console.error(error)
  resultServer.stop()
  process.exit(1)
})
