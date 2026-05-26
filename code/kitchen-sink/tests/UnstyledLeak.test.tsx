import { expect, test, type Page } from '@playwright/test'

import { setupPage } from './test-utils'

// regression test: when a styled() over a HOC like Menu.Item declares
// `unstyled: true` in its config, the `unstyled` prop must not leak to the
// underlying host DOM element. soot's `src/interface/menu/constants.ts`
// commented "(unstyled prop is broken)" and worked around it by silencing
// the react-dom warning globally.

function trackUnstyledWarnings(page: Page) {
  const warnings: string[] = []
  page.on('console', (msg) => {
    const text = msg.text()
    if (
      msg.type() !== 'log' &&
      /non-boolean attribute|unstyled/i.test(text)
    ) {
      warnings.push(`[${msg.type()}] ${text}`)
    }
  })
  page.on('pageerror', (err) => {
    warnings.push(`[pageerror] ${err.message}`)
  })
  return warnings
}

test('styled(Menu.Item, { unstyled }) does not leak unstyled to the DOM', async ({
  page,
}) => {
  const warnings = trackUnstyledWarnings(page)
  await setupPage(page, { name: 'UnstyledLeakCase', type: 'useCase' })

  await page.locator('[data-testid="leak-menu-trigger"]').click()
  await page
    .locator('[data-testid="leak-menu-content"]')
    .waitFor({ state: 'visible' })

  await page.waitForTimeout(150)

  const menuItem1 = page.locator('[data-testid="leak-menu-item-1"]')
  await expect(menuItem1).toBeVisible()
  const itemAttrUnstyled = await menuItem1.evaluate((el) =>
    el.getAttribute('unstyled')
  )
  expect(itemAttrUnstyled).toBeNull()

  expect(warnings, `unexpected unstyled warnings (menu styled):\n${warnings.join('\n')}`).toEqual(
    []
  )
})

test('styled(Popover.Content, { unstyled }) does not leak unstyled to the DOM', async ({
  page,
}) => {
  const warnings = trackUnstyledWarnings(page)
  await setupPage(page, { name: 'UnstyledLeakCase', type: 'useCase' })

  await page.locator('[data-testid="leak-popover-trigger"]').click()
  await page
    .locator('[data-testid="leak-popover-content"]')
    .waitFor({ state: 'visible' })

  await page.waitForTimeout(150)

  const popoverContent = page.locator('[data-testid="leak-popover-content"]')
  await expect(popoverContent).toBeVisible()
  const popoverAttrUnstyled = await popoverContent.evaluate((el) =>
    el.getAttribute('unstyled')
  )
  expect(popoverAttrUnstyled).toBeNull()

  expect(warnings, `unexpected unstyled warnings:\n${warnings.join('\n')}`).toEqual(
    []
  )
})

test('Popover.Content unstyled={true} (runtime) does not leak unstyled to the DOM', async ({
  page,
}) => {
  const warnings = trackUnstyledWarnings(page)
  await setupPage(page, { name: 'UnstyledLeakCase', type: 'useCase' })

  await page.locator('[data-testid="leak-popover-trigger-2"]').click()
  await page
    .locator('[data-testid="leak-popover-content-2"]')
    .waitFor({ state: 'visible' })

  await page.waitForTimeout(150)

  const popoverContent2 = page.locator('[data-testid="leak-popover-content-2"]')
  await expect(popoverContent2).toBeVisible()
  const popoverAttr2Unstyled = await popoverContent2.evaluate((el) =>
    el.getAttribute('unstyled')
  )
  expect(popoverAttr2Unstyled).toBeNull()

  expect(warnings, `unexpected unstyled warnings:\n${warnings.join('\n')}`).toEqual(
    []
  )
})
