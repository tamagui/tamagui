import { expect, test } from '@playwright/test'

// verifies the docs 3-mode code toggle (styled | unstyled | tailwind) and its
// integration with the static syntax routes and sticky cookie. run against the
// served prod site (bun run serve, :8081).
//
// these tests assert the toggle MECHANISM (options, active state, cookie, url)
// for all three modes, plus the real content transform for tailwind (rewrites
// tsx fences to className) and unstyled (rewrites `tamagui` imports to the
// `tamagui/unstyled` subpath).

const PAGE = '/docs/guides/how-to-upgrade'

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

  test('selecting Tailwind transforms the code and sets url + cookie', async ({
    page,
    context,
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

    const cookie = (await context.cookies()).find((c) => c.name === 'tamaguiSyntax')
    expect(cookie?.value).toBe('tailwind')
  })

  test('the static tailwind route renders tailwind directly', async ({ page }) => {
    await page.goto('/tailwind/guides/how-to-upgrade')
    await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')
  })

  test('selecting Unstyled transforms the imports and sets url + cookie', async ({
    page,
    context,
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

    const cookie = (await context.cookies()).find((c) => c.name === 'tamaguiSyntax')
    expect(cookie?.value).toBe('unstyled')
  })

  test('switching back to Styled clears the sticky mode', async ({ page }) => {
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
    test('styled default, then unstyled rewrites the import', async ({
      page,
      context,
    }) => {
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

      const cookie = (await context.cookies()).find((c) => c.name === 'tamaguiSyntax')
      expect(cookie?.value).toBe('unstyled')
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
