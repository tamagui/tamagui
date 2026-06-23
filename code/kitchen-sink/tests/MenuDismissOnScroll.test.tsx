import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Verifies the menu's dismiss-on-scroll only fires when the scroll actually
 * moves the menu's anchor. A scroll in an unrelated subtree must not dismiss.
 */

// scroll the first scrollable node within a testid'd subtree and let the
// scroll event + any resulting state update settle
async function scrollWithin(page: import('@playwright/test').Page, testid: string) {
  await page.evaluate((id) => {
    const root = document.querySelector(`[data-testid="${id}"]`)
    if (!root) throw new Error(`no element for testid ${id}`)
    const nodes = [root, ...Array.from(root.querySelectorAll('*'))] as HTMLElement[]
    const scrollable = nodes.find((n) => n.scrollHeight > n.clientHeight + 1)
    if (!scrollable) throw new Error(`no scrollable node within ${id}`)
    scrollable.scrollTop += 80
  }, testid)
}

test.describe('Menu dismiss on scroll', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuDismissOnScrollCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('scrolling an unrelated subtree does not dismiss the menu', async ({ page }) => {
    await page.getByTestId('menu-trigger').click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    await scrollWithin(page, 'unrelated-scroll')
    await page.waitForTimeout(300)

    // menu must stay open - the scrolled subtree does not contain its anchor
    await expect(page.getByTestId('menu-content')).toBeVisible()
  })

  test('scrolling the container that holds the trigger dismisses the menu', async ({
    page,
  }) => {
    await page.getByTestId('menu-trigger').click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    await scrollWithin(page, 'trigger-scroll')
    await page.waitForTimeout(300)

    // menu must dismiss - the scroll moved its anchor
    await expect(page.getByTestId('menu-content')).not.toBeVisible()
  })

  test('scrolling the page dismisses the menu', async ({ page }) => {
    await page.getByTestId('menu-trigger').click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId('menu-content')).toBeVisible()

    await page.evaluate(() => window.scrollBy(0, 200))
    await page.waitForTimeout(300)

    // menu must dismiss - a page scroll moves the anchor relative to the viewport
    await expect(page.getByTestId('menu-content')).not.toBeVisible()
  })
})
