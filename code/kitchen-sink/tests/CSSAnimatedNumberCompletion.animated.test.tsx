import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * proves the animated number reports real completion tied to the value actually
 * reaching its target, not an estimated-duration timer. against the old css
 * driver (setVal jumps instantly, setTimeout fakes completion) `saw-intermediate`
 * is false because the value never animates through intermediate frames.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'CSSAnimatedNumberCompletionCase', type: 'useCase' })
})

test('completion fires once, at the target, after real intermediate frames', async ({
  page,
}) => {
  const trigger = page.locator('[data-testid="run-trigger"]')
  const completionCount = page.locator('[data-testid="completion-count"]')
  const valueAtFinish = page.locator('[data-testid="value-at-finish"]')
  const sawIntermediate = page.locator('[data-testid="saw-intermediate"]')

  await trigger.waitFor({ state: 'visible' })
  await trigger.click()

  // wait past the animation duration
  await page.waitForTimeout(800)

  // completion fired exactly once
  await expect(completionCount).toHaveText('1')

  // value reached its target when completion fired
  await expect(valueAtFinish).toHaveText('200')

  // the value animated through intermediate frames (real animation, not a jump)
  await expect(sawIntermediate).toHaveText('true')
})
