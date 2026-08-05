import * as assert from 'assert'
import { by, element, expect, waitFor } from 'detox'

import { safeLaunchApp } from './utils/detox'
import {
  formatRGB,
  getDominantColor,
  isBlueish,
  isGreenish,
  isReddish,
} from './utils/colors'
import { remountDirectUseCase } from './utils/navigation'

type Metrics = {
  activeLinks: number
  linkCalls: number
  unlinkCalls: number
  applyCalls: number
  tableCalls: number
  stateNameCalls: number
  commits: number
  misses: number
  activeState: string
  stateNames: string[]
}

async function readMetrics(): Promise<Metrics> {
  const before = (await element(by.id('native-fast-metrics')).getAttributes()) as any
  await element(by.id('native-fast-refresh-metrics')).tap()
  const deadline = Date.now() + 5000
  while (Date.now() < deadline) {
    const attributes = (await element(
      by.id('native-fast-metrics')
    ).getAttributes()) as any
    if (attributes.text !== before.text) {
      return JSON.parse(attributes.text)
    }
    await new Promise((resolve) => setTimeout(resolve, 100))
  }
  throw new Error('native fast path metrics did not refresh')
}

async function swatchColor(testID: string, name: string) {
  const screenshot = await element(by.id(testID)).takeScreenshot(name)
  return getDominantColor(screenshot)
}

function assertSameColor(
  actual: ReturnType<typeof getDominantColor>,
  expected: ReturnType<typeof getDominantColor>,
  label: string
) {
  const delta =
    Math.abs(actual.r - expected.r) +
    Math.abs(actual.g - expected.g) +
    Math.abs(actual.b - expected.b)
  assert.ok(
    delta <= 3,
    `${label}: got ${formatRGB(actual)}, expected ${formatRGB(expected)}, delta ${delta}`
  )
}

async function waitForState(state: string) {
  await waitFor(element(by.id('native-fast-state')))
    .toHaveText(state)
    .withTimeout(10000)
}

