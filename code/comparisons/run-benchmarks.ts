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
import { dirname, join, relative } from 'path'
import {
  createRandom,
  median,
  shuffle,
  summarize,
  type Statistic,
} from './benchmark-statistics'
import { acquireBenchmarkLock } from './shared/benchmarkLock'

const args = process.argv.slice(2)
const VERIFY_WORKLOAD_ONLY = args.includes('--verify-workload')
const BUILD_ONLY = args.includes('--build-only')
const BUNDLE_ATTRIBUTION_PATH = args
  .find((arg) => arg.startsWith('--bundle-attribution='))
  ?.slice(21)
const BEHAVIOR_VALIDATION_PATH = args
  .find((arg) => arg.startsWith('--behavior-validation='))
  ?.slice(22)
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

interface ScenarioSummary {
  warmups: { mount: number[]; rerender: number[] }
  mount: Statistic
  rerender: Statistic
}

interface PairedEffect {
  v3: Statistic
  v2: Statistic
  differenceMs: Statistic
  ratioOfMeans: number
  medianPairedRatio: number
}

interface BenchmarkReport {
  schemaVersion: 2
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
      bundleAttribution?: unknown
      versions: Record<string, string>
      dependencyMetadata: {
        packageJsonSha256: string
        lockfile: { file: string; sha256: string }
      }
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

function bundleSizes(attribution: any) {
  return {
    jsGzipBytes: attribution.chunks.reduce(
      (total: number, chunk: any) => total + chunk.gzipBytes,
      0
    ),
    cssGzipBytes: attribution.assets
      .filter((asset: any) => asset.fileName.endsWith('.css'))
      .reduce((total: number, asset: any) => total + asset.gzipBytes, 0),
    tamaguiJsBytes: attribution.decomposition.groups.tamagui.codeBytes,
    tamaguiJsGzipBytes: attribution.decomposition.groups.tamagui.gzipBytes,
    reactControlJsBytes: attribution.decomposition.groups['react-control'].codeBytes,
    reactControlJsGzipBytes: attribution.decomposition.groups['react-control'].gzipBytes,
  }
}

function moduleGroup(id: string) {
  const dependency = id.split('node_modules/').at(-1)
  if (dependency !== id) {
    const parts = dependency!.split('/')
    return parts[0]!.startsWith('@') ? `${parts[0]}/${parts[1]}` : parts[0]
  }
  const workspace = id.match(/\.\.\/\.\.\/(?:core|packages|ui)\/([^/]+)\/dist/)
  if (workspace) {
    return workspace[1] === 'tamagui' ? 'tamagui' : `@tamagui/${workspace[1]}`
  }
  if (id.startsWith('src/')) return 'fixture'
  if (id.includes('../shared/')) return 'shared benchmark'
  return 'build/runtime helpers'
}

function renderedModuleGroups(attribution: any) {
  const groups: Record<string, number> = {}
  for (const module of attribution.chunks.flatMap((chunk: any) => chunk.modules)) {
    const group = moduleGroup(module.id)
    groups[group] = (groups[group] ?? 0) + module.renderedBytes
  }
  return groups
}

function buildBundleComparison(artifacts: BenchmarkReport['artifacts']) {
  return Object.fromEntries(
    (['compiled', 'runtime'] as const).map((mode) => {
      const v3 = artifacts[`tamagui-v3-${mode}`]
      const v2 = artifacts[`tamagui-v2-${mode}`]
      if (!v3?.bundleAttribution || !v2?.bundleAttribution) return [mode, null]
      const v3Groups = renderedModuleGroups(v3.bundleAttribution)
      const v2Groups = renderedModuleGroups(v2.bundleAttribution)
      const groups = Object.fromEntries(
        [...new Set([...Object.keys(v3Groups), ...Object.keys(v2Groups)])]
          .map((group) => ({
            group,
            v3RenderedBytes: v3Groups[group] ?? 0,
            v2RenderedBytes: v2Groups[group] ?? 0,
            deltaRenderedBytes: (v3Groups[group] ?? 0) - (v2Groups[group] ?? 0),
          }))
          .sort(
            (left, right) =>
              Math.abs(right.deltaRenderedBytes) - Math.abs(left.deltaRenderedBytes) ||
              left.group.localeCompare(right.group)
          )
          .map(({ group, ...values }) => [group, values])
      )
      const v3Gzip = bundleSizes(v3.bundleAttribution)
      const v2Gzip = bundleSizes(v2.bundleAttribution)
      return [
        mode,
        {
          artifactBytes: {
            v3: {
              js: v3.jsBytes,
              css: v3.cssBytes,
              ...v3Gzip,
            },
            v2: {
              js: v2.jsBytes,
              css: v2.cssBytes,
              ...v2Gzip,
            },
            delta: {
              js: v3.jsBytes - v2.jsBytes,
              css: v3.cssBytes - v2.cssBytes,
              jsGzipBytes: v3Gzip.jsGzipBytes - v2Gzip.jsGzipBytes,
              cssGzipBytes: v3Gzip.cssGzipBytes - v2Gzip.cssGzipBytes,
              tamaguiJsBytes: v3Gzip.tamaguiJsBytes - v2Gzip.tamaguiJsBytes,
              tamaguiJsGzipBytes: v3Gzip.tamaguiJsGzipBytes - v2Gzip.tamaguiJsGzipBytes,
              reactControlJsBytes:
                v3Gzip.reactControlJsBytes - v2Gzip.reactControlJsBytes,
              reactControlJsGzipBytes:
                v3Gzip.reactControlJsGzipBytes - v2Gzip.reactControlJsGzipBytes,
            },
          },
          renderedModuleGroups: groups,
        },
      ]
    })
  )
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
      '@tamagui/animations-css',
      'tamagui',
      '@tamagui/vite-plugin',
    ].map((packageName) => [packageName, installedPackageVersion(directory, packageName)])
  )
}

