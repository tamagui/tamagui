import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=ButtonUnstyled')
})

test(`unstyled prop works`, async ({ page }) => {
  const styles = await page.locator('button#unstyled').evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.backgroundColor).toBe(`rgba(0, 0, 0, 0)`)
  expect(styles.padding).toBe(`0px`)
  expect(styles.borderWidth).toBe(`0px`)
})
