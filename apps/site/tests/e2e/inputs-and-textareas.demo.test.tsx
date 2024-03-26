import type { Page } from '@playwright/test'
import { expect, test } from '@playwright/test'

let page: Page

const logs = {
  error: [],
  warn: [],
  log: [],
  info: [],
}

const skipLogs = [
  'Failed to load resource: the server responded with a status of 401 (Unauthorized)',
]

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()

  page.on('console', (message) => {
    const text = message.text()
    if (
      skipLogs.some((value) => {
        return text.includes(value)
      })
    )
      return

    logs[message.type()] ||= []
    logs[message.type()].push(text)
  })

  await page.goto('/docs/components/inputs')
  await page.waitForSelector('#demo')
})

test(`Loads screen with no errors or logs`, async () => {
  expect(logs.error).toEqual([])
  expect(logs.warn).toEqual([])
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
