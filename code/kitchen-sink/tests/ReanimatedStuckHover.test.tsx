import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression tests for the reanimated avoidReRenders "stuck hover / stuck style" bug.
 *
 * The emitter fast path latches its last-emitted snapshot into the worklet
 * (`animatedTargetsRef !== null`). The latch must be reconciled correctly on
 * hover-out and on re-renders, or the hovered style (or a stale base style) stays
 * stuck. The fix threads a `pseudoActive` flag from createComponent into the
 * reanimated emitter so the worklet only keeps the latch while a self pseudo is
 * genuinely active, and clears it otherwise.
 *
 * This bug surfaced in a downstream consumer when `@tamagui/web` and
 * `@tamagui/animations-reanimated` dists were rebuilt out of sync (web carried the
 * pseudoActive arg, reanimated did not consume it) — the latch never cleared. These
 * tests pin the in-sync behavior for both the event-sourced (web mouse) and
 * driver-sourced (platform-driver / desktop) hover lanes.
 */

const RED = 'rgb(255, 0, 0)'
const GREEN = 'rgb(0, 255, 0)'

const bg = (page: Page, id: string) =>
  page.getByTestId(id).evaluate((el) => getComputedStyle(el).backgroundColor)

async function hoverCenter(page: Page, id: string) {
  const box = await page.getByTestId(id).boundingBox()
  if (!box) throw new Error(`no box for ${id}`)
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
}

test.describe('reanimated stuck hover (event-sourced)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'ReanimatedStuckHoverCase',
      type: 'useCase',
      searchParams: { animationDriver: 'reanimated' },
    })
    await page.waitForTimeout(300)
  })

  test('instant hover-out returns to base', async ({ page }) => {
    expect(await bg(page, 'stuck-instant'), 'starts red').toBe(RED)
    await hoverCenter(page, 'stuck-instant')
    await page.waitForTimeout(100)
    expect(await bg(page, 'stuck-instant'), 'hover green').toBe(GREEN)
    await page.mouse.move(2, 2)
    await page.waitForTimeout(100)
    expect(await bg(page, 'stuck-instant'), 'hover-out must return to base red').toBe(RED)
  })

  test('spring hover-out returns to base', async ({ page }) => {
    await hoverCenter(page, 'stuck-spring')
    await page.waitForTimeout(250)
    expect(await bg(page, 'stuck-spring'), 'hover green').toBe(GREEN)
    await page.mouse.move(2, 2)
    await expect
      .poll(() => bg(page, 'stuck-spring'), {
        message: 'hover-out must settle on base red',
        timeout: 2000,
      })
      .toBe(RED)
  })

  test('hover-in then re-render then hover-out is not stuck', async ({ page }) => {
    await hoverCenter(page, 'stuck-rerender')
    await page.waitForTimeout(80)
    expect(await bg(page, 'stuck-rerender'), 'hover green').toBe(GREEN)
    // re-render while hovered — fire the button's click programmatically so the
    // pointer stays over the square (a real .click() would move the mouse off it)
    await page.getByTestId('bump-tick').evaluate((el) => (el as HTMLElement).click())
    await page.waitForTimeout(80)
    expect(
      await bg(page, 'stuck-rerender'),
      'still green while hovered after re-render'
    ).toBe(GREEN)
    // now leave — must return to base
    await page.mouse.move(2, 2)
    await page.waitForTimeout(100)
    expect(
      await bg(page, 'stuck-rerender'),
      'hover-out after re-render must return to base'
    ).toBe(RED)
  })
})

test.describe('reanimated stuck hover (driver-sourced / platform driver)', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'ReanimatedPlatformDriverHoverCase',
      type: 'useCase',
      searchParams: { animationDriver: 'reanimated' },
    })
    await page.waitForFunction(() => typeof (window as any).driveHover === 'function', {
      timeout: 5000,
    })
    await page.waitForTimeout(200)
  })

  const BLUE = 'rgb(0, 0, 255)'
  const driveHover = (page: Page, hovered: boolean) =>
    page.evaluate((h) => (window as any).driveHover(h), hovered)
  const bump = (page: Page) => page.evaluate(() => (window as any).bumpTick?.())
  const toggleActive = (page: Page) =>
    page.evaluate(() => (window as any).toggleActive?.())

  test('driver hover-in/out returns to base (no transition prop, instant)', async ({
    page,
  }) => {
    expect(await bg(page, 'driver-square'), 'starts red').toBe(RED)
    await driveHover(page, true)
    await page.waitForTimeout(80)
    expect(await bg(page, 'driver-square'), 'driver hover green').toBe(GREEN)
    await driveHover(page, false)
    await page.waitForTimeout(80)
    expect(await bg(page, 'driver-square'), 'driver hover-out must return to base').toBe(
      RED
    )
  })

  test('driver hover-in, re-render, hover-out is not stuck', async ({ page }) => {
    await driveHover(page, true)
    await page.waitForTimeout(60)
    await bump(page)
    await page.waitForTimeout(60)
    expect(
      await bg(page, 'driver-square'),
      'green persists across re-render while hovered'
    ).toBe(GREEN)
    await driveHover(page, false)
    await page.waitForTimeout(80)
    expect(
      await bg(page, 'driver-square'),
      'must return to base after re-render+leave'
    ).toBe(RED)
  })

  test('driver hover-out then base color change applies (latch clears)', async ({
    page,
  }) => {
    // the canonical latch bug, on the DRIVER lane: hover once (fires the emitter
    // latch), leave, then flip the base color via a plain re-render. before the fix
    // the worklet stayed latched on the pre-hover snapshot and the base color never
    // updated. it must reach blue.
    expect(await bg(page, 'driver-square'), 'starts red').toBe(RED)
    await driveHover(page, true)
    await page.waitForTimeout(60)
    expect(await bg(page, 'driver-square'), 'hover green').toBe(GREEN)
    await driveHover(page, false)
    await page.waitForTimeout(60)
    expect(await bg(page, 'driver-square'), 'unhover red').toBe(RED)
    await toggleActive(page)
    await page.waitForTimeout(100)
    expect(
      await bg(page, 'driver-square'),
      'base color change after hover must apply (latch must have cleared)'
    ).toBe(BLUE)
  })
})
