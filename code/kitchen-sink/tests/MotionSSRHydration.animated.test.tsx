import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Regression test for SSR hydration with inline-output animation drivers.
 *
 * An SSR-visible element with a `transition` prop (no enterStyle) must adopt
 * the SSR-painted values when the animation driver takes over at hydration.
 * The motion driver used to animate every property from the stripped (zeroed)
 * computed values on the noClass handoff render — the element visibly
 * collapsed (background transparent, border-radius 0) and re-grew right after
 * load.
 *
 * The usecase reproduces real hydration in-page (renderToString +
 * hydrateRoot) and samples computed styles every frame across the handoff;
 * it reports CLEAN only if no frame ever lost the SSR-painted values.
 */

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.name === 'animated-native' ||
      testInfo.project.name === 'animated-reanimated',
    'React Native web drivers hydrate through a different path (hasAnimationThatNeedsHydrate)'
  )
  await setupPage(page, { name: 'MotionSSRHydrationCase', type: 'useCase' })
})

test('SSR-painted transition element never loses its styles across hydration', async ({
  page,
}) => {
  const result = page.getByTestId('hydration-result')
  await expect(result).not.toHaveText('running', { timeout: 10_000 })
  await expect(result).toContainText('CLEAN')
})
