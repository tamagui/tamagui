import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression test: the slider track and active fill became invisible after
// background-press was removed from themes (the track/fill inherited the
// page background so nothing rendered on a plain background)

let pageErrors: Error[]

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
  await setupPage(page, { name: 'Slider', type: 'demo' })
})

test('slider track and active fill render with visible backgrounds', async ({ page }) => {
  await expect(page.getByTestId('slider-track-active').first()).toBeVisible()

  const colors = await page.evaluate(() => {
    // the styled skin names the active fill SliderTrackActive; component themes
    // were removed, so it now sits directly inside the track
    const active = document.querySelector(
      '[data-testid="slider-track-active"]'
    ) as HTMLElement
    const track = active.closest('[data-testid="slider-track"]') as HTMLElement
    const getBg = (el: HTMLElement) => getComputedStyle(el).backgroundColor
    return { track: getBg(track), active: getBg(active) }
  })

  const transparent = new Set(['rgba(0, 0, 0, 0)', 'transparent'])
  expect(transparent.has(colors.track)).toBe(false)
  expect(transparent.has(colors.active)).toBe(false)
  // the fill must stand out from the rail
  expect(colors.active).not.toBe(colors.track)

  expect(pageErrors).toHaveLength(0)
})

test('slider thumb is centered on the track, vertical and horizontal', async ({
  page,
}) => {
  const centers = await page.evaluate(() => {
    const thumbs = Array.from(document.querySelectorAll('[role="slider"]'))
    return thumbs.map((thumb) => {
      const thumbEl = thumb as HTMLElement
      const frame =
        (thumbEl.closest('.is_Slider') as HTMLElement) ||
        (thumbEl.parentElement?.parentElement as HTMLElement)
      const track = frame.querySelector('[data-testid="slider-track"]') as HTMLElement
      const rTrack = track.getBoundingClientRect()
      const rThumb = thumbEl.getBoundingClientRect()
      return {
        orientation: thumbEl.getAttribute('aria-orientation'),
        trackCenter: { x: rTrack.x + rTrack.width / 2, y: rTrack.y + rTrack.height / 2 },
        thumbCenter: { x: rThumb.x + rThumb.width / 2, y: rThumb.y + rThumb.height / 2 },
      }
    })
  })

  expect(centers).toHaveLength(2)
  for (const item of centers) {
    // Both horizontal and vertical sliders must have their thumb center matching track center within 1px
    expect(Math.abs(item.thumbCenter.x - item.trackCenter.x)).toBeLessThanOrEqual(1)
    expect(Math.abs(item.thumbCenter.y - item.trackCenter.y)).toBeLessThanOrEqual(1)
  }
})
