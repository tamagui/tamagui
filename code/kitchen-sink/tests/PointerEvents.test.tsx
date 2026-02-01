import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'PointerEventsCase', type: 'useCase' })
})

test('pointer events - down and up fire on click', async ({ page }) => {
  const target = page.locator('[data-testid="pointer-target"]')
  const downCount = page.locator('[data-testid="down-count"]')
  const upCount = page.locator('[data-testid="up-count"]')

  await expect(downCount).toHaveText('Down: 0')
  await expect(upCount).toHaveText('Up: 0')

  await target.click()

  await expect(downCount).toHaveText('Down: 1')
  await expect(upCount).toHaveText('Up: 1')
})

test('pointer events - enter and leave fire on hover', async ({ page }) => {
  const target = page.locator('[data-testid="pointer-target"]')
  const enterCount = page.locator('[data-testid="enter-count"]')
  const leaveCount = page.locator('[data-testid="leave-count"]')

  await expect(enterCount).toHaveText('Enter: 0')
  await expect(leaveCount).toHaveText('Leave: 0')

  // hover over target
  await target.hover()
  await expect(enterCount).toHaveText('Enter: 1')

  // move away from target
  await page.mouse.move(0, 0)
  await expect(leaveCount).toHaveText('Leave: 1')
})

test('pointer events - move fires during drag', async ({ page }) => {
  const target = page.locator('[data-testid="pointer-target"]')
  const moveCount = page.locator('[data-testid="move-count"]')

  await expect(moveCount).toHaveText('Move: 0')

  // get the bounding box and move within it
  const box = await target.boundingBox()
  if (!box) throw new Error('Could not get bounding box')

  // move mouse across the target
  const startX = box.x + 10
  const startY = box.y + 10
  const endX = box.x + box.width - 10
  const endY = box.y + box.height - 10

  await page.mouse.move(startX, startY)
  await page.mouse.move(endX, endY, { steps: 5 })

  // should have fired multiple move events
  const text = await moveCount.textContent()
  const count = parseInt(text?.replace('Move: ', '') || '0')
  expect(count).toBeGreaterThan(0)
})
