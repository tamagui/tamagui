import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.metadata?.animationDriver !== 'motion',
    'Motion driver linked-value profile'
  )
  await setupPage(page, { name: 'MotionLinkedBenchmarkCase', type: 'useCase' })
})

test('100 linked nodes resolve styles at registration, not during animation', async ({
  page,
}) => {
  await page.getByTestId('motion-linked-trigger').click()
  await expect(page.getByTestId('motion-linked-run')).toHaveText('1', { timeout: 3000 })

  const result = await page.evaluate(() => ({
    styleSplits: performance.getEntriesByName('tamagui-motion-style-split').length,
    duration: performance.getEntriesByName('motion-linked-100').at(-1)?.duration ?? 0,
    transform: getComputedStyle(
      document.querySelector('[data-testid="motion-linked-first"]')!
    ).transform,
  }))

  expect(result.styleSplits).toBe(0)
  expect(result.duration).toBeGreaterThan(0)
  expect(result.duration).toBeLessThan(2000)
  expect(result.transform).not.toBe('none')
})
