import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StackZIndex', type: 'useCase' })
})

test(`dialogs and portals stack their z-index automatically`, async ({ page }) => {
  async function getZIndexOf(selector: string) {
    return await page.locator(selector).evaluate((el) => {
      function findEffectiveZIndex(element: Element): number {
        let current = element
        while (current && current instanceof HTMLElement) {
          if (current.parentElement?.tagName !== 'BODY') {
            current = current.parentElement!
          } else {
            const zIndex = window.getComputedStyle(current).zIndex
            if (zIndex !== 'auto' && zIndex !== '') {
              return Number.parseInt(zIndex, 10)
            }
          }
        }
        throw new Error(`none found`)
      }

      return findEffectiveZIndex(el)
    })
  }

  const [a, b, c] = await Promise.all([
    getZIndexOf('#bottom-popover'),
    getZIndexOf('#middle-dialog'),
    getZIndexOf('#top-popover'),
  ])

  expect(c).toBeGreaterThan(b)
  expect(b).toBeGreaterThan(a)
})

test(`harcoded z-index overrides stacking z-index`, async ({ page }) => {
  async function getZIndexOf(selector: string) {
    return await page.locator(selector).evaluate((el) => {
      function findEffectiveZIndex(element: Element): number {
        let current = element
        while (current && current instanceof HTMLElement) {
          if (current.parentElement?.tagName !== 'BODY') {
            current = current.parentElement!
          } else {
            const zIndex = window.getComputedStyle(current).zIndex
            if (zIndex !== 'auto' && zIndex !== '') {
              return Number.parseInt(zIndex, 10)
            }
          }
        }
        throw new Error(`none found`)
      }

      return findEffectiveZIndex(el)
    })
  }

  const [a, b, c] = await Promise.all([
    getZIndexOf('#hardcoded-popover'),
    getZIndexOf('#hardcoded-dialog'),
    getZIndexOf('#above-hardcoded-dialog'),
  ])

  expect(a).toBe(200_000)
  expect(b).toBe(300_000)
  expect(c).toBe(300_001)
})
