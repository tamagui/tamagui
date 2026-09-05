import { expect, test, type Page } from '@playwright/test'

async function hydratedHome(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Copy install command"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
}

for (const [name, path, heading] of [
  ['Get started (docs)', '/docs/intro/introduction', 'Introduction'],
  ['Explore HTML primitives ↗', '/docs/core/html-primitives', 'HTML primitives'],
  ['Explore the components ↗', '/ui/button', 'Button'],
  ['Speaks Tailwind, too ↗', '/docs/core/tailwind', 'Tamagui Tailwind'],
] as const) {
  test(`homepage navigates to ${path} without a document reload`, async ({ page }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await hydratedHome(page)
    await page.evaluate(() => {
      ;(window as any).__launchNavigationMarker = true
    })
    const link = page.locator('main').getByRole('link', { name, exact: true })
    await expect(link).toHaveAttribute('href', path)
    expect(await link.evaluate((element) => element.tagName)).toBe('A')
    await link.click()
    await expect(page).toHaveURL(new RegExp(`${path}$`))
    await expect(
      page.getByRole('heading', { name: heading, exact: true }).first()
    ).toBeVisible()
    expect(await page.evaluate(() => (window as any).__launchNavigationMarker)).toBe(true)
    expect(errors).toEqual([])
  })
}

test('install command copies from the keyboard and shows one notification', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await hydratedHome(page)
  const copy = page.getByRole('button', { name: 'Copy install command', exact: true })
  await copy.focus()
  await page.keyboard.press('Enter')
  await expect(page.getByRole('button', { name: 'Install command copied' })).toBeVisible()
  expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
    'npm create tamagui@latest'
  )
  await expect(page.getByText('Copied to clipboard', { exact: true })).toHaveCount(1)
})
