import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getPressStyle } from './utils'

// These tests only run with CSS driver
test.beforeEach(async ({ page }, testInfo) => {
  const driver = (testInfo.project?.metadata as any)?.animationDriver
  test.skip(driver !== 'css', `skipping for ${driver} driver`)

  await setupPage(page, { name: 'StyledButtonVariantPseudoMerge', type: 'useCase' })
})

test(`pseudo + variant with pseudo should merge`, async ({ page }) => {
  const button = page.locator('button#test')
  const pressStyles = await getPressStyle(button, { delay: 3000 })
  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  // CSS driver uses individual scale property instead of transform matrix
  expect(pressStyles.scale).toBe(`0.5`)
})

test(`animation + pseudo + variant with pseudo should merge`, async ({ page }) => {
  const button = page.locator('#animated')
  const pressStyles = await getPressStyle(button, { delay: 3000 })
  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  // CSS driver uses individual scale property instead of transform matrix
  expect(pressStyles.scale).toBe(`0.5`)
})

test(`styled without variants HOC of HOC + pseudo`, async ({ page }) => {
  const button = page.locator('#double-styled')
  const pressStyles = await getPressStyle(button, { delay: 3000 })
  expect(pressStyles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  // CSS driver uses individual scale property instead of transform matrix
  expect(pressStyles.scale).toBe(`0.5`)
})
