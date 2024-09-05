import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusVisibleButtonWithFocusStyle', type: 'useCase' })
})

test(`button + focusVisibleStyle + focusVisible`, async ({ page }) => {
  const button = page.locator('#focus-visible-button')

  const beforeFocusStyles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(beforeFocusStyles.borderWidth).toBe(`1px`)

  await page.keyboard.press('Tab')

  const stylesAfterKeyboardFocus = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(stylesAfterKeyboardFocus.borderWidth).toBe(`3px`)

  await button.blur()

  const box = await button.boundingBox()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await page.mouse.down({
    button: 'left',
    clickCount: 1,
  })
  await page.mouse.up()

  const stylesAfterMouseFocus = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(stylesAfterMouseFocus.borderWidth).toBe(`2px`)
})
