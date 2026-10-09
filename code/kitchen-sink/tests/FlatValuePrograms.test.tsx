import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FlatValueProgramsCase', type: 'useCase' })
})

test('applies the last matching hover clause', async ({ page }) => {
  const background = page.getByTestId('flat-background')

  await expect(background).toHaveCSS('background-color', 'rgb(255, 0, 0)')
  await background.hover()
  await page.waitForTimeout(100)
  await expect(background).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('updates shorthand padding at the max-sm breakpoint', async ({ page }) => {
  const padding = page.getByTestId('flat-padding')

  await expect(padding).toHaveCSS('padding-top', '16px')
  await expect(padding).toHaveCSS('padding-right', '16px')
  await expect(padding).toHaveCSS('padding-bottom', '16px')
  await expect(padding).toHaveCSS('padding-left', '16px')

  await page.setViewportSize({ width: 600, height: 800 })
  await page.waitForTimeout(100)

  await expect(padding).toHaveCSS('padding-top', '24px')
  await expect(padding).toHaveCSS('padding-right', '24px')
  await expect(padding).toHaveCSS('padding-bottom', '24px')
  await expect(padding).toHaveCSS('padding-left', '24px')
})

test('matches a dark theme clause under a dark theme wrapper', async ({ page }) => {
  await expect(page.getByTestId('flat-theme')).toHaveCSS('color', 'rgb(0, 0, 255)')
})

test('a later plain shorthand restates the base; the hover clause survives', async ({
  page,
}) => {
  // decision 21: the merge unit is the clause — bg="green" restates only the
  // base, the styled hover keeps working
  const merged = page.getByTestId('flat-forward-merge')

  await expect(merged).toHaveCSS('background-color', 'rgb(0, 128, 0)')
  await merged.hover()
  await page.waitForTimeout(100)
  await expect(merged).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('applies opacity base and hover clause values', async ({ page }) => {
  const opacity = page.getByTestId('flat-opacity')

  await expect(opacity).toHaveCSS('opacity', '0.5')
  await opacity.hover()
  await page.waitForTimeout(100)
  await expect(opacity).toHaveCSS('opacity', '1')
})
