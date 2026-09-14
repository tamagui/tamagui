import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusWithinCase', type: 'useCase' })
})

test('animated focus-within clause applies on focus', async ({ page }) => {
  const input = page.locator('[data-testid="animated-input"]')
  const parent = page.locator('[data-testid="animated-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  // reanimated spring needs more time to settle than motion
  await page.waitForTimeout(1500)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).toBe('rgb(0, 128, 0)')
})

test('animated focus-within clause removes on blur', async ({ page }) => {
  const input = page.locator('[data-testid="animated-input"]')
  const parent = page.locator('[data-testid="animated-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  await page.waitForTimeout(1500)
  await input.blur()
  await page.waitForTimeout(1500)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).not.toBe('rgb(0, 128, 0)')
})

test('animated focus-within clause does not cause React re-render (avoidReRenders)', async ({
  page,
}) => {
  const input = page.locator('[data-testid="animated-input"]')
  const renders = page.locator('[data-testid="animated-renders"]')

  await input.waitFor({ state: 'visible' })
  const before = await renders.textContent()

  await input.focus()
  await page.waitForTimeout(300)
  await input.blur()
  await page.waitForTimeout(300)

  const after = await renders.textContent()
  expect(after).toBe(before)
})
