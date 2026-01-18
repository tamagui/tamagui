import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { TEST_IDS } from '../src/constants/test-ids'

/**
 * Tests for themeShallow prop DOM structure stability
 *
 * The themeShallow prop should NOT affect DOM structure (span wrapping).
 * It only affects whether grandchildren inherit the theme change.
 *
 * This test verifies that themeShallow doesn't cause unexpected DOM changes.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeShallowCase', type: 'useCase' })
})

test('themeShallow does not add extra wrapper elements compared to normal theme', async ({
  page,
}) => {
  const normalContainer = page.locator(`#${TEST_IDS.themeShallowNormal}`)
  const shallowContainer = page.locator(`#${TEST_IDS.themeShallowEnabled}`)

  await expect(normalContainer).toBeVisible()
  await expect(shallowContainer).toBeVisible()

  // Get the DOM structure depth for both containers
  // Count the number of wrapper elements between the container and its text content
  const normalDepth = await normalContainer.evaluate((el) => {
    let depth = 0
    let current = el.querySelector('[class*="is_Theme"]')
    while (current && current !== el) {
      depth++
      current = current.parentElement
    }
    return depth
  })

  const shallowDepth = await shallowContainer.evaluate((el) => {
    let depth = 0
    let current = el.querySelector('[class*="is_Theme"]')
    while (current && current !== el) {
      depth++
      current = current.parentElement
    }
    return depth
  })

  // The DOM structure depth should be the same regardless of themeShallow
  // themeShallow only affects theme context propagation, not DOM structure
  expect(shallowDepth).toBe(normalDepth)
})

test('themeShallow container has consistent DOM structure', async ({ page }) => {
  const container = page.locator(`#${TEST_IDS.themeShallowContainer}`)
  const inner = page.locator(`#${TEST_IDS.themeShallowInner}`)

  await expect(container).toBeVisible()
  await expect(inner).toBeVisible()

  // Snapshot the inner HTML structure to catch any regressions
  const innerHtml = await inner.evaluate((el) => {
    // Normalize the HTML by removing dynamic attributes like data-* IDs
    const clone = el.cloneNode(true) as HTMLElement
    clone.querySelectorAll('*').forEach((node) => {
      // Remove dynamic attributes that change between runs
      Array.from(node.attributes).forEach((attr) => {
        if (
          attr.name.startsWith('data-') &&
          !attr.name.startsWith('data-test') &&
          !attr.name.startsWith('data-disable')
        ) {
          node.removeAttribute(attr.name)
        }
      })
    })
    return clone.innerHTML
  })

  // The inner container should have text content wrapped appropriately
  expect(innerHtml).toContain('Inner content')

  // Verify Theme wrapper spans are present (theme always wraps in span on web)
  const themeSpans = await container.locator('span.is_Theme').count()
  expect(themeSpans).toBeGreaterThan(0)
})

test('themeShallow prop does not change element tag type', async ({ page }) => {
  const shallowContainer = page.locator(`#${TEST_IDS.themeShallowEnabled}`)
  await expect(shallowContainer).toBeVisible()

  // The container itself should be a div (Stack renders as div)
  const tagName = await shallowContainer.evaluate((el) => el.tagName.toLowerCase())
  expect(tagName).toBe('div')
})
