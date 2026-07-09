import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

const contentSelector = '[data-testid="dialog-adapt-content"]'
const targetSelector = '[data-testid="dialog-adapt-target"]'
const frameSelector = '[data-testid="dialog-adapt-sheet-frame"]'

async function openAdaptedDialog(page: Page) {
  await page.getByTestId('dialog-adapt-open').click()
  await expect(page.getByTestId('dialog-adapt-content')).toBeAttached({
    timeout: 5000,
  })
  await expect.poll(() => getSheetState(page), { timeout: 5000 }).toBe('open')
}

async function getSheetState(page: Page) {
  return page.evaluate(
    (selector) => document.querySelector(selector)?.getAttribute('data-state') ?? null,
    frameSelector
  )
}

async function contentIsInTarget(page: Page) {
  return page.evaluate(
    ({ contentSelector, targetSelector }) => {
      const content = document.querySelector(contentSelector)
      const target = document.querySelector(targetSelector)
      return Boolean(content && target && target.contains(content))
    },
    { contentSelector, targetSelector }
  )
}

type Sample = {
  t: number
  exists: boolean
  inTarget: boolean
  sheetState: string | null
}

async function sampleAfter(
  page: Page,
  action: 'flip-off' | 'close-during-flip' | 'reopen-during-exit'
) {
  return page.evaluate(
    ({ action, contentSelector, targetSelector, frameSelector }) =>
      new Promise<Sample[]>((resolve) => {
        const api = (window as any).__dialogAdaptHandoff
        const startedAt = performance.now()
        const samples: Sample[] = []

        const record = () => {
          const content = document.querySelector(contentSelector)
          const target = document.querySelector(targetSelector)

          samples.push({
            t: performance.now() - startedAt,
            exists: Boolean(content),
            inTarget: Boolean(content && target && target.contains(content)),
            sheetState:
              document.querySelector(frameSelector)?.getAttribute('data-state') ?? null,
          })
        }

        if (action === 'flip-off') {
          api.setAdapted(false)
        } else if (action === 'close-during-flip') {
          api.setAdapted(false)
          setTimeout(() => api.setOpen(false), 80)
        } else {
          api.setOpen(false)
          setTimeout(() => api.setOpen(true), 80)
        }

        record()

        const sample = () => {
          record()

          if (performance.now() - startedAt >= 700) {
            resolve(samples)
            return
          }

          requestAnimationFrame(sample)
        }

        requestAnimationFrame(sample)
      }),
    { action, contentSelector, targetSelector, frameSelector }
  )
}

function expectContentDuringEarlySheetExit(samples: Sample[]) {
  const firstClosedAt = samples.find((sample) => sample.sheetState === 'closed')?.t

  expect(firstClosedAt, 'sheet should enter closed state during the sample').toBeDefined()

  const earlyClosedSamples = samples.filter(
    (sample) =>
      firstClosedAt != null &&
      sample.t >= firstClosedAt &&
      sample.t - firstClosedAt <= 250
  )

  expect(earlyClosedSamples.length).toBeGreaterThan(0)

  for (const sample of earlyClosedSamples) {
    expect
      .soft(
        sample.exists,
        `content should remain mounted ${Math.round(
          sample.t - (firstClosedAt ?? 0)
        )}ms after sheet entered closed state`
      )
      .toBe(true)
  }
}

test.describe('Dialog Sheet Adapt handoff', () => {
  test.use({ viewport: { width: 600, height: 900 } })

  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'DialogSheetAdaptHandoffCase',
      type: 'useCase',
    })
  })

  test('live-publish updates adapted Dialog content props without remounting', async ({
    page,
  }) => {
    await openAdaptedDialog(page)
    await expect(page.getByTestId('dialog-adapt-revision')).toHaveText('revision: 0')
    expect(await contentIsInTarget(page)).toBe(true)

    const instanceBefore = await page.getByTestId('dialog-adapt-instance').textContent()

    await page.getByTestId('dialog-adapt-update').click()
    await expect(page.getByTestId('dialog-adapt-revision')).toHaveText('revision: 1')
    await expect(page.getByTestId('dialog-adapt-instance')).toHaveText(
      instanceBefore ?? ''
    )
    expect(await contentIsInTarget(page)).toBe(true)
  })

  test('open media handoff keeps content through sheet exit and returns it on re-adapt', async ({
    page,
  }) => {
    await openAdaptedDialog(page)

    const samples = await sampleAfter(page, 'flip-off')
    expectContentDuringEarlySheetExit(samples)

    await expect(page.getByTestId('dialog-adapt-content')).toBeAttached({
      timeout: 5000,
    })
    await expect.poll(() => contentIsInTarget(page), { timeout: 5000 }).toBe(false)

    await page.evaluate(() => {
      ;(window as any).__dialogAdaptHandoff.setAdapted(true)
    })

    await expect.poll(() => contentIsInTarget(page), { timeout: 5000 }).toBe(true)
    await expect.poll(() => getSheetState(page), { timeout: 5000 }).toBe('open')
  })

  test('close during media handoff releases the adapted content after exit', async ({
    page,
  }) => {
    await openAdaptedDialog(page)

    const samples = await sampleAfter(page, 'close-during-flip')
    expectContentDuringEarlySheetExit(samples)

    await expect
      .poll(
        () =>
          page.evaluate(
            (selector) => Boolean(document.querySelector(selector)),
            contentSelector
          ),
        { timeout: 5000 }
      )
      .toBe(false)
  })

  test('reopen during sheet exit keeps the adapted content instance alive', async ({
    page,
  }) => {
    await openAdaptedDialog(page)

    const instanceBefore = await page.getByTestId('dialog-adapt-instance').textContent()
    const samples = await sampleAfter(page, 'reopen-during-exit')
    expectContentDuringEarlySheetExit(samples)

    await expect(page.getByTestId('dialog-adapt-content')).toBeAttached({
      timeout: 5000,
    })
    await expect(page.getByTestId('dialog-adapt-instance')).toHaveText(
      instanceBefore ?? ''
    )
    await expect.poll(() => getSheetState(page), { timeout: 5000 }).toBe('open')
  })
})
