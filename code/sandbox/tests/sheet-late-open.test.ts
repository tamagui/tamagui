import { expect, test } from '@playwright/test'

// A modal sheet's animated wrapper parks off-screen (translateY 10000) until
// the sheet is measured, and it is measured by the shared layout loop. If that
// loop skips nodes that sit outside the viewport, the wrapper deadlocks: it is
// off-screen because it was never measured, and it is never measured because it
// is off-screen. Opening the sheet long after page load removes the startup
// race in which the wrapper could get measured before it was first observed
// off-screen, so this fails deterministically on a loop that visibility-gates
// its nodes.

test('a sheet opened long after page load still slides on screen', async ({ page }) => {
  await page.goto('/test/sheet-late-open')
  await page.waitForSelector('[data-testid="open-sheet"]')

  // let hydration and the layout loop's first observations fully settle while
  // the sheet is parked off-screen
  await page.waitForTimeout(1500)

  await page.locator('[data-testid="open-sheet"]').click()
  await page.waitForTimeout(1500)

  const viewportHeight = page.viewportSize()!.height
  const frame = page.locator('[data-testid="sheet-frame"]')
  await expect(frame).toBeVisible()

  const top = await frame.evaluate((el) => el.getBoundingClientRect().top)
  expect(top, 'sheet frame rests on screen').toBeGreaterThan(0)
  expect(top, 'sheet frame rests on screen').toBeLessThan(viewportHeight)
})
