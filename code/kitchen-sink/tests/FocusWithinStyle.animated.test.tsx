import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusWithinCase', type: 'useCase' })
})

test('animated focusWithinStyle applies on focus', async ({ page }, testInfo) => {
  // native driver uses RN Animated API which can't animate CSS border colors on web
  test.skip(
    testInfo.project.name === 'animated-native',
    'Native driver cannot animate CSS properties on web'
  )
  const input = page.locator('[data-testid="animated-input"]')
  const parent = page.locator('[data-testid="animated-parent"]')

  await input.waitFor({ state: 'visible' })
  await input.focus()
  // reanimated spring needs more time to settle than motion
  await page.waitForTimeout(1500)

  const borderColor = await parent.evaluate((el) => getComputedStyle(el).borderColor)
  expect(borderColor).toBe('rgb(0, 128, 0)')
})

test('animated focusWithinStyle removes on blur', async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-native',
    'Native driver cannot animate CSS properties on web'
  )
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

test('animated focusWithinStyle does not cause React re-render (avoidReRenders)', async ({
  page,
}, testInfo) => {
  // native driver doesn't support avoidReRenders
  test.skip(
    testInfo.project.name === 'animated-native',
    'Native driver does not support avoidReRenders'
  )

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
