import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'RemoveScrollCase', type: 'useCase' })
})

/**
 * helper: scroll, open select, wait for viewport
 */
async function scrollAndOpenSelect(page: Page, scrollY: number) {
  if (scrollY > 0) {
    await page.evaluate((y) => window.scrollTo(0, y), scrollY)
    await page.waitForTimeout(100)
    const actual = await page.evaluate(() => window.scrollY)
    expect(actual).toBeGreaterThanOrEqual(scrollY - 2)
  }

  const trigger = page.getByTestId('rs-select-trigger')
  await trigger.scrollIntoViewIfNeeded()
  await trigger.click()

  const viewport = page.getByTestId('rs-select-viewport')
  await expect(viewport).toBeVisible({ timeout: 5000 })
  await page.waitForTimeout(200)

  return viewport
}

// --- positive: scroll position IS restored ---

test.describe('scroll position restored after close', () => {
  test('preserved when closing by selecting an item', async ({ page }) => {
    await scrollAndOpenSelect(page, 500)
    const preClose = await page.evaluate(() => window.scrollY)

    const item = page.getByTestId('rs-select-apple')
    await item.click()
    await page.waitForTimeout(300)

    const viewport = page.getByTestId('rs-select-viewport')
    await expect(viewport).not.toBeVisible()

    const postClose = await page.evaluate(() => window.scrollY)
    expect(Math.abs(postClose - preClose)).toBeLessThanOrEqual(2)
  })

  test('preserved when closing by pressing Escape', async ({ page }) => {
    await scrollAndOpenSelect(page, 500)
    const preClose = await page.evaluate(() => window.scrollY)

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const viewport = page.getByTestId('rs-select-viewport')
    await expect(viewport).not.toBeVisible()

    const postClose = await page.evaluate(() => window.scrollY)
    expect(Math.abs(postClose - preClose)).toBeLessThanOrEqual(2)
  })

  test('preserved when closing by clicking outside', async ({ page }) => {
    await scrollAndOpenSelect(page, 500)
    const preClose = await page.evaluate(() => window.scrollY)

    // click far from the select content to dismiss
    await page.mouse.click(10, 10)
    await page.waitForTimeout(300)

    const viewport = page.getByTestId('rs-select-viewport')
    await expect(viewport).not.toBeVisible({ timeout: 5000 })

    const postClose = await page.evaluate(() => window.scrollY)
    expect(Math.abs(postClose - preClose)).toBeLessThanOrEqual(2)
  })
})

// --- negative: things that should NOT happen ---

test.describe('scroll lock prevents body scroll while open', () => {
  test('overflow:hidden applied to html while Select is open', async ({ page }) => {
    await scrollAndOpenSelect(page, 300)

    const htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('hidden')

    // close and verify released
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const afterOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(afterOverflow).not.toBe('hidden')
  })
})

test.describe('edge cases', () => {
  test('no scroll jump when scrollY is 0', async ({ page }) => {
    // already at top
    await scrollAndOpenSelect(page, 0)

    const item = page.getByTestId('rs-select-banana')
    await item.click()
    await page.waitForTimeout(300)

    const postClose = await page.evaluate(() => window.scrollY)
    // should still be at 0, no negative jump or weird offset
    expect(postClose).toBe(0)
  })

  test('scroll position stable across multiple open/close cycles', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(100)

    for (let i = 0; i < 3; i++) {
      const trigger = page.getByTestId('rs-select-trigger')
      await trigger.scrollIntoViewIfNeeded()
      await trigger.click()

      const viewport = page.getByTestId('rs-select-viewport')
      await expect(viewport).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(200)

      await page.keyboard.press('Escape')
      await page.waitForTimeout(300)
      await expect(viewport).not.toBeVisible()
    }

    const finalScroll = await page.evaluate(() => window.scrollY)
    expect(Math.abs(finalScroll - 400)).toBeLessThanOrEqual(2)
  })

  test('selecting different items preserves scroll each time', async ({ page }) => {
    const items = ['rs-select-apple', 'rs-select-banana', 'rs-select-orange']

    for (const itemId of items) {
      // re-scroll to target before each iteration
      await page.evaluate(() => window.scrollTo(0, 600))
      await page.waitForTimeout(200)

      const trigger = page.getByTestId('rs-select-trigger')
      // click trigger directly without scrollIntoViewIfNeeded
      await trigger.click()

      const viewport = page.getByTestId('rs-select-viewport')
      await expect(viewport).toBeVisible({ timeout: 5000 })
      await page.waitForTimeout(200)

      // capture scroll position while select is open (scroll is locked here)
      const whileOpen = await page.evaluate(() => window.scrollY)

      const item = page.getByTestId(itemId)
      await item.click()
      await page.waitForTimeout(500)
      await expect(viewport).not.toBeVisible()

      const afterClose = await page.evaluate(() => window.scrollY)
      // scroll should be restored to where it was when the select opened
      expect(Math.abs(afterClose - whileOpen)).toBeLessThanOrEqual(2)
    }
  })
})

// --- mobile/touch device tests (chrome mobile emulation) ---

test.describe('mobile touch device', () => {
  test.use({
    viewport: { width: 390, height: 844 },
    hasTouch: true,
    isMobile: true,
  })

  test('scroll position restored after selecting item on mobile', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 400))
    await page.waitForTimeout(100)

    const trigger = page.getByTestId('rs-select-trigger')
    await trigger.scrollIntoViewIfNeeded()
    const preOpen = await page.evaluate(() => window.scrollY)
    await trigger.click()

    const viewport = page.getByTestId('rs-select-viewport')
    await expect(viewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(200)

    const item = page.getByTestId('rs-select-apple')
    await item.click()
    await page.waitForTimeout(300)
    await expect(viewport).not.toBeVisible()

    const postClose = await page.evaluate(() => window.scrollY)
    expect(Math.abs(postClose - preOpen)).toBeLessThanOrEqual(2)
  })

  test('scroll lock active on mobile while Select open', async ({ page }) => {
    await page.evaluate(() => window.scrollTo(0, 300))
    await page.waitForTimeout(100)

    const trigger = page.getByTestId('rs-select-trigger')
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()

    const viewport = page.getByTestId('rs-select-viewport')
    await expect(viewport).toBeVisible({ timeout: 5000 })
    await page.waitForTimeout(200)

    const htmlOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(htmlOverflow).toBe('hidden')

    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)

    const afterOverflow = await page.evaluate(
      () => getComputedStyle(document.documentElement).overflow
    )
    expect(afterOverflow).not.toBe('hidden')
  })
})
