import type { Page } from '@playwright/test'
import { test, expect } from '@playwright/test'
import { sleep } from 'zx'

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

  await page.goto('/docs/components/inputs')
  await page.waitForSelector('#demo')
})

test(`Loads screen with no errors or logs`, async () => {
  console.log('my error is ', logs.error[0])
  expect(logs.error.length).toBe(0)
  expect(logs.warn.length).toBe(0)
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
