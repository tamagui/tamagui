#!/usr/bin/env bun
/**
 * production web benchmark matrix.
 *
 * usage:
 *   bun code/comparisons/run-benchmarks.ts
 *   bun code/comparisons/run-benchmarks.ts --samples=10 --seed=1234
 *   bun code/comparisons/run-benchmarks.ts --output=/tmp/benchmarks.json
 */

import { execFileSync, spawn, type ChildProcess } from 'child_process'
import { createHash } from 'crypto'
import { createRequire } from 'module'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  readdirSync,
  rmSync,
  statSync,
  writeFileSync,
} from 'fs'
import { arch, cpus, platform, release, tmpdir, totalmem } from 'os'
import { dirname, join } from 'path'

const args = process.argv.slice(2)
const VERIFY_WORKLOAD_ONLY = args.includes('--verify-workload')
const BUILD_ONLY = args.includes('--build-only')
const samplesArg =
  args.find((arg) => arg.startsWith('--samples=')) ??
  args.find((arg) => arg.startsWith('--runs='))
const NUM_SAMPLES = Number.parseInt(samplesArg?.split('=')[1] ?? '10', 10)
const NUM_WARMUPS = Number.parseInt(
  args.find((arg) => arg.startsWith('--warmups='))?.split('=')[1] ?? '2',
  10
)
const SEED = Number.parseInt(
  args.find((arg) => arg.startsWith('--seed='))?.split('=')[1] ?? `${Date.now()}`,
  10
)
const OUTPUT_PATH =
  args.find((arg) => arg.startsWith('--output='))?.split('=')[1] ??
  join(import.meta.dir, 'output', 'benchmarks.json')
const HTML_PATH = OUTPUT_PATH.replace(/\.json$/, '.html')
const FRAMEWORK_IDS = args
  .find((arg) => arg.startsWith('--frameworks='))
  ?.split('=')[1]
  ?.split(',')
  .filter(Boolean)
const ITEM_COUNT = 200
const HEAVY_COUNT = 60
const SCENARIOS = ['simple', 'rich', 'group', 'heavy', 'animated'] as const
type ScenarioId = (typeof SCENARIOS)[number]
type Metric = 'mount' | 'rerender'

const SCENARIO_LABELS: Record<ScenarioId, string> = {
  simple: 'Simple (static props)',
  rich: 'Rich (borders and spacing)',
  group: 'Nested row',
  heavy: `Heavy page (${HEAVY_COUNT})`,
  animated: 'Dynamic transition',
}

interface BenchConfig {
  id: string
  name: string
  dir: string
  port: number
  buildEnv?: Record<string, string>
  installWith?: 'bun' | 'npm'
  version: string
  mode: string
}

const ALL_BENCHMARKS: BenchConfig[] = [
  {
    id: 'tamagui-v3-compiled',
    name: 'Tamagui v3 (compiled)',
    dir: 'tamagui-bench',
    port: 9101,
    buildEnv: { EXTRACT: '1' },
    version: 'workspace',
    mode: 'compiled',
  },
  {
    id: 'tamagui-v3-runtime',
    name: 'Tamagui v3 (runtime)',
    dir: 'tamagui-bench',
    port: 9106,
    buildEnv: { EXTRACT: '0' },
    version: 'workspace',
    mode: 'runtime',
  },
  {
    id: 'tamagui-v2-compiled',
    name: 'Tamagui v2.6.2 (compiled)',
    dir: 'tamagui-v2-bench',
    port: 9107,
    buildEnv: { EXTRACT: '1' },
    installWith: 'npm',
    version: '2.6.2',
    mode: 'compiled',
  },
  {
    id: 'tamagui-v2-runtime',
    name: 'Tamagui v2.6.2 (runtime)',
    dir: 'tamagui-v2-bench',
    port: 9108,
    buildEnv: { EXTRACT: '0' },
    installWith: 'npm',
    version: '2.6.2',
    mode: 'runtime',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    dir: 'tailwind-bench',
    port: 9102,
    version: 'Tailwind CSS 3.4.19',
    mode: 'compiled',
    installWith: 'bun',
  },
  {
    id: 'inline',
    name: 'Inline (baseline)',
    dir: 'inline-bench',
    port: 9103,
    version: 'React 19',
    mode: 'inline',
    installWith: 'bun',
  },
  {
    id: 'nativewind',
    name: 'NativeWind v5',
    dir: 'nativewind-bench',
    port: 9104,
    version: 'Tailwind CSS 4.3.3 + React Native Web 0.19.13',
    mode: 'compiled',
    installWith: 'bun',
  },
  {
    id: 'uniwind',
    name: 'Uniwind',
    dir: 'uniwind-bench',
    port: 9105,
    version: 'Uniwind 1.10.0',
    mode: 'compiled',
    installWith: 'bun',
  },
]
const BENCHMARKS = FRAMEWORK_IDS
  ? FRAMEWORK_IDS.map((id) => {
      const benchmark = ALL_BENCHMARKS.find((candidate) => candidate.id === id)
      if (!benchmark) throw new Error(`unknown framework id: ${id}`)
      return benchmark
    })
  : ALL_BENCHMARKS

