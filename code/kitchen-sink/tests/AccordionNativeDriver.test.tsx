import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// the @tamagui/animations-react-native driver (animationDriver=native) previously
// snapped Accordion.HeightAnimator open/closed: height was not in any animatable
// key map so it landed in the static style and jumped 0 -> full in one frame.
// layout dimension keys now animate on the JS driver. these assertions are
// behavioral: opening must pass through intermediate heights, closing must tween
// down to 0.
test('native driver: accordion height opens through intermediate frames and closes to 0', async ({
  page,
}) => {
  await setupPage(page, {
    name: 'AccordionDefaultOpenCase',
    type: 'useCase',
    searchParams: { animationDriver: 'native' },
  })

  await page.waitForSelector('#def-trigger2', { timeout: 30_000 })

  const result = await page.evaluate(async () => {
    const trigger = document.getElementById('def-trigger2')
    const wrapper = document.getElementById('def-height2')
    if (!trigger || !wrapper) throw new Error('accordion test nodes missing')

    const sampleFor = async (durationMs: number) => {
      const heights: number[] = []
      const startedAt = performance.now()
      do {
        await new Promise(requestAnimationFrame)
        heights.push(wrapper.getBoundingClientRect().height)
      } while (performance.now() - startedAt < durationMs)
      return heights
    }

    trigger.click()
    const opening = await sampleFor(600)
    const openHeight = opening.at(-1) ?? 0

    trigger.click()
    const closing = await sampleFor(600)

    return { opening, openHeight, closing }
  })

  // fully opens to a real height
  expect(result.openHeight).toBeGreaterThan(10)

  // opening is smooth: passes through heights strictly between 0 and the final,
  // rather than a single jump straight to openHeight
  expect(
    result.opening.some((height) => height > 1 && height < result.openHeight - 1)
  ).toBe(true)

  // no single frame covers the whole distance (would indicate a snap)
  const maxOpenJump = result.opening
    .slice(1)
    .reduce(
      (max, height, i) => Math.max(max, Math.abs(height - result.opening[i])),
      0
    )
  expect(maxOpenJump).toBeLessThan(result.openHeight - 1)

  // closing tweens back down through intermediate heights and lands at 0
  expect(
    result.closing.some((height) => height > 1 && height < result.openHeight - 1)
  ).toBe(true)
  expect(result.closing.at(-1)).toBeLessThanOrEqual(1)
})

// once an open item settles it releases its measured pixel height back to auto,
// so later content growth stays fluid. the native driver previously kept the
// settled height's Animated.Value forever, pinning the wrapper at the old pixel
// value: released-to-auto never took effect and growing the content stayed
// clipped. the driver now drops animated keys that left the incoming style.
test('native driver: settled accordion releases to auto and follows content growth', async ({
  page,
}) => {
  await setupPage(page, {
    name: 'AccordionDefaultOpenCase',
    type: 'useCase',
    searchParams: { animationDriver: 'native' },
  })

  await page.waitForSelector('#def-trigger2', { timeout: 30_000 })

  const wrapperHeight = () =>
    page.$eval('#def-height2', (el) => Math.round(el.getBoundingClientRect().height))
  const wrapperInlineHeight = () =>
    page.$eval('#def-height2', (el) => (el as HTMLElement).style.height)

  await page.click('#def-trigger2')
  // open animation (300ms) + the 100ms quiet window before release to auto
  await page.waitForTimeout(900)

  const settledHeight = await wrapperHeight()
  // released back to auto: no pinned inline pixel height remains
  expect((await wrapperInlineHeight()).endsWith('px')).toBe(false)
  expect(settledHeight).toBeGreaterThan(10)

  // grow the content: an auto wrapper must follow the taller measurement
  await page.click('#grow-content')
  await page.waitForTimeout(700)
  const grownHeight = await wrapperHeight()
  expect(grownHeight).toBeGreaterThan(settledHeight + 5)

  // shrink back: the wrapper follows down again
  await page.click('#grow-content')
  await page.waitForTimeout(700)
  const shrunkHeight = await wrapperHeight()
  expect(shrunkHeight).toBeLessThan(grownHeight - 5)
})
