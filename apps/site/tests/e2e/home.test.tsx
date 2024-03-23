import { expect, test } from '@playwright/test'

test(`Loads home screen with no errors or logs`, async ({ page }) => {
  const logs = {
    error: [],
    warn: [],
    log: [],
    info: [],
  }

  page.on('console', (message) => {
    logs[message.type()] ||= []
    logs[message.type()].push(message.text())
  })

  await page.goto('/')
  expect(logs.error.length).toBe(0)
  expect(logs.warn.length).toBe(0)
})

test(`Loads home screen content properly`, async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('Write less').first()).toBeVisible()
  const menuButton = page.locator(`button[aria-label="Open the main menu"]`).first()
  await expect(menuButton).toBeVisible()
  await menuButton.click()
  await menuButton.hover()
  const menuContents = page.locator(`[aria-label="Home menu contents"]`).last()
  await expect(menuContents).toBeVisible()
})
