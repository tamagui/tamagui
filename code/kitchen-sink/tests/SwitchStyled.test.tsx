import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression test: the styled Switch (SwitchFrame uses render="button") crashed
// when animated ("Failed to set an indexed property [0] on 'CSSStyleDeclaration'")
// because createComponent replaced the animation driver's custom component with
// the raw render tag string, passing a react-native style array to a DOM element

let pageErrors: Error[]

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
  await setupPage(page, { name: 'Switch', type: 'demo' })
})

test('styled Switch demo renders and toggles without errors', async ({ page }) => {
  const switches = page.locator('[role="switch"]')
  await expect(switches.first()).toBeVisible()
  expect(await switches.count()).toBe(6)

  const first = switches.first()
  await expect(first).toHaveAttribute('aria-checked', 'false')
  await first.click()
  await expect(first).toHaveAttribute('aria-checked', 'true')

  expect(pageErrors).toHaveLength(0)
})
