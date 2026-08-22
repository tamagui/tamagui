import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

const bodyPointerEvents = (page: import('@playwright/test').Page) =>
  page.evaluate(() => document.body.style.pointerEvents)

// C1: two stacked dismissable layers toggle disableOutsidePointerEvents
// true->false->true. the body pointer-events bookkeeping must stay symmetric so
// the body only disables pointer events while at least one layer requests it.
test('dismissable body pointer-events survive prop toggles', async ({ page }) => {
  await setupPage(page, { name: 'DismissableLayerToggleCase', type: 'useCase' })
  await page.waitForLoadState('networkidle')

  const toggle1 = page.locator('#toggle-layer1')
  const toggle2 = page.locator('#toggle-layer2')
  const outside = page.locator('#outside-button')
  const outsideClicks = page.locator('#outside-clicks')

  // both layers start with disableOutsidePointerEvents=true -> body disabled
  await expect.poll(() => bodyPointerEvents(page)).toBe('none')

  // flip layer1 off; layer2 still disables -> body stays disabled
  await toggle1.click()
  await expect.poll(() => bodyPointerEvents(page)).toBe('none')

  // flip layer2 off; no layer disables -> body must be restored
  await toggle2.click()
  await expect.poll(() => bodyPointerEvents(page)).toBe('')

  // body restored means outside content is interactive again
  await expect(outsideClicks).toHaveText('0')
  await outside.click()
  await expect(outsideClicks).toHaveText('1')

  // flip layer1 back on -> body must disable again (count/set were not corrupted)
  await toggle1.click()
  await expect.poll(() => bodyPointerEvents(page)).toBe('none')

  // and back off -> restored again
  await toggle1.click()
  await expect.poll(() => bodyPointerEvents(page)).toBe('')
})
