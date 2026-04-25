/**
 * Regression: $group-press stays stuck on children after release when the
 * parent frame has `transition` and gestures end OFF the element.
 *
 * Only the specific sequence reproduces it:
 *   1. finger DOWN on the pressable
 *   2. finger moves OUTSIDE the pressable bounds while still down
 *   3. finger UP (released off-element)
 *
 * A normal tap that releases on the element does NOT reproduce.
 *
 * Matrix covered (parentAnim × childAnim). `pa-cp` is the known bad cell;
 * the others are included to pin down where the buggy behavior lives and
 * catch regressions if the fix accidentally breaks another combination.
 */

import { by, device, element, expect as detoxExpect } from 'detox'
import * as assert from 'assert'
import { navigateToTestCase } from './utils/navigation'
import { getDominantColor, isBlueish, formatRGB } from './utils/colors'
import { safeLaunchApp, safeReloadApp } from './utils/detox'

const CELLS = ['pp-cp', 'pa-cp', 'pp-ca', 'pa-ca'] as const

async function pressDownDragOffAndRelease(cellId: string) {
  // swipe downward on the cell to produce: press-down → move-off → release.
  // swipe() only requires the source view to be hittable at its start
  // point — no ambiguity about a drop target or cross-element visibility.
  // start from the very top of the cell so the first portion of the swipe
  // is still within the cell (gives press-in state time to dispatch to
  // subscribers) before finger leaves bounds.
  await element(by.id(`cell-${cellId}-frame`)).swipe(
    'down',
    'slow',
    1.0, // full viewport traversal
    0.5, // startX in cell
    0.1 // startY near top of cell — maximizes in-cell travel distance
  )
  // give React + animation driver time to settle
  await new Promise((r) => setTimeout(r, 500))
}

async function assertChildReturnedToDefault(cellId: string) {
  // child bg should be blue (default), NOT red (press)
  const bgPath = await element(by.id(`cell-${cellId}-child`)).takeScreenshot(
    `${cellId}-child-after`
  )
  const bgColor = getDominantColor(bgPath)
  assert.ok(
    isBlueish(bgColor),
    `cell ${cellId}: child did not revert to blue after release — got ${formatRGB(bgColor)}`
  )
}

describe('GroupPressTransitionMatrix', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    await navigateToTestCase(
      'GroupPressTransitionMatrix',
      'group-press-transition-matrix-root'
    )
  })

  it('renders every cell and the release target', async () => {
    for (const id of CELLS) {
      await detoxExpect(element(by.id(`cell-${id}-frame`))).toExist()
      await detoxExpect(element(by.id(`cell-${id}-child`))).toExist()
    }
    await detoxExpect(element(by.id('release-target'))).toExist()
  })

  for (const id of CELLS) {
    it(`${id}: child reverts to default when press ends off-element`, async () => {
      await pressDownDragOffAndRelease(id)
      await assertChildReturnedToDefault(id)
    })
  }
})
