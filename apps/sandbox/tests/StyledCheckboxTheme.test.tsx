import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledCheckboxTheme')
})

test(`theme passes through .extractable HOC`, async ({ page }) => {
  const styles = await page.locator('button[role=checkbox]').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.backgroundColor).toBe(`rgb(221, 243, 228)`)
})
