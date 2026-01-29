import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ScrollViewRefCase', type: 'useCase' })
})

test(`ScrollView ref has scrollTo method`, async ({ page }) => {
  const status = page.locator('#status')
  await expect(status).toHaveText('ready')

  await page.click('#scroll-to-btn')
  await expect(status).toHaveText('scrolled-to-200')

  // verify the scroll position changed
  const scrollTop = await page.locator('#test-scrollview').evaluate((el) => el.scrollTop)
  expect(scrollTop).toBe(200)
})

test(`ScrollView ref has scrollToEnd method`, async ({ page }) => {
  const status = page.locator('#status')
  await expect(status).toHaveText('ready')

  await page.click('#scroll-to-end-btn')
  await expect(status).toHaveText('scrolled-to-end')

  // verify it scrolled to the end (scrollTop should be > 0)
  const scrollTop = await page.locator('#test-scrollview').evaluate((el) => el.scrollTop)
  expect(scrollTop).toBeGreaterThan(0)
})

test(`ScrollView ref has getScrollableNode method`, async ({ page }) => {
  const status = page.locator('#status')
  await expect(status).toHaveText('ready')

  await page.click('#get-node-btn')
  await expect(status).toHaveText('got-scrollable-node')
})
