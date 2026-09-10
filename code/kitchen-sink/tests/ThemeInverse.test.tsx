import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemeInverse', type: 'useCase' })
})

// identical themes dedupe into one canonical name, and an alias can carry the
// opposite scheme to the name it deduped into: light_inverse IS dark, so it
// reaches the CSS writer under the name "dark". reading the base theme's scheme
// rather than the alias's own prefix pointed every cross-scheme alias at the
// wrong parent selector, which made <Theme name="inverse"> paint its parent's
// background instead of the opposite scheme's.
for (const scheme of ['light', 'dark'] as const) {
  const opposite = scheme === 'light' ? 'dark' : 'light'

  test(`inverse under ${scheme} paints the ${opposite} scheme`, async ({ page }) => {
    // the authored name, not the canonical one it dedupes into
    await expect(page.locator(`#${scheme}-inverse-name`)).toHaveText(`${scheme}_inverse`)

    const inverse = await getStyles(page.locator(`#${scheme}-inverse`))
    const reference = await getStyles(page.locator(`#${opposite}-reference`))
    const parent = await getStyles(page.locator(`#${scheme}-base`))

    expect(inverse.backgroundColor).toBe(reference.backgroundColor)
    expect(inverse.backgroundColor).not.toBe(parent.backgroundColor)
  })

  // the regression itself: markup carrying only the short `t_inverse` class has
  // no full-name selector to fall back on, so it resolves purely through the
  // relative light/dark selectors that the alias misclassification broke.
  test(`the short inverse class under ${scheme} paints the ${opposite} scheme`, async ({
    page,
  }) => {
    const inverse = await getStyles(page.locator(`#short-${scheme}-inverse`))
    const opposed = await getStyles(page.locator(`#short-${opposite}`))
    const same = await getStyles(page.locator(`#short-${scheme}`))

    expect(inverse.backgroundColor).toBe(opposed.backgroundColor)
    expect(inverse.backgroundColor).not.toBe(same.backgroundColor)
  })

  test(`a level under inverse stays in the ${opposite} scheme`, async ({ page }) => {
    const level = await getStyles(page.locator(`#${scheme}-inverse-level2`))
    const reference = await getStyles(page.locator(`#${opposite}-reference-level2`))
    const inverse = await getStyles(page.locator(`#${scheme}-inverse`))

    expect(level.backgroundColor).toBe(reference.backgroundColor)
    expect(level.backgroundColor).not.toBe(inverse.backgroundColor)
  })
}
