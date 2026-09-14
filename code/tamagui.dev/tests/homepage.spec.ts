import { expect, test, type Page } from '@playwright/test'

async function hydratedHome(page: Page) {
  await page.goto('/')
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Copy install command"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
}

for (const [name, path, heading, source] of [
  [
    'Get started (docs)',
    '/docs/intro/introduction',
    'Introduction',
    'data/docs/intro/introduction',
  ],
  [
    'Explore the components ↗',
    '/ui/button',
    'Button',
    'data/docs/components/button/3.0.0',
  ],
  [
    'Speaks Tailwind, too ↗',
    '/docs/core/tailwind',
    'Tamagui Tailwind',
    'data/docs/core/tailwind',
  ],
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
    await expect(
      page.getByRole('link', { name: 'Edit this page on GitHub.' })
    ).toHaveAttribute(
      'href',
      `https://github.com/tamagui/tamagui/edit/main/code/tamagui.dev/${source}.mdx`
    )
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

test('homepage reaches HTML primitives through the docs navigation', async ({ page }) => {
  await hydratedHome(page)
  await page.evaluate(() => {
    ;(window as any).__launchNavigationMarker = true
  })
  await page.getByRole('link', { name: 'Get started (docs)', exact: true }).click()
  await expect(
    page.getByRole('heading', { name: 'Introduction', exact: true }).first()
  ).toBeVisible()
  await page.getByRole('button', { name: 'Components', exact: true }).click()
  const link = page.getByRole('link', { name: 'HTML primitives', exact: true })
  await expect(link).toHaveAttribute('href', '/docs/core/html-primitives')
  await link.click()
  await expect(page).toHaveURL(/\/docs\/core\/html-primitives$/)
  await expect(
    page.getByRole('heading', { name: 'HTML primitives', exact: true }).first()
  ).toBeVisible()
  await expect(
    page.getByRole('link', { name: 'Edit this page on GitHub.' })
  ).toHaveAttribute(
    'href',
    'https://github.com/tamagui/tamagui/edit/main/code/tamagui.dev/data/docs/core/html-primitives.mdx'
  )
  expect(await page.evaluate(() => (window as any).__launchNavigationMarker)).toBe(true)
})

for (const hydrated of [false, true]) {
  test(`homepage style tabs work ${hydrated ? 'after hydration' : 'in server HTML'}`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    if (hydrated) {
      await hydratedHome(page)
    } else {
      await page.route('**/*', (route) =>
        route.request().resourceType() === 'script' ? route.abort() : route.continue()
      )
      await page.goto('/', { waitUntil: 'domcontentloaded' })
    }
    const list = page.getByRole('tablist', { name: 'style syntax' })
    const tamagui = list.getByRole('tab', { name: 'tamagui', exact: true })
    const tailwind = list.getByRole('tab', { name: 'tailwind', exact: true })
    const panel = page.getByRole('tabpanel', { name: 'tamagui', exact: true })
    await expect(list).toBeVisible()
    await expect(list).toHaveAttribute('tabindex', '0')
    await expect(tamagui).toHaveAttribute('aria-selected', 'true')
    await expect(tailwind).toHaveAttribute('aria-selected', 'false')
    await expect(tamagui).toHaveAttribute(
      'aria-controls',
      (await panel.getAttribute('id'))!
    )
    await expect(panel).toContainText("from 'tamagui'")
    if (hydrated) {
      await list.focus()
      await expect(tamagui).toBeFocused()
      await page.keyboard.press('ArrowRight')
      await expect(tailwind).toBeFocused()
      await expect(tamagui).toHaveAttribute('tabindex', '-1')
      await page.keyboard.press('Enter')
      await expect(tailwind).toHaveAttribute('aria-selected', 'true')
      await expect(
        page.getByRole('tabpanel', { name: 'tailwind', exact: true })
      ).toContainText('@tamagui/tailwind')
    } else {
      await expect(tamagui).toHaveAttribute('tabindex', '-1')
      await expect(tailwind).toHaveAttribute('tabindex', '-1')
    }
    expect(errors).toEqual([])
  })
}
