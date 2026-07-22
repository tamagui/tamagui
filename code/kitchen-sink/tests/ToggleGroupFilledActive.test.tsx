import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression: a styled(ToggleGroup.Item) variant that sets a resting
// backgroundColor used to override activeStyle, because that resting value
// reached Toggle as a plain prop in buttonProps and was spread AFTER the
// activeStyle merge. the active item stayed stuck at its resting color.
test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ToggleGroupFilledActiveCase', type: 'useCase' })
})

const GREEN = 'rgb(0, 128, 0)'
const RED = 'rgb(255, 0, 0)'

test('filled variant: activeStyle wins on the initially-active item', async ({
  page,
}) => {
  // filled-a is active by default; activeStyle green must beat resting red
  await expect(page.locator('#filled-a')).toHaveCSS('background-color', GREEN)
  // inactive filled item keeps its resting red
  await expect(page.locator('#filled-b')).toHaveCSS('background-color', RED)
})

test('filled variant: activeStyle follows selection changes', async ({ page }) => {
  await page.click('#filled-b')
  await page.mouse.move(2, 2) // move off so hover styles do not mask the resting color
  await expect(page.locator('#filled-b')).toHaveCSS('background-color', GREEN)
  await expect(page.locator('#filled-a')).toHaveCSS('background-color', RED)
})
