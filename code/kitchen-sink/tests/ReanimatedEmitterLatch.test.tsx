import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for the reanimated avoidReRenders emitter latch bug.
 *
 * Once a hover fires the useStyleEmitter fast path, the worklet used to latch onto
 * its last-emitted snapshot and ignore `animatedStyles` from later re-renders — so a
 * base style driven by external state (a sidebar row's `backgroundColor` flipping with
 * a selection store) got stuck on the pre-hover value until the next hover. This runs
 * against the default reanimated driver, which is where the bug lived.
 */

const bg = (page: import('@playwright/test').Page) =>
  page.getByTestId('latch-square').evaluate((el) => getComputedStyle(el).backgroundColor)

test.describe('reanimated emitter latch', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'ReanimatedEmitterLatchCase',
      type: 'useCase',
      searchParams: { animationDriver: 'reanimated' },
    })
    await page.waitForTimeout(300)
  })

  test('base style change via re-render applies after the element was hovered', async ({
    page,
  }) => {
    const square = page.getByTestId('latch-square')

    expect(await bg(page), 'starts inactive (red)').toBe('rgb(255, 0, 0)')

    // hover the square — this fires useStyleEmitter and sets the worklet's latch
    await square.hover()
    await page.waitForTimeout(100)
    expect(await bg(page), 'hover shows green').toBe('rgb(0, 255, 0)')

    // move the mouse away so we are no longer hovering, then flip `active` through a
    // plain React re-render (NOT a hover). the background must follow to the active color.
    await page.mouse.move(0, 0)
    await page.waitForTimeout(100)
    expect(await bg(page), 'unhover returns to inactive red').toBe('rgb(255, 0, 0)')

    await page.getByTestId('toggle-active').click()
    await page.waitForTimeout(200)

    expect(
      await bg(page),
      'after hovering once, the base bg must still update on re-render (latch bug)'
    ).toBe('rgb(0, 0, 255)')

    // and flipping back must work too
    await page.getByTestId('toggle-active').click()
    await page.waitForTimeout(200)
    expect(await bg(page), 'flips back to inactive red').toBe('rgb(255, 0, 0)')
  })
})
