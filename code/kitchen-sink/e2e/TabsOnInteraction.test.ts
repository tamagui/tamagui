/**
 * Test that Tabs onInteraction fires with layout measurements on native.
 * Regression test for: createTabs tab layout measurement broken on native
 * since commit 525e303 which replaced onLayout with web-only ResizeObserver.
 */

import { by, element, expect, waitFor } from 'detox'
import { navigateToTestCase } from './utils/navigation'
import { safeLaunchApp, safeReloadApp, withSync } from './utils/detox'

describe('TabsOnInteraction', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    // skipEnableSync: the Tabs screen keeps the main thread busy via
    // onLayout callbacks, so leaving sync enabled hangs the hook.
    await navigateToTestCase('TabsOnInteraction', 'tabs-root', {
      skipEnableSync: true,
    })
  })

  it('should fire onInteraction with layout for the default selected tab', async () => {
    // tab1 is defaultValue, so onInteraction should fire with 'select' and a layout
    await waitFor(element(by.id('tabs-layout-has-value')))
      .toHaveText('hasLayout: true')
      .withTimeout(5000)

    await expect(element(by.id('tabs-interaction-type'))).toHaveText(
      'interaction: select'
    )
  })

  it('should have non-zero layout dimensions', async () => {
    await waitFor(element(by.id('tabs-layout-has-value')))
      .toHaveText('hasLayout: true')
      .withTimeout(5000)

    // width and height should not be 'null' or '0'
    const widthEl = element(by.id('tabs-layout-width'))
    const heightEl = element(by.id('tabs-layout-height'))

    // verify they don't show null
    await expect(widthEl).not.toHaveText('width: null')
    await expect(heightEl).not.toHaveText('height: null')
    await expect(widthEl).not.toHaveText('width: 0')
    await expect(heightEl).not.toHaveText('height: 0')
  })

  it('should fire onInteraction when switching tabs', async () => {
    // wait for initial layout
    await waitFor(element(by.id('tabs-layout-has-value')))
      .toHaveText('hasLayout: true')
      .withTimeout(5000)

    // tap tab2 — requires sync briefly for reliable tap delivery
    await withSync(() => element(by.id('tabs-tab2')).tap())

    // content should switch
    await waitFor(element(by.id('tabs-content-tab2')))
      .toBeVisible()
      .withTimeout(5000)

    // onInteraction should still have a layout
    await expect(element(by.id('tabs-layout-has-value'))).toHaveText('hasLayout: true')
    await expect(element(by.id('tabs-interaction-type'))).toHaveText(
      'interaction: select'
    )
  })
})
