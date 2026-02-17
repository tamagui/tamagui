import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StackZIndex', type: 'useCase' })
})

// find the portal wrapper's z-index by looking for the ancestor with
// position:fixed + inline z-index (portal wrappers use inline styles)
function makeGetZIndexOf(page: any) {
  return async function getZIndexOf(selector: string) {
    return await page.locator(selector).evaluate((el: Element) => {
      let current: Element | null = el
      while (current && current instanceof HTMLElement) {
        if (current.style.position === 'fixed' && current.style.zIndex) {
          return Number.parseInt(current.style.zIndex, 10)
        }
        current = current.parentElement
      }
      throw new Error(`no portal z-index found`)
    })
  }
}

test(`dialogs and portals stack their z-index automatically`, async ({ page }) => {
  const getZIndexOf = makeGetZIndexOf(page)

  const [a, b, c] = await Promise.all([
    getZIndexOf('#bottom-popover'),
    getZIndexOf('#middle-dialog'),
    getZIndexOf('#top-popover'),
  ])

  expect(c).toBeGreaterThan(b)
  expect(b).toBeGreaterThan(a)
})

test(`harcoded z-index overrides stacking z-index`, async ({ page }) => {
  const getZIndexOf = makeGetZIndexOf(page)

  const [a, b, c] = await Promise.all([
    getZIndexOf('#hardcoded-popover'),
    getZIndexOf('#hardcoded-dialog'),
    getZIndexOf('#above-hardcoded-dialog'),
  ])

  expect(a).toBe(200_000)
  expect(b).toBe(300_000)
  expect(c).toBe(300_001)
})
