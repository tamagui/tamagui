/**
 * Tests compiler extraction with theme functionality and performance.
 * Runs tamagui build to generate .native.tsx before testing.
 */

import * as assert from 'assert'
import { execSync } from 'child_process'
import { unlinkSync, existsSync } from 'fs'
import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'

const SOURCE_FILE = 'src/usecases/CompilerExtraction.tsx'
const NATIVE_FILE = 'src/usecases/CompilerExtraction.native.tsx'
const EXPECTED_OPTIMIZATIONS = 18

describe('CompilerExtraction', () => {
  beforeAll(async () => {
    // remove existing .native.tsx to force rebuild
    if (existsSync(NATIVE_FILE)) {
      unlinkSync(NATIVE_FILE)
    }

    // run tamagui build to generate optimized .native.tsx
    console.log('Running tamagui build...')
    execSync(
      `npx tamagui build ${SOURCE_FILE} --target native --output-around --expect-optimizations ${EXPECTED_OPTIMIZATIONS}`,
      { stdio: 'inherit' }
    )
    console.log('Build complete, .native.tsx generated')

    await device.launchApp({ newInstance: true })
  })

  it('should render and respond to theme changes', async () => {
    await device.reloadReactNative()
    await navigateToTestCase('CompilerExtraction', 'compiler-extraction-root')
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

  it('should benchmark optimized vs non-optimized (best of 3)', async () => {
    await device.reloadReactNative()
    await navigateToTestCase('CompilerExtraction', 'compiler-extraction-root')
    await new Promise((r) => setTimeout(r, 300))

    // show benchmark
    await element(by.id('compiler-toggle-bench')).tap()
    await waitFor(element(by.id('bench-run-opt')))
      .toBeVisible()
      .withTimeout(3000)

    // run optimized 3 times
    for (let i = 0; i < 3; i++) {
      await element(by.id('bench-run-opt')).tap()
      await new Promise((r) => setTimeout(r, 300))
    }

    // run non-optimized 3 times
    for (let i = 0; i < 3; i++) {
      await element(by.id('bench-run-noopt')).tap()
      await new Promise((r) => setTimeout(r, 300))
    }

    // get results via accessibility labels
    const optResult = await element(by.id('bench-opt-result')).getAttributes()
    const noOptResult = await element(by.id('bench-noopt-result')).getAttributes()
    const pctResult = await element(by.id('bench-pct')).getAttributes()

    // parse times from accessibility labels (format: "opt:1.2345" or "noopt:1.2345")
    const optLabel = (optResult as any).label || ''
    const noOptLabel = (noOptResult as any).label || ''
    const pctLabel = (pctResult as any).label || ''

    const optTime = parseFloat(optLabel.split(':')[1])
    const noOptTime = parseFloat(noOptLabel.split(':')[1])
    const pctDiff = parseFloat(pctLabel.split(':')[1])

    console.log(`Benchmark results:`)
    console.log(`  Optimized best: ${optTime.toFixed(2)}ms`)
    console.log(`  Non-optimized best: ${noOptTime.toFixed(2)}ms`)
    console.log(`  Difference: ${pctDiff.toFixed(1)}%`)

    // assert optimized is faster (or at least not significantly slower)
    assert.ok(
      pctDiff > -10,
      `Optimized should not be >10% slower than non-optimized. Got ${pctDiff.toFixed(1)}%`
    )

    // log the improvement
    if (pctDiff > 0) {
      console.log(`✓ Optimized is ${pctDiff.toFixed(1)}% faster`)
    } else {
      console.log(
        `⚠ Optimized is ${Math.abs(pctDiff).toFixed(1)}% slower (within tolerance)`
      )
    }
  })
})
