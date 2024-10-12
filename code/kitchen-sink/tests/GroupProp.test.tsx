import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

let page: Page

test.beforeAll(async ({ browser }) => {
  page = await browser.newPage()
  await setupPage(page, { name: 'GroupProp', type: 'useCase' })
})

test.afterAll(async () => {
  await page.close()
})

test(`group prop - styled()`, async () => {
  const styles = await getStyles(page.locator('#styled').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`group prop - styled() + media unmatched`, async () => {
  const styles = await getStyles(page.locator('#styled-media-unmatched').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`group prop - styled() + media matched`, async () => {
  const styles = await getStyles(page.locator('#styled-media-matched').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 255, 0)`)
})

test(`group prop - inline`, async () => {
  const styles = await getStyles(page.locator('#inline').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 0, 255)`)
})
