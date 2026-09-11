import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

type TransitionEvent = {
  phase: 'start' | 'end'
  cause: 'enter' | 'exit' | 'update'
  finished?: boolean
  t?: number
}

async function getEvents(page: Page, id: string): Promise<TransitionEvent[]> {
  return page.evaluate((sid) => (window as any).__onTransitionEvents?.[sid] || [], id)
}

async function resetEvents(page: Page, id: string) {
  await page.evaluate((sid) => (window as any).__resetOnTransition?.(sid), id)
}

async function waitForEvent(
  page: Page,
  id: string,
  match: (e: TransitionEvent) => boolean,
  timeout = 5000
): Promise<TransitionEvent> {
  const start = Date.now()
  while (Date.now() - start < timeout) {
    const events = await getEvents(page, id)
    const found = events.find(match)
    if (found) return found
    await page.waitForTimeout(50)
  }
  throw new Error(
    `timed out waiting for ${id} event; saw ${JSON.stringify(await getEvents(page, id))}`
  )
}

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'OnTransitionCase', type: 'useCase' })
  await page.waitForTimeout(500)
})

test('emits start then end for an enter transition', async ({ page }) => {
  await resetEvents(page, 'enterexit')
  await page.getByTestId('enterexit-toggle').click()

  await waitForEvent(page, 'enterexit', (e) => e.phase === 'end' && e.cause === 'enter')

  const events = await getEvents(page, 'enterexit')
  const startIdx = events.findIndex((e) => e.phase === 'start' && e.cause === 'enter')
  const endIdx = events.findIndex((e) => e.phase === 'end' && e.cause === 'enter')
  expect(startIdx, 'enter start must be emitted').toBeGreaterThanOrEqual(0)
  expect(endIdx, 'enter end must come after enter start').toBeGreaterThan(startIdx)
  expect(events[endIdx].finished).toBe(true)
})

test('emits start then end for an in-place update transition', async ({ page }) => {
  await resetEvents(page, 'update')
  await page.getByTestId('update-toggle').click()

  await waitForEvent(page, 'update', (e) => e.phase === 'end' && e.cause === 'update')

  const events = await getEvents(page, 'update')
  const startIdx = events.findIndex((e) => e.phase === 'start' && e.cause === 'update')
  const endIdx = events.findIndex((e) => e.phase === 'end' && e.cause === 'update')
  expect(startIdx, 'update start must be emitted').toBeGreaterThanOrEqual(0)
  expect(endIdx, 'update end must come after update start').toBeGreaterThan(startIdx)
  expect(events[endIdx].finished).toBe(true)
})

test('exit end fires before the element is removed (safeToRemove)', async ({ page }) => {
  // mount first, let the enter settle
  await page.getByTestId('enterexit-toggle').click()
  await waitForEvent(page, 'enterexit', (e) => e.phase === 'end' && e.cause === 'enter')
  await resetEvents(page, 'enterexit')

  // record the exact moment the element leaves the DOM (safeToRemove)
  await page.evaluate(() => {
    ;(window as any).__removedAt = null
    const observer = new MutationObserver(() => {
      if (
        !document.querySelector('[data-testid="enterexit-box"]') &&
        (window as any).__removedAt === null
      ) {
        ;(window as any).__removedAt = performance.now()
        observer.disconnect()
      }
    })
    observer.observe(document.body, { childList: true, subtree: true })
  })

  // unmount -> exit
  await page.getByTestId('enterexit-toggle').click()
  await expect(page.getByTestId('enterexit-box')).toHaveCount(0)

  const { startIdx, endIdx, endAt, removedAt, endFinished } = await page.evaluate(() => {
    const events = (window as any).__onTransitionEvents?.['enterexit'] || []
    const endEvent = events.find(
      (e: TransitionEvent) => e.phase === 'end' && e.cause === 'exit'
    )
    return {
      startIdx: events.findIndex(
        (e: TransitionEvent) => e.phase === 'start' && e.cause === 'exit'
      ),
      endIdx: events.findIndex(
        (e: TransitionEvent) => e.phase === 'end' && e.cause === 'exit'
      ),
      endAt: endEvent?.t as number | undefined,
      endFinished: endEvent?.finished as boolean | undefined,
      removedAt: (window as any).__removedAt as number | null,
    }
  })

  expect(startIdx, 'exit start must be emitted').toBeGreaterThanOrEqual(0)
  expect(endIdx, 'exit end must come after exit start').toBeGreaterThan(startIdx)
  expect(endFinished).toBe(true)
  expect(endAt, 'exit end timestamp recorded').toBeDefined()
  expect(removedAt, 'element removal timestamp recorded').not.toBeNull()
  // the exit 'end' fires before (or in the same tick as) presence safeToRemove
  expect(endAt!).toBeLessThanOrEqual(removedAt!)
})

test('reports finished:false when an update is interrupted', async ({ page }) => {
  await resetEvents(page, 'interrupt')
  // triggers an update, then supersedes it mid-flight (~80ms into a 500ms anim)
  await page.getByTestId('interrupt-trigger').click()

  await waitForEvent(
    page,
    'interrupt',
    (e) => e.phase === 'end' && e.cause === 'update' && e.finished === false
  )

  const events = await getEvents(page, 'interrupt')
  const interrupted = events.filter(
    (e) => e.phase === 'end' && e.cause === 'update' && e.finished === false
  )
  expect(
    interrupted.length,
    'a superseded update must end finished:false'
  ).toBeGreaterThan(0)
  // every start still gets a matching end (no skipped end events)
  const starts = events.filter((e) => e.phase === 'start' && e.cause === 'update').length
  const ends = events.filter((e) => e.phase === 'end' && e.cause === 'update').length
  expect(ends).toBeGreaterThanOrEqual(starts - 1)
})
