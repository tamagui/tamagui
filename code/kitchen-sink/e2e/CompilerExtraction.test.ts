/**
 * Tests compiler extraction with theme functionality and performance.
 */

import * as assert from 'assert'
import { by, element, expect, waitFor } from 'detox'
import { remountDirectUseCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'
import { safeLaunchApp } from './utils/detox'

type BenchMode = 'opt' | 'noopt'
type BenchScenario = 'simple' | 'nested'
type BenchRun = { mode: BenchMode; scenario: BenchScenario }

const benchmarkCases: BenchRun[] = [
  { scenario: 'simple', mode: 'opt' },
  { scenario: 'simple', mode: 'noopt' },
  { scenario: 'nested', mode: 'opt' },
  { scenario: 'nested', mode: 'noopt' },
]

function shuffled<T>(values: readonly T[], seed: number): T[] {
  const output = [...values]
  let state = seed >>> 0
  for (let index = output.length - 1; index > 0; index--) {
    state = (Math.imul(state, 1_664_525) + 1_013_904_223) >>> 0
    const swapIndex = state % (index + 1)
    ;[output[index], output[swapIndex]] = [output[swapIndex]!, output[index]!]
  }
  return output
}

async function runBenchmarkCase({ mode, scenario }: BenchRun, expectedCount: number) {
  await element(by.id(`bench-run-${scenario}-${mode}`)).tap()
  await waitFor(element(by.id(`bench-${scenario}-${mode}-count`)))
    .toHaveLabel(`count:${expectedCount}`)
    .withTimeout(3000)
}

async function readBenchmarkNumber(testID: string): Promise<number> {
  const attributes = await element(by.id(testID)).getAttributes()
  const label = (attributes as any).label || ''
  const value = Number.parseFloat(label.split(':').at(-1) || '')
  assert.ok(Number.isFinite(value), `${testID} has invalid benchmark label: ${label}`)
  return value
}

describe('CompilerExtraction', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'CompilerExtraction' },
    })
    await waitFor(element(by.id('compiler-extraction-root')))
      .toExist()
      .withTimeout(180000)
  })

  beforeEach(async () => {
    await remountDirectUseCase('compiler-extraction-root')
  })

  it('should render and respond to theme changes', async () => {
    await new Promise((r) => setTimeout(r, 300))

    // verify components render
    await expect(element(by.id('compiler-simple-box'))).toBeVisible()
    await expect(element(by.id('compiler-advanced-box'))).toBeVisible()
    await expect(element(by.id('compiler-subtheme-box'))).toBeVisible()

    // verify initial light mode
    await expect(element(by.id('compiler-mode-label'))).toHaveText('Mode: light')

    // capture light mode color
    const lightScreenshot = await element(by.id('compiler-advanced-box')).takeScreenshot(
      'light'
    )
    const lightColor = getDominantColor(lightScreenshot)
    console.log(`Light mode color: ${formatRGB(lightColor)}`)

    // toggle to dark mode
    await element(by.id('compiler-toggle-mode')).tap()
    await waitFor(element(by.id('compiler-mode-label')))
      .toHaveText('Mode: dark')
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 200))

    // capture dark mode color
    const darkScreenshot = await element(by.id('compiler-advanced-box')).takeScreenshot(
      'dark'
    )
    const darkColor = getDominantColor(darkScreenshot)
    console.log(`Dark mode color: ${formatRGB(darkColor)}`)

    // colors must differ (verifies theme fix works)
    const colorsDiffer =
      Math.abs(lightColor.r - darkColor.r) > 20 ||
      Math.abs(lightColor.g - darkColor.g) > 20 ||
      Math.abs(lightColor.b - darkColor.b) > 20
    assert.ok(
      colorsDiffer,
      `Theme change failed: light=${formatRGB(lightColor)}, dark=${formatRGB(darkColor)}`
    )

    // test sub-theme: cycle to blue
    await element(by.id('compiler-cycle-subtheme')).tap()
    await new Promise((r) => setTimeout(r, 300))
    const blueScreenshot = await element(by.id('compiler-subtheme-box')).takeScreenshot(
      'blue'
    )
    const blueColor = getDominantColor(blueScreenshot)
    console.log(`Blue sub-theme: ${formatRGB(blueColor)}`)
    assert.ok(isBlueish(blueColor), `Expected blueish, got ${formatRGB(blueColor)}`)
  })

  it('should benchmark optimized vs non-optimized with shuffled median samples', async () => {
    await new Promise((r) => setTimeout(r, 300))

    // show benchmark
    await element(by.id('compiler-toggle-bench')).tap()
    await waitFor(element(by.id('bench-run-simple-opt')))
      .toBeVisible()
      .withTimeout(3000)

    // warm every compiler/scenario combination before collecting data; the
    // shuffled order avoids systematically giving either path a cold or hot run.
    const warmupOrder = shuffled(benchmarkCases, 0x51a7e)
    console.log(
      `Benchmark warmup order: ${warmupOrder.map(({ mode, scenario }) => `${scenario}:${mode}`).join(', ')}`
    )
    for (const benchmarkCase of warmupOrder) {
      await runBenchmarkCase(benchmarkCase, 1)
    }
    await element(by.id('bench-reset')).tap()
    await waitFor(element(by.id('bench-simple-count')))
      .toHaveLabel('count:0')
      .withTimeout(3000)

    const sampleCount = 7
    const sampleOrder = shuffled(
      benchmarkCases.flatMap((benchmarkCase) =>
        Array.from({ length: sampleCount }, () => benchmarkCase)
      ),
      0xc011ec7
    )
    console.log(
      `Benchmark sample order: ${sampleOrder.map(({ mode, scenario }) => `${scenario}:${mode}`).join(', ')}`
    )
    const collected = new Map<string, number>()
    for (const benchmarkCase of sampleOrder) {
      const key = `${benchmarkCase.scenario}:${benchmarkCase.mode}`
      const expectedCount = (collected.get(key) ?? 0) + 1
      collected.set(key, expectedCount)
      await runBenchmarkCase(benchmarkCase, expectedCount)
    }

    for (const scenario of ['simple', 'nested'] as const) {
      await waitFor(element(by.id(`bench-${scenario}-count`)))
        .toHaveLabel(`count:${sampleCount}`)
        .withTimeout(3000)

      const optTime = await readBenchmarkNumber(`bench-${scenario}-opt-result`)
      const noOptTime = await readBenchmarkNumber(`bench-${scenario}-noopt-result`)
      const pctDiff = await readBenchmarkNumber(`bench-${scenario}-pct`)

      console.log(`Benchmark results (${scenario}, median of ${sampleCount}):`)
      console.log(`  Optimized: ${optTime.toFixed(2)}ms`)
      console.log(`  Non-optimized: ${noOptTime.toFixed(2)}ms`)
      console.log(`  Difference: ${pctDiff.toFixed(1)}%`)

      assert.ok(
        pctDiff > -10,
        `${scenario} optimized median should not be >10% slower than non-optimized. Got ${pctDiff.toFixed(1)}%`
      )
    }
  })
})
