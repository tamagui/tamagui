#!/usr/bin/env bun
/**
 * replays statically harvested real app props through the core-test
 * getSplitStyles harness.
 *
 * usage:
 *   npm ci --workspaces=false --prefix code/comparisons/v2-control
 *   NODE_ENV=production TAMAGUI_TARGET=web npx tsx code/comparisons/benchmark-get-split-styles.ts
 *   NODE_ENV=production TAMAGUI_TARGET=web npx tsx code/comparisons/benchmark-get-split-styles.ts --output=code/comparisons/get-split-styles-baseline.json
 *   NODE_ENV=production TAMAGUI_TARGET=web npx tsx code/comparisons/benchmark-get-split-styles.ts --compare=code/comparisons/get-split-styles-baseline.json
 */

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as config from '../core/config-default'
import { Text, View, createTamagui, styled } from '../core/web/src'
import { getConfig, getSplitStyles as v3GetSplitStyles } from '../core/web/src'
import { defaultComponentState } from '../core/web/src/defaultComponentState'
import { getStyleStaticConfig } from '../core/web/src/helpers/styleStaticConfig'
import { createRandom, median, shuffle, summarize } from './benchmark-statistics'

type Scenario =
  | 'zero-props'
  | 'one-prop'
  | 'plain-props'
  | 'clause-strings'
  | 'conditional-objects'
  | 'variant-props'
  | 'shorthand-heavy'
  | 'style-prop-heavy'
  | 'total'

type CorpusElement = {
  component: string
  componentKind: 'custom' | 'intrinsic' | 'text' | 'view'
  props: Record<string, any>
  scenarios: Exclude<Scenario, 'total'>[]
  staticPropCount: number
  variantPropNames: string[]
}

type PreparedElement = {
  component: any
  options: { render?: string } | undefined
  props: Record<string, any>
  staticPropCount: number
}

const argument = (name: string, fallback?: string) =>
  process.argv.find((value) => value.startsWith(`--${name}=`))?.slice(name.length + 3) ??
  fallback
const rounds = Number.parseInt(argument('rounds', '11')!, 10)
const warmups = Number.parseInt(argument('warmups', '3')!, 10)
const targetOperations = Number.parseInt(argument('target-ops', '20000')!, 10)
const outputPath = argument('output')
const comparePath = argument('compare')
const comparisonRoot = dirname(fileURLToPath(import.meta.url))
const corpusPath = resolve(comparisonRoot, 'get-split-styles-prop-corpus.json')
const corpusSource = readFileSync(corpusPath, 'utf8')
const corpus = JSON.parse(corpusSource) as {
  fixedOverheadScenarios: Record<'zero-props' | 'one-prop', CorpusElement>
  elements: CorpusElement[]
  distribution: { staticAttributes: number }
}

if (process.env.NODE_ENV !== 'production' || process.env.TAMAGUI_TARGET !== 'web') {
  throw new Error('run with NODE_ENV=production TAMAGUI_TARGET=web')
}
if (rounds < 2 || warmups < 1 || targetOperations < 1) {
  throw new Error('rounds must be at least 2; warmups and target-ops must be positive')
}

createTamagui(config.getDefaultTamaguiConfig('web'))

const v2Root = resolve(comparisonRoot, 'v2-control/node_modules')
const v2Require = createRequire(resolve(v2Root, '..', 'package.json'))
const v2Web = v2Require('@tamagui/web')
const v2ConfigDefault = v2Require('@tamagui/config-default')
v2Web.createTamagui(v2ConfigDefault.getDefaultTamaguiConfig('web'))

function prepareElements(
  elements: CorpusElement[],
  framework: {
    Text: any
    View: any
    styled: typeof styled
    dynamic?: typeof styled.dynamic
  }
) {
  const variants = new Map<string, any>()
  const getVariantComponent = (kind: CorpusElement['componentKind'], names: string[]) => {
    const sortedNames = [...names].sort()
    const cacheKey = `${kind}:${sortedNames.join(',')}`
    let component = variants.get(cacheKey)
    if (component) return component
    const definitions: Record<string, any> = {}
    for (const name of sortedNames) {
      const resolveOpacity = (value: any) => ({
        opacity: value === false ? 1 : 0.875,
      })
      definitions[name] = framework.dynamic
        ? framework.dynamic<any>(resolveOpacity)
        : { ['...']: resolveOpacity }
    }
    component = framework.styled(kind === 'text' ? framework.Text : framework.View, {
      variants: definitions,
    } as any)
    variants.set(cacheKey, component)
    return component
  }

  return elements.map<PreparedElement>((element) => ({
    component: element.variantPropNames.length
      ? getVariantComponent(element.componentKind, element.variantPropNames)
      : element.componentKind === 'text'
        ? framework.Text
        : framework.View,
    options:
      element.componentKind === 'intrinsic' ||
      (element.component[0] === element.component[0]?.toLowerCase() &&
        element.componentKind === 'text')
        ? { render: element.component }
        : undefined,
    props: element.props,
    staticPropCount: element.staticPropCount,
  }))
}

