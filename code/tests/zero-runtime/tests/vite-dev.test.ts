import { expect, test } from '@playwright/test'

/**
 * Zero-runtime development.
 *
 * Dev runs the same lowering and reference erasure as production, so the runtime
 * that generates design-system, :root, font and theme CSS is gone here too and
 * the dev server has to serve it. Nothing here reads a build artifact: the dev
 * server's `publicDir` is off, so a rule that reaches the page came from this
 * server and not from another integration's published output.
 */

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await page.waitForSelector('[data-testid="zero-root"]')
})

test('the design system reaches the page with no runtime generating it', async ({
  page,
}) => {
  // base rule: without it a View is display:block
  await expect(page.locator('[data-testid="zero-root"]')).toHaveCSS('display', 'flex')
  // a compiler atomic rule from an app module
  await expect(page.locator('[data-testid="zero-card"]')).toHaveCSS(
    'background-color',
    'rgb(29, 78, 216)'
  )
  // a theme variable, which only resolves from the served config CSS
  const themed = await page.evaluate(() => {
    const probe = document.createElement('div')
    probe.className = 't_dark'
    document.body.appendChild(probe)
    const value = getComputedStyle(probe).getPropertyValue('--color').trim()
    probe.remove()
    return value
  })
  expect(themed).not.toBe('')
})

test('the island is built and served by the dev server', async ({ page }) => {
  await page.waitForSelector('[data-testid="island-root"]')
  await page.click('[data-testid="island-open"]')
  const frame = page.locator('[data-testid="island-portal-frame"]')
  await expect(frame).toBeVisible()
  await expect(page.locator('[data-testid="island-unique"]')).toHaveCSS('width', '137px')
})
