import { expect, test } from '@playwright/test'

test.beforeEach(async ({ page }) => {
  await page.goto('/?test=MenuAsChildPositionCase')
})

test('Menu.Trigger asChild does not leak position static class to child', async ({
  page,
}) => {
  const menuTrigger = page.locator('[data-testid="menu-trigger-button"]')
  await expect(menuTrigger).toBeVisible()

  // should not have _pos-static class leaked from View defaults via asChild
  const className = await menuTrigger.getAttribute('class')
  expect(className).not.toContain('_pos-static')
})
