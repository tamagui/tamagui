import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for the group + disabledStyle emitter latch bug (Wez, June 2026).
 *
 * A `group` frame with pressStyle goes through the avoidReRenders style emitter:
 * the press that toggles `disabled` latches the worklet onto its last-emitted
 * snapshot. The disabled re-render merges disabledStyle into the base style, but
 * before the latch-drop fix the worklet kept painting the stale latched green —
 * the circle never went grey even though a child label re-rendered fine. Runs
 * against the reanimated driver where the latch lives.
 */

const color = (
  page: import('@playwright/test').Page,
  id: string,
  prop: 'backgroundColor' | 'borderTopColor'
) => page.getByTestId(id).evaluate((el, p) => getComputedStyle(el)[p], prop)

const GREEN = 'rgb(27, 122, 61)'
const GREY = 'rgb(217, 215, 210)'

test.describe('group + disabledStyle emitter latch', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'GroupDisabledStyleLatchCase',
      type: 'useCase',
      searchParams: { animationDriver: 'reanimated' },
    })
    await page.waitForTimeout(300)
  })

  test('disabledStyle applies after the press that latched the emitter', async ({
    page,
  }) => {
    const pressBtn = 'group-disabled-press-btn'
    const plainBtn = 'group-disabled-btn'

    expect(await color(page, pressBtn, 'backgroundColor'), 'starts green').toBe(GREEN)
    expect(await color(page, plainBtn, 'backgroundColor'), 'starts green').toBe(GREEN)

    // the press itself goes through the emitter (pressStyle), then onPress flips
    // disabled via a React re-render whose base style must win over the latch
    await page.getByTestId(pressBtn).click()
    await expect(page.getByTestId('group-disabled-state')).toHaveText('disabled')

    await expect
      .poll(() => color(page, pressBtn, 'backgroundColor'), {
        message: 'pressed frame settles grey when disabled',
        timeout: 3000,
      })
      .toBe(GREY)
    await expect
      .poll(() => color(page, pressBtn, 'borderTopColor'), {
        message: 'pressed frame border settles grey when disabled',
        timeout: 3000,
      })
      .toBe(GREY)
    // the minimized frame (no press/hover styles) follows through the plain re-render
    await expect
      .poll(() => color(page, plainBtn, 'backgroundColor'), {
        message: 'minimized frame settles grey when disabled',
        timeout: 3000,
      })
      .toBe(GREY)

    // re-enable via the external toggle (the disabled circles ignore presses)
    await page.getByTestId('group-disabled-toggle').click()
    await expect(page.getByTestId('group-disabled-state')).toHaveText('enabled')
    await expect
      .poll(() => color(page, pressBtn, 'backgroundColor'), {
        message: 'pressed frame settles back to green',
        timeout: 3000,
      })
      .toBe(GREEN)
    await expect
      .poll(() => color(page, plainBtn, 'backgroundColor'), {
        message: 'minimized frame settles back to green',
        timeout: 3000,
      })
      .toBe(GREEN)

    // a second press-disable cycle still works (latch was re-set by the press)
    await page.getByTestId(pressBtn).click()
    await expect(page.getByTestId('group-disabled-state')).toHaveText('disabled')
    await expect
      .poll(() => color(page, pressBtn, 'backgroundColor'), {
        message: 'second disable settles grey',
        timeout: 3000,
      })
      .toBe(GREY)
  })
})
