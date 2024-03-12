import { test, expect, Page } from '@playwright/test'

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('/docs/components/checkbox')
  await page.waitForSelector('#demo')
})

test('visually looks correct', async () => {
  expect(await page.locator('#tamagui-demos-container').screenshot()).toMatchSnapshot()
})

// click on the checkbox itself
test('test checkboxs', async () => {
  await expect(page.locator('#checkbox-3')).toHaveAttribute('data-state', 'unchecked')
  await page.click('#checkbox-3')
  await expect(page.locator('#checkbox-3')).toHaveAttribute('data-state', 'checked')

  // checked by default
  await expect(page.locator('#checkbox-4')).toHaveAttribute('data-state', 'checked')
  await page.click('#checkbox-4')
  await expect(page.locator('#checkbox-4')).toHaveAttribute('data-state', 'unchecked')

  // reset
  await page.click('#checkbox-3')
  await page.click('#checkbox-4')
})

test('test labels', async () => {
  await expect(page.locator('#checkbox-3')).toHaveAttribute('data-state', 'unchecked')
  await page.click('label[for="checkbox-3"]')
  await expect(page.locator('#checkbox-3')).toHaveAttribute('data-state', 'checked')

  // default value
  await expect(page.locator('#checkbox-4')).toHaveAttribute('data-state', 'checked')
  await page.click('label[for="checkbox-4"]')
  await expect(page.locator('#checkbox-4')).toHaveAttribute('data-state', 'unchecked')

  // reset
  await page.click('#checkbox-3')
  await page.click('#checkbox-4')
})

test.afterAll(async () => {
  await page.close()
})
