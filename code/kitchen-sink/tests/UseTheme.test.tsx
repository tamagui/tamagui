import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'UseTheme', type: 'useCase' })
})

test(`useTheme() returns right values`, async ({ page }) => {
  expect(await page.locator('#theme-get').innerText()).toBe(`var(--background)`)
  // The shipped v6 theme palette uses rgba values.
  expect(await page.locator('#theme-val').innerText()).toBe(`rgba(255, 255, 255, 1)`)
  expect(await page.locator('#token-get').innerText()).toBe(`var(--blue1)`)
  expect(await page.locator('#token-val').innerText()).toBe(`rgba(251, 253, 255, 1)`)
})
