import { expect, test } from '@playwright/test'

// run against the served site to exercise static syntax content and navigation.

const PAGE = '/docs/guides/how-to-upgrade'

async function waitForDocsHydration(page: import('@playwright/test').Page) {
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Copy code to clipboard"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
}

for (const syntax of ['tailwind', 'unstyled']) {
  test(`${syntax} docs navigate between pages without reloading the document`, async ({
    page,
  }) => {
    const errors: string[] = []
    page.on('pageerror', (error) => errors.push(error.message))
    await page.goto(`/${syntax}/intro/introduction`)
    await expect(page.getByTestId('docs-syntax')).toBeVisible()
    await page.evaluate(() => {
      ;(window as any).__docsNavigationMarker = true
    })
    const next = page.getByRole('link', { name: '@tamagui/core', exact: true })
    await expect(next).toHaveAttribute('href', `/${syntax}/core/configuration`)
    await next.click()
    await expect(page).toHaveURL(new RegExp(`/${syntax}/core/configuration$`))
    await expect(
      page.getByRole('heading', { name: 'Configuration', exact: true })
    ).toBeVisible()
    expect(await page.evaluate(() => (window as any).__docsNavigationMarker)).toBe(true)
    expect(errors).toEqual([])
  })
}

async function codeText(page: import('@playwright/test').Page) {
  return (await page.locator('pre').allInnerTexts()).join('\n---\n')
}

test.describe('docs 3-mode code toggle', () => {
  test('styled is the default and the toggle offers all three modes', async ({
    page,
  }) => {
    await page.goto(PAGE)
    const trigger = page.getByTestId('docs-syntax')
    await expect(trigger).toBeVisible()
    await expect(trigger).toContainText('Styled')

    await trigger.click()
    await expect(page.getByTestId('docs-syntax-styled')).toBeVisible()
    await expect(page.getByTestId('docs-syntax-unstyled')).toBeVisible()
    await expect(page.getByTestId('docs-syntax-tailwind')).toBeVisible()
  })

  test('selecting Tailwind transforms the code and navigates to its syntax route', async ({
    page,
  }) => {
    await page.goto(PAGE)
    const styled = await codeText(page)
    expect(styled).toContain('tamagui/button')
    expect(styled).toContain('tamagui/toast')

    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-tailwind').click()

    await page.waitForURL(/\/tailwind\/guides\/how-to-upgrade/)
    await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')

    // the tailwind transform rewrites the tsx fences, so the code must change
    expect(await codeText(page)).not.toEqual(styled)
  })

  test('the static tailwind route renders tailwind directly', async ({ page }) => {
    await page.goto('/tailwind/guides/how-to-upgrade')
    await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')
  })

  test('selecting Unstyled transforms the imports and navigates to its syntax route', async ({
    page,
  }) => {
    await page.goto(PAGE)
    const styled = await codeText(page)

    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-unstyled').click()

    await page.waitForURL(/\/unstyled\/guides\/how-to-upgrade/)
    await expect(page.getByTestId('docs-syntax')).toContainText('Unstyled')

    // the unstyled transform rewrites `from 'tamagui'` to `tamagui/unstyled`,
    // so the code must change and the new subpath must appear
    const unstyled = await codeText(page)
    expect(unstyled).not.toEqual(styled)
    expect(unstyled).toContain('tamagui/unstyled')
    expect(unstyled).not.toContain("from 'tamagui/button'")
    expect(unstyled).not.toContain("from 'tamagui/toast'")
  })

  test('switching back to Styled navigates to the styled route', async ({ page }) => {
    await page.goto('/tailwind/guides/how-to-upgrade')
    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-styled').click()

    await expect(page.getByTestId('docs-syntax')).toContainText('Styled')
    await expect(page).toHaveURL(/\/docs\/guides\/how-to-upgrade$/)
  })
})

