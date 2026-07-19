import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

const bg = (loc: any) =>
  loc.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor)

test('Surface: nothing on by default, facets opt-in, level re-binds the theme', async ({
  page,
}) => {
  // v4 themes ship the surface1-3 sub-themes the `level` variant re-binds to.
  await setupPage(page, {
    name: 'SurfaceCase',
    type: 'useCase',
    searchParams: { v4theme: 'true' },
  })

  const bare = page.getByTestId('surface-bare')
  const filled = page.getByTestId('surface-filled')
  const outlined = page.getByTestId('surface-outlined')
  const l1 = page.getByTestId('surface-level-1')
  const l2 = page.getByTestId('surface-level-2')

  await expect(bare).toBeVisible()
  await expect(filled).toBeVisible()

  // nothing on by default: a bare Surface paints no background
  expect(await bg(bare)).toBe('rgba(0, 0, 0, 0)')

  // filled paints a background
  const filledBg = await bg(filled)
  expect(filledBg).not.toBe('rgba(0, 0, 0, 0)')

  // outlined adds a border
  const outlinedBorder = await outlined.evaluate(
    (el: HTMLElement) => getComputedStyle(el).borderTopWidth
  )
  expect(outlinedBorder).not.toBe('0px')

  // `level` re-binds the subtree theme (surface1 vs surface2), so filled
  // surfaces at different levels resolve to different backgrounds
  const l1Bg = await bg(l1)
  const l2Bg = await bg(l2)
  expect(l1Bg).not.toBe('rgba(0, 0, 0, 0)')
  expect(l1Bg).not.toBe(l2Bg)
})
