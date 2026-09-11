import { expect, test } from '@playwright/test'

// build → serve → interact. the installed Button must render and respond to a
// real click by incrementing the counter it drives via onPress.
test('installed Button renders and responds to press', async ({ page }) => {
  await page.goto('/')
  const button = page.locator('#smoke-button')
  await expect(button).toBeVisible()
  await expect(button).toContainText('pressed 0')
  await button.click()
  await expect(button).toContainText('pressed 1')
  await button.click()
  await expect(button).toContainText('pressed 2')
})
