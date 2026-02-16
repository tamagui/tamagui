import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Auto Resize', () => {
  test('menu resizes to fit in small viewport', async ({ page }) => {
    // set a very small viewport height
    await page.setViewportSize({ width: 400, height: 300 })

    await setupPage(page, { name: 'MenuAutoResizeCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // get menu content bounding box
    const boundingBox = await menuContent.boundingBox()
    const viewportSize = page.viewportSize()

    expect(boundingBox).not.toBeNull()
    expect(viewportSize).not.toBeNull()

    if (boundingBox && viewportSize) {
      // menu should NOT extend beyond viewport top
      expect(boundingBox.y).toBeGreaterThanOrEqual(0)
      // menu should NOT extend beyond viewport bottom
      expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(viewportSize.height)
    }
  })

  test('menu scroll view uses available height CSS variable', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 300 })

    await setupPage(page, { name: 'MenuAutoResizeCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuScrollView = page.getByTestId('menu-scroll-view')
    await expect(menuScrollView).toBeVisible()

    // the scroll view should be scrollable (content exceeds available height)
    const isScrollable = await menuScrollView.evaluate((el) => {
      return el.scrollHeight > el.clientHeight
    })

    expect(isScrollable).toBe(true)
  })
})
