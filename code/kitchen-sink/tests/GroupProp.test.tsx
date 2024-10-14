import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'GroupProp', type: 'useCase' })
  // In some instances the mouses hovers the style breaking the test
  await page.mouse.move(0, 0)
})

test(`group prop - styled()`, async ({ page }) => {
  const styles = await getStyles(page.locator('#styled').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`group prop - styled() + media unmatched`, async ({ page }) => {
  const styles = await getStyles(page.locator('#styled-media-unmatched').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`group prop - styled() + media matched`, async ({ page }) => {
  const styles = await getStyles(page.locator('#styled-media-matched').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 255, 0)`)
})

test(`group prop - inline`, async ({ page }) => {
  const styles = await getStyles(page.locator('#inline').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 0, 255)`)
})
