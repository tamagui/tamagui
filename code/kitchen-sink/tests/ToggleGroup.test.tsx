import { expect, test } from '@playwright/test'

test.describe('ToggleGroup', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:6666/?demo=ToggleGroup')
    await page.waitForLoadState('networkidle')
  })

  test('single mode: clicking toggle item should toggle active state', async ({
    page,
  }) => {
    await page.waitForSelector('[aria-label="Left aligned"]')

    const leftButton = page.locator('[aria-label="Left aligned"]').first()

    const initialState = await leftButton.getAttribute('data-state')
    expect(initialState).toBe('off')

    await leftButton.click()
    await page.waitForTimeout(100)

    const stateAfterClick = await leftButton.getAttribute('data-state')
    expect(stateAfterClick).toBe('on')
  })

  test('single mode with disableDeactivation: cannot turn off active item', async ({
    page,
  }) => {
    await page.waitForSelector('[aria-label="Left aligned"]')

    const leftButton = page.locator('[aria-label="Left aligned"]').first()

    await leftButton.click()
    await page.waitForTimeout(100)
    expect(await leftButton.getAttribute('data-state')).toBe('on')

    // clicking again should not turn it off due to disableDeactivation
    await leftButton.click()
    await page.waitForTimeout(100)
    expect(await leftButton.getAttribute('data-state')).toBe('on')
  })

  test('single mode: clicking different item should change selection', async ({
    page,
  }) => {
    await page.waitForSelector('[aria-label="Left aligned"]')

    const leftButton = page.locator('[aria-label="Left aligned"]').first()
    const centerButton = page.locator('[aria-label="Center aligned"]').first()

    await leftButton.click()
    await page.waitForTimeout(100)
    expect(await leftButton.getAttribute('data-state')).toBe('on')
    expect(await centerButton.getAttribute('data-state')).toBe('off')

    await centerButton.click()
    await page.waitForTimeout(100)
    expect(await leftButton.getAttribute('data-state')).toBe('off')
    expect(await centerButton.getAttribute('data-state')).toBe('on')
  })
})