interface Trial {
  sequence: number
  phase: 'warmup' | 'sample'
  round: number
  framework: string
  scenario: ScenarioId
  mount: number
  rerender: number
}

interface Statistic {
  n: number
  mean: number
  standardDeviation: number
  ci95: { low: number; high: number; margin: number }
}

interface ScenarioSummary {
  warmups: { mount: number[]; rerender: number[] }
  mount: Statistic
  rerender: Statistic
}

interface PairedEffect {
  v3: Statistic
  v2: Statistic
  differenceMs: Statistic
  ratio: Statistic
}

interface BenchmarkReport {
  schemaVersion: 1
  metadata: Record<string, unknown>
  frameworks: Array<Pick<BenchConfig, 'id' | 'name' | 'version' | 'mode'>>
  workload: { itemCount: number; heavyCount: number; samples: number; warmups: number }
  artifacts: Record<
    string,
    {
      files: number
      totalBytes: number
      jsBytes: number
      cssBytes: number
      compilerStats?: unknown
      versions: Record<string, string>
    }
  >
  trials: Trial[]
  summary: Record<string, Record<ScenarioId, ScenarioSummary>>
  effects: Partial<
    Record<'compiled' | 'runtime', Record<ScenarioId, Record<Metric, PairedEffect>>>
  >
}

function command(command: string, commandArgs: string[], cwd: string, env = {}) {
  execFileSync(command, commandArgs, {
    cwd,
    env: { ...process.env, ...env },
    stdio: 'inherit',
  })
}

function git(...commandArgs: string[]) {
  return execFileSync('git', commandArgs, { cwd: import.meta.dir })
    .toString()
    .trim()
}

function measureBuildArtifact(directory: string) {
  const totals = { files: 0, totalBytes: 0, jsBytes: 0, cssBytes: 0 }
  const visit = (current: string) => {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const filePath = join(current, entry.name)
      if (entry.isDirectory()) {
        visit(filePath)
        continue
      }
      const bytes = statSync(filePath).size
      totals.files++
      totals.totalBytes += bytes
      if (/\.[cm]?js$/.test(entry.name)) totals.jsBytes += bytes
      if (entry.name.endsWith('.css')) totals.cssBytes += bytes
    }
  }
  visit(directory)
  return totals
}

function installedPackageVersion(directory: string, packageName: string) {
  const require = createRequire(join(directory, 'package.json'))
  let current = dirname(require.resolve(packageName))
  while (true) {
    const packagePath = join(current, 'package.json')
    try {
      const metadata = JSON.parse(readFileSync(packagePath, 'utf8')) as {
        name?: string
        version?: string
      }
      if (metadata.name === packageName && metadata.version) return metadata.version
    } catch {}
    const parent = dirname(current)
    if (parent === current) break
    current = parent
  }
  throw new Error(`could not resolve installed version for ${packageName}`)
}

function installedVersions(directory: string) {
  return Object.fromEntries(
    [
      'react',
      'react-dom',
      'vite',
      '@vitejs/plugin-react',
      'tamagui',
      '@tamagui/vite-plugin',
    ].map((packageName) => [packageName, installedPackageVersion(directory, packageName)])
  )
}

function verifyTamaguiWorkload() {
  const v3Path = join(import.meta.dir, 'tamagui-bench', 'src', 'index.tsx')
  const v2Path = join(import.meta.dir, 'tamagui-v2-bench', 'src', 'index.tsx')
  const v3Source = readFileSync(v3Path)
  const v2Source = readFileSync(v2Path)
  if (!v3Source.equals(v2Source)) {
    throw new Error(
      'Tamagui v2 and v3 benchmark sources must remain byte-for-byte identical'
    )
  }
  return {
    byteIdentical: true,
    bytes: v3Source.byteLength,
    sha256: createHash('sha256').update(v3Source).digest('hex'),
    sources: ['tamagui-bench/src/index.tsx', 'tamagui-v2-bench/src/index.tsx'],
  }
}

