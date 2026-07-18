import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression: Accordion.HeightAnimator used height:'auto' for the open-but-not-
// yet-measured state. with a transition set, the CSS animation driver writes
// height inline and cannot tween out of 'auto', so the wrapper froze at
// height:auto -> collapsed to 0. the content (absolutely positioned) then spilled
// out of layout and rendered below the last item, and nothing animated.
// the demo drives collapse with the `transition` prop, which is a CSS-transition
// the default-open layout check runs under css, while the frame-level motion check
// runs under both css and reanimated so web cannot hide a native-driver snap.
test('open item reserves height and pushes siblings below its content', async ({
  page,
}) => {
  await setupPage(page, {
    name: 'AccordionDefaultOpenCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
  const content = page.locator('#def-content')
  const marker = page.locator('#after-accordion-marker')
  await expect(content).toBeVisible()

  const contentBox = await content.boundingBox()
  const trigger2Box = await page.locator('#def-trigger2').boundingBox()
  const markerBox = await marker.boundingBox()
  expect(contentBox).not.toBeNull()
  expect(trigger2Box).not.toBeNull()
  expect(markerBox).not.toBeNull()

  // content of the open item has real height (not collapsed to 0)
  expect(contentBox!.height).toBeGreaterThan(10)

  // the next item's trigger sits at or below the open content bottom (no overlap,
  // content is not rendering below the last item)
  expect(trigger2Box!.y).toBeGreaterThanOrEqual(contentBox!.y + contentBox!.height - 2)
  expect(markerBox!.y).toBeGreaterThanOrEqual(trigger2Box!.y + trigger2Box!.height - 2)
})

for (const animationDriver of ['css', 'reanimated']) {
  test(`${animationDriver}: toggling and reversing samples numeric wrapper height`, async ({
    page,
  }) => {
    await setupPage(page, {
      name: 'AccordionDefaultOpenCase',
      type: 'useCase',
      searchParams: { animationDriver },
    })

    const result = await page.evaluate(async () => {
      const trigger = document.getElementById('def-trigger2')
      const wrapper = document.getElementById('def-height2')
      const marker = document.getElementById('after-accordion-marker')
      if (!trigger || !wrapper || !marker) throw new Error('accordion test nodes missing')

      const sampleFor = async (durationMs: number) => {
        const samples: Array<{ height: number; markerY: number }> = []
        const startedAt = performance.now()
        do {
          await new Promise(requestAnimationFrame)
          samples.push({
            height: Number.parseFloat(getComputedStyle(wrapper).height),
            markerY: marker.getBoundingClientRect().y,
          })
        } while (performance.now() - startedAt < durationMs)
        return samples
      }

      trigger.click()
      const opening = await sampleFor(450)
      const initialOpenHeight = opening.at(-1)?.height ?? 0

      const resize = document.getElementById('grow-content')
      if (!resize) throw new Error('accordion resize control missing')
      resize.click()
      const resizing = await sampleFor(450)
      const openHeight = resizing.at(-1)?.height ?? 0

      trigger.click()
      const closingBeforeReverse = await sampleFor(100)
      trigger.click()
      const reopening = await sampleFor(450)

      trigger.click()
      const closing = await sampleFor(450)

      return {
        opening,
        initialOpenHeight,
        resizing,
        openHeight,
        closingBeforeReverse,
        reopening,
        closing,
      }
    })

    expect(result.initialOpenHeight).toBeGreaterThan(10)
    expect(
      result.opening.some(
        ({ height }) => height > 1 && height < result.initialOpenHeight - 1
      )
    ).toBe(true)
    expect(result.openHeight).toBeGreaterThan(result.initialOpenHeight)
    expect(
      result.resizing.some(
        ({ height }) =>
          height > result.initialOpenHeight + 1 && height < result.openHeight - 1
      )
    ).toBe(true)

    const beforeReverse = result.closingBeforeReverse.at(-1)?.height ?? 0
    const afterReverse = result.reopening[0]?.height ?? 0
    expect(beforeReverse).toBeGreaterThan(1)
    expect(beforeReverse).toBeLessThan(result.openHeight - 1)
    expect(afterReverse).toBeGreaterThan(1)
    expect(afterReverse).toBeLessThan(result.openHeight - 1)
    expect(Math.abs(afterReverse - beforeReverse)).toBeLessThan(15)
    expect(result.reopening.at(-1)?.height).toBeCloseTo(result.openHeight, 0)

    expect(
      result.closing.some(({ height }) => height > 1 && height < result.openHeight - 1)
    ).toBe(true)
    expect(result.closing.at(-1)?.height).toBeLessThanOrEqual(1)
    expect(result.closing.at(-1)?.markerY).toBeLessThan(result.closing[0]?.markerY ?? 0)
    await expect(page.locator('#def-content2')).toHaveCount(0)
  })
}
