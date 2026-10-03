import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledCheckboxTheme', type: 'useCase' })
})

const bg = (page: import('@playwright/test').Page, testid: string) =>
  page
    .locator(`[data-testid="${testid}"]`)
    .evaluate((el) => getComputedStyle(el).backgroundColor)

test(`theme passes through createStyledHOC`, async ({ page }) => {
  // green theme base background, v6 light_green `background` = #dcfce7
  expect(await bg(page, 'unchecked')).toBe(`rgb(220, 252, 231)`)
})

test(`checked swaps the frame onto the brand theme`, async ({ page }) => {
  // activeTheme: 'brand' outranks the caller's theme, and brand is the
  // high-contrast flip of whatever it sits on
  const checked = await bg(page, 'checked')
  expect(checked).toBe(await bg(page, 'brand-reference'))
  expect(checked).not.toBe(await bg(page, 'unchecked'))
})
