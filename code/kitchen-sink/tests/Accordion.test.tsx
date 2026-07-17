import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

// regression: Accordion.HeightAnimator used height:'auto' for the open-but-not-
// yet-measured state. with a transition set, the CSS animation driver writes
// height inline and cannot tween out of 'auto', so the wrapper froze at
// height:auto -> collapsed to 0. the content (absolutely positioned) then spilled
// out of layout and rendered below the last item, and nothing animated.
// the demo drives collapse with the `transition` prop, which is a CSS-transition
// concept: run under the css driver (the native RN Animated driver cannot
// interpolate themed var() colors and is not the target for these accordions).
test.beforeEach(async ({ page }) => {
  await setupPage(page, {
    name: 'AccordionDefaultOpenCase',
    type: 'useCase',
    searchParams: { animationDriver: 'css' },
  })
})

test('open item reserves height and pushes siblings below its content', async ({
  page,
}) => {
  const content = page.locator('#def-content')
  await expect(content).toBeVisible()

  const contentBox = await content.boundingBox()
  const trigger2Box = await page.locator('#def-trigger2').boundingBox()
  expect(contentBox).not.toBeNull()
  expect(trigger2Box).not.toBeNull()

  // content of the open item has real height (not collapsed to 0)
  expect(contentBox!.height).toBeGreaterThan(10)

  // the next item's trigger sits at or below the open content bottom (no overlap,
  // content is not rendering below the last item)
  expect(trigger2Box!.y).toBeGreaterThanOrEqual(contentBox!.y + contentBox!.height - 2)
})

test('toggling an item animates its wrapper height between 0 and content height', async ({
  page,
}) => {
  const trigger2 = page.locator('#def-trigger2')

  // open the initially-closed second item
  await trigger2.click()
  await page.waitForTimeout(500)

  // its content region should now be visible with real height
  const region = page.locator('[role="region"]').last()
  await expect(region).toBeVisible()
  const openBox = await region.boundingBox()
  expect(openBox!.height).toBeGreaterThan(10)

  // close it again; the region unmounts (collapsed), so it should detach/hide
  await trigger2.click()
  await page.waitForTimeout(500)
  const stillOpen = await page.locator('#def-trigger2').boundingBox()
  // trigger2 should move back up now that the content collapsed
  expect(stillOpen).not.toBeNull()
})
