import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Overflow', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuOverflowCase', type: 'useCase' })
  })

  test('menu content is constrained to max height', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // get menu content bounding box and viewport dimensions
    const boundingBox = await menuContent.boundingBox()
    const viewportSize = page.viewportSize()

    expect(boundingBox).not.toBeNull()
    expect(viewportSize).not.toBeNull()

    if (boundingBox && viewportSize) {
      // menu should not extend beyond viewport
      expect(boundingBox.y).toBeGreaterThanOrEqual(0)
      expect(boundingBox.y + boundingBox.height).toBeLessThanOrEqual(viewportSize.height)
      // menu height should be constrained (less than total items would need)
      expect(boundingBox.height).toBeLessThan(1000) // 30 items at ~33px each would be ~1000px
    }
  })

  test('menu scroll view is scrollable', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuScrollView = page.getByTestId('menu-scroll-view')
    await expect(menuScrollView).toBeVisible()

    // check that scroll view has overflow (is scrollable)
    const isScrollable = await menuScrollView.evaluate((el) => {
      return el.scrollHeight > el.clientHeight
    })

    expect(isScrollable).toBe(true)
  })

  test('scrollbars are hidden', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuScrollView = page.getByTestId('menu-scroll-view')
    await expect(menuScrollView).toBeVisible()

    // check that scrollbar-width is none (Firefox/modern browsers)
    const scrollbarWidth = await menuScrollView.evaluate((el) => {
      return window.getComputedStyle(el).scrollbarWidth
    })

    expect(scrollbarWidth).toBe('none')
  })

  test('first item is visible and last item requires scrolling', async ({ page }) => {
    await page.waitForLoadState('networkidle')

    const trigger = page.getByTestId('menu-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    const menuScrollView = page.getByTestId('menu-scroll-view')
    await expect(menuScrollView).toBeVisible()

    // first item should be visible
    const firstItem = page.getByTestId('menu-item-1')
    await expect(firstItem).toBeVisible()

    // last item should exist but not be in view (requires scrolling)
    const lastItem = page.getByTestId('menu-item-30')
    await expect(lastItem).toBeAttached()
    await expect(lastItem).not.toBeInViewport()
  })
})
