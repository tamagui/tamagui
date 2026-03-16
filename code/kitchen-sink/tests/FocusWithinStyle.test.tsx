import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusWithinCase', type: 'useCase' })
})

test('focusWithinStyle applies via direct prop', async ({ page }) => {
  const input = page.locator('[data-testid="direct-input"]')
  const parent = page.locator('[data-testid="direct-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  await page.waitForTimeout(100)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).toBe('rgb(255, 0, 0)')
})

test('focusWithinStyle applies via styled() component', async ({ page }) => {
  const input = page.locator('[data-testid="styled-input"]')
  const parent = page.locator('[data-testid="styled-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  await page.waitForTimeout(100)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).toBe('rgb(0, 0, 255)')
})

test('focusWithinStyle removes on blur', async ({ page }) => {
  const input = page.locator('[data-testid="direct-input"]')
  const parent = page.locator('[data-testid="direct-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  await page.waitForTimeout(100)
  await input.blur()
  await page.waitForTimeout(100)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).not.toBe('rgb(255, 0, 0)')
})

test('plain focusWithinStyle does not re-render parent', async ({ page }) => {
  const input = page.locator('[data-testid="direct-input"]')
  const renders = page.locator('[data-testid="direct-renders"]')

  await input.waitFor({ state: 'visible' })
  const before = await renders.textContent()

  await input.focus()
  await page.waitForTimeout(200)
  await input.blur()
  await page.waitForTimeout(200)

  const after = await renders.textContent()
  expect(after).toBe(before)
})
