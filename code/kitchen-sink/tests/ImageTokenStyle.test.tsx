import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ImageTokenStyle', type: 'useCase' })
})

test('Image: borderRadius token resolves to same value as View', async ({ page }) => {
  // case 1: br="$4"
  const imgRadius = await page.locator('#v2-image-1').evaluate((el) => {
    return window.getComputedStyle(el).borderRadius
  })

  const viewRadius = await page.locator('#view-ref-1').evaluate((el) => {
    return window.getComputedStyle(el).borderRadius
  })

  expect(imgRadius).not.toBe('0px')
  expect(imgRadius).toBe(viewRadius)
})

test('Image: borderRadius number works', async ({ page }) => {
  // case 2: br={20}
  const radius = await page.locator('#v2-image-2').evaluate((el) => {
    return window.getComputedStyle(el).borderRadius
  })

  expect(radius).toBe('20px')
})

test('Image: size token resolves to non-zero dimensions', async ({ page }) => {
  // case 4: w/h="$10" br="$2"
  const styles = await page.locator('#v2-image-4').evaluate((el) => {
    const computed = window.getComputedStyle(el)
    return { width: computed.width, height: computed.height }
  })

  const width = Number.parseFloat(styles.width)
  const height = Number.parseFloat(styles.height)
  expect(width).toBeGreaterThan(20)
  expect(height).toBeGreaterThan(20)
})
