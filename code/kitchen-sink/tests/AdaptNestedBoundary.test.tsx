import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * A component adapts on its own <Adapt />, never on one belonging to an
 * adapting component nested inside its content.
 *
 * The Dialog here has no Adapt. The Popover inside its content has one, and a
 * parent that searches its whole child element tree finds it: the Dialog then
 * thinks it is adapted, publishes its content into a slot nothing renders, and
 * the dialog disappears.
 */
test.describe('Adapt nested boundary', () => {
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'AdaptNestedBoundaryCase',
      type: 'useCase',
    })
  })

  test('a nested Popover Adapt does not adapt the Dialog around it', async ({ page }) => {
    await page.getByTestId('open-dialog').click()

    // the dialog stays a dialog
    await expect(page.getByTestId('dialog-content-marker')).toBeVisible()

    // and the popover still adapts to its sheet
    await page.getByTestId('open-popover').click()

    await expect
      .poll(
        async () =>
          page.evaluate(() =>
            document
              .querySelector('[data-testid="sheet-frame"][data-state]')
              ?.getAttribute('data-state')
          ),
        { timeout: 5000 }
      )
      .toBe('open')

    await expect(page.getByTestId('popover-content-marker')).toBeVisible()
  })
})
