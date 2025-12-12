import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

/**
 * Tests for styled context token preservation (issues #3670, #3676)
 *
 * When a parent component sets a context value via a variant (like gap: '$8'),
 * child components should receive the original token string ('$8') in their
 * functional variants, NOT the resolved CSS variable ('var(--t-space-8)').
 *
 * This is important because functional variants need the token string to
 * look up values in the tokens object.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledContextTokens', type: 'useCase' })
})

test('variant should pass token string to context, not CSS variable - small spacing', async ({
  page,
}) => {
  // The debug display shows what gap value the child received via context
  const gapValue = await page.locator('#debug-small-gap-value').textContent()

  // Should be '$2' (the token string), not 'var(--t-space-2)' (the CSS variable)
  expect(gapValue).toBe('$2')
})

test('variant should pass token string to context, not CSS variable - large spacing', async ({
  page,
}) => {
  const gapValue = await page.locator('#debug-large-gap-value').textContent()

  // Should be '$8' (the token string), not 'var(--t-space-8)' (the CSS variable)
  expect(gapValue).toBe('$8')
})

test('default context value should be preserved as token string', async ({ page }) => {
  const gapValue = await page.locator('#debug-default-gap-value').textContent()

  // Default context value should also be a token string
  expect(gapValue).toBe('$4')
})

test('debug display should show green background when token is preserved', async ({ page }) => {
  // The debug display has green background if gap is a token string, red if CSS variable
  const debugSmall = page.locator('#debug-small')
  const bgColor = await debugSmall.evaluate((el) => getComputedStyle(el).backgroundColor)

  // Green-ish color indicates token was preserved (using $green5 theme token)
  // This is a sanity check that our isToken logic in the component is working
  expect(bgColor).not.toBe('rgb(254, 202, 202)') // not red ($red5)
})