describe('NativeRegistryCorrectness', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'NativeRegistryCorrectnessCase' },
    })
    await waitFor(element(by.id('native-fast-correctness-root')))
      .toExist()
      .withTimeout(300000)
  }, 360000)

  beforeEach(async () => {
    await remountDirectUseCase('native-fast-correctness-root')
    await waitForState('nested:fallback:red:ready')
  })

  it('matches the fallback across nested scopes and sub-themes', async () => {
    const fallbackRed = {
      outer: await swatchColor('native-fast-outer', 'nested-fallback-red-outer'),
      level2: await swatchColor(
        'native-fast-nested-level2',
        'nested-fallback-red-level2'
      ),
      pinned: await swatchColor('native-fast-pinned-blue', 'nested-fallback-red-pinned'),
    }
    assert.ok(isReddish(fallbackRed.outer), formatRGB(fallbackRed.outer))
    assert.ok(isReddish(fallbackRed.level2), formatRGB(fallbackRed.level2))
    assert.ok(isBlueish(fallbackRed.pinned), formatRGB(fallbackRed.pinned))

    await element(by.id('native-fast-toggle-theme')).tap()
    await waitForState('nested:fallback:green:ready')
    const fallbackGreen = {
      outer: await swatchColor('native-fast-outer', 'nested-fallback-green-outer'),
      level2: await swatchColor(
        'native-fast-nested-level2',
        'nested-fallback-green-level2'
      ),
      pinned: await swatchColor(
        'native-fast-pinned-blue',
        'nested-fallback-green-pinned'
      ),
    }
    assert.ok(isGreenish(fallbackGreen.outer), formatRGB(fallbackGreen.outer))
    assert.ok(isGreenish(fallbackGreen.level2), formatRGB(fallbackGreen.level2))
    assertSameColor(fallbackGreen.pinned, fallbackRed.pinned, 'pinned fallback scope')

    await element(by.id('native-fast-nested-fast')).tap()
    await waitForState('nested:fast:red:ready')
    const fastRed = {
      outer: await swatchColor('native-fast-outer', 'nested-fast-red-outer'),
      level2: await swatchColor('native-fast-nested-level2', 'nested-fast-red-level2'),
      pinned: await swatchColor('native-fast-pinned-blue', 'nested-fast-red-pinned'),
    }
    assertSameColor(fastRed.outer, fallbackRed.outer, 'outer red')
    assertSameColor(fastRed.level2, fallbackRed.level2, 'nested level2 red')
    assertSameColor(fastRed.pinned, fallbackRed.pinned, 'pinned blue')

    await element(by.id('native-fast-toggle-theme')).tap()
    await waitForState('nested:fast:green:ready')
    const fastGreen = {
      outer: await swatchColor('native-fast-outer', 'nested-fast-green-outer'),
      level2: await swatchColor('native-fast-nested-level2', 'nested-fast-green-level2'),
      pinned: await swatchColor('native-fast-pinned-blue', 'nested-fast-green-pinned'),
    }
    assertSameColor(fastGreen.outer, fallbackGreen.outer, 'outer green')
    assertSameColor(fastGreen.level2, fallbackGreen.level2, 'nested level2 green')
    assertSameColor(fastGreen.pinned, fallbackGreen.pinned, 'pinned green')

    const metrics = await readMetrics()
    assert.equal(metrics.activeLinks, 3)
    assert.equal(metrics.applyCalls, 0, 'compiler mode must not use runtime updates')
    assert.ok(metrics.tableCalls > 0, 'cold compiler state should fill native tables')
    assert.ok(metrics.stateNameCalls > 0, 'scope changes should publish to the engine')
    assert.ok(metrics.commits > 0, 'the engine must commit the theme change')
    assert.equal(metrics.misses, 0)
  })

  it('re-links virtualized rows and applies toggles after recycling', async () => {
    await element(by.id('native-fast-list')).tap()
    await waitForState('list:fast:red:ready')
    await waitFor(element(by.id('native-fast-list-row-0')))
      .toBeVisible()
      .withTimeout(10000)

    const topRed = await swatchColor('native-fast-list-row-0', 'list-top-red')
    assert.ok(isReddish(topRed), formatRGB(topRed))
    const initial = await readMetrics()
    assert.ok(initial.activeLinks > 0)
    assert.equal(initial.applyCalls, 0, 'compiler mode must not use runtime updates')

    await element(by.id('native-fast-toggle-theme')).tap()
    await waitForState('list:fast:green:ready')
    const topGreen = await swatchColor('native-fast-list-row-0', 'list-top-green')
    assert.ok(isGreenish(topGreen), formatRGB(topGreen))

    await waitFor(element(by.id('native-fast-list-row-79')))
      .toBeVisible()
      .whileElement(by.id('native-fast-list-view'))
      .scroll(600, 'down')
    const recycled = await readMetrics()
    assert.ok(recycled.unlinkCalls > 0, 'virtualization must detach offscreen links')
    assert.ok(
      recycled.linkCalls > initial.linkCalls,
      `expected new links after scroll, got ${recycled.linkCalls} from ${initial.linkCalls}`
    )

    await element(by.id('native-fast-toggle-theme')).tap()
    await waitForState('list:fast:red:ready')
    const bottomRed = await swatchColor('native-fast-list-row-79', 'list-bottom-red')
    assertSameColor(bottomRed, topRed, 'recycled bottom row red')

    await waitFor(element(by.id('native-fast-list-row-0')))
      .toBeVisible()
      .whileElement(by.id('native-fast-list-view'))
      .scroll(600, 'up')
    await element(by.id('native-fast-toggle-theme')).tap()
    await waitForState('list:fast:green:ready')
    const relinkedTopGreen = await swatchColor(
      'native-fast-list-row-0',
      'list-relinked-top-green'
    )
    assertSameColor(relinkedTopGreen, topGreen, 're-linked top row green')

    const final = await readMetrics()
    assert.ok(final.activeLinks > 0)
    assert.ok(final.commits > initial.commits)
    assert.equal(final.applyCalls, 0, 'compiler mode must stay on scope broadcasts')
    assert.equal(final.misses, 0)
  })

  it('survives rapid unmount and remount cycles with interleaved theme toggles', async () => {
    await element(by.id('native-fast-churn')).tap()
    await waitForState('churn:fast:red:ready')
    await waitFor(element(by.id('native-fast-churn-swatch')))
      .toBeVisible()
      .withTimeout(10000)

    await element(by.id('native-fast-run-churn')).tap()
    await waitFor(element(by.id('native-fast-churn-status')))
      .toHaveText('done:15:green')
      .withTimeout(30000)
    await waitForState('churn:fast:green:ready')

    const finalColor = await swatchColor('native-fast-churn-swatch', 'churn-final-green')
    assert.ok(isGreenish(finalColor), formatRGB(finalColor))
    const metrics = await readMetrics()
    assert.equal(metrics.activeLinks, 1)
    assert.ok(
      metrics.linkCalls >= 16,
      `expected at least 16 links, got ${metrics.linkCalls}`
    )
    assert.ok(
      metrics.unlinkCalls >= 15,
      `expected at least 15 unlinks, got ${metrics.unlinkCalls}`
    )
    assert.ok(metrics.commits > 0)
    assert.equal(metrics.applyCalls, 0, 'compiler mode must stay on scope broadcasts')
    assert.equal(metrics.misses, 0)
    assert.equal(metrics.activeState, '')
    assert.ok(metrics.stateNames.includes('light_red'))
    assert.ok(metrics.stateNames.includes('light_green'))
  })
})
