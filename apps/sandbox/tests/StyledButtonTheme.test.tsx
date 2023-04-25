import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledButtonTheme')
})

test(`circular prop works`, async ({ page }) => {
  const styles = await page.locator('#test2').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.backgroundColor).toBe(`rgb(0, 128, 0)`)
})
