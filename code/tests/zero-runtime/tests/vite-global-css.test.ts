import { expect, test } from '@playwright/test'

/**
 * The compiled-global-CSS tier: ordinary compiled Tamagui plus an owned
 * outputCSS artifact. `TAMAGUI_DID_OUTPUT_CSS` is derived from that artifact, so
 * every rule below has to arrive through loaded stylesheets. Nothing here reads
 * the artifact from disk: if JavaScript were still generating these rules the
 * disk assertions would pass while the claim was false.
 */

/** Every rule text the document actually loaded, same-origin sheets only. */
const loadedCSS = async (page: import('@playwright/test').Page) =>
  page.evaluate(() => {
    const parts: string[] = []
    const walk = (rules: CSSRuleList) => {
      for (const rule of rules as unknown as Iterable<CSSRule>) {
        parts.push(rule.cssText)
        const nested = (rule as CSSGroupingRule).cssRules
        if (nested) walk(nested)
      }
    }
    for (const sheet of document.styleSheets) {
      try {
        if (sheet.cssRules) walk(sheet.cssRules)
      } catch {
        // cross origin
      }
    }
    return parts.join('\n')
  })

test.beforeEach(async ({ page }) => {
  await page.goto('/global.html')
  await page.waitForSelector('[data-testid="global-root"]')
})

test('the loaded CSS carries base, root, font, theme and compiler atomic rules', async ({
  page,
}) => {
  const css = await loadedCSS(page)
  // base design-system rules
  expect(css).toContain('.is_View')
  expect(css).toContain('overscroll-behavior')
  // :root variables
  expect(css).toMatch(/:root[^}]*--/)
  // font rules
  expect(css).toContain('.font_body')
  // theme rules
  expect(css).toContain('.t_dark')
  // compiler atomic rules from two different app modules. cssText is the
  // browser's serialization, so the declaration is whitespace-normalized.
  expect(css).toMatch(/\._w-\d+ \{ width: 91px/)
  expect(css).toMatch(/\._w-\d+ \{ width: 83px/)
})

test('the runtime generated none of it: the provider injects no sheet', async ({
  page,
}) => {
  // createDesignSystem, getThemeCSSRules and insertFont are compiled out, so
  // the provider omits its style element; the mutates-themes project asserts
  // the opposite against the same source and same entry.
  const injected = await page.evaluate(
    () => document.querySelector('style[data-href="tamagui-css"]')?.textContent ?? null
  )
  expect(injected).toBeNull()
})

test('it renders correctly with JavaScript CSS generation absent', async ({ page }) => {
  // base rule applied
  const root = page.locator('[data-testid="global-root"]')
  await expect(root).toHaveCSS('display', 'flex')
  await expect(root).toHaveCSS('flex-direction', 'column')

  // compiler atomic rules, from two modules
  await expect(page.locator('[data-testid="global-badge"]')).toHaveCSS('width', '91px')
  await expect(page.locator('[data-testid="global-panel"]')).toHaveCSS('width', '83px')
  await expect(page.locator('[data-testid="global-text"]')).toHaveCSS('font-size', '23px')

  // a :root/theme variable resolved through the artifact
  const light = await page
    .locator('[data-testid="global-text"]')
    .evaluate((node) => getComputedStyle(node).color)
  const dark = await page
    .locator('[data-testid="global-dark-text"]')
    .evaluate((node) => getComputedStyle(node).color)
  expect(light).not.toBe('')
  expect(dark).not.toBe('')
  // the nested dark theme really switched, so theme rules are live
  expect(dark).not.toBe(light)

  // font rules reached the document
  const fontFamily = await page
    .locator('[data-testid="global-font"]')
    .evaluate((node) => getComputedStyle(node).fontFamily)
  expect(fontFamily).not.toBe('')
})