// component-doc smoke: all three modes render on real component pages (the task
// asks for Button + one more). asserts each mode's rendered code and the
// unstyled/tailwind transforms actually apply on a component page, not just the
// upgrade guide.
for (const component of ['/ui/button', '/ui/tabs']) {
  test.describe(`docs 3-mode toggle renders on ${component}`, () => {
    test('styled default, then unstyled rewrites the import', async ({ page }) => {
      await page.goto(component)
      await expect(page.getByTestId('docs-syntax')).toContainText('Styled')
      const styled = await codeText(page)
      expect(styled).toContain("'tamagui'")

      await page.getByTestId('docs-syntax').click()
      await page.getByTestId('docs-syntax-unstyled').click()
      await page.waitForURL(new RegExp(`/unstyled-ui/${component.slice(4)}$`))

      const unstyled = await codeText(page)
      expect(unstyled).not.toEqual(styled)
      expect(unstyled).toContain('tamagui/unstyled')
    })

    test('tailwind transforms the code', async ({ page }) => {
      await page.goto(component)
      const styled = await codeText(page)

      await page.getByTestId('docs-syntax').click()
      await page.getByTestId('docs-syntax-tailwind').click()
      await page.waitForURL(new RegExp(`/tailwind-ui/${component.slice(4)}$`))

      await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')
      expect(await codeText(page)).not.toEqual(styled)
    })
  })
}

for (const [source, destination, label] of [
  [
    '/docs/guides/how-to-upgrade?syntax=tailwind',
    '/tailwind/guides/how-to-upgrade',
    'Tailwind',
  ],
  [
    '/tailwind/guides/how-to-upgrade?syntax=styled',
    '/docs/guides/how-to-upgrade',
    'Styled',
  ],
] as const) {
  test(`syntax query resolves before rendering: ${label}`, async ({ page, request }) => {
    const response = await request.get(source, { maxRedirects: 0 })
    expect(response.status()).toBe(307)
    expect(new URL(response.headers().location).pathname).toBe(destination)
    await page.goto(source)
    await expect(page).toHaveURL(new RegExp(`${destination}$`))
    await expect(page.getByTestId('docs-syntax')).toContainText(label)
    const code = await codeText(page)
    expect(code).toContain(label === 'Styled' ? 'tamagui/button' : 'className')
  })
}

test('syntax switching keeps the picker mounted through browser history', async ({
  page,
}) => {
  await page.goto(PAGE)
  for (const syntax of ['unstyled', 'tailwind', 'styled']) {
    await page.getByTestId('docs-syntax').click()
    await page.getByTestId(`docs-syntax-${syntax}`).click()
    await expect(page).toHaveURL(
      new RegExp(`${syntax === 'styled' ? '/docs' : `/${syntax}`}/guides/how-to-upgrade$`)
    )
    await expect(page.getByTestId('docs-syntax')).toBeVisible()
    await expect(page.getByRole('heading', { name: /upgrade/i }).first()).toBeVisible()
  }
  await page.goBack()
  await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')
  await page.goBack()
  await expect(page.getByTestId('docs-syntax')).toContainText('Unstyled')
})

test('installation code controls share one row and copy the selected command', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/docs/intro/installation')
  await expect(page.getByTestId('docs-syntax')).toBeVisible()
  const block = page
    .locator('pre')
    .filter({ has: page.getByRole('tablist', { name: 'package manager' }) })
    .first()
  await expect(block).toBeVisible()
  const copy = block.getByRole('button', { name: 'Copy code to clipboard' })
  await expect(copy).toHaveCount(1)
  const npm = block.getByRole('tab', { name: 'npm', exact: true })
  await npm.click()
  await expect(npm).toHaveAttribute('aria-selected', 'true')
  const tabRect = await npm.boundingBox()
  const copyRect = await copy.boundingBox()
  expect(tabRect).not.toBeNull()
  expect(copyRect).not.toBeNull()
  expect(tabRect!.height).toBe(copyRect!.height)
  expect(tabRect!.y).toBe(copyRect!.y)
  await copy.click()
  const command = await block.locator('code').innerText()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toBe(command)
})

test('conditional code defaults to String and switches without navigating', async ({
  page,
  context,
}) => {
  await context.grantPermissions(['clipboard-read', 'clipboard-write'])
  await page.goto('/docs/intro/styles')
  const syntax = page.getByRole('tablist', { name: 'code syntax' })
  const string = syntax.getByRole('tab', { name: 'String', exact: true })
  const typed = syntax.getByRole('tab', { name: 'Typed', exact: true })
  await expect(string).toHaveAttribute('aria-selected', 'true')
  await waitForDocsHydration(page)

  const block = syntax.locator('xpath=following::*[self::pre][1]')
  await expect(block).toContainText('backgroundColor="red hover:blue')
  await page.evaluate(() => {
    ;(window as any).__codeSyntaxMarker = true
  })

  await typed.click()
  await expect(page).toHaveURL(/\/docs\/intro\/styles\?syntax=typed$/)
  await expect(typed).toHaveAttribute('aria-selected', 'true')
  await expect(block).toContainText('backgroundColor={{')
  expect(await page.evaluate(() => (window as any).__codeSyntaxMarker)).toBe(true)

  await block.hover()
  await block.getByRole('button', { name: 'Copy code to clipboard' }).click()
  await expect
    .poll(() => page.evaluate(() => navigator.clipboard.readText()))
    .toContain('backgroundColor={{')
})

