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

  // v6 authored its recipe tree from scratch and never carried black/white over,
  // so <Theme name="black"> resolved to nothing and silently rendered in the
  // parent theme. it is the only way to pin a scheme from a subtree that does not
  // know which scheme it is mounted under, which is exactly when it is reached
  // for, so falling through to the parent is the one failure it must not have.
  test(`black under ${scheme} paints dark and white paints light`, async ({ page }) => {
    await expect(page.locator(`#${scheme}-black-name`)).toHaveText(`${scheme}_black`)

    const black = await getStyles(page.locator(`#${scheme}-black`))
    const white = await getStyles(page.locator(`#${scheme}-white`))
    const dark = await getStyles(page.locator(`#dark-reference`))
    const light = await getStyles(page.locator(`#light-reference`))

    expect(black.backgroundColor).toBe(dark.backgroundColor)
    expect(white.backgroundColor).toBe(light.backgroundColor)
    expect(black.backgroundColor).not.toBe(white.backgroundColor)
  })

  // the property that separates black from inverse: it does not consult the
  // parent, so it must survive a parent that is neither bare light nor bare dark.
  test(`black resolves under a palette sub-theme in ${scheme}`, async ({ page }) => {
    const nested = await getStyles(page.locator(`#${scheme}-red-black`))
    const dark = await getStyles(page.locator(`#dark-reference`))

    expect(nested.backgroundColor).toBe(dark.backgroundColor)
  })

  test(`a level under black steps within the dark scheme in ${scheme}`, async ({
    page,
  }) => {
    const level = await getStyles(page.locator(`#${scheme}-black-level2`))
    const reference = await getStyles(page.locator(`#dark-reference-level2`))
    const black = await getStyles(page.locator(`#${scheme}-black`))

    expect(level.backgroundColor).toBe(reference.backgroundColor)
    expect(level.backgroundColor).not.toBe(black.backgroundColor)
  })

  // as with inverse, short-class markup has no full-name selector to fall back
  // on, so it is the only place a misrouted relative selector shows up.
  test(`the short black/white classes under ${scheme} pin their scheme`, async ({
    page,
  }) => {
    const black = await getStyles(page.locator(`#short-${scheme}-black`))
    const white = await getStyles(page.locator(`#short-${scheme}-white`))
    const dark = await getStyles(page.locator(`#short-dark`))
    const light = await getStyles(page.locator(`#short-light`))

    expect(black.backgroundColor).toBe(dark.backgroundColor)
    expect(white.backgroundColor).toBe(light.backgroundColor)
  })
}

// the absolute-versus-relative distinction, asserted directly: inverse gives a
// different answer per parent, black gives the same one.
test(`black is parent-independent where inverse is not`, async ({ page }) => {
  const fromLight = await getStyles(page.locator('#light-black'))
  const fromDark = await getStyles(page.locator('#dark-black'))
  const inverseFromLight = await getStyles(page.locator('#light-inverse'))
  const inverseFromDark = await getStyles(page.locator('#dark-inverse'))

  expect(fromLight.backgroundColor).toBe(fromDark.backgroundColor)
  expect(inverseFromLight.backgroundColor).not.toBe(inverseFromDark.backgroundColor)
})
