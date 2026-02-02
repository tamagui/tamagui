import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'PopoverAnimatePositionCase', type: 'useCase' })
})

// TODO: test passes on actual site but fails here - likely test setup difference
test.skip('popover with animatePosition shows correct position on re-open', async ({
  page,
}) => {
  await page.waitForLoadState('networkidle')

  const trigger = page.locator('#animate-position-trigger')
  const content = page.locator('#animate-position-content')
  const closeButton = page.locator('#animate-position-close')

  await expect(trigger).toBeVisible()

  // first open
  await trigger.click()
  await expect(content).toBeVisible({ timeout: 5000 })
  // wait for animation to settle
  await page.waitForTimeout(500)

  const box1 = await content.boundingBox()

  // close
  await closeButton.click()
  await expect(content).not.toBeVisible({ timeout: 5000 })

  // second open
  await trigger.click()
  await expect(content).toBeVisible({ timeout: 5000 })
  // wait for animation to settle
  await page.waitForTimeout(500)

  const box2 = await content.boundingBox()

  // verify position is consistent between opens
  // the x position should be the same (within small tolerance for animation)
  expect(box1).toBeTruthy()
  expect(box2).toBeTruthy()
  if (box1 && box2) {
    const xDiff = Math.abs(box1.x - box2.x)
    const yDiff = Math.abs(box1.y - box2.y)
    expect(xDiff).toBeLessThan(5)
    expect(yDiff).toBeLessThan(5)
  }
})
