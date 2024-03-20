import { test, expect, Page } from '@playwright/test'

let page: Page

const logs = {
  error: [],
  warn: [],
  log: [],
  info: [],
}

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()

  page.on('console', (message) => {
    logs[message.type()] ||= []
    logs[message.type()].push(message.text())
  })

  await page.goto('/docs/components/checkbox')
  await page.waitForSelector('#demo')
})

test(`Loads screen with no errors or logs`, async () => {
  expect(logs.error.length).toBe(0)
  expect(logs.warn.length).toBe(0)
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
