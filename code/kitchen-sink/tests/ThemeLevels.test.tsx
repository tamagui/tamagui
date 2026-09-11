import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeLevels', type: 'useCase' })
})

for (const scheme of ['light', 'dark'] as const) {
  test(`${scheme} base, panel, and button compose relative levels`, async ({ page }) => {
    await expect(page.locator(`#${scheme}-base-name`)).toHaveText(scheme)
    await expect(page.locator(`#${scheme}-panel-name`)).toHaveText(`${scheme}_level2`)
    await expect(page.locator(`#${scheme}-button-name`)).toHaveText(
      `${scheme}_level2_level2`
    )

    const button = await getStyles(page.locator(`#${scheme}-button`))
    const level3 = await getStyles(page.locator(`#${scheme}-level3-reference`))
    expect(button.backgroundColor).toBe(level3.backgroundColor)
  })
}

test('theme=red on Button resolves the red raised level', async ({ page }) => {
  await expect(page.locator('#red-level-button-name')).toHaveText('light_red_level2')

  const button = await getStyles(page.locator('#red-level-button'))
  const redLevel = await getStyles(page.locator('#red-level-reference'))
  const neutralLevel = await getStyles(page.locator('#light-button'))
  expect(button.backgroundColor).toBe(redLevel.backgroundColor)
  expect(button.backgroundColor).not.toBe(neutralLevel.backgroundColor)
})
