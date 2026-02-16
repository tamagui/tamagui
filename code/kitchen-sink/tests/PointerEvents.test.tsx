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

test('pointer events - box-none allows clicks to pass through parent to element behind', async ({
  page,
}) => {
  const parentCount = page.locator('[data-testid="box-none-parent-count"]')
  const childCount = page.locator('[data-testid="box-none-child-count"]')
  const behindCount = page.locator('[data-testid="box-none-behind-count"]')
  const behind = page.locator('[data-testid="box-none-behind"]')

  // initial state
  await expect(parentCount).toHaveText('BoxNoneParent: 0')
  await expect(childCount).toHaveText('BoxNoneChild: 0')
  await expect(behindCount).toHaveText('BoxNoneBehind: 0')

  // click directly on parent area (where behind element is underneath)
  // box-none should let the click pass through to the behind element
  const behindBox = await behind.boundingBox()
  if (!behindBox) throw new Error('Could not get behind bounding box')

  // get center of the behind element which is covered by the parent
  const centerX = behindBox.x + behindBox.width / 2
  const centerY = behindBox.y + behindBox.height / 2

  // clicking at this position should:
  // 1. NOT trigger the parent's onPress (box-none means parent ignores pointer events)
  // 2. Trigger the behind element's onPress (click passes through)
  await page.mouse.click(centerX, centerY)

  // parent should not have received the click
  await expect(parentCount).toHaveText('BoxNoneParent: 0')
  // behind element should have received the click
  await expect(behindCount).toHaveText('BoxNoneBehind: 1')
})

test('pointer events - box-none child still receives clicks', async ({ page }) => {
  const childCount = page.locator('[data-testid="box-none-child-count"]')
  const child = page.locator('[data-testid="box-none-child"]')

  await expect(childCount).toHaveText('BoxNoneChild: 0')

  // clicking on child should work (children can still receive events)
  await child.click()
  await expect(childCount).toHaveText('BoxNoneChild: 1')
})

test('pointer events - box-none applies correct CSS', async ({ page }) => {
  const parent = page.locator('[data-testid="box-none-parent"]')
  const child = page.locator('[data-testid="box-none-child"]')

  // parent should have pointer-events: none
  const parentPointerEvents = await parent.evaluate(
    (el) => window.getComputedStyle(el).pointerEvents
  )
  expect(parentPointerEvents).toBe('none')

  // direct children should have pointer-events: auto (due to box-none polyfill)
  const childPointerEvents = await child.evaluate(
    (el) => window.getComputedStyle(el).pointerEvents
  )
  expect(childPointerEvents).toBe('auto')
})
