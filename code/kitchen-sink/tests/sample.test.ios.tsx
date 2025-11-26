import { expect, test } from 'vitest'
import { remote } from 'webdriverio'
import { getWebDriverConfig } from '../native-testing'
const sharedTestOptions = { timeout: 10 * 60 * 1000, retry: 3 }

test('basic iOS test', sharedTestOptions, async () => {
  const driver = await remote(await getWebDriverConfig())

  const titleElement = await driver.$(
    '//*[contains(@label, "Kitchen Sink") or contains(@value, "Kitchen Sink") or contains(@name, "Kitchen Sink") or contains(text(), "Kitchen Sink")]'
  )
  await titleElement.waitForDisplayed({ timeout: 20_000 })
  expect((await titleElement.getText()).includes('Kitchen Sink')).toBe(true)
})