function sha256File(file: string) {
  return createHash('sha256').update(readFileSync(file)).digest('hex')
}

function dependencyMetadata(directory: string, installWith?: 'bun' | 'npm') {
  let current = directory
  const lockfileName = installWith === 'npm' ? 'package-lock.json' : 'bun.lock'
  while (true) {
    const lockfile = join(current, lockfileName)
    try {
      statSync(lockfile)
      return {
        packageJsonSha256: sha256File(join(directory, 'package.json')),
        lockfile: {
          file: relative(import.meta.dir, lockfile).replaceAll('\\', '/'),
          sha256: sha256File(lockfile),
        },
      }
    } catch {}
    const parent = dirname(current)
    if (parent === current) {
      throw new Error(`could not find ${lockfileName} for ${directory}`)
    }
    current = parent
  }
}

function verifyTamaguiWorkload() {
  const files = ['src/index.tsx', 'src/tamagui.config.ts']
  const workloadHash = createHash('sha256')
  const verifiedFiles = files.map((file) => {
    const v3Source = readFileSync(join(import.meta.dir, 'tamagui-bench', file))
    const v2Source = readFileSync(join(import.meta.dir, 'tamagui-v2-bench', file))
    if (!v3Source.equals(v2Source)) {
      throw new Error(
        `Tamagui v2 and v3 benchmark files must remain byte-for-byte identical: ${file}`
      )
    }
    workloadHash.update(file)
    workloadHash.update(v3Source)
    return {
      file,
      bytes: v3Source.byteLength,
      sha256: createHash('sha256').update(v3Source).digest('hex'),
    }
  })
  return {
    byteIdentical: true,
    sha256: workloadHash.digest('hex'),
    sourceSha256: verifiedFiles.find(({ file }) => file === 'src/index.tsx')!.sha256,
    configSha256: verifiedFiles.find(({ file }) => file === 'src/tamagui.config.ts')!
      .sha256,
    files: verifiedFiles,
    sources: files.flatMap((file) => [
      `tamagui-bench/${file}`,
      `tamagui-v2-bench/${file}`,
    ]),
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
        const pairedRatios = v3Values.map((value, index) => value / v2Values[index])
        effects[mode][scenario][metric] = {
          v3: summarize(v3Values),
          v2: summarize(v2Values),
          differenceMs: summarize(
            v3Values.map((value, index) => value - v2Values[index])
          ),
          ratioOfMeans:
            v3Values.reduce((total, value) => total + value, 0) /
            v2Values.reduce((total, value) => total + value, 0),
          medianPairedRatio: median(pairedRatios),
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

const expectedLayouts = {
  simple: {
    itemCount: ITEM_COUNT,
    hostCount: ITEM_COUNT,
    styles: {
      width: '20px',
      height: '20px',
      backgroundColor: 'rgb(99, 102, 241)',
      borderRadius: '3px',
      marginTop: '1px',
    },
  },
  rich: {
    itemCount: ITEM_COUNT,
    hostCount: ITEM_COUNT,
    styles: {
      width: '60px',
      height: '40px',
      backgroundColor: 'rgb(99, 102, 241)',
      borderRadius: '6px',
      borderTopWidth: '1px',
      borderTopColor: 'rgba(0, 0, 0, 0.1)',
      paddingTop: '4px',
      marginTop: '1px',
    },
  },
  group: {
    itemCount: ITEM_COUNT,
    hostCount: ITEM_COUNT * 4,
    styles: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '8px',
      paddingTop: '8px',
      borderRadius: '8px',
      backgroundColor: 'rgb(245, 245, 245)',
      marginTop: '1px',
    },
  },
  heavy: {
    itemCount: HEAVY_COUNT,
    hostCount: HEAVY_COUNT * 7,
    styles: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: '12px',
      paddingTop: '12px',
      borderRadius: '10px',
      backgroundColor: 'rgb(250, 250, 250)',
      borderTopWidth: '1px',
      borderTopColor: 'rgb(212, 212, 212)',
      marginBottom: '4px',
    },
  },
} as const

async function validateScenarioLayout(
  context: import('playwright').BrowserContext,
  bench: BenchConfig,
  scenario: keyof typeof expectedLayouts
) {
  const page = await context.newPage()
  await page.goto(
    `http://127.0.0.1:${bench.port}/?scenario=${scenario}&behaviorValidation=1&label=${encodeURIComponent(bench.name)}`,
    { waitUntil: 'networkidle' }
  )
  await page.locator('#bench-start').click()
  const items = page.locator(`[data-bench-scenario-item="${scenario}"]`)
  await items.first().waitFor({ state: 'attached' })
  const initialItem = await items.first().elementHandle()
  if (!initialItem) throw new Error(`${bench.id}/${scenario}: missing initial item`)
  await page.waitForSelector('[data-bench-runner-seed="2"]', { timeout: 120_000 })
  const actual = await initialItem.evaluate((element, expectedStyles) => {
    const style = getComputedStyle(element)
    return {
      sameNodeAfterUpdate:
        element.isConnected &&
        element.parentElement?.getAttribute('data-bench-runner-seed') === '2',
      itemCount: element.parentElement!.querySelectorAll(
        `[data-bench-scenario-item="${element.getAttribute('data-bench-scenario-item')}"]`
      ).length,
      hostCount: element.parentElement!.querySelectorAll('*').length,
      styles: Object.fromEntries(
        Object.keys(expectedStyles).map((property) => [
          property,
          style[property as keyof CSSStyleDeclaration],
        ])
      ),
    }
  }, expectedLayouts[scenario].styles)
  await page.waitForSelector(`#bench-result-${scenario}-rerender`, {
    timeout: 120_000,
  })
  await page.close()

  const expected = expectedLayouts[scenario]
  const preservesBehavior =
    actual.sameNodeAfterUpdate &&
    actual.itemCount === expected.itemCount &&
    actual.hostCount === expected.hostCount &&
    Object.entries(expected.styles).every(
      ([property, value]) => actual.styles[property] === value
    )
  return { expected, actual, preservesBehavior }
}

async function validateDynamicTransition(
  context: import('playwright').BrowserContext,
  bench: BenchConfig
) {
  const page = await context.newPage()
  await page.goto(
    `http://127.0.0.1:${bench.port}/?scenario=animated&behaviorValidation=1&label=${encodeURIComponent(bench.name)}`,
    { waitUntil: 'networkidle' }
  )
  await page.evaluate(() => {
    const samples: Array<{
      elapsed: number
      opacity: number
      scale: number
      seed: number
      transitionDuration: string
      transitionProperty: string
    }> = []
    const start = performance.now()
    const capture = () => {
      const target = document.querySelector<HTMLElement>(
        '[data-bench-dynamic-item="primary"]'
      )
      if (!target) return
      const style = getComputedStyle(target)
      const match = style.transform.match(/^matrix\(([^,]+)/)
      const individualScale =
        style.scale !== 'none' ? Number.parseFloat(style.scale) : Number.NaN
      samples.push({
        elapsed: performance.now() - start,
        opacity: Number(style.opacity),
        scale: Number.isFinite(individualScale)
          ? individualScale
          : match
            ? Number(match[1])
            : style.transform === 'none'
              ? 1
              : Number.NaN,
        seed: Number(target.dataset.benchDynamicSeed),
        transitionDuration: style.transitionDuration,
        transitionProperty: style.transitionProperty,
      })
    }
    const timer = setInterval(capture, 16)
    const observer = new MutationObserver(capture)
    observer.observe(document.getElementById('root')!, {
      attributes: true,
      childList: true,
      subtree: true,
    })
    ;(window as any).__dynamicTransitionCapture = { samples, timer, observer }
  })
  await page.locator('#bench-start').click()
  const initialTarget = page.locator('[data-bench-dynamic-item="primary"]')
  await initialTarget.waitFor({ state: 'attached' })
  const initialTargetHandle = await initialTarget.elementHandle()
  if (!initialTargetHandle) {
    await page.close()
    throw new Error(`${bench.id}: missing initial dynamic transition target`)
  }
  const expected = {
    itemCount: ITEM_COUNT,
    hostCount: ITEM_COUNT,
    styles: {
      width: '24px',
      height: '24px',
      backgroundColor: 'rgb(59, 130, 246)',
      borderRadius: '4px',
      marginTop: '1px',
    },
  }
  await page.waitForFunction(
    () =>
      document.querySelector<HTMLElement>('[data-bench-dynamic-item="primary"]')?.dataset
        .benchDynamicSeed === '2',
    undefined,
    { timeout: 120_000 }
  )
  await page.waitForTimeout(400)
  const actual = await initialTargetHandle.evaluate((target) => {
    const style = getComputedStyle(target)
    return {
      sameNodeAfterUpdate:
        target.isConnected &&
        target.parentElement?.getAttribute('data-bench-runner-seed') === '2',
      itemCount: target.parentElement!.querySelectorAll(
        '[data-bench-scenario-item="animated"]'
      ).length,
      hostCount: target.parentElement!.querySelectorAll('*').length,
      styles: {
        width: style.width,
        height: style.height,
        backgroundColor: style.backgroundColor,
        borderRadius: style.borderRadius,
        marginTop: style.marginTop,
      },
    }
  })
  await page.waitForSelector('#bench-result-animated-rerender', { timeout: 120_000 })
  const samples = await page.evaluate(() => {
    const capture = (window as any).__dynamicTransitionCapture
    clearInterval(capture.timer)
    capture.observer.disconnect()
    return capture.samples
  })
  await page.close()

  if (!samples.length) {
    throw new Error(`${bench.id}: dynamic transition target produced zero samples`)
  }
  if (!actual) {
    throw new Error(`${bench.id}: dynamic transition target unmounted before validation`)
  }
  const opacity = samples.map((sample) => sample.opacity).filter(Number.isFinite)
  const scale = samples.map((sample) => sample.scale).filter(Number.isFinite)
  const transitionDeclared = samples.some(
    (sample) =>
      sample.transitionDuration
        .split(',')
        .some((duration) => Number.parseFloat(duration) > 0) &&
      sample.transitionProperty !== 'none'
  )
  const startStateObserved = samples.some(
    ({ seed, opacity, scale }) =>
      seed === 1 && opacity >= 0.83 && opacity <= 0.87 && scale >= 0.93 && scale <= 0.97
  )
  const finalStateObserved = samples.some(
    ({ seed, opacity, scale }) => seed === 2 && opacity >= 0.99 && scale >= 0.99
  )
  const intermediateStateObserved = samples.some(
    ({ seed, opacity, scale }) =>
      seed === 2 && opacity > 0.87 && opacity < 0.99 && scale > 0.97 && scale < 0.99
  )
  const layoutPreserved =
    actual.sameNodeAfterUpdate &&
    actual.itemCount === expected.itemCount &&
    actual.hostCount === expected.hostCount &&
    Object.entries(expected.styles).every(
      ([property, value]) =>
        actual.styles[property as keyof typeof actual.styles] === value
    )
  return {
    expected,
    actual,
    samples: samples.length,
    opacityRange: {
      min: Math.min(...opacity),
      max: Math.max(...opacity),
    },
    scaleRange: {
      min: Math.min(...scale),
      max: Math.max(...scale),
    },
    transitionDeclared,
    startStateObserved,
    finalStateObserved,
    intermediateStateObserved,
    layoutPreserved,
    preservesBehavior:
      transitionDeclared &&
      startStateObserved &&
      finalStateObserved &&
      intermediateStateObserved &&
      layoutPreserved,
  }
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
          return `<tr><td>${mode}</td><td>${escapeHtml(SCENARIO_LABELS[scenario])}</td><td>${metric}</td><td>${effect.ratioOfMeans.toFixed(3)}× <span class="ci">paired median ${effect.medianPairedRatio.toFixed(3)}×</span></td><td>${effect.differenceMs.mean.toFixed(2)} ms <span class="ci">${effect.differenceMs.ci95.low.toFixed(2)}–${effect.differenceMs.ci95.high.toFixed(2)}</span></td></tr>`
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
<thead><tr><th>Mode</th><th>Scenario</th><th>Metric</th><th>Ratio of means / paired median</th><th>V3 − V2 (95% CI)</th></tr></thead>
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
      const bundleAttributionPath = join(buildRoot, `${bench.id}-bundle-attribution.json`)
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
        ...(BUNDLE_ATTRIBUTION_PATH && {
          BUNDLE_ATTRIBUTION_FILE: bundleAttributionPath,
        }),
        ...bench.buildEnv,
      })
      artifacts[bench.id] = {
        ...measureBuildArtifact(outDir),
        versions: installedVersions(cwd),
        dependencyMetadata: dependencyMetadata(cwd, bench.installWith),
        ...(BUNDLE_ATTRIBUTION_PATH && {
          bundleAttribution: JSON.parse(readFileSync(bundleAttributionPath, 'utf8')),
        }),
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
      if (BUNDLE_ATTRIBUTION_PATH) {
        mkdirSync(dirname(BUNDLE_ATTRIBUTION_PATH), { recursive: true })
        writeFileSync(
          BUNDLE_ATTRIBUTION_PATH,
          `${JSON.stringify(
            {
              schemaVersion: 2,
              metadata: {
                commit: git('rev-parse', 'HEAD'),
                branch: git('branch', '--show-current'),
                dirty: git('status', '--porcelain').length > 0,
                workload: tamaguiWorkload,
                buildMode: 'production',
              },
              frameworks: BENCHMARKS.map(({ id, name, version, mode }) => ({
                id,
                name,
                version,
                mode,
              })),
              artifacts,
              comparison: buildBundleComparison(artifacts),
              interpretation: {
                correctedHarness:
                  'Both arms use byte-identical minimal Tamagui configs; the prior default-theme import mismatch was removed.',
                moduleLengths:
                  'Rendered module lengths are pre-minification attribution, while artifact bytes and gzip bytes are exact emitted sizes.',
                tamaguiGzip:
                  'Tamagui-attributable gzip is measured from an explicit production-minified Rollup chunk containing tamagui, @tamagui/*, workspace core/packages/ui dist modules, and @react-native/normalize-color when pulled by the Tamagui runtime. It excludes fixture code, shared benchmark code, React, react-dom, scheduler, Vite helpers, and other dependencies.',
                remainingDelta:
                  'The remaining V3 delta is framework surface led by @tamagui/style-grammar and @tamagui/web, not fixture/config/theme code.',
              },
            },
            null,
            2
          )}\n`
        )
        console.log(`\nBundle attribution: ${BUNDLE_ATTRIBUTION_PATH}`)
      }
      console.log(
        '\nProduction builds and previews validated; retained sampling skipped.\n'
      )
      return
    }

    const { chromium } = await import('playwright')
    const browser = await chromium.launch()
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } })
    if (BEHAVIOR_VALIDATION_PATH) {
      try {
        const results: Record<
          string,
          Record<string, Awaited<ReturnType<typeof validateScenarioLayout>>>
        > = {}
        for (const bench of BENCHMARKS) {
          results[bench.id] = {}
          for (const scenario of ['simple', 'rich', 'group', 'heavy'] as const) {
            results[bench.id][scenario] = await validateScenarioLayout(
              context,
              bench,
              scenario
            )
          }
          results[bench.id].animated = await validateDynamicTransition(context, bench)
        }
        const comparable = Object.values(results).every((scenarios) =>
          Object.values(scenarios).every(({ preservesBehavior }) => preservesBehavior)
        )
        mkdirSync(dirname(BEHAVIOR_VALIDATION_PATH), { recursive: true })
        writeFileSync(
          BEHAVIOR_VALIDATION_PATH,
          `${JSON.stringify(
            {
              schemaVersion: 1,
              metadata: {
                commit: git('rev-parse', 'HEAD'),
                branch: git('branch', '--show-current'),
                dirty: git('status', '--porcelain').length > 0,
                workload: tamaguiWorkload,
                buildMode: 'production',
                selectedFrameworks: BENCHMARKS.map(({ id }) => id),
              },
              assertion:
                'expected host/item counts and representative computed layout styles in every scenario, plus seed-driven opacity and scale start, intermediate transition, and final states',
              results,
              comparable,
              ...(!comparable && {
                qualification:
                  'Timing is non-comparable because at least one production arm does not preserve the asserted workload behavior.',
              }),
            },
            null,
            2
          )}\n`
        )
        console.log(`Behavior validation: ${BEHAVIOR_VALIDATION_PATH}`)
        if (!comparable) {
          throw new Error(
            'production benchmark behavior differs; refusing to collect timing samples'
          )
        }
        return
      } finally {
        await context.close()
        await browser.close()
      }
    }
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
        schemaVersion: 2,
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

const releaseBenchmarkLock =
  VERIFY_WORKLOAD_ONLY || BUILD_ONLY || BEHAVIOR_VALIDATION_PATH
    ? undefined
    : acquireBenchmarkLock(
        `web benchmark timing with ${NUM_WARMUPS} warmups and ${NUM_SAMPLES} samples`
      )

main()
  .finally(() => releaseBenchmarkLock?.())
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
