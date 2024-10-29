import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'UseTheme', type: 'useCase' })
})

test('useTheme() returns correct values', async ({ page }) => {
  const themeGet = await page.locator('#theme-get').innerText()
  const themeVal = await page.locator('#theme-val').innerText()
  const tokenGet = await page.locator('#token-get').innerText()
  const tokenVal = await page.locator('#token-val').innerText()

  expect(themeGet).toBe('x.background.get():\n"var(--background)"')
  expect(themeVal).toBe('x.background.val:\n#fff')
  expect(tokenGet).toBe('x.blue1.get():\n"var(--blue1)"')
  expect(tokenVal).toBe('x.blue1.val:\nhsl(206, 100%, 99.2%)')
})
