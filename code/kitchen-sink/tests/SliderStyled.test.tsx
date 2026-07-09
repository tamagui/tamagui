import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression test: the slider track and active fill became invisible after
// $backgroundActive was removed from themes (the track/fill inherited the
// page $background so nothing rendered on a plain background)

let pageErrors: Error[]

test.beforeEach(async ({ page }) => {
  pageErrors = []
  page.on('pageerror', (error) => pageErrors.push(error))
  await setupPage(page, { name: 'Slider', type: 'demo' })
})

test('slider track and active fill render with visible backgrounds', async ({ page }) => {
  await expect(page.locator('.is_SliderActive').first()).toBeVisible()

  const colors = await page.evaluate(() => {
    const active = document.querySelector('.is_SliderActive') as HTMLElement
    const track = active.parentElement as HTMLElement
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
