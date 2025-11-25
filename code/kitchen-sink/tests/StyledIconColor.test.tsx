import { expect, test } from '@playwright/test'

test('styled() icon respects color prop', async ({ page }) => {
  await page.goto('/?test=StyledIconColor')
  await page.waitForTimeout(1000)

  // Helper to get stroke color from SVG path
  async function getSvgStrokeColor(testId: string) {
    const element = page.getByTestId(testId)
    await expect(element).toBeVisible()
    // The testID is on the svg, path has stroke
    const path = element.locator('path').first()
    return await path.getAttribute('stroke')
  }

  // Direct color prop should work
  const directColor = await getSvgStrokeColor('direct-blue')
  expect(directColor).toBe('blue')

  // styled() with color should work
  const redColor = await getSvgStrokeColor('styled-red')
  expect(redColor).toBe('red')

  // another styled() with different color
  const greenColor = await getSvgStrokeColor('styled-green')
  expect(greenColor).toBe('green')

  // runtime prop should override styled() default
  const purpleColor = await getSvgStrokeColor('override-purple')
  expect(purpleColor).toBe('purple')
})
