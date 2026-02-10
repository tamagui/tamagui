import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'CompoundVariantsCase', type: 'useCase' })
})

test.describe('compoundVariants', () => {
  test('applies compound styles when all conditions match', async ({ page }) => {
    const el = page.getByTestId('outline-small')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('border-width', '1px')
  })

  test('later compound overrides earlier for same conditions', async ({ page }) => {
    const el = page.getByTestId('outline-small')
    // second compound for outline+small sets borderColor to purple
    await expect(el).toHaveCSS('border-color', 'rgb(128, 0, 128)')
  })

  test('applies different compound for different variant values', async ({ page }) => {
    const el = page.getByTestId('outline-large')
    await expect(el).toBeVisible()
    await expect(el).toHaveCSS('border-width', '4px')
    await expect(el).toHaveCSS('border-color', 'rgb(0, 128, 0)')
  })

  test('does not apply compound when conditions do not match', async ({ page }) => {
    const el = page.getByTestId('filled-small')
    await expect(el).toBeVisible()
    // filled + small has no compound, should keep filled's blue background
    await expect(el).toHaveCSS('background-color', 'rgb(0, 0, 255)')
  })

  test('matches against defaultVariants', async ({ page }) => {
    const el = page.getByTestId('outline-default-size')
    await expect(el).toBeVisible()
    // size defaults to 'small', so outline+small compound should match
    await expect(el).toHaveCSS('border-width', '1px')
    await expect(el).toHaveCSS('border-color', 'rgb(128, 0, 128)')
  })

  test('boolean variant coercion in compound', async ({ page }) => {
    const el = page.getByTestId('disabled-filled')
    await expect(el).toBeVisible()
    // disabled=true + filled compound sets bg to gray
    await expect(el).toHaveCSS('background-color', 'rgb(128, 128, 128)')
  })

  test('does not match compound when only some conditions match', async ({ page }) => {
    const el = page.getByTestId('disabled-outline')
    await expect(el).toBeVisible()
    // disabled + outline has no compound, but outline + small does
    // should still get outline+small compound (borderWidth:1, borderColor:purple)
    await expect(el).toHaveCSS('border-width', '1px')
    // should have opacity from disabled variant
    await expect(el).toHaveCSS('opacity', '0.5')
  })
})
