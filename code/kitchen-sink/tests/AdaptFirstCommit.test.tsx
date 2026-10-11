import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * An adapted Select must resolve Adapt activation on its first commit.
 *
 * When AdaptParent learned when/platform from the Adapt child's layout effect,
 * SelectInner rendered SelectInlineImpl first and SelectSheetImpl one commit
 * later, remounting everything the user nested in the Select. The probe inside
 * the Select counts its own mounts, so an adapted Select must report exactly 1.
 */
test.describe('Adapt first-commit activation', () => {
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'AdaptFirstCommitCase',
      type: 'useCase',
    })
  })

  test('the adapted Select subtree mounts once', async ({ page }) => {
    const count = page.getByTestId('impl-mount-count')

    await expect(page.getByTestId('open-select')).toBeVisible()
    await expect(count).toHaveText('1')

    await page.getByTestId('open-select').click()

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

    await expect(page.getByTestId('select-content-marker')).toBeAttached()
    await expect(count).toHaveText('1')
  })
})
