import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: "StyledInputFocusStyle", type: "useCase" })
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
