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

    test('indicator dots keep their styles through hydration', async ({
      page,
    }, testInfo) => {
      const compiledArtifact = testInfo.project.name === 'prod'
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

      // animateOnly keeps this candidate on the runtime path; in the compiled
      // artifact its unproven values stay inline, and SSR must make the same
      // decision as the first client render.
      const serverStyle = serverTag.match(/\bstyle="([^"]*)"/)?.[1]
      if (compiledArtifact) {
        expect(serverStyle).toBeTruthy()
      } else {
        expect(serverStyle).toBeUndefined()
        expect(
          className!.split(/\s+/).some((name) => html.includes(`.${name}{width:16px`))
        ).toBe(true)
      }

      const errors: string[] = []
      page.on('console', (message) => {
        if (message.type() === 'error') errors.push(message.text())
      })
      let releaseScripts: () => void
      const scriptsHeld = new Promise<void>((resolve) => {
        releaseScripts = resolve
      })
      await page.route('**/*.js', async (route) => {
        await scriptsHeld
        await route.continue()
      })
      await page.goto(`/hydration-${driver}`, { waitUntil: 'commit' })

      const dot = page.getByTestId('indicator-dot-1')
      await expect(dot).toBeAttached({ timeout: 15000 })
      await expect(page.locator('[data-testid=hydrated-true]')).toHaveCount(0)
      const readStyles = () =>
        dot.evaluate((element) => {
          const style = getComputedStyle(element)
          return {
            className: element.getAttribute('class'),
            inline: element.getAttribute('style'),
            computed: {
              flexDirection: style.flexDirection,
              width: style.width,
              height: style.height,
              backgroundColor: style.backgroundColor,
              borderTopLeftRadius: style.borderTopLeftRadius,
              borderTopRightRadius: style.borderTopRightRadius,
              borderBottomRightRadius: style.borderBottomRightRadius,
              borderBottomLeftRadius: style.borderBottomLeftRadius,
            },
          }
        })
      const beforeHydration = await readStyles()
      expect(beforeHydration.className).toBe(className)
      if (compiledArtifact) expect(beforeHydration.inline).toBeTruthy()
      else expect(beforeHydration.inline).toBeNull()

      releaseScripts!()
      await page.waitForSelector('[data-testid=hydrated-true]')
      const afterHydration = await readStyles()
      if (compiledArtifact) {
        expect(afterHydration.className).toBe(beforeHydration.className)
        expect(afterHydration.inline).toBeTruthy()
        expect(afterHydration.computed).toEqual(beforeHydration.computed)
      } else if (driver === 'css') {
        expect(afterHydration.className).toBe(beforeHydration.className)
      } else {
        expect(afterHydration.computed).toMatchObject({ width: '16px', height: '8px' })
      }
      expect(errors).toEqual([])
      await expect(dot).toBeVisible({ timeout: 15000 })
    })

    test('transform styles render correctly before and after hydration', async ({
      page,
    }, testInfo) => {
      const compiledArtifact = testInfo.project.name === 'prod'
      // Hold every script until the pre-hydration styles have been read. Without
      // this the assertion below is a race: in a production build hydration
      // finishes before the element is even reported attached, so the "before"
      // read lands after the driver has already replaced the longhands with a
      // composed matrix, which is a state this test explicitly allows further
      // down. It failed only under TEST_MODE=prod for exactly that reason.
      let releaseScripts: () => void
      const scriptsHeld = new Promise<void>((resolve) => {
        releaseScripts = resolve
      })
      await page.route('**/*.js', async (route) => {
        await scriptsHeld
        await route.continue()
      })

      // 'commit', not 'domcontentloaded': DOMContentLoaded waits for deferred and
      // module scripts, which is exactly what the gate above is holding, so waiting
      // on it deadlocks against the release below and times out the navigation.
      // 'commit' resolves as soon as the response lands, and the assertion below
      // waits for the SSR'd element, which HTML parsing produces without scripts.
      await page.goto(`/hydration-${driver}`, { waitUntil: 'commit' })

      const box = page.getByTestId('transform-box')
      await expect(box).toBeAttached({ timeout: 15000 })
      // the point of the gate: nothing may have hydrated yet
      await expect(page.locator('[data-testid=hydrated-true]')).toHaveCount(0)

      // the runtime Configuration driver is invisible to the compiler, so the
      // compiled artifact keeps this transform inline for both pages; the dev
      // server still generates CSS at runtime and emits transform longhands.
      const preStyles = await box.evaluate((el) => {
        const styles = getComputedStyle(el)
        return {
          transform: styles.transform,
          translate: styles.translate,
          scale: styles.scale,
          rotate: styles.rotate,
        }
      })
      const preInlineStyle = await box.getAttribute('style')
      const preBounds = await box.boundingBox()

      if (compiledArtifact) {
        expect(preInlineStyle).toContain(
          'transform:translateX(50px) translateY(20px) scale(1.1) rotate(5deg)'
        )
        expect(preStyles.transform).not.toBe('none')
        expect(preStyles).toMatchObject({
          translate: 'none',
          scale: 'none',
          rotate: 'none',
        })
      } else {
        expect(preInlineStyle).toBeNull()
        expect(preStyles).toEqual({
          transform: 'none',
          translate: '50px 20px',
          scale: '1.1',
          rotate: '5deg',
        })
      }

      // let the app boot and hydrate
      releaseScripts!()
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
