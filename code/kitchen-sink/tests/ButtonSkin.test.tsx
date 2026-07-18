import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ButtonSkin', type: 'useCase' })
})

test('uses button behavior without framework aesthetics', async ({ page }) => {
  const button = page.getByTestId('button-skin-default')

  await expect(button).toHaveAttribute('role', 'button')
  await expect(button).toHaveAttribute('tabindex', '0')
  await expect(button).toHaveAttribute('type', 'button')
  await expect(button).toHaveCSS('height', '36px')
  expect(await button.evaluate((element) => element.tagName)).toBe('BUTTON')

  await button.click()
  await expect(page.getByTestId('button-skin-press-count')).toHaveText('presses:1')
})

test('disables press and focus behavior', async ({ page }) => {
  const button = page.getByTestId('button-skin-disabled')

  await expect(button).toBeDisabled()
  await expect(button).toHaveAttribute('aria-disabled', 'true')
  await expect(button).toHaveAttribute('tabindex', '-1')

  await button.evaluate((element) => {
    ;(element as HTMLElement).click()
    element.focus()
  })

  await expect(button).not.toBeFocused()
  await expect(page.getByTestId('button-skin-press-count')).toHaveText('presses:0')
})

test('nested button is a non-interactive presentation part', async ({ page }) => {
  const outer = page.getByTestId('button-skin-nested-outer')
  const inner = page.getByTestId('button-skin-nested-inner')

  // outer stays a real control
  expect(await outer.evaluate((element) => element.tagName)).toBe('BUTTON')
  await expect(outer).toHaveAttribute('role', 'button')

  // inner is presentational: a span, no button role, and not a tab stop
  expect(await inner.evaluate((element) => element.tagName)).toBe('SPAN')
  await expect(inner).not.toHaveAttribute('role', 'button')
  const innerTabIndex = await inner.getAttribute('tabindex')
  expect(innerTabIndex === null || innerTabIndex === '-1').toBe(true)

  // keyboard: tab order skips the inner presentation element
  await page.getByTestId('button-skin-nested-before').focus()
  await page.keyboard.press('Tab')
  expect(
    await page.evaluate(() => document.activeElement?.getAttribute('data-testid'))
  ).toBe('button-skin-nested-outer')
  await page.keyboard.press('Tab')
  expect(
    await page.evaluate(() => document.activeElement?.getAttribute('data-testid'))
  ).toBe('button-skin-nested-after')

  // clicking the inner element does not fire its own (stripped) handler and
  // does not register as a second control - activation goes to the one button
  await inner.click()
  await expect(page.getByTestId('button-skin-nested-inner-presses')).toHaveText('inner:0')
  await expect(page.getByTestId('button-skin-nested-outer-presses')).toHaveText('outer:1')

  // outer still activates via keyboard (it remains a real control)
  await outer.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByTestId('button-skin-nested-outer-presses')).toHaveText('outer:2')
})

test('plumbs leading and trailing icons around wrapped text', async ({ page }) => {
  const leading = page.getByTestId('button-skin-leading')
  const trailing = page.getByTestId('button-skin-trailing')

  const leadingOrder = await leading.evaluate((element) => {
    return Array.from(element.children).map((child) => {
      return child.getAttribute('data-testid') ?? child.textContent
    })
  })
  const trailingOrder = await trailing.evaluate((element) => {
    return Array.from(element.children).map((child) => {
      return child.getAttribute('data-testid') ?? child.textContent
    })
  })

  expect(leadingOrder).toEqual(['button-skin-leading-icon', 'Leading icon'])
  expect(trailingOrder).toEqual(['Trailing icon', 'button-skin-trailing-icon'])
  await expect(page.getByTestId('button-skin-leading-icon')).toHaveCSS('width', '16px')
  await expect(page.getByText('Wrapped string text')).toHaveCSS('font-size', '15px')
  await expect(page.getByTestId('button-skin-explicit-text')).toHaveText(
    'Explicit text part'
  )
})

test('applies circular and custom named sizes from the copied skin', async ({ page }) => {
  const circular = page.getByTestId('button-skin-circular')
  const wide = page.getByTestId('button-skin-wide')

  await expect(circular).toHaveCSS('height', '44px')
  await expect(circular).toHaveCSS('width', '44px')
  await expect(page.getByTestId('button-skin-circle-icon')).toHaveCSS('width', '20px')
  await expect(wide).toHaveCSS('height', '44px')
  await expect(wide).toHaveCSS('min-width', '180px')
})
