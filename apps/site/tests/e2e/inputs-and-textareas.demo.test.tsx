import { test, expect, Page } from '@playwright/test'
import { sleep } from 'zx'

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await page.goto('/docs/components/inputs')
  await page.waitForSelector('#demo')
})

test('visually looks correct', async () => {
  expect(await page.locator('#tamagui-demos-container').screenshot({})).toMatchSnapshot()
})

test.afterAll(async () => {
  await page.close()
})

test('inputs and text areas are working fine', async () => {
  const input = page.locator('#demo input').first()
  await input.fill('hello')
  await expect(input).toHaveValue('hello')

  const textArea = page.locator('#demo textarea').first()
  await textArea.fill('hello')
  await expect(textArea).toHaveValue('hello')
})
