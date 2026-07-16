import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SheetSkin', type: 'useCase' })
})

test('uses the copied skin with the public Sheet root and parts', async ({ page }) => {
  await page.getByTestId('sheet-skin-open').click()

  await expect(page.getByTestId('sheet-skin-overlay')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-handle')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-container')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-background')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-scroll-view')).toBeVisible()
  await expect(page.getByTestId('sheet-skin-title')).toHaveText(
    'Public behavior, copied aesthetics'
  )
})

test('applies app-owned surface, handle, overlay, and spacing aesthetics', async ({
  page,
}) => {
  await page.getByTestId('sheet-skin-open').click()

  await expect(page.getByTestId('sheet-skin-overlay')).toHaveCSS('opacity', '0.45')
  await expect(page.getByTestId('sheet-skin-handle')).toHaveCSS('height', '10px')
  await expect(page.getByTestId('sheet-skin-container')).toHaveCSS('padding-top', '24px')
  await expect(page.getByTestId('sheet-skin-background')).toHaveCSS(
    'border-top-left-radius',
    '16px'
  )
})

test('preserves close behavior through the copied parts', async ({ page }) => {
  const container = page.getByTestId('sheet-skin-container')

  await page.getByTestId('sheet-skin-open').click()
  await expect(container).toHaveAttribute('data-state', 'open')
  await page.getByTestId('sheet-skin-close').click()

  await expect(container).toHaveAttribute('data-state', 'closed')
  await expect(page.getByTestId('sheet-skin-overlay')).toHaveCount(0)
})
