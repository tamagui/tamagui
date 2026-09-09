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
    const driver = (test.info().project.metadata as any).animationDriver as string
    await page.getByTestId(`${id}-open`).click()

    if (driver !== 'motion') {
      await page.waitForTimeout(500)
      expect(
        (await getEvents(page, id)).filter((event) => event.open),
        'enter should not complete before the 1000ms animation'
      ).toHaveLength(0)
    }

    const event = await waitForTransitionEvent(page, id, true)
    if (driver !== 'motion') {
      expect(event.elapsed).toBeGreaterThanOrEqual(850)
      // the same counter the branch below reads, proving it counts: css waits
      // out the whole 1000ms transition, so it spends frames rather than none
      expect(event.frames).toBeGreaterThan(4)
    } else {
      // a driver that reports completion itself lands within a frame or two of
      // the state change. a millisecond budget cannot say that on a loaded
      // machine, where the same two frames take 120ms.
      expect(
        event.frames,
        `${driver} has no changing driver-owned style in this fixture, so completion should not wait frames (elapsed ${event.elapsed}ms)`
      ).toBeLessThanOrEqual(2)
    }
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
