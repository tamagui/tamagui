import { expect, test } from '@playwright/test'

test.describe('SSR Theme Styles', () => {
  test('$theme-light generates proper CSS classes', async ({ page }) => {
    await page.goto('/ssr-test')

    // wait for render
    const box = page.getByTestId('theme-light-box')
    await expect(box).toBeVisible({ timeout: 15000 })

    // the theme rule is compile-time extracted; in dev vite injects the CSS
    // client-side after hydration, so wait on the stylesheet instead of racing
    // it by reading page.content() at first paint
    const themeRule = await page.waitForFunction(
      () => {
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              const text = rule.cssText || ''
              // the extracted theme-scoped boxShadow rule specifically (not the
              // theme variable definitions, which also mention .t_light)
              if (text.includes('.t_light') && text.includes('_bxsh-_light_')) {
                return text
              }
            }
          } catch {}
        }
        return null
      },
      undefined,
      { timeout: 15000 }
    )

    // the declaration must survive browser CSS parsing — an unresolved token
    // like "$color5" makes the browser drop it, leaving an empty rule
    const ruleText = (await themeRule.jsonValue()) as string
    expect(ruleText).toContain('.t_light')
    expect(ruleText).toContain('box-shadow')

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
