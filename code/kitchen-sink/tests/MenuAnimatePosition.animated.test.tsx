import { expect, test } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

test.describe('Menu animatePosition', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'MenuAnimatePositionCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('content appears near the trigger that opened it', async ({ page }) => {
    const triggerLeft = page.getByTestId('trigger-left')
    await triggerLeft.click()
    await page.waitForTimeout(400)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    const triggerBox = await getBoundingRect(page, '[data-testid="trigger-left"]')
    const contentBox = await getBoundingRect(page, '[data-testid="menu-content"]')
    expect(triggerBox).not.toBeNull()
    expect(contentBox).not.toBeNull()

    // content should be horizontally aligned near the left trigger
    expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThan(50)
  })

  test('content has transition style when animatePosition is set', async ({ page }) => {
    const triggerLeft = page.getByTestId('trigger-left')
    await triggerLeft.click()
    await page.waitForTimeout(400)

    const content = page.getByTestId('menu-content')
    await expect(content).toBeVisible()

    // check that the content element (or its popper wrapper) has a CSS transition
    const hasTransition = await content.evaluate((el) => {
      let node: Element | null = el
      while (node) {
        const style = getComputedStyle(node)
        if (
          style.transition &&
          style.transition !== 'none' &&
          style.transition !== 'all 0s ease 0s'
        ) {
          return true
        }
        node = node.parentElement
      }
      return false
    })

    expect(hasTransition).toBe(true)
  })
})
