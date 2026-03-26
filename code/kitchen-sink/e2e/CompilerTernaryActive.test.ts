/**
 * Tests that the compiler correctly preserves fontWeight in ternaries
 * when mixed with theme-token conditionals (e.g. color).
 *
 * Regression test: the compiler was unconditionally adding plain styles
 * (fontWeight) from ternary branches instead of wrapping them in the
 * conditional, causing the last branch's value to always win.
 */

import * as assert from 'assert'
import { execSync } from 'child_process'
import { unlinkSync, existsSync } from 'fs'
import { by, device, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, formatRGB } from './utils/colors'

const SOURCE_FILE = 'src/usecases/CompilerTernaryActive.tsx'
const NATIVE_FILE = 'src/usecases/CompilerTernaryActive.native.tsx'

describe('CompilerTernaryActive', () => {
  beforeAll(async () => {
    if (existsSync(NATIVE_FILE)) {
      unlinkSync(NATIVE_FILE)
    }

    console.log('Running tamagui build...')
    execSync(`npx tamagui build ${SOURCE_FILE} --target native --output-around`, {
      stdio: 'inherit',
    })
    console.log('Build complete, .native.tsx generated')

    await device.launchApp({ newInstance: true })
  })

  it('optimized and non-optimized text should match colors in both states', async () => {
    await device.reloadReactNative()
    await navigateToTestCase('CompilerTernaryActive', 'compiler-ternary-active-root')
    await new Promise((r) => setTimeout(r, 300))

    // verify initial state is inactive
    await expect(element(by.id('active-state-label'))).toHaveText('Active: NO')

    // screenshot both text containers in inactive state
    const optInactive = await element(by.id('opt-text-container')).takeScreenshot(
      'opt-inactive'
    )
    const noOptInactive = await element(by.id('noopt-text-container')).takeScreenshot(
      'noopt-inactive'
    )

    const optInactiveColor = getDominantColor(optInactive)
    const noOptInactiveColor = getDominantColor(noOptInactive)
    console.log(`Opt inactive: ${formatRGB(optInactiveColor)}`)
    console.log(`NoOpt inactive: ${formatRGB(noOptInactiveColor)}`)

    // inactive colors should be similar between opt and noopt
    const inactiveDiff =
      Math.abs(optInactiveColor.r - noOptInactiveColor.r) +
      Math.abs(optInactiveColor.g - noOptInactiveColor.g) +
      Math.abs(optInactiveColor.b - noOptInactiveColor.b)
    assert.ok(
      inactiveDiff < 60,
      `Inactive state: opt=${formatRGB(optInactiveColor)} vs noopt=${formatRGB(noOptInactiveColor)} differ by ${inactiveDiff}`
    )

    // toggle to active
    await element(by.id('toggle-active')).tap()
    await waitFor(element(by.id('active-state-label')))
      .toHaveText('Active: YES')
      .withTimeout(3000)
    await new Promise((r) => setTimeout(r, 200))

    // screenshot both in active state
    const optActive = await element(by.id('opt-text-container')).takeScreenshot(
      'opt-active'
    )
    const noOptActive = await element(by.id('noopt-text-container')).takeScreenshot(
      'noopt-active'
    )

    const optActiveColor = getDominantColor(optActive)
    const noOptActiveColor = getDominantColor(noOptActive)
    console.log(`Opt active: ${formatRGB(optActiveColor)}`)
    console.log(`NoOpt active: ${formatRGB(noOptActiveColor)}`)

    // active colors should be similar between opt and noopt
    const activeDiff =
      Math.abs(optActiveColor.r - noOptActiveColor.r) +
      Math.abs(optActiveColor.g - noOptActiveColor.g) +
      Math.abs(optActiveColor.b - noOptActiveColor.b)
    assert.ok(
      activeDiff < 60,
      `Active state: opt=${formatRGB(optActiveColor)} vs noopt=${formatRGB(noOptActiveColor)} differ by ${activeDiff}`
    )

    // colors must change between inactive and active (verifies the ternary works)
    const optColorChange =
      Math.abs(optInactiveColor.r - optActiveColor.r) +
      Math.abs(optInactiveColor.g - optActiveColor.g) +
      Math.abs(optInactiveColor.b - optActiveColor.b)
    assert.ok(
      optColorChange > 20,
      `Optimized text color did not change: inactive=${formatRGB(optInactiveColor)} active=${formatRGB(optActiveColor)}`
    )
  })
})
