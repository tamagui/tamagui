import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonIconColor', type: 'useCase' })
})

test(`Button icon receives color from theme`, async ({ page }) => {
  const colorText = await page.getByTestId('icon-color-themed').textContent()
  expect(colorText).not.toBe('undefined')
  expect(colorText).toBeTruthy()
})

test(`Button icon receives color with default theme`, async ({ page }) => {
  const colorText = await page.getByTestId('icon-color-default').textContent()
  expect(colorText).not.toBe('undefined')
  expect(colorText).toBeTruthy()
})

test(`ListItem icon receives color from theme`, async ({ page }) => {
  const colorText = await page.getByTestId('listitem-icon-color-themed').textContent()
  expect(colorText).not.toBe('undefined')
  expect(colorText).toBeTruthy()
})

test(`ListItem icon receives color with default theme`, async ({ page }) => {
  const colorText = await page.getByTestId('listitem-icon-color-default').textContent()
  expect(colorText).not.toBe('undefined')
  expect(colorText).toBeTruthy()
})
