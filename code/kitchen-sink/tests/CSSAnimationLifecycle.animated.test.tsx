import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }, testInfo) => {
  test.skip(
    testInfo.project.metadata?.animationDriver !== 'css',
    'CSS driver lifecycle contract'
  )
  await setupPage(page, { name: 'CSSAnimationLifecycleCase', type: 'useCase' })
})

test('host renders once while linked consumers receive interpolated values', async ({
  page,
}) => {
  const initialRenders = Number(await page.getByTestId('css-host-renders').textContent())
  await page.getByTestId('css-number-trigger').click()
  await expect(page.getByTestId('css-number-finished')).toHaveText('true')

  const finalRenders = Number(await page.getByTestId('css-host-renders').textContent())
  expect(finalRenders - initialRenders).toBeLessThanOrEqual(2)
  await expect(page.getByTestId('css-host-value')).toHaveText('1')

  const samples = (await page.getByTestId('css-number-samples').textContent())!
    .split(',')
    .filter(Boolean)
    .map(Number)
  expect(samples.some((value) => value > 0.05 && value < 0.95)).toBe(true)

  const [linkedValue, linkedRenders] = (await page
    .getByTestId('css-linked-value')
    .textContent())!
    .split(':')
    .map(Number)
  expect(linkedValue).toBeCloseTo(1, 2)
  expect(linkedRenders).toBeGreaterThan(2)
})

test('exit completion follows the element animation promises', async ({ page }) => {
  await page.getByTestId('css-waapi-exit-trigger').click()
  await expect(page.getByTestId('css-waapi-exit-target')).toHaveCount(0, { timeout: 400 })
  const elapsed = Number(await page.getByTestId('css-waapi-exit-elapsed').textContent())
  expect(elapsed).toBeGreaterThanOrEqual(40)
  expect(elapsed).toBeLessThan(300)
})
