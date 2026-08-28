import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression test: checked and active states must use a persistent state color.
// v6 press colors intentionally rest, so controls use an accent for selection.

const transparent = new Set(['rgba(0, 0, 0, 0)', 'transparent'])

const getBg = (el: HTMLElement) => getComputedStyle(el).backgroundColor

// resolve a state-dependent locator to a stable per-element locator so it still
// matches after clicking flips the state it selected on
async function pin(page: import('@playwright/test').Page, selector: string) {
  const first = page.locator(selector).first()
  await expect(first).toBeVisible()
  const id = await first.evaluate((el) => {
    if (!el.id) el.id = `active-state-test-${Math.random().toString(36).slice(2)}`
    return el.id
  })
  return page.locator(`[id="${id}"]`)
}

test('checkbox checked state changes background', async ({ page }) => {
  await setupPage(page, { name: 'Checkbox', type: 'demo' })
  // select by role, not by skin class: the demo owns its own Checkbox skin now
  const checkbox = await pin(
    page,
    '[role="checkbox"][aria-checked="false"]:not([aria-disabled="true"])'
  )
  const before = await checkbox.evaluate(getBg)
  await checkbox.click()
  await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  await page.mouse.move(0, 0)
  await expect.poll(() => checkbox.evaluate(getBg)).not.toBe(before)
  const after = await checkbox.evaluate(getBg)
  expect(transparent.has(after)).toBe(false)
})

test('switch checked state changes background', async ({ page }) => {
  await setupPage(page, { name: 'Switch', type: 'demo' })
  const first = page.getByRole('switch', { checked: false }).first()
  await expect(first).toBeVisible()
  const id = await first.evaluate((el) => {
    if (!el.id) el.id = 'active-state-test-switch'
    return el.id
  })
  const switchEl = page.locator(`[id="${id}"]`)
  const before = await switchEl.evaluate(getBg)
  await switchEl.click()
  await expect(page.getByRole('switch', { checked: true }).and(switchEl)).toBeVisible()
  await page.mouse.move(0, 0)
  await expect.poll(() => switchEl.evaluate(getBg)).not.toBe(before)
  const after = await switchEl.evaluate(getBg)
  expect(transparent.has(after)).toBe(false)
})

test('active tab background differs from inactive', async ({ page }) => {
  await setupPage(page, { name: 'Tabs', type: 'demo' })
  const active = page.locator('[role="tab"][data-state="active"]').first()
  const inactive = page.locator('[role="tab"][data-state="inactive"]').first()
  await expect(active).toBeVisible()
  const activeBg = await active.evaluate(getBg)
  const inactiveBg = await inactive.evaluate(getBg)
  expect(activeBg).not.toBe(inactiveBg)
})

test('toggle-group active item background differs', async ({ page }) => {
  await setupPage(page, { name: 'ToggleGroup', type: 'demo' })
  const item = await pin(page, '.is_ToggleGroupItem[data-state="off"]')
  const before = await item.evaluate(getBg)
  await item.click()
  await expect(item).toHaveAttribute('data-state', 'on')
  await page.mouse.move(0, 0)
  await expect.poll(() => item.evaluate(getBg)).not.toBe(before)
})
