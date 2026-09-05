import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'UseTheme', type: 'useCase' })
})

test(`useTheme() returns right values`, async ({ page }) => {
  expect(await page.locator('#theme-get').innerText()).toBe(`var(--background)`)
  // `.val` is the value as authored in the palette, passed through untouched.
  expect(await page.locator('#theme-val').innerText()).toBe(`#ffffff`)
  expect(await page.locator('#token-get').innerText()).toBe(`var(--color1)`)
  expect(await page.locator('#token-val').innerText()).toBe(`#f9fafb`)
})