test('a direct Typed URL renders Typed and code controls share the page value', async ({
  page,
  request,
}) => {
  const response = await request.get('/docs/intro/styles?syntax=typed', {
    maxRedirects: 0,
  })
  expect(response.status()).toBe(200)

  await page.goto('/docs/guides/flat-values?syntax=typed')
  const syntax = page.getByRole('tablist', { name: 'code syntax' })
  await expect(syntax).toHaveCount(5)
  const typedTabs = syntax.getByRole('tab', { name: 'Typed', exact: true })
  await expect
    .poll(() =>
      typedTabs.evaluateAll((tabs) => tabs.every((tab) => tab.ariaSelected === 'true'))
    )
    .toBe(true)
  await waitForDocsHydration(page)

  const string = syntax.first().getByRole('tab', { name: 'String', exact: true })
  const typed = syntax.first().getByRole('tab', { name: 'Typed', exact: true })
  await typed.focus()
  await page.keyboard.press('ArrowLeft')
  await expect(string).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(page).toHaveURL(/\/docs\/guides\/flat-values\?syntax=string$/)
  const stringTabs = syntax.getByRole('tab', { name: 'String', exact: true })
  await expect
    .poll(() =>
      stringTabs.evaluateAll((tabs) => tabs.every((tab) => tab.ariaSelected === 'true'))
    )
    .toBe(true)
})

test('Tailwind docs omit the conditional code syntax control', async ({ page }) => {
  await page.goto('/tailwind/guides/flat-values')
  await expect(page.getByRole('tablist', { name: 'code syntax' })).toHaveCount(0)
})

test('a direct docs URL keeps its syntax and content with a saved preference', async ({
  page,
  context,
}) => {
  await context.addCookies([
    {
      name: 'tamaguiSyntax',
      value: 'unstyled',
      url: process.env.BASE_URL || 'http://localhost:8081',
    },
  ])
  await page.goto(PAGE)
  await expect(page.getByTestId('docs-syntax')).toContainText('Styled')
  await expect(page).toHaveURL(new RegExp(`${PAGE}$`))
  expect(await codeText(page)).toContain('tamagui/button')
  await page.getByRole('link', { name: 'Installation', exact: true }).first().click()
  await expect(
    page.getByRole('heading', { name: 'Installation', exact: true }).first()
  ).toBeVisible()
  await expect(page.getByTestId('docs-syntax')).toContainText('Styled')
  await expect(page).toHaveURL(/\/docs\/intro\/installation$/)
})

test('saved dark mode paints docs subthemes correctly before and after hydration', async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 })
  await page.addInitScript(() => localStorage.setItem('vxrn-scheme', 'dark'))
  await page.route('**/*', (route) =>
    route.request().resourceType() === 'script' ? route.abort() : route.continue()
  )
  await page.goto('/unstyled-ui/intro', { waitUntil: 'domcontentloaded' })
  await expect(page.locator('html')).toHaveClass(/t_dark/)
  const button = page.getByRole('button', { name: /Copy-Paste/ })
  await expect(button).toBeVisible()
  await expect(button).toHaveCSS('background-color', 'rgb(23, 53, 40)')
  await expect(page.getByRole('button', { name: 'Search docs' })).toHaveCSS(
    'background-color',
    'rgb(36, 36, 36)'
  )
  await page.evaluate(() =>
    document.documentElement.classList.replace('t_dark', 't_light')
  )
  await expect(button).toHaveCSS('background-color', 'rgb(215, 239, 223)')
  await page.evaluate(() =>
    document.documentElement.classList.replace('t_light', 't_dark')
  )
  await expect(button).toHaveCSS('background-color', 'rgb(23, 53, 40)')

  await page.unroute('**/*')
  await page.reload()
  await expect(page.getByTestId('docs-syntax')).toBeVisible()
  await expect(button).toHaveCSS('background-color', 'rgb(23, 53, 40)')
})
