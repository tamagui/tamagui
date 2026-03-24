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

async function waitForOpacity(
  page: Page,
  testId: string,
  target: number,
  timeout = 3000
) {
  const tolerance = target === 1 ? 0.02 : 0.01
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const opacity = await getOpacity(page, testId)
    if (Math.abs(opacity - target) < tolerance) return opacity
    await page.waitForTimeout(50)
  }
  return getOpacity(page, testId)
}

async function waitForRemoval(page: Page, testId: string, timeout = 3000) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    if (!(await elementExists(page, testId))) return true
    await page.waitForTimeout(50)
  }
  return false
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'AnimatePresenceEnterExitCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

test('scenario 01: enter animation should animate opacity from 0 to 1', async ({
  page,
}) => {
  expect(await elementExists(page, 'enter-exit-01-target')).toBe(false)

  await page.getByTestId('enter-exit-01-trigger').click()

  // check intermediate opacity during animation
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-01-target')
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  // wait for animation to settle near 1
  const finalOpacity = await waitForOpacity(page, 'enter-exit-01-target', 1)
  expect(finalOpacity).toBeGreaterThan(0.98)
})

test('scenario 01: exit animation should animate opacity from 1 to 0', async ({
  page,
}) => {
  await page.getByTestId('enter-exit-01-trigger').click()
  const enterOpacity = await waitForOpacity(page, 'enter-exit-01-target', 1)
  expect(enterOpacity).toBeGreaterThan(0.98)

  await page.getByTestId('enter-exit-01-trigger').click()

  // during exit, element should still exist but opacity should be less than 1
  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-01-target')
  expect(await elementExists(page, 'enter-exit-01-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)
  expect(midOpacity).toBeGreaterThanOrEqual(0)

  // wait for exit to complete - element should be removed
  expect(await waitForRemoval(page, 'enter-exit-01-target')).toBe(true)
})

test('scenario 02: circle badge enter animation', async ({ page }) => {
  expect(await elementExists(page, 'enter-exit-02-target')).toBe(false)

  await page.getByTestId('enter-exit-02-increment').click()

  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-02-target')
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  const finalOpacity = await waitForOpacity(page, 'enter-exit-02-target', 1)
  expect(finalOpacity).toBeGreaterThan(0.98)
})

test('scenario 03: initial=false enter animation', async ({ page }) => {
  expect(await elementExists(page, 'enter-exit-03-target')).toBe(false)

  await page.getByTestId('enter-exit-03-increment').click()

  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-03-target')
  expect(midOpacity).toBeGreaterThanOrEqual(0)
  expect(midOpacity).toBeLessThan(1)

  const finalOpacity = await waitForOpacity(page, 'enter-exit-03-target', 1)
  expect(finalOpacity).toBeGreaterThan(0.98)
})

test('scenario 03: initial=false enter has intermediate frames', async ({ page }) => {
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

  expect(frames.length).toBeGreaterThan(3)

  const intermediateFrames = frames.filter((f) => f > 0.05 && f < 0.95)
  expect(
    intermediateFrames.length,
    `expected intermediate opacity frames, got: ${JSON.stringify(frames.slice(0, 20))}`
  ).toBeGreaterThan(0)

  // final frame should be near 1 (spring may not land exactly on 1)
  expect(frames[frames.length - 1]).toBeGreaterThan(0.95)
})

test('scenario 03: initial=false exit animation', async ({ page }) => {
  await page.getByTestId('enter-exit-03-increment').click()
  const enterOpacity = await waitForOpacity(page, 'enter-exit-03-target', 1)
  expect(enterOpacity).toBeGreaterThan(0.98)

  await page.getByTestId('enter-exit-03-clear').click()

  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-03-target')
  expect(await elementExists(page, 'enter-exit-03-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)

  expect(await waitForRemoval(page, 'enter-exit-03-target')).toBe(true)
})

test('scenario 02: circle badge exit animation', async ({ page }) => {
  await page.getByTestId('enter-exit-02-increment').click()
  const enterOpacity = await waitForOpacity(page, 'enter-exit-02-target', 1)
  expect(enterOpacity).toBeGreaterThan(0.98)

  await page.getByTestId('enter-exit-02-clear').click()

  await page.waitForTimeout(50)
  const midOpacity = await getOpacity(page, 'enter-exit-02-target')
  expect(await elementExists(page, 'enter-exit-02-target')).toBe(true)
  expect(midOpacity).toBeLessThan(1)

  expect(await waitForRemoval(page, 'enter-exit-02-target')).toBe(true)
})
