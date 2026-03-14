import { expect, test } from '@playwright/test'

test('focusWithinStyle applies style to parent', async ({ page }) => {
  await page.goto('http://localhost:9000/?test=FocusWithinCase')

  const input = page.locator('input')
  const parent = page.locator('[data-testid="parent"]')

  await input.focus()

  const borderColor = await parent.evaluate((el) =>
    getComputedStyle(el).borderColor
  )

  expect(borderColor).toBe('rgb(255, 0, 0)')
})