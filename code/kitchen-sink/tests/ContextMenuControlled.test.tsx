import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// ContextMenu used to keep its own useState next to the controlled `open` prop:
// the provider (which the trigger reads) and the inner menu could disagree
test.describe('ContextMenu with a controlled open', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'ContextMenuControlledCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('a right click does not open it when the caller pins open to false', async ({
    page,
  }) => {
    const trigger = page.getByTestId('pinned-trigger')
    await trigger.click({ button: 'right' })
    await page.waitForTimeout(300)

    await expect(page.getByTestId('pinned-content')).toBeHidden()
    await expect(trigger).toHaveAttribute('data-state', 'closed')
  })

  test('the caller can open it without a right click', async ({ page }) => {
    const trigger = page.getByTestId('controlled-trigger')
    await expect(trigger).toHaveAttribute('data-state', 'closed')

    await page.getByTestId('open-button').click()
    await page.waitForTimeout(300)

    await expect(page.getByTestId('controlled-content')).toBeVisible()
    await expect(trigger).toHaveAttribute('data-state', 'open')
  })

  test('a right click opens it through onOpenChange', async ({ page }) => {
    const trigger = page.getByTestId('controlled-trigger')
    await trigger.click({ button: 'right' })
    await page.waitForTimeout(300)

    await expect(page.getByTestId('controlled-content')).toBeVisible()
    await expect(trigger).toHaveAttribute('data-state', 'open')
  })
})
