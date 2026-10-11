import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true })

test('phone header menu opens as a sheet and closes on navigation', async ({ page }) => {
  await page.goto('/')
  const menu = page.getByRole('button', { name: 'Open the main menu', exact: true })
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Open the main menu"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
  await menu.click()

  const background = page.locator('[data-sheet-background]')
  await expect(background).toBeVisible()
  await expect(page.getByRole('dialog')).toHaveCount(0)
  await expect
    .poll(async () => (await background.boundingBox())?.y ?? Infinity)
    .toBeLessThan(200)
  const frame = await background.locator('..').boundingBox()
  expect(frame?.x).toBe(0)
  expect(frame?.width).toBe(393)

  await page
    .getByLabel('Home menu contents')
    .getByRole('link', { name: 'Core', exact: true })
    .click()
  await expect(page).toHaveURL(/\/docs\/intro\/introduction$/)
  await expect(
    page.getByRole('heading', { name: 'Introduction', exact: true })
  ).toBeVisible()
  await expect(page.getByRole('link', { name: 'Sponsor', exact: true })).toBeHidden()
  await menu.click()
  await expect(page.getByRole('link', { name: 'Sponsor', exact: true })).toBeVisible()
})
