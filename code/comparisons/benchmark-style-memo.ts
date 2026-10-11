#!/usr/bin/env bun
/**
 * Benchmark: style object memoization levels for Tamagui native.
 *
 * Measures how much work can be avoided by returning referentially stable
 * style objects from getSplitStyles. React Native's Fabric reconciler
 * (ReactNativeAttributePayload.diffNestedProperty) short-circuits on
 * `prevProp === nextProp` for style objects, skipping the entire per-property
 * diff AND the subsequent cloneNodeWithNewProps C++ call.
 *
 * Four memoization levels:
 *
 *   L0 (baseline)  — current behavior: fresh style object every render
 *   L1 (instance)  — shallow-compare against prev style per component instance
 *   L2 (per-config) — cache resolved defaults per staticConfig + theme name
 *   L3 (global)    — content-addressed cache keyed by deterministic hash
 *
 * Each level is tested with several prop scenarios:
 *   - static: same props every re-render (most common case)
 *   - dynamic: one prop changes per re-render
 *   - themed: theme-derived values, same theme
 *   - mixed: some static + some dynamic props
 *
 * usage:
 *   NODE_ENV=production TAMAGUI_TARGET=native bun code/comparisons/benchmark-style-memo.ts
 */

import { readFileSync } from 'node:fs'
import { resolve, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import * as config from '../core/config-default'
import { Text, View, createTamagui, styled, getConfig } from '../core/web/src'
import { getSplitStyles } from '../core/web/src'
import { defaultComponentState } from '../core/web/src/defaultComponentState'
import { getStyleStaticConfig } from '../core/web/src/helpers/styleStaticConfig'
import { isEqualShallow } from '../../code/packages/is-equal-shallow/src'
import { createRandom, median, shuffle, summarize } from './benchmark-statistics'

if (process.env.NODE_ENV !== 'production') {
  throw new Error('run with NODE_ENV=production')
}
if (process.env.TAMAGUI_TARGET !== 'native') {
  throw new Error(
    'run with TAMAGUI_TARGET=native (this benchmark measures native style object cost)'
  )
}

createTamagui(config.getDefaultTamaguiConfig('native'))

// ── components ──

const StyledBox = styled(View, {
  width: 44,
  height: 44,
  padding: 4,
  borderRadius: 8,
  backgroundColor: '$background',
})

const StyledText = styled(Text, {
  fontSize: 14,
  color: '$color',
})

const VariantBox = styled(View, {
  variants: {
    size: {
      sm: { width: 24, height: 24 },
      md: { width: 44, height: 44 },
      lg: { width: 64, height: 64 },
    },
    tone: {
      warm: { backgroundColor: 'rgb(253,186,116)' },
      cool: { backgroundColor: 'rgb(147,197,253)' },
    },
  } as const,
})

// ── scenario definitions ──

type Scenario = {
  name: string
  component: any
  // returns props for a given iteration (seed changes to simulate re-renders)
  getProps: (seed: number) => Record<string, any>
  // whether the resolved style should be identical across seeds
  expectStable: boolean
}

const scenarios: Scenario[] = [
  {
    name: 'static-view',
    component: View,
    getProps: () => ({
      width: 44,
      height: 44,
      padding: 4,
      borderRadius: 8,
      backgroundColor: 'red',
    }),
    expectStable: true,
  },
  {
    name: 'static-styled',
    component: StyledBox,
    getProps: () => ({}),
    expectStable: true,
  },
  {
    name: 'dynamic-one-prop',
    component: View,
    getProps: (seed) => ({
      width: 44,
      height: 44,
      padding: 4,
      borderRadius: 8,
      backgroundColor: 'red',
      opacity: seed % 2 ? 0.5 : 1,
    }),
    expectStable: false,
  },
  {
    name: 'static-variant',
    component: VariantBox,
    getProps: () => ({
      size: 'md' as const,
      tone: 'warm' as const,
    }),
    expectStable: true,
  },
  {
    name: 'dynamic-variant',
    component: VariantBox,
    getProps: (seed) => ({
      size: seed % 2 ? ('sm' as const) : ('md' as const),
      tone: 'warm' as const,
    }),
    expectStable: false,
  },
  {
    name: 'many-static-props',
    component: View,
    getProps: () => ({
      width: 60,
      height: 40,
      borderRadius: 6,
      padding: 4,
      borderWidth: 1,
      borderColor: 'rgba(0,0,0,0.1)',
      backgroundColor: 'rgb(99,102,241)',
      margin: 1,
      flexDirection: 'row' as const,
      alignItems: 'center' as const,
      gap: 8,
    }),
    expectStable: true,
  },
  {
    name: 'nested-themed',
    component: StyledBox,
    getProps: () => ({
      borderColor: '$borderColor',
      borderWidth: 1,
    }),
    expectStable: true,
  },
]

// ── getSplitStyles runner ──

const emptyObj = {} as any
const nativeEnv = { animationDriver: {}, groups: { state: {} } } as any

function runSplit(component: any, props: Record<string, any>) {
  const staticConfig = component.staticConfig
  return getSplitStyles(
    props,
    staticConfig,
    emptyObj, // theme (empty = use default)
    '', // themeName
    defaultComponentState,
    {
      isAnimated: false,
      resolveValues: 'auto',
      styledContext: staticConfig.context?.props,
    },
    emptyObj, // propMapper
    nativeEnv,
    undefined, // elementType
    undefined, // render
    true, // isStartingUnhydrated
    undefined, // debug
    undefined, // animationDriver
    getStyleStaticConfig(staticConfig, getConfig())
  )!
}

// ── memoization implementations ──

// L0: baseline - just return the style as-is (current behavior)
function memoL0(_prev: any, current: any): any {
  return current
}

// L1: instance-level shallow compare
function memoL1(prev: any, current: any): any {
  if (prev && current && isEqualShallow(prev, current)) {
    return prev
  }
  return current
}

// L2: per-config + theme cache (simulated via a Map keyed by config identity + theme)
const l2Cache = new WeakMap<any, Map<string, any>>()

function memoL2(prev: any, current: any, staticConfig: any, themeName: string): any {
  // first try instance-level
  if (prev && current && isEqualShallow(prev, current)) {
    return prev
  }
  // then try config-level cache
  let configCache = l2Cache.get(staticConfig)
  if (!configCache) {
    configCache = new Map()
    l2Cache.set(staticConfig, configCache)
  }
  const cached = configCache.get(themeName)
  if (cached && isEqualShallow(cached, current)) {
    return cached
  }
  configCache.set(themeName, current)
  return current
}

// L3: content-addressed global cache
const l3Cache = new Map<string, any>()

function styleHash(style: Record<string, any>): string {
  // fast deterministic hash for style objects
  const keys = Object.keys(style).sort()
  let hash = ''
  for (let i = 0; i < keys.length; i++) {
    const k = keys[i]
    hash += `${k}:${style[k]};`
  }
  return hash
}

function memoL3(prev: any, current: any): any {
  // instance-level first (cheapest)
  if (prev && current && isEqualShallow(prev, current)) {
    return prev
  }
  if (!current) return current
  const hash = styleHash(current)
  const cached = l3Cache.get(hash)
  if (cached) {
    return cached
  }
  l3Cache.set(hash, current)
  return current
}

// ── benchmark runner ──

const WARMUPS = 3
const ROUNDS = 11
const OPS_PER_ROUND = 10_000

type LevelName = 'L0-baseline' | 'L1-instance' | 'L2-per-config' | 'L3-global'
const levels: LevelName[] = ['L0-baseline', 'L1-instance', 'L2-per-config', 'L3-global']

type Result = {
  scenario: string
  level: LevelName
  medianNsPerOp: number
  hitRate: number // fraction of ops that returned prev reference
}

const results: Result[] = []

for (const scenario of scenarios) {
  for (const level of levels) {
    // warm up
    for (let w = 0; w < WARMUPS; w++) {
      let prev: any = null
      for (let i = 0; i < OPS_PER_ROUND; i++) {
        const seed = i % 3
        const props = scenario.getProps(seed)
        const split = runSplit(scenario.component, props)
        const style = split?.style
        switch (level) {
          case 'L0-baseline':
            prev = memoL0(prev, style)
            break
          case 'L1-instance':
            prev = memoL1(prev, style)
            break
          case 'L2-per-config':
            prev = memoL2(prev, style, scenario.component.staticConfig, '')
            break
          case 'L3-global':
            prev = memoL3(prev, style)
            break
        }
      }
    }

    // measure
    const samples: number[] = []
    const hitRates: number[] = []

    for (let round = 0; round < ROUNDS; round++) {
      let prev: any = null
      let hits = 0

      const start = process.hrtime.bigint()
      for (let i = 0; i < OPS_PER_ROUND; i++) {
        const seed = i % 3
        const props = scenario.getProps(seed)
        const split = runSplit(scenario.component, props)
        const style = split?.style
        let result: any
        switch (level) {
          case 'L0-baseline':
            result = memoL0(prev, style)
            break
          case 'L1-instance':
            result = memoL1(prev, style)
            break
          case 'L2-per-config':
            result = memoL2(prev, style, scenario.component.staticConfig, '')
            break
          case 'L3-global':
            result = memoL3(prev, style)
            break
        }
        if (result === prev && prev !== null) hits++
        prev = result
      }
      const elapsed = process.hrtime.bigint() - start

      samples.push(Number(elapsed) / OPS_PER_ROUND)
      // first op is always a miss, so exclude it
      hitRates.push(hits / (OPS_PER_ROUND - 1))
    }

    results.push({
      scenario: scenario.name,
      level,
      medianNsPerOp: median(samples),
      hitRate: median(hitRates),
    })
  }
}

// ── report ──

console.log('\nStyle Object Memoization Benchmark (native)')
console.log('='.repeat(90))
console.log(
  'scenario'.padEnd(20),
  'level'.padEnd(16),
  'ns/op'.padStart(10),
  'hit rate'.padStart(10),
  'vs L0'.padStart(10),
  'RN diff saved'.padStart(15)
)
console.log('-'.repeat(90))

const l0Medians = new Map<string, number>()
for (const r of results) {
  if (r.level === 'L0-baseline') {
    l0Medians.set(r.scenario, r.medianNsPerOp)
  }
}

for (const scenario of scenarios) {
  for (const level of levels) {
    const r = results.find((x) => x.scenario === scenario.name && x.level === level)!
    const baseline = l0Medians.get(scenario.name)!
    const ratio = r.medianNsPerOp / baseline
    // RN diff savings estimate: for each hit, we avoid ~N property comparisons
    // where N = number of style keys. conservative estimate of savings.
    const rnDiffNote = r.hitRate > 0 ? `~${(r.hitRate * 100).toFixed(0)}% skipped` : '-'

    console.log(
      r.scenario.padEnd(20),
      r.level.padEnd(16),
      r.medianNsPerOp.toFixed(0).padStart(10),
      (r.hitRate * 100).toFixed(1).padStart(9) + '%',
      ratio.toFixed(3).padStart(10) + 'x',
      rnDiffNote.padStart(15)
    )
  }
  console.log('')
}

// ── summary ──
console.log('Key findings:')
console.log('')
for (const scenario of scenarios) {
  const l0 = results.find(
    (x) => x.scenario === scenario.name && x.level === 'L0-baseline'
  )!
  const l1 = results.find(
    (x) => x.scenario === scenario.name && x.level === 'L1-instance'
  )!

  if (scenario.expectStable) {
    console.log(
      `  ${scenario.name}: L1 hit rate ${(l1.hitRate * 100).toFixed(0)}%` +
        ` — ${(l1.hitRate * 100).toFixed(0)}% of RN diffNestedProperty calls eliminated`
    )
  } else {
    console.log(
      `  ${scenario.name}: L1 hit rate ${(l1.hitRate * 100).toFixed(0)}%` +
        ` (dynamic props change, expected lower)`
    )
  }
}

console.log('')
console.log('Interpretation:')
console.log(
  '  "hit rate" = fraction of re-renders where the memoized style reference was returned.'
)
console.log(
  '  Each hit skips: RN diffNestedProperty traversal + cloneNodeWithNewProps C++ call.'
)
console.log('  "ns/op" includes getSplitStyles + memo overhead. Lower is better.')
console.log(
  '  "vs L0" shows the ratio: <1.0 means faster than baseline (memo overhead < diff savings).'
)
console.log('')
console.log(
  '  The RN savings are NOT measured here (they happen in the native reconciler).'
)
console.log('  This benchmark measures the JS-side memo OVERHEAD only.')
console.log(
  '  The actual perf gain = (hit_rate × RN_diff_cost_per_node × nodes_in_subtree)'
)
console.log('  which is where the real wins are.')