function createRandom(seed: number) {
  let state = seed >>> 0
  return () => {
    state += 0x6d2b79f5
    let value = state
    value = Math.imul(value ^ (value >>> 15), value | 1)
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61)
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296
  }
}

function shuffle<T>(values: readonly T[], random: () => number): T[] {
  const shuffled = [...values]
  for (let index = shuffled.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1))
    ;[shuffled[index], shuffled[other]] = [shuffled[other], shuffled[index]]
  }
  return shuffled
}

function tCritical95(degreesOfFreedom: number) {
  const values = [
    0, 12.706, 4.303, 3.182, 2.776, 2.571, 2.447, 2.365, 2.306, 2.262, 2.228, 2.201,
    2.179, 2.16, 2.145, 2.131, 2.12, 2.11, 2.101, 2.093, 2.086, 2.08, 2.074, 2.069, 2.064,
    2.06, 2.056, 2.052, 2.048, 2.045,
  ]
  return values[Math.min(degreesOfFreedom, 30)] ?? 1.96
}

function summarize(values: number[]): Statistic {
  const mean = values.reduce((total, value) => total + value, 0) / values.length
  const variance =
    values.reduce((total, value) => total + (value - mean) ** 2, 0) / (values.length - 1)
  const standardDeviation = Math.sqrt(variance)
  const margin =
    tCritical95(values.length - 1) * (standardDeviation / Math.sqrt(values.length))
  return {
    n: values.length,
    mean,
    standardDeviation,
    ci95: { low: mean - margin, high: mean + margin, margin },
  }
}

function buildSummary(trials: Trial[]): BenchmarkReport['summary'] {
  const summary = {} as BenchmarkReport['summary']
  for (const bench of BENCHMARKS) {
    summary[bench.id] = {} as Record<ScenarioId, ScenarioSummary>
    for (const scenario of SCENARIOS) {
      const warmups = trials.filter(
        (trial) =>
          trial.phase === 'warmup' &&
          trial.framework === bench.id &&
          trial.scenario === scenario
      )
      const samples = trials.filter(
        (trial) =>
          trial.phase === 'sample' &&
          trial.framework === bench.id &&
          trial.scenario === scenario
      )
      summary[bench.id][scenario] = {
        warmups: {
          mount: warmups.map((warmup) => warmup.mount),
          rerender: warmups.map((warmup) => warmup.rerender),
        },
        mount: summarize(samples.map((sample) => sample.mount)),
        rerender: summarize(samples.map((sample) => sample.rerender)),
      }
    }
  }
  return summary
}

function buildEffects(trials: Trial[]): BenchmarkReport['effects'] {
  const effects = {} as BenchmarkReport['effects']
  for (const mode of ['compiled', 'runtime'] as const) {
    const v3Framework = `tamagui-v3-${mode}`
    const v2Framework = `tamagui-v2-${mode}`
    if (
      !BENCHMARKS.some(({ id }) => id === v3Framework) ||
      !BENCHMARKS.some(({ id }) => id === v2Framework)
    ) {
      continue
    }
    effects[mode] = {} as Record<ScenarioId, Record<Metric, PairedEffect>>
    for (const scenario of SCENARIOS) {
      effects[mode][scenario] = {} as Record<Metric, PairedEffect>
      for (const metric of ['mount', 'rerender'] as const) {
        const v3 = trials
          .filter(
            (trial) =>
              trial.phase === 'sample' &&
              trial.framework === v3Framework &&
              trial.scenario === scenario
          )
          .sort((left, right) => left.round - right.round)
        const v2 = trials
          .filter(
            (trial) =>
              trial.phase === 'sample' &&
              trial.framework === v2Framework &&
              trial.scenario === scenario
          )
          .sort((left, right) => left.round - right.round)
        if (v3.length !== NUM_SAMPLES || v2.length !== NUM_SAMPLES) {
          throw new Error(`incomplete paired samples for ${mode}/${scenario}/${metric}`)
        }
        const v3Values = v3.map((trial) => trial[metric])
        const v2Values = v2.map((trial) => trial[metric])
        effects[mode][scenario][metric] = {
          v3: summarize(v3Values),
          v2: summarize(v2Values),
          differenceMs: summarize(
            v3Values.map((value, index) => value - v2Values[index])
          ),
          ratio: summarize(v3Values.map((value, index) => value / v2Values[index])),
        }
      }
    }
  }
  return effects
}

