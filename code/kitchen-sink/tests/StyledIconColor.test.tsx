import { expect, test } from '@playwright/test'

test('styled() icon respects color prop', async ({ page }) => {
  await page.goto('/?test=StyledIconColor')
  await page.waitForTimeout(1000)

  // Helper to get computed stroke color from SVG path
  // Uses computedStyle to resolve CSS variables like var(--color)
  async function getSvgStrokeColor(testId: string) {
    const element = page.getByTestId(testId)
    await expect(element).toBeVisible()
    // The testID is on the svg, path has stroke
    const path = element.locator('path').first()
    return await path.evaluate((el) => getComputedStyle(el).stroke)
  }

  // Direct color prop should work
  const directColor = await getSvgStrokeColor('direct-blue')
  expect(directColor).toBe('rgb(0, 0, 255)') // blue

  // styled() with color should work
  const redColor = await getSvgStrokeColor('styled-red')
  expect(redColor).toBe('rgb(255, 0, 0)') // red

  // another styled() with different color
  const greenColor = await getSvgStrokeColor('styled-green')
  expect(greenColor).toBe('rgb(0, 128, 0)') // green

  // runtime prop should override styled() default
  const purpleColor = await getSvgStrokeColor('override-purple')
  expect(purpleColor).toBe('rgb(128, 0, 128)') // purple
})