const fixedElements = [
  corpus.fixedOverheadScenarios['zero-props'],
  corpus.fixedOverheadScenarios['one-prop'],
]
const allElements = [...corpus.elements, ...fixedElements]
const prepared = prepareElements(allElements, {
  Text,
  View,
  styled,
  dynamic: styled.dynamic,
})
const v2Prepared = prepareElements(allElements, {
  Text: v2Web.Text,
  View: v2Web.View,
  styled: v2Web.styled,
})

const scenarioNames: Scenario[] = [
  'zero-props',
  'one-prop',
  'plain-props',
  'clause-strings',
  'conditional-objects',
  'variant-props',
  'shorthand-heavy',
  'style-prop-heavy',
  'total',
]
function buildScenarios(elements: PreparedElement[]) {
  const harvested = elements.slice(0, corpus.elements.length)
  const fixed = elements.slice(corpus.elements.length)
  return Object.fromEntries(
    scenarioNames.map((name) => [
      name,
      name === 'zero-props'
        ? [fixed[0]!]
        : name === 'one-prop'
          ? [fixed[1]!]
          : name === 'total'
            ? harvested
            : harvested.filter((_, index) =>
                corpus.elements[index]!.scenarios.includes(name as any)
              ),
    ])
  ) as Record<Scenario, PreparedElement[]>
}

const scenarios = buildScenarios(prepared)
const v2Scenarios = buildScenarios(v2Prepared)

for (const name of scenarioNames) {
  if (!scenarios[name].length) throw new Error(`scenario ${name} has no corpus elements`)
}

let checksum = 0
function replay(
  elements: PreparedElement[],
  repetitions: number,
  split: (element: PreparedElement) => any
) {
  for (let repetition = 0; repetition < repetitions; repetition++) {
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]!
      const result = split(element)
      checksum +=
        Object.keys(result.classNames).length +
        Object.keys(result.style ?? {}).length +
        Object.keys(result.viewProps).length
    }
  }
}

// the runtime call shape createComponent makes, and the same shape the v2 arm
// uses. the core-test harness is NOT used here: it runs the split in the
// compiler's static mode (isStatic collects rulesToInsert) and then parses the
// generated CSS to expose class properties, which is bookkeeping a render never
// pays and it inflated the v3 arm by roughly a fifth
const v3Empty = {} as any
const v3Env = { animationDriver: {}, groups: { state: {} } } as any
const splitV3 = (element: PreparedElement) => {
  const staticConfig = element.component.staticConfig
  return v3GetSplitStyles(
    element.props,
    staticConfig,
    v3Empty,
    '',
    defaultComponentState,
    {
      isAnimated: false,
      resolveValues: 'auto',
      styledContext: staticConfig.context?.props,
    },
    v3Empty,
    v3Env,
    undefined,
    element.options?.render,
    true,
    undefined,
    undefined,
    getStyleStaticConfig(staticConfig, getConfig())
  )!
}
const splitV2 = (element: PreparedElement) =>
  v2Web.getSplitStyles(
    element.props,
    element.component.staticConfig,
    {},
    '',
    { unmounted: false },
    { isAnimated: false, noClass: false, resolveValues: 'auto' },
    {},
    { animationDriver: {}, groups: { state: {} } },
    undefined,
    element.options?.render,
    true
  )

const repetitions = Object.fromEntries(
  scenarioNames.map((name) => [
    name,
    Math.max(1, Math.ceil(targetOperations / scenarios[name].length)),
  ])
) as Record<Scenario, number>

for (let warmup = 0; warmup < warmups; warmup++) {
  for (const name of scenarioNames) {
    replay(scenarios[name], repetitions[name], splitV3)
    replay(v2Scenarios[name], repetitions[name], splitV2)
  }
}

