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
      const response = await page.request.get(`/hydration-${driver}`)
      expect(response.ok()).toBe(true)

      const html = await response.text()
      const marker = 'data-testid="indicator-dot-1"'
      const markerIndex = html.indexOf(marker)
      expect(markerIndex).toBeGreaterThan(-1)

      const tagStart = html.lastIndexOf('<div', markerIndex)
      const tagEnd = html.indexOf('>', markerIndex)
      const serverTag = html.slice(tagStart, tagEnd)

      const className = serverTag.match(/\bclass="([^"]*)"/)?.[1]
      expect(className).toBeTruthy()
      expect(
        className!.split(/\s+/).some((name) => html.includes(`.${name}{width:16px}`))
      ).toBe(true)
      expect(serverTag).not.toContain('style=')

      await page.goto(`/hydration-${driver}`)
      await page.waitForSelector(`[data-testid=hydrated-true]`)

      const dot = page.getByTestId('indicator-dot-1')
      const classes = await dot.getAttribute('class')

      console.log(`${driver} driver - classes:`, classes)
      console.log(`${driver} driver - server tag:`, serverTag)

      expect(classes).toBe(className)
      await expect(dot).toBeVisible({ timeout: 15000 })
    })

    test('transform styles render correctly before and after hydration', async ({
      page,
    }) => {
      await page.goto(`/hydration-${driver}`)

      const box = page.getByTestId('transform-box')
      await expect(box).toBeAttached({ timeout: 15000 })

      // SSR emits the web-standard individual transform properties as classes.
      const preStyles = await box.evaluate((el) => {
        const styles = getComputedStyle(el)
        return {
          transform: styles.transform,
          translate: styles.translate,
          scale: styles.scale,
          rotate: styles.rotate,
        }
      })
      const preBounds = await box.boundingBox()

      expect(preStyles).toEqual({
        transform: 'none',
        translate: '50px 20px',
        scale: '1.1',
        rotate: '5deg',
      })

      // wait for hydration
      await page.waitForSelector('[data-testid=hydrated-true]')

      // Motion composes those properties into a matrix after hydration, while
      // CSS keeps the longhands. Either representation must preserve geometry.
      const postBounds = await box.boundingBox()
      expect(preBounds).not.toBeNull()
      expect(postBounds).not.toBeNull()
      for (const key of ['x', 'y', 'width', 'height'] as const) {
        expect(postBounds![key]).toBeCloseTo(preBounds![key], 3)
      }
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
