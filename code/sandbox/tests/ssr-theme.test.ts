import { expect, test } from '@playwright/test'

test.describe('SSR Theme Styles', () => {
  test('theme-light generates proper CSS classes', async ({ page }) => {
    await page.goto('/ssr-test')

    // wait for render
    const box = page.getByTestId('theme-light-box')
    await expect(box).toBeVisible({ timeout: 15000 })

    // the theme rule is compile-time extracted; in dev vite injects the CSS
    // client-side after hydration, so wait on the stylesheet instead of racing
    // it by reading page.content() at first paint
    const boxClasses = await box.getAttribute('class')
    expect(boxClasses).toBeTruthy()

    const themeRule = await page.waitForFunction(
      (classes) => {
        for (const sheet of document.styleSheets) {
          try {
            for (const rule of sheet.cssRules) {
              const text = rule.cssText || ''
              const matchesBox = classes.some((name) =>
                text.startsWith(`.${name}:where(.t_light`)
              )
              if (matchesBox && text.includes('box-shadow')) {
                return text
              }
            }
          } catch {}
        }
        return null
      },
      boxClasses!.split(/\s+/),
      { timeout: 15000 }
    )

    // the declaration must survive browser CSS parsing — an unresolved token
    // like "color5" makes the browser drop it, leaving an empty rule
    const ruleText = (await themeRule.jsonValue()) as string
    expect(ruleText).toContain('.t_light')
    expect(ruleText).toContain('box-shadow')

    console.log('Box classes:', boxClasses)
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
