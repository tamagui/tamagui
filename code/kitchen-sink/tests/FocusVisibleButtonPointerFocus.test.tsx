import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FocusVisibleButtonPointer', type: 'useCase' })
})

test(`button + focusVisibleStyle + non keyboard focus`, async ({ page }) => {
  const button = page.locator('#focus-visible-button')

  const box = await button.boundingBox()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await page.mouse.down({
    button: 'left',
    clickCount: 1,
  })

  const styles = await button.evaluate((el) => {
    return window.getComputedStyle(el)
  })

  expect(styles.borderWidth).toBe(`1px`)
})
