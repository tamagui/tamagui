import { expect, test } from '@playwright/test'

test.describe('SSR Theme Styles', () => {
  test('$theme-light generates proper CSS classes', async ({ page }) => {
    await page.goto('/ssr-test')

    // wait for render
    const box = page.getByTestId('theme-light-box')
    await expect(box).toBeVisible({ timeout: 15000 })

    // get the HTML after render
    const html = await page.content()

    // should have .t_light scoped CSS rules
    expect(html).toContain('.t_light')

    const boxClasses = await box.getAttribute('class')
    console.log('Box classes:', boxClasses)

    // should have a _light_ prefixed class for the theme-specific style
    expect(boxClasses).toMatch(/_light_/)
  })

  test('no hydration mismatch with JS enabled', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error' && msg.text().includes('Hydration')) {
        errors.push(msg.text())
      }
    })

    await page.goto('/ssr-test')
    await page.waitForTimeout(1000)

    expect(errors).toHaveLength(0)
  })
})
