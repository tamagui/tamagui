import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Menu Theme Inheritance', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuThemeCase', type: 'useCase' })
  })

  test('menu content inherits theme from parent context', async ({ page }) => {
    const trigger = page.getByTestId('menu-trigger')
    await expect(trigger).toBeVisible()

    await trigger.focus()
    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    const menuContent = page.getByTestId('menu-content')
    await expect(menuContent).toBeVisible()

    // check that menu content ancestor has the theme class
    const hasThemeClass = await menuContent.evaluate((el) => {
      let current = el.parentElement
      while (current) {
        if (current.className?.includes('t_blue_active')) {
          return true
        }
        current = current.parentElement
      }
      return false
    })

    expect(hasThemeClass).toBe(true)
  })
})
