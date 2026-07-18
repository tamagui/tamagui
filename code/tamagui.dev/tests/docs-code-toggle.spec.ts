import { expect, test } from '@playwright/test'

// verifies the docs 3-mode code toggle (styled | unstyled | tailwind) and its
// integration with the existing tailwind syntax switcher (cookie + ?syntax=
// param + route). run against the served prod site (bun run serve, :8081).
//
// note: the unstyled code-fence transform lands with W4's @tamagui/ui pilots, so
// unstyled currently shares the styled source. these tests assert the toggle
// MECHANISM (options, active state, cookie, url) for all three modes, and the
// real content transform only for tailwind (which is landed).

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

    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-tailwind').click()

    await page.waitForURL(/syntax=tailwind/)
    await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')

    // the tailwind transform rewrites the tsx fences, so the code must change
    expect(await codeText(page)).not.toEqual(styled)

    const cookie = (await context.cookies()).find((c) => c.name === 'tamaguiSyntax')
    expect(cookie?.value).toBe('tailwind')
  })

  test('?syntax=tailwind renders tailwind directly (switcher integration)', async ({
    page,
  }) => {
    await page.goto(`${PAGE}?syntax=tailwind`)
    await expect(page.getByTestId('docs-syntax')).toContainText('Tailwind')
  })

  test('selecting Unstyled sets url + cookie', async ({ page, context }) => {
    await page.goto(PAGE)
    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-unstyled').click()

    await page.waitForURL(/syntax=unstyled/)
    await expect(page.getByTestId('docs-syntax')).toContainText('Unstyled')

    const cookie = (await context.cookies()).find((c) => c.name === 'tamaguiSyntax')
    expect(cookie?.value).toBe('unstyled')
  })

  test('switching back to Styled clears the sticky mode', async ({ page }) => {
    await page.goto(`${PAGE}?syntax=tailwind`)
    await page.getByTestId('docs-syntax').click()
    await page.getByTestId('docs-syntax-styled').click()

    await expect(page.getByTestId('docs-syntax')).toContainText('Styled')
    await expect(page).not.toHaveURL(/syntax=(tailwind|unstyled)/)
  })
})
