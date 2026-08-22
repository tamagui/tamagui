import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for GitHub issue #4146: the slider thumb stops following the cursor once
 * the page is scrolled.
 *
 * A responder event's pageX/pageY come straight off the DOM event and are
 * document-relative, while the track is measured with getBoundingClientRect and
 * is viewport-relative. Mixing the two makes the dragged value drift by exactly
 * the scroll offset — with a tall page it saturates at the minimum.
 *
 * The press itself is unaffected (it uses locationY, which is already relative to
 * the responder element), so these tests have to *drag* to exercise the bug.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'SliderScrollOffsetCase', type: 'useCase' })
})

test('vertical slider tracks the cursor after the page is scrolled', async ({ page }) => {
  const slider = page.locator(`#${TEST_IDS.sliderScrollVertical}`)
  await slider.scrollIntoViewIfNeeded()

  // the whole point of the repro — without a scroll offset the bug can't show
  const scrollY = await page.evaluate(() => window.scrollY)
  expect(scrollY).toBeGreaterThan(0)

  const box = (await slider.boundingBox())!
  expect(box).not.toBeNull()

  // drag from the middle of the track to a quarter down from the top
  const targetY = box.y + box.height * 0.25
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(box.x + box.width / 2, targetY, { steps: 10 })
  await page.mouse.up()

  // vertical runs bottom(min) -> top(max)
  const expected = 100 - ((targetY - box.y) / box.height) * 100
  const value = Number(
    await page.locator(`#${TEST_IDS.sliderScrollVerticalValue}`).innerText()
  )
  expect(value).toBeGreaterThan(expected - 4)
  expect(value).toBeLessThan(expected + 4)
})

test('horizontal slider tracks the cursor after the page is scrolled', async ({
  page,
}) => {
  const slider = page.locator(`#${TEST_IDS.sliderScrollHorizontal}`)
  await slider.scrollIntoViewIfNeeded()

  const box = (await slider.boundingBox())!
  expect(box).not.toBeNull()

  const targetX = box.x + box.width * 0.75
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2)
  await page.mouse.down()
  await page.mouse.move(targetX, box.y + box.height / 2, { steps: 10 })
  await page.mouse.up()

  const expected = ((targetX - box.x) / box.width) * 100
  const value = Number(
    await page.locator(`#${TEST_IDS.sliderScrollHorizontalValue}`).innerText()
  )
  expect(value).toBeGreaterThan(expected - 4)
  expect(value).toBeLessThan(expected + 4)
})