const samples = {
  v3: Object.fromEntries(scenarioNames.map((name) => [name, [] as number[]])),
  v2: Object.fromEntries(scenarioNames.map((name) => [name, [] as number[]])),
} as Record<'v2' | 'v3', Record<Scenario, number[]>>
const random = createRandom(0x5e17_57a1)
for (let round = 0; round < rounds; round++) {
  for (const name of shuffle(scenarioNames, random)) {
    const order = round % 2 ? (['v2', 'v3'] as const) : (['v3', 'v2'] as const)
    for (const framework of order) {
      const elements = framework === 'v3' ? scenarios[name] : v2Scenarios[name]
      const operations = elements.length * repetitions[name]
      const start = process.hrtime.bigint()
      replay(elements, repetitions[name], framework === 'v3' ? splitV3 : splitV2)
      const elapsed = process.hrtime.bigint() - start
      samples[framework][name].push(Number(elapsed) / operations)
    }
  }
}

const resultsFor = (frameworkSamples: Record<Scenario, number[]>) =>
  Object.fromEntries(
    scenarioNames.map((name) => {
      const statistic = summarize(frameworkSamples[name])
      const elements = scenarios[name]
      return [
        name,
        {
          elements: elements.length,
          propsPerOperation:
            elements.reduce((sum, element) => sum + element.staticPropCount, 0) /
            elements.length,
          operationsPerRound: elements.length * repetitions[name],
          medianNsPerOperation: median(frameworkSamples[name]),
          meanNsPerOperation: statistic.mean,
          standardDeviationNs: statistic.standardDeviation,
          ci95Ns: statistic.ci95,
          samplesNsPerOperation: frameworkSamples[name],
        },
      ]
    })
  ) as Record<Scenario, any>

const results = resultsFor(samples.v3)
const v2Results = resultsFor(samples.v2)

const report = {
  schemaVersion: 2,
  label: argument('label', 'working-tree'),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: comparisonRoot })
    .toString()
    .trim(),
  runtime: {
    bun: process.versions.bun ?? null,
    node: process.version,
    platform: `${process.platform}-${process.arch}`,
    nodeEnv: process.env.NODE_ENV,
    target: process.env.TAMAGUI_TARGET,
  },
  corpus: {
    sha256: createHash('sha256').update(corpusSource).digest('hex'),
    elements: corpus.elements.length,
    staticAttributes: corpus.distribution.staticAttributes,
  },
  measurement: {
    rounds,
    warmups,
    targetOperations,
    allocation: null,
    allocationNote:
      'not collected: forced-GC heap deltas measure retained memory, not total allocation; profile-hotpath.ts supplies sampled allocation attribution',
  },
  scenarios: results,
  pairedV2Control: {
    packageVersion: '2.6.2',
    scenarios: v2Results,
    medianRatios: Object.fromEntries(
      scenarioNames.map((name) => [
        name,
        results[name].medianNsPerOperation / v2Results[name].medianNsPerOperation,
      ])
    ),
  },
  checksum,
}

console.log(
  `getSplitStyles corpus benchmark: ${rounds} rounds, ${warmups} warmups, Node ${process.version}`
)
console.log(
  'scenario                 elements   props/op    V3 median    V2 median   V3/V2'
)
for (const name of scenarioNames) {
  const result = results[name]
  const control = v2Results[name]
  console.log(
    `${name.padEnd(24)} ${String(result.elements).padStart(8)} ${result.propsPerOperation
      .toFixed(2)
      .padStart(
        10
      )} ${result.medianNsPerOperation.toFixed(1).padStart(12)} ${control.medianNsPerOperation
      .toFixed(1)
      .padStart(12)} ${(result.medianNsPerOperation / control.medianNsPerOperation)
      .toFixed(3)
      .padStart(8)}x`
  )
}
console.log(`checksum ${checksum}`)
console.log(report.measurement.allocationNote)

if (comparePath) {
  const baseline = JSON.parse(readFileSync(resolve(comparePath), 'utf8')) as typeof report
  console.log(`\ncomparison to ${comparePath} (${baseline.commit.slice(0, 12)})`)
  for (const name of scenarioNames) {
    const before = baseline.scenarios[name].medianNsPerOperation
    const after = results[name].medianNsPerOperation
    console.log(
      `${name.padEnd(24)} ${before.toFixed(1).padStart(12)} -> ${after
        .toFixed(1)
        .padStart(
          12
        )} ns/op ${`${(((after - before) / before) * 100).toFixed(2)}%`.padStart(9)}`
    )
  }
}

if (outputPath) {
  writeFileSync(resolve(outputPath), `${JSON.stringify(report, null, 2)}\n`)
  console.log(`wrote ${outputPath}`)
}

// the v2 control package registers timers on import, so the loop never drains
process.exit(0)
