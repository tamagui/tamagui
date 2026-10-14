import { expect, test } from '@playwright/test'

test.use({ viewport: { width: 393, height: 852 }, hasTouch: true, isMobile: true })

test('phone home page hydrates the pre-mounted header menu without errors', async ({
  page,
}) => {
  // dev logs "Hydration failed", production throws minified React errors 418/423/425
  const hydrationErrors: string[] = []
  const isHydrationError = (text: string) =>
    /Hydration failed|hydrat.*mismatch|Minified React error #(418|423|425)/i.test(text)
  page.on('pageerror', (error) => {
    if (isHydrationError(error.message)) hydrationErrors.push(error.message)
  })
  page.on('console', (message) => {
    if (message.type() === 'error' && isHydrationError(message.text())) {
      hydrationErrors.push(message.text())
    }
  })

  await page.goto('/', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Open the main menu"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
  expect(hydrationErrors).toEqual([])
})

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

test.describe('wide touch header', () => {
  test.use({ viewport: { width: 844, height: 390 }, deviceScaleFactor: 3 })

  test('Components popover contains visible, reachable links above the sheet breakpoint', async ({
    page,
  }) => {
    await page.goto('/ui/intro')
    const components = page.getByRole('link', { name: 'Components', exact: true }).first()
    await page.waitForFunction(() => {
      const button = document.querySelector('[aria-label="Open the main menu"]')
      return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
    })
    await components.hover()

    const popover = page.getByRole('dialog')
    await expect(popover).toBeVisible()
    await expect
      .poll(async () => (await popover.boundingBox())?.height ?? 0)
      .toBeGreaterThan(200)
    const button = popover.getByRole('link', { name: 'Button', exact: true })
    await button.click()
    await expect(page).toHaveURL(/\/ui\/button$/)
    await expect(page.getByRole('heading', { name: 'Button', exact: true })).toBeVisible()
    await expect(popover).toBeHidden()
  })
})
