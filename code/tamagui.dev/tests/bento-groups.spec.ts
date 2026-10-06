import { expect, test } from '@playwright/test'
import { bentoGroups } from '@tamagui/bento/registry'

// every bento group page renders its demos with no errors and no sideways
// scrolling, in both themes at desktop and phone widths. run against a site
// server: BASE_URL=http://localhost:8099 npx playwright test bento-groups
for (const { section, group, name, demos } of bentoGroups) {
  for (const scheme of ['light', 'dark'] as const) {
    for (const width of [1280, 360]) {
      test(`bento ${section}/${group} renders clean in ${scheme} at ${width}`, async ({
        browser,
      }) => {
        const context = await browser.newContext({
          viewport: { width, height: 900 },
          colorScheme: scheme,
        })
        const page = await context.newPage()
        const errors: string[] = []
        page.on('pageerror', (error) => errors.push(`pageerror: ${error.message}`))
        page.on('console', (message) => {
          if (message.type() === 'error') {
            errors.push(`console: ${message.text().slice(0, 300)}`)
          }
        })

        await page.goto(`/bento/${section}/${group}`, {
          waitUntil: 'domcontentloaded',
        })

        // the page actually rendered in the requested theme
        await expect(page.locator('html')).toHaveClass(new RegExp(`t_${scheme}`), {
          timeout: 30_000,
        })

        // every registry demo made it onto the page
        const frames = page.locator('[data-bento-demo]')
        await expect(frames).toHaveCount(demos.length, { timeout: 30_000 })
        for (const demo of demos) {
          await expect(
            frames.filter({ has: page.getByRole('heading', { name: demo.title }) })
          ).toHaveCount(1)
        }

        // the breadcrumb names the group, not its url slug
        await expect(
          page
            .getByRole('navigation', { name: 'Breadcrumb' })
            .locator('a')
            .filter({ hasText: new RegExp(`^${name}$`) })
        ).toBeVisible()

        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - window.innerWidth
        )
        expect(overflow, 'horizontal overflow px').toBeLessThanOrEqual(1)
        expect(errors, 'console/page errors').toEqual([])

        await context.close()
      })
    }
  }
}
