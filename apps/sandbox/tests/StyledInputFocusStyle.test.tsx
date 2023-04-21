import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=StyledInputFocusStyle')
})

test(`styled input + focusStyle`, async ({ page }) => {
  const input = page.locator('input')

  await input.focus()

  const styles = await input.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.borderColor).toBe(`rgb(0, 0, 255)`)
  expect(styles.borderWidth).toBe(`10px`)
})
