import { expect, test } from '@playwright/test'
import type { Page } from '@playwright/test'

// A modal Sheet with unmountChildrenWhenHidden throws its frame away on close
// and builds a new one on the next open. The frame's animated position lives in
// a motion value that outlives the node, so the driver has to put that value on
// the new node — a node that never receives it renders at its untransformed
// layout position, which for a sheet frame is the top of the viewport.

// the sheet frame's animated wrapper: the absolutely positioned element the
// driver writes translateY into. keyed off the sheet's zIndex, which the test
// page sets to a value nothing else uses.
const wrapperState = () => {
  const el = Array.from(document.querySelectorAll<HTMLElement>('body *')).find((e) => {
    const st = getComputedStyle(e)
    return st.position === 'absolute' && st.zIndex === '100000'
  })
  if (!el) return null
  const st = getComputedStyle(el)
  return {
    // null when the node carries no transform at all
    translateY: st.transform === 'none' ? null : new DOMMatrixReadOnly(st.transform).m42,
    height: el.getBoundingClientRect().height,
  }
}

// sample the wrapper every frame for `ms`, keeping one entry per distinct
// position so a settled sheet collapses to a single reading.
async function recordPositions(page: Page, ms: number) {
  return page.evaluate(async (duration) => {
    const read = (window as any).__readWrapper as () => {
      translateY: number | null
      height: number
    } | null
    const out: (number | null)[] = []
    const started = performance.now()
    await new Promise<void>((resolve) => {
      const tick = () => {
        const s = read()
        if (s) {
          const rounded = s.translateY === null ? null : Math.round(s.translateY)
          if (out.length === 0 || out.at(-1) !== rounded) out.push(rounded)
        }
        if (performance.now() - started >= duration) return resolve()
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    return out
  }, ms)
}

test('a sheet that unmounts while hidden still animates in when reopened', async ({
  page,
}) => {
  await page.goto('/test/sheet-unmount-when-hidden')
  await page.waitForSelector('[data-testid="open-sheet"]')
  await page.addScriptTag({ content: `window.__readWrapper = ${wrapperState}` })

  const viewportHeight = page.viewportSize()!.height

  const openAndRecord = async () => {
    const recording = recordPositions(page, 1200)
    await page.locator('[data-testid="open-sheet"]').click()
    return recording
  }
  const closeAndSettle = async () => {
    await page.locator('[data-testid="close-sheet"]').click()
    await page.waitForTimeout(1200)
  }

  const firstOpen = await openAndRecord()
  const restingY = firstOpen.at(-1)
  expect(restingY, 'first open settles at a resting position').not.toBeNull()
  expect(restingY!).toBeGreaterThan(0)
  expect(restingY!).toBeLessThan(viewportHeight)

  await closeAndSettle()
  const secondOpen = await openAndRecord()

  // the whole point: a reopened frame must never paint untransformed, which
  // would put it at the top of the viewport at full width.
  expect(
    secondOpen.includes(null),
    `reopened frame painted with no transform: ${JSON.stringify(secondOpen)}`
  ).toBe(false)

  // and it has to travel, from off-screen to the same resting position, rather
  // than snapping straight there.
  expect(
    secondOpen.length,
    `reopened frame did not animate: ${JSON.stringify(secondOpen)}`
  ).toBeGreaterThan(5)
  expect(secondOpen[0]!).toBeGreaterThanOrEqual(viewportHeight)
  expect(secondOpen.at(-1)!).toBeCloseTo(restingY!, -1)
})