async function waitForServer(port: number, timeout = 30_000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    try {
      const response = await fetch(`http://127.0.0.1:${port}/`)
      if (response.ok) return
    } catch {}
    await Bun.sleep(250)
  }
  throw new Error(`production preview did not start on port ${port}`)
}

async function measure(
  context: import('playwright').BrowserContext,
  pages: Map<string, import('playwright').Page>,
  bench: BenchConfig,
  scenario: ScenarioId,
  nonce: number
) {
  const key = `${bench.id}/${scenario}`
  let page = pages.get(key)
  if (!page) {
    page = await context.newPage()
    const params = new URLSearchParams({
      scenario,
      label: bench.name,
      run: String(nonce),
    })
    await page.goto(`http://127.0.0.1:${bench.port}/?${params}`, {
      waitUntil: 'networkidle',
    })
    pages.set(key, page)
  }
  const previousResults = page.locator('#bench-results-table')
  if ((await previousResults.count()) > 0) {
    await previousResults.evaluate((element) => element.replaceChildren())
  }
  await page.locator('#bench-start').click()
  await page.waitForSelector(`#bench-result-${scenario}-rerender`, { timeout: 120_000 })
  const resultCells = await page.locator('[id^="bench-result-"]').count()
  if (resultCells !== 2) {
    throw new Error(
      `${bench.id}/${scenario} rendered ${resultCells} result cells; expected one scenario`
    )
  }
  const mount = Number(
    await page.locator(`#bench-result-${scenario}-mount`).getAttribute('data-value')
  )
  const rerender = Number(
    await page.locator(`#bench-result-${scenario}-rerender`).getAttribute('data-value')
  )
  if (!Number.isFinite(mount) || !Number.isFinite(rerender)) {
    throw new Error(`invalid result for ${bench.id}/${scenario}`)
  }
  return { mount, rerender }
}

