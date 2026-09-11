import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

const cases = [
  { prefix: 'input-ref-plain', tagName: 'INPUT' },
  { prefix: 'input-ref-styled', tagName: 'INPUT' },
  { prefix: 'textarea-ref-plain', tagName: 'TEXTAREA' },
  { prefix: 'textarea-ref-styled', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-callback', tagName: 'INPUT' },
  { prefix: 'textarea-ref-callback', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-double-styled', tagName: 'INPUT' },
  { prefix: 'textarea-ref-double-styled', tagName: 'TEXTAREA' },
  { prefix: 'input-ref-imperative', tagName: 'INPUT' },
  { prefix: 'input-ref-as-child', tagName: 'INPUT' },
] as const

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'InputRefCase', type: 'useCase' })
})

test('Input and TextArea refs resolve to their DOM elements and can focus them', async ({
  page,
}) => {
  for (const refCase of cases) {
    await expect(page.getByTestId(`${refCase.prefix}-tag`)).toHaveText(refCase.tagName)

    await page
      .getByTestId(`${refCase.prefix}-focus`)
      .evaluate((element: HTMLElement) => element.click())
    await expect(page.locator(`#${refCase.prefix}`)).toBeFocused()
  }

  await page.getByTestId('input-ref-dialog-open').click()
  await expect(page.getByTestId('input-ref-dialog-tag')).toHaveText('INPUT')
  await page
    .getByTestId('input-ref-dialog-focus')
    .evaluate((element: HTMLElement) => element.click())
  await expect(page.locator('#input-ref-dialog')).toBeFocused()
  await page.getByTestId('input-ref-dialog-close').click()

  await page.getByTestId('textarea-ref-popover-open').click()
  await expect(page.getByTestId('textarea-ref-popover-tag')).toHaveText('TEXTAREA')
  await page
    .getByTestId('textarea-ref-popover-focus')
    .evaluate((element: HTMLElement) => element.click())
  await expect(page.locator('#textarea-ref-popover')).toBeFocused()

  await expect(page.locator('#textarea-ref-plain')).toHaveAttribute('rows', '5')
  await expect(page.locator('#textarea-ref-styled')).toHaveAttribute('rows', '5')
})
