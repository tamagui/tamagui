import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

async function dragDown(page: Page, testID: string, dy: number) {
  const box = await page.getByTestId(testID).boundingBox()
  expect(box).toBeTruthy()

  const x = box!.x + box!.width / 2
  const y = box!.y + box!.height / 2
  await page.mouse.move(x, y)
  await page.mouse.down()
  for (let i = 1; i <= 20; i++) {
    await page.mouse.move(x, y + (dy * i) / 20)
  }
  await page.mouse.up()
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetOnAnimationCompleteCase', type: 'useCase' })
})

test('onTransition reports open completion', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const lastEvent = page.locator('[data-testid="last-event"]')

  await trigger.waitFor({ state: 'visible' })
  await trigger.click()
  // wait for animation to complete
  await page.waitForTimeout(1500)

  await expect(lastEvent).toHaveText('opened')
})

test('onTransition reports close completion', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const lastEvent = page.locator('[data-testid="last-event"]')

  await trigger.click()
  await page.waitForTimeout(1500)
  await closeBtn.click()
  await page.waitForTimeout(1500)

  await expect(lastEvent).toHaveText('closed')
})

test('onTransition completes exactly once per open/close cycle', async ({ page }) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const eventCount = page.locator('[data-testid="event-count"]')

  await trigger.click()
  await page.waitForTimeout(1500)
  await expect(eventCount).toHaveText('1')

  await closeBtn.click()
  await page.waitForTimeout(1500)
  await expect(eventCount).toHaveText('2')
})

test('closed sheet leaves the viewport after its transition completes', async ({
  page,
}) => {
  const trigger = page.locator('[data-testid="sheet-open-trigger"]')
  const closeBtn = page.locator('[data-testid="sheet-close"]')
  const frame = page.locator('[data-testid="sheet-frame"]').first()

  await trigger.click()
  await page.waitForTimeout(1500)
  await expect(frame).toBeVisible()

  await closeBtn.click()
  // wait for animation to fully complete
  await page.waitForTimeout(1500)
  await expect(frame).not.toBeInViewport({ ratio: 0.5 })
})

test('dragging to the dismiss snap reports close and fully unmounts the sheet', async ({
  page,
}) => {
  const trigger = page.getByTestId('sheet-open-trigger')
  const lastEvent = page.getByTestId('last-event')
  const eventCount = page.getByTestId('event-count')
  const frame = page.getByTestId('sheet-frame')

  await trigger.click()
  await expect(lastEvent).toHaveText('opened', { timeout: 3000 })
  await dragDown(page, 'sheet-handle', 500)

  await expect(lastEvent).toHaveText('closed', { timeout: 3000 })
  await expect(eventCount).toHaveText('2')
  await expect(frame).toHaveCount(0)
})
