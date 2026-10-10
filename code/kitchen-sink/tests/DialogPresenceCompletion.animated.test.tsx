import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

type DialogPresenceEvent = {
  open: boolean
  elapsed: number
  frames: number
}

async function getEvents(page: Page, id: string): Promise<DialogPresenceEvent[]> {
  return page.evaluate((scenarioId) => {
    return (window as any).__dialogPresenceEvents?.[scenarioId] || []
  }, id)
}

async function getUserEventCount(page: Page, id: string): Promise<number> {
  return page.evaluate((scenarioId) => {
    return (window as any).__dialogPresenceUserEvents?.[scenarioId] || 0
  }, id)
}

async function waitForTransitionEvent(
  page: Page,
  id: string,
  open: boolean,
  timeout = 3000
) {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const events = await getEvents(page, id)
    const event = events.find((item) => item.open === open)
    if (event) return event
    await page.waitForTimeout(50)
  }
  throw new Error(`Timed out waiting for ${id} ${open ? 'open' : 'close'} event`)
}

async function expectExactlyOneTransitionEvent(page: Page, id: string, open: boolean) {
  await page.waitForTimeout(300)
  const events = await getEvents(page, id)
  expect(events.filter((event) => event.open === open)).toHaveLength(1)
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'DialogPresenceCompletionCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

for (const id of ['portal', 'inline']) {
  test(`${id} dialog reports enter completion from the animation driver once`, async ({
    page,
  }) => {
    await setupPage(page, {
      name: 'DialogPresenceCompletionCase',
      type: 'useCase',
      searchParams: { explicitEnter: 'true' },
    })
    await expect(page.getByTestId(`${id}-open`)).toBeVisible()
    const frames = await page.evaluate(async (scenarioId) => {
      const samples: number[] = []
      ;(
        document.querySelector(`[data-testid="${scenarioId}-open"]`) as HTMLElement
      ).click()
      while (!window.__dialogPresenceEvents[scenarioId]?.some((event) => event.open)) {
        await new Promise(requestAnimationFrame)
        const node = document.querySelector(`[data-testid="${scenarioId}-content"]`)
        if (node) samples.push(Number(getComputedStyle(node).opacity))
      }
      return samples
    }, id)
    expect(
      frames.some((opacity) => opacity > 0 && opacity < 1),
      'enter must visibly interpolate'
    ).toBe(true)
    const event = await waitForTransitionEvent(page, id, true)
    expect(event.elapsed).toBeGreaterThanOrEqual(850)
    expect(event.frames).toBeGreaterThan(4)
    await expectExactlyOneTransitionEvent(page, id, true)
    expect(await getUserEventCount(page, id)).toBe(1)
  })

  test(`${id} dialog reports exit completion from the animation driver once`, async ({
    page,
  }) => {
    await page.getByTestId(`${id}-open`).click()
    await waitForTransitionEvent(page, id, true)
    await page.getByTestId(`${id}-close`).click()

    const event = await waitForTransitionEvent(page, id, false)
    expect(event.elapsed).toBeGreaterThanOrEqual(850)
    expect(event.frames).toBeGreaterThan(4)
    await expectExactlyOneTransitionEvent(page, id, false)
    await expect(page.getByTestId(`${id}-content`)).not.toBeVisible()
  })
}

test('non-modal overlay renders when authored without forceMount', async ({ page }) => {
  await page.getByTestId('nonmodal-open').click()
  await expect(page.getByTestId('nonmodal-overlay')).toBeVisible()
})

for (const id of ['portal', 'inline']) {
  test(`${id} dialog stays mounted and animates after Escape`, async ({ page }) => {
    await page.getByTestId(`${id}-open`).click()
    await waitForTransitionEvent(page, id, true)
    await expect(page.getByTestId(`${id}-content`)).toBeVisible()
    await expect(page.getByTestId(`${id}-content`)).toHaveCSS('opacity', '1')

    const frames = await page.evaluate(async (scenarioId) => {
      const node = document.querySelector(`[data-testid="${scenarioId}-content"]`)!
      const samples: number[] = []
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      while (node.isConnected) {
        await new Promise(requestAnimationFrame)
        if (node.isConnected) samples.push(Number(getComputedStyle(node).opacity))
      }
      return samples
    }, id)

    expect(frames.length, 'exit must survive the first animation frame').toBeGreaterThan(
      0
    )
    await test.info().attach(`${id}-exit-frames`, {
      body: JSON.stringify(frames),
      contentType: 'application/json',
    })
    expect(
      frames[0],
      'the first exit frame must not snap to transparent'
    ).toBeGreaterThan(0)
    expect(
      frames.some((opacity) => opacity > 0 && opacity < 1),
      'exit must visibly interpolate opacity'
    ).toBe(true)
    await expect(page.getByTestId(`${id}-state`)).toHaveText('closed')
    await expect(page.getByTestId(`${id}-content`)).toHaveCount(0)
  })
}

const axisTargets: Record<string, [number, number]> = {
  translateZ: [14, 40],
  rotateX: [6, Math.sin((20 * Math.PI) / 180)],
  rotateY: [8, Math.sin((30 * Math.PI) / 180)],
  rotateZ: [1, Math.sin((15 * Math.PI) / 180)],
  skewX: [4, Math.tan((10 * Math.PI) / 180)],
  skewY: [1, Math.tan((5 * Math.PI) / 180)],
  perspective: [11, -1 / 400],
}

for (const transformCase of ['family', ...Object.keys(axisTargets), 'composition']) {
  test(`portal ${transformCase} transforms animate during exit`, async ({ page }) => {
    await setupPage(page, {
      name: 'DialogPresenceCompletionCase',
      type: 'useCase',
      searchParams: { transformCase },
    })
    await page.getByTestId('portal-open').click()
    await waitForTransitionEvent(page, 'portal', true)
    await expect(page.getByTestId('portal-content')).toBeVisible()
    await expect(page.getByTestId('portal-content')).toHaveCSS('opacity', '1')
    const frames = await page.evaluate(async () => {
      const node = document.querySelector('[data-testid="portal-content"]')!
      const sample = () => {
        const style = getComputedStyle(node)
        const matrix = new DOMMatrix(
          style.transform === 'none' ? undefined : style.transform
        )
        return {
          x: matrix.m41 + (style.translate === 'none' ? 0 : parseFloat(style.translate)),
          y:
            matrix.m42 +
            (style.translate === 'none'
              ? 0
              : Number.parseFloat(style.translate.split(' ')[1] || '0')),
          scaleY:
            Math.hypot(matrix.c, matrix.d) *
            (style.scale === 'none'
              ? 1
              : Number.parseFloat(style.scale.split(' ')[1] || style.scale)),
          scale:
            Math.hypot(matrix.a, matrix.b) *
            (style.scale === 'none' ? 1 : parseFloat(style.scale)),
          angle:
            (Math.atan2(matrix.b, matrix.a) * 180) / Math.PI +
            (style.rotate === 'none' ? 0 : parseFloat(style.rotate)),
          matrix: Array.from(matrix.toFloat64Array()),
        }
      }
      const samples = [sample()]
      document.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Escape', bubbles: true })
      )
      while (node.isConnected) {
        await new Promise(requestAnimationFrame)
        if (node.isConnected) samples.push(sample())
      }
      return samples
    })
    expect(frames.length).toBeGreaterThan(2)
    if (transformCase === 'family') {
      expect(frames.some((frame) => frame.x > 0 && frame.x < 40)).toBe(true)
      expect(frames.some((frame) => frame.y > 0 && frame.y < 20)).toBe(true)
      expect(frames.some((frame) => frame.scaleY > 0.8 && frame.scaleY < 0.99)).toBe(true)
      expect(frames.some((frame) => frame.scale > 0.8 && frame.scale < 0.99)).toBe(true)
      expect(frames.some((frame) => frame.angle > 1 && frame.angle < 44)).toBe(true)
    } else if (transformCase in axisTargets) {
      const [axis, target] = axisTargets[transformCase]
      const initial = frames[0].matrix[axis]
      const intermediate = frames.filter((frame) => {
        const progress = (frame.matrix[axis] - initial) / (target - initial)
        return progress > 0.05 && progress < 0.95
      })
      expect(
        new Set(intermediate.map((frame) => frame.matrix[axis])).size,
        `${transformCase} must visibly interpolate, not jump to its target`
      ).toBeGreaterThan(2)
    } else {
      expect(frames[0].angle).toBeCloseTo(30, 1)
      expect(
        frames[1].angle,
        'rotation must survive the first exit frame'
      ).toBeGreaterThan(25)
      expect(
        frames.some(
          (frame) => frame.angle > 1 && frame.scale > 0.71 && frame.scale < 0.99
        )
      ).toBe(true)
    }
    await expect(page.getByTestId('portal-content')).toHaveCount(0)
  })
}
