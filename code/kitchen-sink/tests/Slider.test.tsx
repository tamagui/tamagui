import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.describe('Slider', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SliderCase', type: 'useCase' })
  })

  test('basic slider can be dragged', async ({ page }) => {
    const slider = page.getByTestId('basic-slider')
    const thumb = page.getByTestId('basic-slider-thumb')
    const valueDisplay = page.getByTestId('basic-slider-value')

    await expect(slider).toBeVisible()
    await expect(thumb).toBeVisible()

    // get initial value
    const initialText = await valueDisplay.textContent()
    expect(initialText).toContain('50')

    // get bounding boxes
    const sliderBox = await slider.boundingBox()
    const thumbBox = await thumb.boundingBox()

    if (!sliderBox || !thumbBox) throw new Error('Could not get bounding boxes')

    // drag thumb to the right
    const thumbCenterX = thumbBox.x + thumbBox.width / 2
    const thumbCenterY = thumbBox.y + thumbBox.height / 2
    const targetX = sliderBox.x + sliderBox.width * 0.8

    await page.mouse.move(thumbCenterX, thumbCenterY)
    await page.mouse.down()
    await page.mouse.move(targetX, thumbCenterY, { steps: 10 })
    await page.mouse.up()

    // verify value changed
    await page.waitForTimeout(100)
    const newText = await valueDisplay.textContent()
    const newValue = Number.parseInt(newText?.replace('Value: ', '') || '0')
    expect(newValue).toBeGreaterThan(60)
  })

  test('flexible slider fills container width', async ({ page }) => {
    const slider = page.getByTestId('flex-slider')
    const track = page.getByTestId('flex-slider-track')

    await expect(slider).toBeVisible()

    const sliderBox = await slider.boundingBox()
    const trackBox = await track.boundingBox()

    if (!sliderBox || !trackBox) throw new Error('Could not get bounding boxes')

    // slider should be wider than a small fixed width (e.g., 150px)
    expect(sliderBox.width).toBeGreaterThan(150)

    // track should fill the slider width
    expect(trackBox.width).toBeCloseTo(sliderBox.width, 0)
  })

  test('clicking on track moves thumb', async ({ page }) => {
    const slider = page.getByTestId('basic-slider')
    const valueDisplay = page.getByTestId('basic-slider-value')

    await expect(slider).toBeVisible()

    const sliderBox = await slider.boundingBox()
    if (!sliderBox) throw new Error('Could not get slider bounding box')

    // click near the start of the track (around 20%)
    await page.mouse.click(
      sliderBox.x + sliderBox.width * 0.2,
      sliderBox.y + sliderBox.height / 2
    )

    await page.waitForTimeout(100)
    const text = await valueDisplay.textContent()
    const value = Number.parseInt(text?.replace('Value: ', '') || '0')

    // value should be around 20 (with some tolerance)
    expect(value).toBeGreaterThanOrEqual(10)
    expect(value).toBeLessThanOrEqual(30)
  })

  test('range slider has two thumbs that work independently', async ({ page }) => {
    const thumb0 = page.getByTestId('range-slider-thumb-0')
    const thumb1 = page.getByTestId('range-slider-thumb-1')
    const valueDisplay = page.getByTestId('range-slider-value')

    await expect(thumb0).toBeVisible()
    await expect(thumb1).toBeVisible()

    // verify initial range
    const initialText = await valueDisplay.textContent()
    expect(initialText).toContain('30 - 70')

    // drag first thumb left
    const thumb0Box = await thumb0.boundingBox()
    if (!thumb0Box) throw new Error('Could not get thumb0 bounding box')

    const thumb0CenterX = thumb0Box.x + thumb0Box.width / 2
    const thumb0CenterY = thumb0Box.y + thumb0Box.height / 2

    await page.mouse.move(thumb0CenterX, thumb0CenterY)
    await page.mouse.down()
    await page.mouse.move(thumb0CenterX - 50, thumb0CenterY, { steps: 5 })
    await page.mouse.up()

    await page.waitForTimeout(100)
    const newText = await valueDisplay.textContent()
    // first value should be less than 30
    const match = newText?.match(/(\d+)\s*-\s*(\d+)/)
    if (match) {
      const firstValue = Number.parseInt(match[1])
      expect(firstValue).toBeLessThan(30)
    }
  })

  test('vertical slider is taller than wide', async ({ page }) => {
    const slider = page.getByTestId('vertical-slider')
    await expect(slider).toBeVisible()

    const sliderBox = await slider.boundingBox()
    if (!sliderBox) throw new Error('Could not get slider bounding box')

    // vertical slider should be taller than it is wide
    expect(sliderBox.height).toBeGreaterThan(sliderBox.width)
  })

  test('keyboard navigation works', async ({ page }) => {
    const thumb = page.getByTestId('basic-slider-thumb')
    const valueDisplay = page.getByTestId('basic-slider-value')

    await expect(thumb).toBeVisible()

    // focus the thumb
    await thumb.focus()

    // initial value is 50
    let text = await valueDisplay.textContent()
    expect(text).toContain('50')

    // press arrow right to increase
    await page.keyboard.press('ArrowRight')
    await page.waitForTimeout(50)

    text = await valueDisplay.textContent()
    const valueAfterRight = Number.parseInt(text?.replace('Value: ', '') || '0')
    expect(valueAfterRight).toBe(51)

    // press arrow left to decrease
    await page.keyboard.press('ArrowLeft')
    await page.waitForTimeout(50)

    text = await valueDisplay.textContent()
    const valueAfterLeft = Number.parseInt(text?.replace('Value: ', '') || '0')
    expect(valueAfterLeft).toBe(50)
  })
})
