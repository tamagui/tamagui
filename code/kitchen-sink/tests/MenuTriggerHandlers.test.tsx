import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// a caller's own event handlers used to be spread over the trigger's composed
// ones, so passing onKeyDown silently disabled Enter/Space/ArrowDown opening
test.describe('Menu.Trigger with caller-supplied handlers', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'MenuTriggerHandlersCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  for (const key of ['Enter', 'Space', 'ArrowDown']) {
    test(`${key} opens the menu when the caller passes onKeyDown`, async ({ page }) => {
      const trigger = page.getByTestId('keydown-trigger')
      await trigger.focus()
      await expect(trigger).toBeFocused()

      await page.keyboard.press(key)
      await page.waitForTimeout(300)

      await expect(page.getByTestId('keydown-content')).toBeVisible()
      // the caller's handler still ran
      await expect(page.getByTestId('keydown-count')).toHaveText('1')
    })
  }

  test('Enter opens the menu with the deprecated onKeydown spelling', async ({
    page,
  }) => {
    const trigger = page.getByTestId('legacy-trigger')
    await trigger.focus()
    await expect(trigger).toBeFocused()

    await page.keyboard.press('Enter')
    await page.waitForTimeout(300)

    await expect(page.getByTestId('legacy-content')).toBeVisible()
    await expect(page.getByTestId('legacy-keydown-count')).toHaveText('1')
  })

  test('press opens the menu when the caller passes onPointerDown', async ({ page }) => {
    const trigger = page.getByTestId('press-trigger')
    await trigger.click()
    await page.waitForTimeout(300)

    await expect(page.getByTestId('press-content')).toBeVisible()
    await expect(page.getByTestId('press-count')).toHaveText('1')
  })
})
