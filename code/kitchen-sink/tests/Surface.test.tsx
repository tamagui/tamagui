import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

const bg = (loc: any) =>
  loc.evaluate((el: HTMLElement) => getComputedStyle(el).backgroundColor)

test('Surface: nothing on by default, facets opt-in, level re-binds the theme', async ({
  page,
}) => {
  // v6 ships relative level themes for the `level` boundary.
  await setupPage(page, {
    name: 'SurfaceCase',
    type: 'useCase',
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

  // rounded resolves the default radius token — a real radius under a config
  // that declares no custom variables
  const outlinedRadius = await outlined.evaluate(
    (el: HTMLElement) => getComputedStyle(el).borderTopLeftRadius
  )
  expect(outlinedRadius).not.toBe('0px')

  // `level` re-binds the subtree theme, so filled
  // surfaces at different levels resolve to different backgrounds
  const l1Bg = await bg(l1)
  const l2Bg = await bg(l2)
  expect(l1Bg).not.toBe('rgba(0, 0, 0, 0)')
  expect(l1Bg).not.toBe(l2Bg)
})
