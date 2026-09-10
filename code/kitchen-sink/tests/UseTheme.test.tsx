import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'UseTheme', type: 'useCase' })
})

test(`useTheme() returns right values`, async ({ page }) => {
  expect(await page.locator('#theme-get').innerText()).toBe(`var(--background)`)
  // `.val` is the value as authored in the palette, passed through untouched.
  // the light ground sits one rung off pure white: a ground pinned to white
  // leaves `background-hover` nowhere to go and forces it to darken, which
  // reads as the surface receding rather than lifting.
  expect(await page.locator('#theme-val').innerText()).toBe(`#faf9fb`)
  expect(await page.locator('#token-get').innerText()).toBe(`var(--color-1)`)
  expect(await page.locator('#token-val').innerText()).toBe(`#faf9fb`)
})
