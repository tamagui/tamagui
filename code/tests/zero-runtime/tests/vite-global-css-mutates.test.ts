import { expect, test } from '@playwright/test'

/**
 * `TAMAGUI_DOES_SSR_CSS='mutates-themes'` declares runtime theme mutation, so
 * the same source, same entry and same imported artifact must stay on the
 * ordinary tier: no derived TAMAGUI_DID_OUTPUT_CSS and a live runtime generator.
 *
 * This is also the independent variable for the compiled-global-CSS assertions.
 * Without it, "the runtime generated none of it" is a check that could pass on
 * a build where the runtime never runs at all.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/global.html')
  await page.waitForSelector('[data-testid="global-root"]')
})

test('the runtime CSS generator stays live and emits the design system', async ({
  page,
}) => {
  const injected = await page.evaluate(
    () => document.querySelector('style[data-href="tamagui-css"]')?.textContent ?? null
  )
  expect(injected).toContain('.is_View')
  expect(injected).toContain('.t_dark')
  expect(injected).toContain(':root')
})

test('and it still renders correctly', async ({ page }) => {
  await expect(page.locator('[data-testid="global-root"]')).toHaveCSS('display', 'flex')
  await expect(page.locator('[data-testid="global-badge"]')).toHaveCSS('width', '91px')
})
