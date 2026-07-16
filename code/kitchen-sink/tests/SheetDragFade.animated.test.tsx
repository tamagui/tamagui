import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// mobile viewport with touch for realistic sheet drag testing
test.use({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
})

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetDragFadeCase', type: 'useCase' })
})

async function backdropOpacity(page: Page): Promise<number> {
  return page
    .getByTestId('drag-fade-backdrop')
    .evaluate((el) => Number.parseFloat(getComputedStyle(el as HTMLElement).opacity))
}

async function dragSheet(page: Page, startX: number, startY: number, deltaY: number) {
  await page.mouse.move(startX, startY)
  await page.mouse.down()
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(startX, startY + (deltaY * i) / 20)
    await page.waitForTimeout(16)
  }
  await page.mouse.up()
}

test('drag-linked overlay fade tracks the sheet position', async ({ page }) => {
  const trigger = page.getByTestId('drag-fade-open')
  const frame = page.getByTestId('drag-fade-frame')
  const handle = page.getByTestId('drag-fade-handle')

  await trigger.click()
  await expect(frame).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(600)

  // at the 80% snap the backdrop fades to ~0.6 * (1 - 0.2) = 0.48
  const openedOpacity = await backdropOpacity(page)
  expect(openedOpacity).toBeGreaterThan(0.3)
  expect(openedOpacity).toBeLessThanOrEqual(0.62)

  const handleBox = await handle.boundingBox()
  expect(handleBox).toBeTruthy()
  const startX = handleBox!.x + handleBox!.width / 2
  const startY = handleBox!.y + handleBox!.height / 2

  // drag down to the 40% snap; the backdrop must fade further out
  await dragSheet(page, startX, startY, 250)
  await page.waitForTimeout(700)

  const draggedOpacity = await backdropOpacity(page)
  expect(draggedOpacity).toBeLessThan(openedOpacity - 0.08)
})

test('drag-linked overlay is hidden with the sheet after close', async ({ page }) => {
  const trigger = page.getByTestId('drag-fade-open')
  const frame = page.getByTestId('drag-fade-frame')

  await trigger.click()
  await expect(frame).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(600)

  // escape closes the top-most modal sheet
  await page.keyboard.press('Escape')
  await page.waitForTimeout(900)

  // closed sheet frame leaves the viewport (display:none / off-screen)
  await expect(frame).not.toBeInViewport({ ratio: 0.5 })
})
