import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * The program block cascade, in whichever browser the project selects.
 *
 * The encoding gives every clause of a program the same specificity — `:where()`
 * around each condition — so the cascade reduces to source order and the last
 * matching clause wins. That is a browser behaviour, and it was only ever
 * checked in Chromium, so this file is also run by the `webkit-programs`
 * project.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ProgramCascadeCase', type: 'useCase' })
})

const settle = (page: any) => page.waitForTimeout(120)

test('a theme and state chain resolves to the last matching clause', async ({ page }) => {
  const light = page.getByTestId('chain-light')
  const dark = page.getByTestId('chain-dark')

  // light: the base is the only match, then hover is the last match
  await expect(light).toHaveCSS('background-color', 'rgb(255, 0, 0)')
  await light.hover()
  await settle(page)
  await expect(light).toHaveCSS('background-color', 'rgb(0, 255, 0)')

  // dark: the theme clause is authored after the hover clause, so it beats the
  // base, and dark+hover is authored last so it beats both
  await expect(dark).toHaveCSS('background-color', 'rgb(128, 128, 128)')
  await dark.hover()
  await settle(page)
  await expect(dark).toHaveCSS('background-color', 'rgb(0, 0, 255)')
})

test('a media clause wins where it matches and the base wins elsewhere', async ({
  page,
}) => {
  const element = page.getByTestId('base-then-media')

  await page.setViewportSize({ width: 1200, height: 800 })
  await settle(page)
  await expect(element).toHaveCSS('background-color', 'rgb(128, 0, 0)')

  await page.setViewportSize({ width: 600, height: 800 })
  await settle(page)
  await expect(element).toHaveCSS('background-color', 'rgb(0, 128, 0)')

  // and back, so this is a live re-resolution rather than a first-paint result
  await page.setViewportSize({ width: 1200, height: 800 })
  await settle(page)
  await expect(element).toHaveCSS('background-color', 'rgb(128, 0, 0)')
})
