import { by, element, expect, waitFor } from 'detox'

import { safeLaunchApp, safeReloadApp } from './utils/detox'
import { navigateToTestCase } from './utils/navigation'

const testElement = (id: string) => element(by.id(id)).atIndex(0)

describe('Select multiple', () => {
  beforeAll(async () => {
    await safeLaunchApp({ newInstance: true })
  })

  beforeEach(async () => {
    await safeReloadApp()
    await navigateToTestCase('SelectMultipleCase', 'multiple-inline-trigger')
  })

  it('toggles multiple values in the plain React Native inline path', async () => {
    await testElement('multiple-inline-trigger').tap()
    await waitFor(testElement('multiple-inline-red-delicious'))
      .toBeVisible()
      .withTimeout(5000)

    await testElement('multiple-inline-red-delicious').tap()
    await expect(testElement('multiple-inline-red-delicious')).toBeVisible()
    await expect(testElement('multiple-inline-red-delicious-indicator')).toBeVisible()

    await testElement('multiple-inline-green-pear').tap()
    await expect(testElement('multiple-inline-green-pear')).toBeVisible()
    await expect(testElement('multiple-inline-green-pear-indicator')).toBeVisible()
    await expect(testElement('multiple-inline-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )

    await testElement('multiple-inline-trigger').tap()
    await waitFor(testElement('multiple-inline-red-delicious'))
      .not.toBeVisible()
      .withTimeout(5000)
    await expect(testElement('multiple-inline-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )
  })

  it('keeps the native Sheet open across toggles and preserves values after dismissal', async () => {
    await testElement('multiple-adapt-trigger').tap()
    await waitFor(testElement('multiple-adapt-red-delicious'))
      .toBeVisible()
      .withTimeout(5000)

    await testElement('multiple-adapt-red-delicious').tap()
    await expect(testElement('multiple-adapt-red-delicious')).toBeVisible()
    await expect(testElement('multiple-adapt-red-delicious-indicator')).toBeVisible()

    await testElement('multiple-adapt-blueberry').tap()
    await expect(testElement('multiple-adapt-blueberry')).toBeVisible()
    await expect(testElement('multiple-adapt-blueberry-indicator')).toBeVisible()
    await expect(testElement('multiple-adapt-value')).toHaveText(
      '["red-delicious","blueberry"]'
    )

    await testElement('multiple-adapt-overlay').tap({ x: 5, y: 5 })
    await waitFor(testElement('multiple-adapt-red-delicious'))
      .not.toBeVisible()
      .withTimeout(5000)
    await expect(testElement('multiple-adapt-value')).toHaveText(
      '["red-delicious","blueberry"]'
    )

    await testElement('multiple-adapt-trigger').tap()
    await waitFor(testElement('multiple-adapt-red-delicious-indicator'))
      .toBeVisible()
      .withTimeout(5000)
    await expect(testElement('multiple-adapt-blueberry-indicator')).toBeVisible()
    await expect(testElement('multiple-adapt-value')).toHaveText(
      '["red-delicious","blueberry"]'
    )
  })
})
