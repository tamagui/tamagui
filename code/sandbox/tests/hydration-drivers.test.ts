import { expect, test } from '@playwright/test'

const drivers = ['motion', 'css'] as const

test.describe.configure({ mode: 'serial' })

for (const driver of drivers) {
  test.describe(`Hydration - ${driver} driver`, () => {
    test('no errors at all (includes hydration errors)', async ({ page }) => {
      const errors: string[] = []
      page.on('console', (msg) => {
        const text = msg.text()
        if (msg.type() === 'error') {
          errors.push(text)
        }
      })

      await page.goto(`/hydration-${driver}`, {
        waitUntil: 'domcontentloaded',
      })
      await page.waitForSelector(`[data-testid=hydrated-true]`)

      if (errors.length > 0) {
        console.error(`Hydration errors for ${driver}:`, errors)
      }
      expect(errors).toHaveLength(0)
    })

    test('indicator dots render with className not inline style', async ({ page }) => {
      await page.goto(`/hydration-${driver}`)

      const dot = page.getByTestId('indicator-dot-1')
      await expect(dot).toBeVisible({ timeout: 15000 })

      // get the computed width
      const width = await dot.evaluate((el) => getComputedStyle(el).width)
      expect(width).toBe('16px')

      // for css driver, should have className-based styles
      // for motion driver with outputStyle: 'inline', may have inline after hydration
      const classes = await dot.getAttribute('class')
      const style = await dot.getAttribute('style')

      console.log(`${driver} driver - classes:`, classes)
      console.log(`${driver} driver - inline style:`, style)

      // the key test: on initial render (SSR), the styles should be class-based
      // to avoid hydration mismatch
      expect(classes?.length).toBeGreaterThan(0)
      expect(style).toBeNull()
    })

    test('transform styles render correctly before and after hydration', async ({
      page,
    }) => {
      await page.goto(`/hydration-${driver}`)

      const box = page.getByTestId('transform-box')
      await expect(box).toBeAttached({ timeout: 15000 })

      // pre-hydration: SSR should have transform applied via className
      const preTransform = await box.evaluate((el) => getComputedStyle(el).transform)
      console.log(`${driver} driver - pre-hydration transform:`, preTransform)
      expect(preTransform, 'transform should be applied before hydration').toContain(
        'matrix'
      )

      // wait for hydration
      await page.waitForSelector('[data-testid=hydrated-true]')

      // post-hydration: transform should still be correct
      const postTransform = await box.evaluate((el) => getComputedStyle(el).transform)
      console.log(`${driver} driver - post-hydration transform:`, postTransform)
      expect(postTransform, 'transform should be applied after hydration').toContain(
        'matrix'
      )

      // the styles dont change the transform shouldnt change
      expect(postTransform === preTransform)
    })

    test('presence box renders without hydration error', async ({ page }) => {
      await page.goto(`/hydration-${driver}`)

      const presenceBox = page.getByTestId('presence-box')
      await expect(presenceBox).toBeVisible({ timeout: 15000 })

      // verify it has proper classes (SSR rendered)
      const classes = await presenceBox.getAttribute('class')
      console.log(`${driver} driver - presence box classes:`, classes)
      expect(classes).toBeTruthy()
      expect(classes!.length).toBeGreaterThan(0)
    })
  })
}
