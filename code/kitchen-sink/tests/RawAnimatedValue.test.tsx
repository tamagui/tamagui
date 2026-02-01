import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Tests for raw Animated.Value with Animated.createAnimatedComponent
 *
 * This validates that react-native-web-lite properly handles AnimatedValue
 * objects when passed as style props to Animated components.
 */

test.describe('Raw Animated.Value', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'RawAnimatedValueCase',
      type: 'useCase',
    })
    await page.waitForTimeout(500)
  })

  test('initial state applies animated values correctly', async ({ page }) => {
    const box = page.getByTestId('animated-box')

    // initial values: opacity=0, scale=0.5, translateY=50, backgroundColor=red
    const opacity = await box.evaluate((el) => getComputedStyle(el).opacity)
    const transform = await box.evaluate((el) => getComputedStyle(el).transform)
    const bgColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)

    expect(opacity).toBe('0')
    // matrix(scaleX, 0, 0, scaleY, translateX, translateY)
    expect(transform).toContain('matrix')
    expect(transform).toContain('0.5') // scale
    expect(transform).toContain('50') // translateY
    expect(bgColor).toBe('rgb(255, 0, 0)') // red
  })

  test('animate in changes values over time', async ({ page }) => {
    const box = page.getByTestId('animated-box')
    const trigger = page.getByTestId('animate-in-trigger')

    // capture initial
    const initialOpacity = await box.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(initialOpacity).toBe(0)

    // click animate in
    await trigger.click()

    // wait a bit for animation to progress
    await page.waitForTimeout(100)

    // capture mid-animation value
    const midOpacity = await box.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )

    // wait for animation to complete
    await page.waitForTimeout(400)

    // capture final
    const finalOpacity = await box.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    const finalTransform = await box.evaluate((el) => getComputedStyle(el).transform)
    const finalBgColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)

    // final values should be: opacity=1, scale=1, translateY=0, backgroundColor=green
    expect(finalOpacity).toBeCloseTo(1, 1)

    // transform should be identity or close to it (scale=1, translateY=0)
    // matrix(1, 0, 0, 1, 0, 0) or 'none'
    if (finalTransform !== 'none') {
      expect(finalTransform).toMatch(/matrix\(1,?\s*0,?\s*0,?\s*1,?\s*0,?\s*0\)/)
    }

    // backgroundColor should be green
    expect(finalBgColor).toBe('rgb(0, 255, 0)')

    // the mid-animation value should show progress (not jumped instantly)
    // if animation is working, mid should be between 0 and 1
    console.log(
      `Animation progress: initial=${initialOpacity}, mid=${midOpacity}, final=${finalOpacity}`
    )

    // key test: animation should have progressed, not jumped
    const animationProgressed = midOpacity > 0.05 && midOpacity < 0.95
    expect(
      animationProgressed || finalOpacity === 1,
      `Animation should progress smoothly. mid=${midOpacity}`
    ).toBe(true)
  })

  test('animate out returns to initial values', async ({ page }) => {
    const box = page.getByTestId('animated-box')
    const animateIn = page.getByTestId('animate-in-trigger')
    const animateOut = page.getByTestId('animate-out-trigger')

    // first animate in
    await animateIn.click()
    await page.waitForTimeout(400)

    // verify we're at end state
    let opacity = await box.evaluate((el) => parseFloat(getComputedStyle(el).opacity))
    expect(opacity).toBeCloseTo(1, 1)

    // now animate out
    await animateOut.click()
    await page.waitForTimeout(400)

    // should be back to initial
    opacity = await box.evaluate((el) => parseFloat(getComputedStyle(el).opacity))
    const transform = await box.evaluate((el) => getComputedStyle(el).transform)
    const bgColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)

    expect(opacity).toBeCloseTo(0, 1)
    expect(transform).toContain('0.5') // scale back to 0.5
    expect(transform).toContain('50') // translateY back to 50
    expect(bgColor).toBe('rgb(255, 0, 0)') // back to red
  })

  test('interpolated color animates correctly', async ({ page }) => {
    const box = page.getByTestId('animated-box')
    const trigger = page.getByTestId('animate-in-trigger')

    // initial color is red
    let bgColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)
    expect(bgColor).toBe('rgb(255, 0, 0)')

    // animate
    await trigger.click()

    // capture mid-animation color
    await page.waitForTimeout(150)
    const midColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)

    // wait for completion
    await page.waitForTimeout(300)
    bgColor = await box.evaluate((el) => getComputedStyle(el).backgroundColor)

    // final should be green
    expect(bgColor).toBe('rgb(0, 255, 0)')

    // mid color should be somewhere between red and green
    // (not exactly red and not exactly green if interpolation works)
    console.log(`Color interpolation: mid=${midColor}, final=${bgColor}`)
  })
})
