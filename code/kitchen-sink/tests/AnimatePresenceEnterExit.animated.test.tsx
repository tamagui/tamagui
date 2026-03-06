import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

async function getOpacity(page: Page, testId: string): Promise<number> {
  return page.evaluate((id) => {
    const el = document.querySelector(`[data-testid="${id}"]`)
    if (!el) return -1
    return parseFloat(getComputedStyle(el).opacity)
  }, testId)
}

async function elementExists(page: Page, testId: string): Promise<boolean> {
  return page.evaluate((id) => !!document.querySelector(`[data-testid="${id}"]`), testId)
}

async function waitForTrackingReady(page: Page, id: string, timeout = 2000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const ready = await page.evaluate(
      (trackId) => (window as any).__enterExitReady?.[trackId],
      id
    )
    if (ready) return
    await page.waitForTimeout(50)
  }
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'AnimatePresenceEnterExitCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

test('scenario 01: enter animation should animate opacity from 0 to 1', async ({ page }) => {
  // element should not exist initially
  expect(await elementExists(page, 'enter-exit-01-target')).toBe(false)

  // click toggle to show
  await page.getByTestId('enter-exit-01-trigger').click()

  // wait a bit for animation to start, then check intermediate opacity
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-01-target')

  // the key assertion: during enter animation, opacity should be LESS than 1
  // if the animation driver doesn't animate, opacity would jump straight to 1
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  // wait for animation to finish
  await waitForTrackingReady(page, '01')

  // after animation completes, opacity should be 1
  const finalOpacity = await getOpacity(page, 'enter-exit-01-target')
  expect(finalOpacity).toBe(1)
})

test('scenario 01: exit animation should animate opacity from 1 to 0', async ({ page }) => {
  // show the element first
  await page.getByTestId('enter-exit-01-trigger').click()
  await page.waitForTimeout(600) // wait for enter animation

  // verify it's visible
  expect(await getOpacity(page, 'enter-exit-01-target')).toBe(1)

  // click to hide (exit)
  await page.getByTestId('enter-exit-01-trigger').click()

  // wait a bit for exit animation to start
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-01-target')

  // during exit, element should still exist but opacity should be less than 1
  expect(await elementExists(page, 'enter-exit-01-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)
  expect(midOpacity).toBeGreaterThanOrEqual(0)

  // wait for exit to complete - element should be removed
  await page.waitForTimeout(1000)
  expect(await elementExists(page, 'enter-exit-01-target')).toBe(false)
})

test('scenario 02: circle badge enter animation', async ({ page }) => {
  // badge should not exist initially
  expect(await elementExists(page, 'enter-exit-02-target')).toBe(false)

  // add count to show badge
  await page.getByTestId('enter-exit-02-increment').click()

  // check intermediate state
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-02-target')

  // during enter, opacity should be animating (less than 1)
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  // wait for animation to complete
  await waitForTrackingReady(page, '02')
  const finalOpacity = await getOpacity(page, 'enter-exit-02-target')
  expect(finalOpacity).toBe(1)
})

test('scenario 03: initial=false enter animation', async ({ page }) => {
  // badge should not exist initially
  expect(await elementExists(page, 'enter-exit-03-target')).toBe(false)

  // add count to show badge
  await page.getByTestId('enter-exit-03-increment').click()

  // check intermediate state
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-03-target')

  // during enter, opacity should be animating (less than 1)
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  // wait for animation to complete
  await waitForTrackingReady(page, '03')
  const finalOpacity = await getOpacity(page, 'enter-exit-03-target')
  expect(finalOpacity).toBe(1)
})

test('scenario 03: initial=false enter has intermediate frames', async ({ page }) => {
  // capture opacity frames during animation
  await page.evaluate(() => {
    ;(window as any).__opacityFrames03 = []
    ;(window as any).__rafRunning03 = true
    const track = () => {
      if (!(window as any).__rafRunning03) return
      const el = document.querySelector('[data-testid="enter-exit-03-target"]')
      if (el) {
        ;(window as any).__opacityFrames03.push(parseFloat(getComputedStyle(el).opacity))
      }
      requestAnimationFrame(track)
    }
    requestAnimationFrame(track)
  })

  await page.getByTestId('enter-exit-03-increment').click()
  await page.waitForTimeout(500)

  await page.evaluate(() => {
    ;(window as any).__rafRunning03 = false
  })

  const frames: number[] = await page.evaluate(() => (window as any).__opacityFrames03)

  // should have multiple frames
  expect(frames.length).toBeGreaterThan(3)

  // should have at least some intermediate values (not just 0 and 1)
  const intermediateFrames = frames.filter((f) => f > 0.05 && f < 0.95)
  expect(
    intermediateFrames.length,
    `expected intermediate opacity frames, got: ${JSON.stringify(frames.slice(0, 20))}`
  ).toBeGreaterThan(0)

  // final frame should be 1
  expect(frames[frames.length - 1]).toBe(1)
})

test('scenario 03: initial=false exit animation', async ({ page }) => {
  // show badge
  await page.getByTestId('enter-exit-03-increment').click()
  await page.waitForTimeout(600)

  expect(await getOpacity(page, 'enter-exit-03-target')).toBe(1)

  // clear to trigger exit
  await page.getByTestId('enter-exit-03-clear').click()

  // during exit, opacity should be animating
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-03-target')
  expect(await elementExists(page, 'enter-exit-03-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)

  // after exit completes, element should be gone
  await page.waitForTimeout(1000)
  expect(await elementExists(page, 'enter-exit-03-target')).toBe(false)
})

test('scenario 02: circle badge exit animation', async ({ page }) => {
  // show badge
  await page.getByTestId('enter-exit-02-increment').click()
  await page.waitForTimeout(600)

  expect(await getOpacity(page, 'enter-exit-02-target')).toBe(1)

  // clear to trigger exit
  await page.getByTestId('enter-exit-02-clear').click()

  // during exit, opacity should be animating
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-02-target')
  expect(await elementExists(page, 'enter-exit-02-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)

  // after exit completes, element should be gone
  await page.waitForTimeout(1000)
  expect(await elementExists(page, 'enter-exit-02-target')).toBe(false)
})
