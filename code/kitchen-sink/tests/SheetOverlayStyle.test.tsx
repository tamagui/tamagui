import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'SheetOverlayStyleCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
})

async function overlayStyles(page: import('@playwright/test').Page) {
  return page.getByTestId('sheet-overlay-style-overlay').evaluate((element) => {
    const style = getComputedStyle(element)
    return {
      backgroundColor: style.backgroundColor,
      opacity: Number(style.opacity),
    }
  })
}

test('Sheet.Overlay keeps caller styles when hoisted into the sheet portal', async ({
  page,
}) => {
  await page.getByTestId('sheet-overlay-style-open').click()
  await expect(page.getByTestId('sheet-overlay-style-frame')).toBeVisible({
    timeout: 5000,
  })
  await page.waitForTimeout(250)

  const initial = await overlayStyles(page)
  expect(initial.backgroundColor).toBe('rgba(210, 40, 40, 0.35)')
  expect(initial.opacity).toBeCloseTo(0.61, 1)

  await page.getByTestId('sheet-overlay-style-toggle').click()
  await page.waitForTimeout(100)

  const updated = await overlayStyles(page)
  expect(updated.backgroundColor).toBe('rgba(10, 120, 80, 0.35)')
  expect(updated.opacity).toBeCloseTo(0.61, 1)
})
