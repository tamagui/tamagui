import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuSubNestedPositionCase', type: 'useCase' })
})

test('nested submenu does not overlap parent submenu', async ({ page }) => {
  await page.setViewportSize({ width: 500, height: 600 })
  await page.waitForLoadState('networkidle')

  // open root menu
  await page.locator('#menu-trigger').focus()
  await page.keyboard.press('Enter')
  await page.waitForTimeout(400)
  await expect(page.locator('#menu-content')).toBeVisible({ timeout: 5000 })

  // open sub
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(100)
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(400)
  await expect(page.locator('#sub-content')).toBeVisible({ timeout: 5000 })

  // open nested
  await page.keyboard.press('ArrowDown')
  await page.waitForTimeout(100)
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(400)
  await expect(page.locator('#nested-content')).toBeVisible({ timeout: 5000 })

  // nested center must be far from its PARENT sub center (not root)
  const centers = await page.evaluate(() => {
    const rect = (id: string) => {
      const r = document.getElementById(id)!.getBoundingClientRect()
      return { cx: r.x + r.width / 2, cy: r.y + r.height / 2 }
    }
    return { sub: rect('sub-content'), nested: rect('nested-content') }
  })

  const dx = Math.abs(centers.nested.cx - centers.sub.cx)
  const dy = Math.abs(centers.nested.cy - centers.sub.cy)
  const distance = Math.sqrt(dx * dx + dy * dy)

  // centers must be far apart - nested should NOT sit on top of parent sub
  expect(distance).toBeGreaterThan(100)
})
