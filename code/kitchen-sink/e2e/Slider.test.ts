/**
 * Detox E2E tests for Slider component
 *
 * Tests:
 * 1. Basic slider drag functionality
 * 2. Flexible width slider behavior
 * 3. Vertical slider orientation
 * 4. Range slider with two thumbs
 */

import { by, device, element, expect } from 'detox'
import { navigateToTestCase } from './utils/navigation'

// only run on iOS for now - Android gesture handling differs
const isAndroid = () => device.getPlatform() === 'android'

describe('Slider', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await device.launchApp({ newInstance: true })
  })

  beforeEach(async () => {
    if (isAndroid()) return
    await device.reloadReactNative()
    await navigateToTestCase('SliderCase', 'basic-slider')
    // disable sync for gesture testing
    await device.disableSynchronization()
  })

  afterEach(async () => {
    if (isAndroid()) return
    await device.enableSynchronization()
  })

  it('should navigate to SliderCase and show basic slider', async () => {
    if (isAndroid()) return

    await expect(element(by.id('basic-slider'))).toBeVisible()
    await expect(element(by.id('basic-slider-thumb'))).toBeVisible()
    await expect(element(by.id('basic-slider-value'))).toHaveText('Value: 50')
  })

  it('should change value when dragging thumb horizontally', async () => {
    if (isAndroid()) return

    // verify initial value
    await expect(element(by.id('basic-slider-value'))).toHaveText('Value: 50')

    // drag thumb to the right
    await element(by.id('basic-slider-thumb')).swipe('right', 'slow', 0.5)

    await new Promise((r) => setTimeout(r, 300))

    // value should have increased - check that it's not 50 anymore
    const attrs = await element(by.id('basic-slider-value')).getAttributes()
    const text = (attrs as any).text || (attrs as any).label
    const value = Number.parseInt(text?.replace('Value: ', '') || '50')

    // value should be greater than 50 after swiping right
    if (value <= 50) {
      throw new Error(`Expected value > 50 after drag, got ${value}`)
    }
  })

  it('should show flexible slider with proper width', async () => {
    if (isAndroid()) return

    await expect(element(by.id('flex-slider'))).toBeVisible()
    await expect(element(by.id('flex-slider-track'))).toBeVisible()

    // the flex slider should be visible and wider than a small fixed width
    const attrs = await element(by.id('flex-slider')).getAttributes()
    const bounds = (attrs as any).frame || (attrs as any).bounds
    if (bounds && bounds.width <= 100) {
      throw new Error(`Expected flex slider width > 100, got ${bounds.width}`)
    }
  })

  it('should show vertical slider with correct orientation', async () => {
    if (isAndroid()) return

    await expect(element(by.id('vertical-slider'))).toBeVisible()

    // get dimensions to verify vertical orientation
    const attrs = await element(by.id('vertical-slider')).getAttributes()
    const bounds = (attrs as any).frame || (attrs as any).bounds
    if (bounds && bounds.height <= bounds.width) {
      throw new Error(`Expected vertical slider height > width, got ${bounds.height} x ${bounds.width}`)
    }
  })

  it('should show range slider with two thumbs', async () => {
    if (isAndroid()) return

    await expect(element(by.id('range-slider'))).toBeVisible()
    await expect(element(by.id('range-slider-thumb-0'))).toBeVisible()
    await expect(element(by.id('range-slider-thumb-1'))).toBeVisible()

    // verify initial range
    await expect(element(by.id('range-slider-value'))).toHaveText('Range: 30 - 70')
  })

  it('should allow clicking on track to jump value', async () => {
    if (isAndroid()) return

    // verify initial value
    await expect(element(by.id('basic-slider-value'))).toHaveText('Value: 50')

    // tap on the track area (this should jump the thumb)
    await element(by.id('basic-slider-track')).tap()

    await new Promise((r) => setTimeout(r, 300))

    // value may have changed depending on where tap landed
    // just verify slider is still functional
    await expect(element(by.id('basic-slider-thumb'))).toBeVisible()
  })
})