function escapeHtml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function generateHtml(report: BenchmarkReport) {
  const baseline =
    report.summary['tamagui-v2-compiled'] ??
    report.summary[report.frameworks[0]?.id ?? '']
  const baselineName = report.summary['tamagui-v2-compiled']
    ? 'v2 compiled'
    : report.frameworks[0]?.name
  const cells = (metric: Metric, scenario: ScenarioId) =>
    report.frameworks
      .map((framework) => {
        const stat = report.summary[framework.id][scenario][metric]
        const baselineMean = baseline[scenario][metric].mean
        const ratio = stat.mean / baselineMean
        const ratioClass = ratio > 1 ? 'regression' : 'improvement'
        return `<td><span class="value">${stat.mean.toFixed(1)} ms</span><span class="ci">95% CI ${stat.ci95.low.toFixed(1)}–${stat.ci95.high.toFixed(1)}</span><span class="ratio ${ratioClass}">${ratio.toFixed(2)}× ${escapeHtml(baselineName)}</span></td>`
      })
      .join('')
  const rows = (metric: Metric) =>
    SCENARIOS.map(
      (scenario) =>
        `<tr><td>${escapeHtml(SCENARIO_LABELS[scenario])}</td>${cells(metric, scenario)}</tr>`
    ).join('\n')
  const effectRows = (['compiled', 'runtime'] as const)
    .flatMap((mode) => {
      const modeEffects = report.effects[mode]
      if (!modeEffects) return []
      return SCENARIOS.flatMap((scenario) =>
        (['mount', 'rerender'] as const).map((metric) => {
          const effect = modeEffects[scenario][metric]
          return `<tr><td>${mode}</td><td>${escapeHtml(SCENARIO_LABELS[scenario])}</td><td>${metric}</td><td>${effect.ratio.mean.toFixed(3)}× <span class="ci">${effect.ratio.ci95.low.toFixed(3)}–${effect.ratio.ci95.high.toFixed(3)}</span></td><td>${effect.differenceMs.mean.toFixed(2)} ms <span class="ci">${effect.differenceMs.ci95.low.toFixed(2)}–${effect.differenceMs.ci95.high.toFixed(2)}</span></td></tr>`
        })
      )
    })
    .join('\n')
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>Tamagui production benchmark comparison</title>
<style>
  body { font-family: system-ui; background: #0a0a0a; color: #eee; padding: 40px; margin: 0 auto; }
  h1 { font-size: 28px; margin-bottom: 4px; }
  .sub { color: #aaa; font-size: 14px; margin-bottom: 24px; }
  .scroll { overflow-x: auto; }
  table { border-collapse: collapse; font-size: 13px; min-width: 1500px; }
  th, td { padding: 10px 14px; text-align: right; border-bottom: 1px solid #262626; vertical-align: top; }
  th:first-child, td:first-child { text-align: left; position: sticky; left: 0; background: #0a0a0a; min-width: 170px; }
  th { background: #141414; color: #aaa; font-size: 11px; text-transform: uppercase; }
  .section td { font-weight: 650; background: #1a1a1a; border-top: 2px solid #333; }
  .value, .ci, .ratio { display: block; white-space: nowrap; }
  .value { font-weight: 650; font-family: monospace; }
  .ci { color: #aaa; font-size: 11px; margin-top: 2px; }
  .ratio { font-size: 11px; margin-top: 2px; }
  .regression { color: #f87171; }
  .improvement { color: #4ade80; }
</style>
</head>
<body>
<h1>Tamagui production benchmark comparison</h1>
<p class="sub">${report.workload.itemCount}/${report.workload.heavyCount} equal components · ${report.workload.samples} retained samples + ${report.workload.warmups} warmup rounds · randomized seed ${escapeHtml(String(report.metadata.randomSeed))} · Chromium ${escapeHtml(String(report.metadata.browserVersion))} · commit ${escapeHtml(String(report.metadata.commit))}</p>
<div class="scroll"><table>
<thead><tr><th>Scenario</th>${report.frameworks.map((framework) => `<th>${escapeHtml(framework.name)}</th>`).join('')}</tr></thead>
<tbody>
<tr class="section"><td colspan="${report.frameworks.length + 1}">Mount</td></tr>
${rows('mount')}
<tr class="section"><td colspan="${report.frameworks.length + 1}">Re-render</td></tr>
${rows('rerender')}
</tbody>
</table></div>
<h2>Paired V3 versus V2 effects</h2>
<p class="sub">Ratios below 1 and negative differences favor V3. Confidence intervals pair observations by retained sample round.</p>
<div class="scroll"><table>
<thead><tr><th>Mode</th><th>Scenario</th><th>Metric</th><th>V3 / V2 ratio (95% CI)</th><th>V3 − V2 (95% CI)</th></tr></thead>
<tbody>${effectRows}</tbody>
</table></div>
</body>
</html>`
}

async function main() {
  const tamaguiWorkload = verifyTamaguiWorkload()
  if (VERIFY_WORKLOAD_ONLY) {
    console.log(JSON.stringify(tamaguiWorkload, null, 2))
    return
  }
  if (!Number.isInteger(NUM_SAMPLES) || NUM_SAMPLES < 3) {
    throw new Error('--samples must be an integer of at least 3')
  }
  if (!Number.isInteger(NUM_WARMUPS) || NUM_WARMUPS < 2) {
    throw new Error('--warmups must be an integer of at least 2')
  }

  const buildRoot = mkdtempSync(join(tmpdir(), 'tamagui-production-bench-'))
  const previews: ChildProcess[] = []
  const random = createRandom(SEED)
  const byId = new Map(BENCHMARKS.map((bench) => [bench.id, bench]))
  const installedDirs = new Set<string>()
  const artifacts: BenchmarkReport['artifacts'] = {}
  const tasks = BENCHMARKS.flatMap((bench) =>
    SCENARIOS.map((scenario) => ({ framework: bench.id, scenario }))
  )

  console.log(`\nBuilding ${BENCHMARKS.length} production benchmark variants...\n`)
  try {
    for (const bench of BENCHMARKS) {
      const cwd = join(import.meta.dir, bench.dir)
      const outDir = join(buildRoot, bench.id)
      const compilerStatsPath = join(buildRoot, `${bench.id}-compiler-stats.json`)
      if (!installedDirs.has(cwd)) {
        if (bench.installWith === 'npm') command('npm', ['ci'], cwd)
        if (bench.installWith === 'bun') {
          command('bun', ['install', '--frozen-lockfile'], cwd)
        }
        installedDirs.add(cwd)
      }
      const executable = bench.installWith === 'npm' ? 'npm' : 'bunx'
      const buildArgs =
        bench.installWith === 'npm'
          ? ['exec', 'vite', '--', 'build', '--outDir', outDir]
          : ['vite', 'build', '--outDir', outDir]
      console.log(`▶ ${bench.name}`)
      command(executable, buildArgs, cwd, {
        NODE_ENV: 'production',
        ...(bench.id === 'tamagui-v3-compiled' && {
          TAMAGUI_COMPILER_STATS_FILE: compilerStatsPath,
        }),
        ...bench.buildEnv,
      })
      artifacts[bench.id] = {
        ...measureBuildArtifact(outDir),
        versions: installedVersions(cwd),
        ...(bench.id === 'tamagui-v3-compiled' && {
          compilerStats: JSON.parse(readFileSync(compilerStatsPath, 'utf8')),
        }),
      }
      const previewArgs =
        bench.installWith === 'npm'
          ? [
              'exec',
              'vite',
              '--',
              'preview',
              '--host',
              '127.0.0.1',
              '--port',
              String(bench.port),
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
              String(bench.port),
              '--strictPort',
              '--outDir',
              outDir,
            ]
      previews.push(
        spawn(executable, previewArgs, { cwd, stdio: 'ignore', env: process.env })
      )
      await waitForServer(bench.port)
    }

    if (BUILD_ONLY) {
      console.log(
        '\nProduction builds and previews validated; retained sampling skipped.\n'
      )
      return
    }

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    const pages = new Map<string, import('playwright').Page>()
    const trials: Trial[] = []
    let sequence = 0
    try {
      console.log('\nRecording randomized warmups...')
      for (let round = 0; round < NUM_WARMUPS; round++) {
        for (const task of shuffle(tasks, random)) {
          const bench = byId.get(task.framework)!
          const result = await measure(context, pages, bench, task.scenario, sequence)
          trials.push({
            sequence: sequence++,
            phase: 'warmup',
            round,
            ...task,
            ...result,
          })
          process.stdout.write('.')
        }
        console.log(` ${round + 1}/${NUM_WARMUPS}`)
      }
      console.log('\nRecording retained samples...')
      for (let round = 0; round < NUM_SAMPLES; round++) {
        for (const task of shuffle(tasks, random)) {
          const bench = byId.get(task.framework)!
          const result = await measure(context, pages, bench, task.scenario, sequence)
          trials.push({
            sequence: sequence++,
            phase: 'sample',
            round,
            ...task,
            ...result,
          })
          process.stdout.write('.')
        }
        console.log(` ${round + 1}/${NUM_SAMPLES}`)
      }

      const metadataPage = await context.newPage()
      const userAgent = await metadataPage.evaluate(() => navigator.userAgent)
      await metadataPage.close()
      const report: BenchmarkReport = {
        schemaVersion: 1,
        metadata: {
          generatedAt: new Date().toISOString(),
          commit: git('rev-parse', 'HEAD'),
          branch: git('branch', '--show-current'),
          dirty: git('status', '--porcelain').length > 0,
          platform: platform(),
          osRelease: release(),
          architecture: arch(),
          cpu: cpus()[0]?.model ?? 'unknown',
          logicalCpuCount: cpus().length,
          totalMemoryBytes: totalmem(),
          bunVersion: Bun.version,
          browser: 'Chromium',
          browserVersion: browser.version(),
          userAgent,
          viewport: { width: 1280, height: 720 },
          buildMode: 'production',
          order:
            'framework/scenario tasks reshuffled independently in every warmup and sample round',
          randomSeed: SEED,
          tamaguiWorkload,
          selectedFrameworks: BENCHMARKS.map(({ id }) => id),
        },
        frameworks: BENCHMARKS.map(({ id, name, version, mode }) => ({
          id,
          name,
          version,
          mode,
        })),
        workload: {
          itemCount: ITEM_COUNT,
          heavyCount: HEAVY_COUNT,
          samples: NUM_SAMPLES,
          warmups: NUM_WARMUPS,
        },
        artifacts,
        trials,
        summary: buildSummary(trials),
        effects: buildEffects(trials),
      }
      mkdirSync(dirname(OUTPUT_PATH), { recursive: true })
      writeFileSync(OUTPUT_PATH, `${JSON.stringify(report, null, 2)}\n`)
      const persisted = JSON.parse(readFileSync(OUTPUT_PATH, 'utf8')) as BenchmarkReport
      writeFileSync(HTML_PATH, generateHtml(persisted))
      console.log(`\nJSON: ${OUTPUT_PATH}`)
      console.log(`HTML: ${HTML_PATH}\n`)
    } finally {
      await context.close()
      await browser.close()
    }
  } finally {
    for (const preview of previews) preview.kill('SIGTERM')
    rmSync(buildRoot, { recursive: true, force: true })
  }
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
