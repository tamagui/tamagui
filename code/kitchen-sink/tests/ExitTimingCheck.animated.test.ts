import { test, expect } from '@playwright/test'
import { setupPage } from './test-utils'

test('exit animation holds element during tab switch', async ({ page }) => {
  // native driver has hover/animation issues on web
  const driver = (test.info().project?.metadata as any)?.animationDriver
  test.skip(driver === 'native', 'native driver has element detection issues on web')

  await setupPage(page, { name: 'TabHoverAnimationCase', type: 'useCase' })
  await page.waitForTimeout(500)

  await page.locator('[data-testid="tab-tab-a"]').hover()
  await page.waitForTimeout(400)

  const content = page.locator('[data-testid="slide-content"]')
  expect(await content.count()).toBe(1)

  await page.locator('[data-testid="tab-tab-d"]').hover()

  await page.waitForTimeout(60)
  const countAt60 = await content.count()

  const elemsAt60 = await page.evaluate(() =>
    Array.from(document.querySelectorAll('[data-testid="slide-content"]')).map((el) => ({
      tab: (el as HTMLElement).dataset.tab,
      opacity: getComputedStyle(el).opacity,
    }))
  )
  console.log(`At 60ms - count: ${countAt60}, elements: ${JSON.stringify(elemsAt60)}`)

  // If exit animation works: 2 elements (A exiting + D entering)
  // If exit is immediate: 1 element (only D)
  expect(countAt60).toBe(2)
})
