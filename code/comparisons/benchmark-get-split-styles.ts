#!/usr/bin/env bun
/**
 * replays statically harvested real app props through the core-test
 * getSplitStyles harness.
 *
 * usage:
 *   NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts
 *   NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts --output=code/comparisons/get-split-styles-baseline.json
 *   NODE_ENV=production TAMAGUI_TARGET=web bun code/comparisons/benchmark-get-split-styles.ts --compare=code/comparisons/get-split-styles-baseline.json
 */

import { createHash } from 'node:crypto'
import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

import config from '../core/config-default'
import { Text, View, createTamagui, styled } from '../core/web/src'
import { simplifiedGetSplitStyles } from '../core/core-test/utils'
import { createRandom, median, shuffle, summarize } from './benchmark-statistics'

type Scenario =
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
const corpusPath = resolve(import.meta.dir, 'get-split-styles-prop-corpus.json')
const corpusSource = readFileSync(corpusPath, 'utf8')
const corpus = JSON.parse(corpusSource) as {
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

const variantComponents = new Map<string, any>()
function variantComponent(kind: CorpusElement['componentKind'], names: string[]) {
  const sortedNames = [...names].sort()
  const cacheKey = `${kind}:${sortedNames.join(',')}`
  let component = variantComponents.get(cacheKey)
  if (component) return component
  const variants: Record<string, any> = {}
  for (const name of sortedNames) {
    variants[name] = {
      any: (value: any) => ({ opacity: value === false ? 1 : 0.875 }),
    }
  }
  component = styled(kind === 'text' ? Text : View, { variants } as any)
  variantComponents.set(cacheKey, component)
  return component
}

const prepared = corpus.elements.map<PreparedElement>((element) => ({
  component: element.variantPropNames.length
    ? variantComponent(element.componentKind, element.variantPropNames)
    : element.componentKind === 'text'
      ? Text
      : View,
  options:
    element.componentKind === 'intrinsic' ||
    (element.component[0] === element.component[0]?.toLowerCase() &&
      element.componentKind === 'text')
      ? { render: element.component }
      : undefined,
  props: element.props,
  staticPropCount: element.staticPropCount,
}))

const scenarioNames: Scenario[] = [
  'plain-props',
  'clause-strings',
  'conditional-objects',
  'variant-props',
  'shorthand-heavy',
  'style-prop-heavy',
  'total',
]
const scenarios = Object.fromEntries(
  scenarioNames.map((name) => [
    name,
    name === 'total'
      ? prepared
      : prepared.filter((_, index) => corpus.elements[index]!.scenarios.includes(name)),
  ])
) as Record<Scenario, PreparedElement[]>

for (const name of scenarioNames) {
  if (!scenarios[name].length) throw new Error(`scenario ${name} has no corpus elements`)
}

let checksum = 0
function replay(elements: PreparedElement[], repetitions: number) {
  for (let repetition = 0; repetition < repetitions; repetition++) {
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index]!
      const result = simplifiedGetSplitStyles(
        element.component,
        element.props,
        element.options
      )
      checksum +=
        Object.keys(result.classNames).length +
        Object.keys(result.style ?? {}).length +
        Object.keys(result.viewProps).length
    }
  }
}

const repetitions = Object.fromEntries(
  scenarioNames.map((name) => [
    name,
    Math.max(1, Math.ceil(targetOperations / scenarios[name].length)),
  ])
) as Record<Scenario, number>

for (let warmup = 0; warmup < warmups; warmup++) {
  for (const name of scenarioNames) replay(scenarios[name], repetitions[name])
}

const samples = Object.fromEntries(
  scenarioNames.map((name) => [name, [] as number[]])
) as Record<Scenario, number[]>
const random = createRandom(0x5e17_57a1)
for (let round = 0; round < rounds; round++) {
  for (const name of shuffle(scenarioNames, random)) {
    const elements = scenarios[name]
    const operations = elements.length * repetitions[name]
    const start = process.hrtime.bigint()
    replay(elements, repetitions[name])
    const elapsed = process.hrtime.bigint() - start
    samples[name].push(Number(elapsed) / operations)
  }
}

const results = Object.fromEntries(
  scenarioNames.map((name) => {
    const statistic = summarize(samples[name])
    const elements = scenarios[name]
    return [
      name,
      {
        elements: elements.length,
        propsPerOperation:
          elements.reduce((sum, element) => sum + element.staticPropCount, 0) /
          elements.length,
        operationsPerRound: elements.length * repetitions[name],
        medianNsPerOperation: median(samples[name]),
        meanNsPerOperation: statistic.mean,
        standardDeviationNs: statistic.standardDeviation,
        ci95Ns: statistic.ci95,
        samplesNsPerOperation: samples[name],
      },
    ]
  })
) as Record<Scenario, any>

const report = {
  schemaVersion: 1,
  label: argument('label', 'working-tree'),
  commit: execFileSync('git', ['rev-parse', 'HEAD'], { cwd: import.meta.dir })
    .toString()
    .trim(),
  runtime: {
    bun: Bun.version,
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
  checksum,
}

console.log(
  `getSplitStyles corpus benchmark: ${rounds} rounds, ${warmups} warmups, Bun ${Bun.version}`
)
console.log('scenario                 elements   props/op   median ns/op     95% CI mean')
for (const name of scenarioNames) {
  const result = results[name]
  console.log(
    `${name.padEnd(24)} ${String(result.elements).padStart(8)} ${result.propsPerOperation
      .toFixed(2)
      .padStart(
        10
      )} ${result.medianNsPerOperation.toFixed(1).padStart(14)} ${`${result.ci95Ns.low.toFixed(1)}..${result.ci95Ns.high.toFixed(1)}`.padStart(19)}`
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
