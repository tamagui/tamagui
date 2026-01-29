import { expect, test } from '@playwright/test'

/**
 * Tests for motion driver hydration behavior.
 *
 * Elements with enterStyle should NOT animate on initial page load.
 * They should render at their final position immediately without any
 * "flying across the page" effect.
 *
 * This regression was seen on tamagui.dev with HomeGlow components
 * animating from top-left to their final positions on hydration.
 */
test.describe('Motion Hydration', () => {
  test('elements should NOT animate from origin on hydration', async ({ page }) => {
    // track all transforms seen for glow elements, capturing as early as possible
    await page.addInitScript(() => {
      ;(window as any).__transformHistory = []
      ;(window as any).__captureStartTime = performance.now()
      ;(window as any).__pageLoadTime = 0

      // capture transforms using requestAnimationFrame to get every frame
      const captureTransforms = () => {
        const glows = document.querySelectorAll('[data-testid^="glow-"]')
        glows.forEach((el) => {
          const htmlEl = el as HTMLElement
          const testId = htmlEl.getAttribute('data-testid')
          const transform = getComputedStyle(htmlEl).transform
          const rect = htmlEl.getBoundingClientRect()
          const style = htmlEl.getAttribute('style') || ''

          ;(window as any).__transformHistory.push({
            id: testId,
            transform,
            style: style.substring(0, 200), // truncate for readability
            left: rect.left,
            top: rect.top,
            time: performance.now() - (window as any).__captureStartTime,
            sinceLoad: performance.now() - (window as any).__pageLoadTime,
          })
        })

        // keep capturing for 2 seconds after page load
        if (performance.now() - (window as any).__pageLoadTime < 2000) {
          requestAnimationFrame(captureTransforms)
        }
      }

      // use MutationObserver to detect when glow elements are added
      const observer = new MutationObserver((mutations) => {
        for (const mutation of mutations) {
          for (const node of mutation.addedNodes) {
            if (node instanceof HTMLElement) {
              const testId = node.getAttribute?.('data-testid')
              if (testId?.startsWith('glow-')) {
                // record immediately when element is added
                const transform = getComputedStyle(node).transform
                ;(window as any).__transformHistory.push({
                  id: testId,
                  transform,
                  style: (node.getAttribute('style') || '').substring(0, 200),
                  event: 'element-added',
                  time: performance.now() - (window as any).__captureStartTime,
                  sinceLoad: (window as any).__pageLoadTime ? performance.now() - (window as any).__pageLoadTime : 0,
                })
              }
            }
          }
        }
      })

      // start observing immediately
      observer.observe(document, {
        childList: true,
        subtree: true,
      })

      // also start capturing frames when DOM is ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
          ;(window as any).__pageLoadTime = performance.now()
          requestAnimationFrame(captureTransforms)
        })
      } else {
        ;(window as any).__pageLoadTime = performance.now()
        requestAnimationFrame(captureTransforms)
      }
    })

    await page.goto('/motion-hydration-test')

    // wait for elements to be visible
    const glow1 = page.getByTestId('glow-1')
    await expect(glow1).toBeVisible({ timeout: 10000 })

    // wait for capture to complete
    await page.waitForTimeout(2500)

    // get transform history
    const history = await page.evaluate(
      () => (window as any).__transformHistory || []
    )

    // filter to just glow-1
    const glow1History = history.filter((h: any) => h.id === 'glow-1')

    console.log(`Captured ${glow1History.length} frames for glow-1`)

    if (glow1History.length > 0) {
      // log first few and last few frames
      console.log('First 3 frames:', JSON.stringify(glow1History.slice(0, 3), null, 2))
      console.log(
        'Last 3 frames:',
        JSON.stringify(glow1History.slice(-3), null, 2)
      )

      // the element should be at x=400, y=50 (from our test case)
      // check if the FIRST frame had the element at the wrong position
      const firstFrame = glow1History[0]
      const lastFrame = glow1History[glow1History.length - 1]

      // parse transforms
      const parseMatrix = (transform: string) => {
        const m = transform.match(
          /matrix\(([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^,]+),\s*([^)]+)\)/
        )
        if (m) {
          return { tx: Number.parseFloat(m[5]), ty: Number.parseFloat(m[6]) }
        }
        return null
      }

      const firstPos = parseMatrix(firstFrame.transform)
      const lastPos = parseMatrix(lastFrame.transform)

      if (firstPos && lastPos) {
        console.log(
          `First frame position: x=${firstPos.tx}, y=${firstPos.ty} at ${firstFrame.time}ms`
        )
        console.log(
          `Last frame position: x=${lastPos.tx}, y=${lastPos.ty} at ${lastFrame.time}ms`
        )

        // THE KEY BUG: element starts at (0,0) or near it and animates to final position
        // this happens when motion driver doesn't properly handle hydration
        //
        // expected initial position is x=400, y=50 based on our test component
        // if we see the element start near origin, that's the bug

        // check if the FIRST frame was at origin (the specific hydration bug)
        const firstFrameAtOrigin =
          Math.abs(firstPos.tx) < 50 && Math.abs(firstPos.ty) < 50

        // also check early frames (first 10 frames within 100ms of load)
        const earlyFrames = glow1History.filter(
          (h: any) => h.sinceLoad < 100
        )
        console.log(`Early frames (within 100ms of load): ${earlyFrames.length}`)

        const hadOriginInEarlyFrames = earlyFrames.some((frame: any) => {
          const pos = parseMatrix(frame.transform)
          if (!pos) return false
          const atOrigin = Math.abs(pos.tx) < 50 && Math.abs(pos.ty) < 50
          if (atOrigin) {
            console.log(
              `Found frame at origin: x=${pos.tx}, y=${pos.ty} at ${frame.sinceLoad}ms after load`
            )
          }
          return atOrigin
        })

        if (firstFrameAtOrigin) {
          console.log(
            'CRITICAL REGRESSION: First frame was at origin!'
          )
          console.log(
            'Element should have rendered at x=400, y=50 immediately'
          )
        }

        if (hadOriginInEarlyFrames) {
          console.log(
            'REGRESSION: Element was at origin during early hydration frames'
          )
        }

        // the element should NOT start at origin - it should render at (400, 50) immediately
        expect(
          firstFrameAtOrigin,
          'First frame should NOT be at origin - element should render at final position immediately'
        ).toBe(false)

        expect(
          hadOriginInEarlyFrames,
          'No early frames should show element at origin'
        ).toBe(false)
      }
    }
  })

  test('no hydration console errors', async ({ page }) => {
    const errors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.goto('/motion-hydration-test')
    await page.waitForTimeout(1000)

    const hydrationErrors = errors.filter(
      (e) => e.includes('Hydration') || e.includes('hydrat')
    )
    expect(hydrationErrors).toHaveLength(0)
  })
})
