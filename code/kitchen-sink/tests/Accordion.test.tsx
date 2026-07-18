import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression: Accordion.HeightAnimator used height:'auto' for the open-but-not-
// yet-measured state. with a transition set, the CSS animation driver writes
// height inline and cannot tween out of 'auto', so the wrapper froze at
// height:auto -> collapsed to 0. the content (absolutely positioned) then spilled
// out of layout and rendered below the last item, and nothing animated.
for (const animationDriver of ['css', 'reanimated']) {
  test(`${animationDriver}: default-open layout never collapses on its first frames`, async ({
    page,
  }) => {
    await page.addInitScript(() => {
      globalThis['__accordionFirstFrames'] = []
      // the sampling window starts at the first frame the accordion exists, not
      // at script init — under load the page can take longer than any fixed
      // budget to appear, and a window that expires early would assert on an
      // empty array (a vacuous pass/fail)
      let firstSampleAt: number | null = null
      const sample = () => {
        const wrapper = document.getElementById('def-height')
        const content = document.getElementById('def-content')
        const marker = document.getElementById('after-accordion-marker')
        if (wrapper && content && marker) {
          if (firstSampleAt === null) firstSampleAt = performance.now()
          const wrapperRect = wrapper.getBoundingClientRect()
          const contentRect = content.getBoundingClientRect()
          const markerRect = marker.getBoundingClientRect()
          globalThis['__accordionFirstFrames'].push({
            wrapperHeight: wrapperRect.height,
            contentBottom: contentRect.y + contentRect.height,
            markerY: markerRect.y,
          })
        }
        if (firstSampleAt === null || performance.now() - firstSampleAt < 1200) {
          requestAnimationFrame(sample)
        }
      }
      requestAnimationFrame(sample)
    })

    await setupPage(page, {
      name: 'AccordionDefaultOpenCase',
      type: 'useCase',
      searchParams: { animationDriver },
    })
    await page.waitForFunction(
      () => globalThis['__accordionFirstFrames'].length > 20,
      undefined,
      { timeout: 30_000 }
    )

    const frames = await page.evaluate<
      Array<{ wrapperHeight: number; contentBottom: number; markerY: number }>
    >(() => globalThis['__accordionFirstFrames'])
    expect(frames.length).toBeGreaterThan(20)
    expect(
      Math.min(...frames.map(({ wrapperHeight }) => wrapperHeight)),
      JSON.stringify(frames)
    ).toBeGreaterThan(10)
    expect(
      Math.min(...frames.map(({ markerY, contentBottom }) => markerY - contentBottom))
    ).toBeGreaterThanOrEqual(-2)

    const closing = await page.evaluate(async () => {
      const trigger = document.getElementById('def-trigger')
      const wrapper = document.getElementById('def-height')
      if (!trigger || !wrapper) throw new Error('default-open accordion nodes missing')

      const openHeight = wrapper.getBoundingClientRect().height
      trigger.click()
      const heights: number[] = []
      const startedAt = performance.now()
      do {
        await new Promise(requestAnimationFrame)
        heights.push(wrapper.getBoundingClientRect().height)
      } while (performance.now() - startedAt < 450)
      return { openHeight, heights }
    })

    expect(
      closing.heights.some((height) => height > 1 && height < closing.openHeight - 1)
    ).toBe(true)
    expect(closing.heights.at(-1)).toBeLessThanOrEqual(1)
  })

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
      // once the open animation settles the wrapper releases back to auto
      // (no inline height), so content and viewport changes stay fluid
      await new Promise((resolve) => setTimeout(resolve, 300))
      const inlineAfterOpen = (wrapper as HTMLElement).style.height

      const resize = document.getElementById('grow-content')
      if (!resize) throw new Error('accordion resize control missing')
      resize.click()
      const resizing = await sampleFor(450)
      const openHeight = resizing.at(-1)?.height ?? 0
      const inlineAfterResize = (wrapper as HTMLElement).style.height

      trigger.click()
      const closingBeforeReverse = await sampleFor(100)
      trigger.click()
      const reopening = await sampleFor(450)

      trigger.click()
      const closing = await sampleFor(450)

      return {
        opening,
        initialOpenHeight,
        inlineAfterOpen,
        resizing,
        openHeight,
        inlineAfterResize,
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
    // at rest the wrapper is auto height: content growth applies immediately
    // and no inline pixel height lingers (drivers paint '' or an explicit auto)
    expect(result.inlineAfterOpen.endsWith('px')).toBe(false)
    expect(result.openHeight).toBeGreaterThan(result.initialOpenHeight)
    expect(result.inlineAfterResize.endsWith('px')).toBe(false)

    const beforeReverse = result.closingBeforeReverse.at(-1)?.height ?? 0
    const afterReverse = result.reopening[0]?.height ?? 0
    expect(beforeReverse).toBeGreaterThan(1)
    expect(beforeReverse).toBeLessThan(result.openHeight - 1)
    expect(afterReverse).toBeGreaterThan(1)
    expect(afterReverse).toBeLessThan(result.openHeight - 1)
    expect(Math.abs(afterReverse - beforeReverse)).toBeLessThan(
      result.openHeight * 0.2
    )
    expect(result.reopening.at(-1)?.height).toBeCloseTo(result.openHeight, 0)

    expect(
      result.closing.some(({ height }) => height > 1 && height < result.openHeight - 1)
    ).toBe(true)
    expect(result.closing.at(-1)?.height).toBeLessThanOrEqual(1)
    expect(result.closing.at(-1)?.markerY).toBeLessThan(result.closing[0]?.markerY ?? 0)
    await expect(page.locator('#def-content2')).toHaveCount(0)
  })
}

test('reanimated clears absent keys and seeds them again on reappearance', async ({
  page,
}) => {
  await setupPage(page, {
    name: 'AccordionDefaultOpenCase',
    type: 'useCase',
    searchParams: { animationDriver: 'reanimated' },
  })

  const probe = page.locator('#animated-key-probe')
  const initial = await probe.boundingBox()
  expect(initial).not.toBeNull()
  expect(initial!.height).toBeCloseTo(40, 0)

  await page.locator('#toggle-key-probe').click()
  await page.waitForTimeout(150)
  const absent = await probe.boundingBox()
  expect(absent).not.toBeNull()
  expect(absent!.height).toBeLessThanOrEqual(1)
  expect(absent!.x).toBeLessThan(initial!.x - 30)

  await page.locator('#toggle-key-probe').click()
  await page.waitForTimeout(150)
  const reappeared = await probe.boundingBox()
  expect(reappeared).not.toBeNull()
  expect(reappeared!.height).toBeCloseTo(40, 0)
  expect(reappeared!.x).toBeCloseTo(initial!.x, 0)
})
