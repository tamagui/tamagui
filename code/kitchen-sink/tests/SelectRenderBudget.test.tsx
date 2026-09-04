import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// the list must not re-render while the user hovers, scrolls or moves the
// active item: the active index is a ref plus an emitter, items never subscribe
// to the registry, and the interaction getters stay stable. counts come from a
// React Profiler around each of the 40 items in SelectRenderProbeCase.
test.describe('Select render budget', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectRenderProbeCase', type: 'useCase' })
    await page.getByTestId('probe-status').waitFor()
  })

  test('hover, scroll and keyboard re-render only the items that change', async ({
    page,
  }) => {
    const itemRenders = () => page.evaluate(() => window.__selectRenders.items)
    const focused = () =>
      page.evaluate(() => document.activeElement?.getAttribute('data-testid'))

    // items mount hidden before the first open (the trigger portals the value)
    let before = await itemRenders()
    await page.getByTestId('probe-trigger').click()
    const viewport = page.getByTestId('probe-viewport')
    await viewport.waitFor()
    await expect(page.getByTestId('probe-item-3')).toBeFocused()
    await page.waitForTimeout(300)

    // opening mounts each item once; the selected item flips active
    expect((await itemRenders()) - before).toBeLessThanOrEqual(45)

    before = await itemRenders()
    for (let i = 4; i < 9; i++) {
      await page.getByTestId(`probe-item-${i}`).hover()
      await page.waitForTimeout(30)
    }
    expect(await focused()).toBe('probe-item-8')
    // two per hover: the item losing active and the one gaining it
    expect((await itemRenders()) - before).toBeLessThanOrEqual(10)

    before = await itemRenders()
    for (let i = 0; i < 10; i++) {
      await viewport.evaluate((el, i) => {
        el.scrollTop = 20 * (i + 1)
      }, i)
      await page.waitForTimeout(30)
    }
    // scrolling moves the list under the pointer: a handful of hover flips
    expect((await itemRenders()) - before).toBeLessThanOrEqual(16)

    before = await itemRenders()
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('ArrowDown')
      await page.waitForTimeout(30)
    }
    expect(await focused()).toBe('probe-item-13')
    // four per press: active flips on two items plus their focus styles
    expect((await itemRenders()) - before).toBeLessThanOrEqual(20)

    before = await itemRenders()
    await page.keyboard.press('End')
    await page.waitForTimeout(100)
    expect(await focused()).toBe('probe-item-39')
    await page.keyboard.press('Home')
    await page.waitForTimeout(100)
    expect(await focused()).toBe('probe-item-0')
    await page.keyboard.type('item-2', { delay: 20 })
    await page.waitForTimeout(100)
    expect(await focused()).toBe('probe-item-20')
    // End, Home and typeahead re-render the impl, never the list
    expect((await itemRenders()) - before).toBeLessThanOrEqual(24)

    await page.keyboard.press('Enter')
    await expect(viewport).toBeHidden()
    await expect(page.getByTestId('probe-trigger')).toHaveText('item-20')
  })
})
