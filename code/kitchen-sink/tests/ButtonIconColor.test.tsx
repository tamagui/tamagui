import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonIconColor', type: 'useCase' })
})

test(`button icon receives color from theme`, async ({ page }) => {
  const button = page.getByTestId('button-themed')
  const path = button.locator('svg path').first()
  const stroke = await path.evaluate((el) => getComputedStyle(el).stroke)
  expect(stroke).toBeTruthy()
  expect(stroke).not.toBe('none')
})

test(`listitem icon receives color from theme`, async ({ page }) => {
  const listitem = page.getByTestId('listitem-themed')
  const path = listitem.locator('svg path').first()
  const stroke = await path.evaluate((el) => getComputedStyle(el).stroke)
  expect(stroke).toBeTruthy()
  expect(stroke).not.toBe('none')
})
