import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'TailwindMode', type: 'useCase' })
})

test('tailwind basic - className="w-100 h-50 bg-red" sets styles', async ({ page }) => {
  const styles = await getStyles(page.locator('#tailwind-basic').first())
  expect(styles.width).toBe('100px')
  expect(styles.height).toBe('50px')
  expect(styles.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('tailwind hover - base state has green background', async ({ page }) => {
  const styles = await getStyles(page.locator('#tailwind-hover').first())
  expect(styles.backgroundColor).toBe('rgb(0, 128, 0)')
})

test('tailwind hover - hovered state has blue background', async ({ page }) => {
  const el = page.locator('#tailwind-hover').first()
  await el.hover()
  const styles = await getStyles(el)
  expect(styles.backgroundColor).toBe('rgb(0, 0, 255)')
})

test('tailwind token - className="bg-$background" resolves token', async ({ page }) => {
  const styles = await getStyles(page.locator('#tailwind-token').first())
  // token should resolve to actual color (not undefined)
  expect(styles.backgroundColor).toMatch(/^rgb/)
})

test('tailwind combined - className="sm:hover:bg-orange" renders base state', async ({ page }) => {
  const styles = await getStyles(page.locator('#tailwind-combined').first())
  // base color should be gray
  expect(styles.backgroundColor).toBe('rgb(128, 128, 128)')
})

test('tailwind mixed - preserves regular classes and processes tailwind classes', async ({ page }) => {
  const el = page.locator('#tailwind-mixed').first()
  const styles = await getStyles(el)
  // tailwind class bg-pink should be processed
  expect(styles.backgroundColor).toBe('rgb(255, 192, 203)')
  // dimensions should be set
  expect(styles.width).toBe('100px')
  expect(styles.height).toBe('50px')
})

// visual comparison tests - tailwind className vs regular tamagui syntax

test('tailwind visual basic - matches regular tamagui syntax', async ({ page }) => {
  const tailwind = page.locator('#tailwind-visual-basic').first()
  const regular = page.locator('#regular-visual-basic').first()

  const tailwindStyles = await getStyles(tailwind)
  const regularStyles = await getStyles(regular)

  expect(tailwindStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(tailwindStyles.width).toBe(regularStyles.width)
  expect(tailwindStyles.height).toBe(regularStyles.height)
  expect(tailwindStyles.borderRadius).toBe(regularStyles.borderRadius)
  expect(tailwindStyles.padding).toBe(regularStyles.padding)
})

test('tailwind visual hover - base state matches regular syntax', async ({ page }) => {
  const tailwind = page.locator('#tailwind-visual-hover').first()
  const regular = page.locator('#regular-visual-hover').first()

  const tailwindStyles = await getStyles(tailwind)
  const regularStyles = await getStyles(regular)

  expect(tailwindStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test('tailwind visual hover - hovered state matches regular syntax', async ({ page }) => {
  const tailwind = page.locator('#tailwind-visual-hover').first()
  const regular = page.locator('#regular-visual-hover').first()

  // hover on regular
  await regular.hover()
  const regularStyles = await getStyles(regular)

  // hover on tailwind
  await tailwind.hover()
  const tailwindStyles = await getStyles(tailwind)

  expect(tailwindStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

// visual screenshot comparison
test('visual screenshot - tailwind basic comparison', async ({ page }) => {
  const comparison = page.locator('#tailwind-basic-comparison').first()
  await expect(comparison).toHaveScreenshot('tailwind-basic-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test('visual screenshot - tailwind hover comparison', async ({ page }) => {
  const comparison = page.locator('#tailwind-hover-comparison').first()
  await expect(comparison).toHaveScreenshot('tailwind-hover-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})

// token-based visual tests
test('tailwind visual token - matches regular tamagui syntax', async ({ page }) => {
  const tailwind = page.locator('#tailwind-visual-token').first()
  const regular = page.locator('#regular-visual-token').first()

  const tailwindStyles = await getStyles(tailwind)
  const regularStyles = await getStyles(regular)

  expect(tailwindStyles.backgroundColor).toBe(regularStyles.backgroundColor)
  expect(tailwindStyles.borderRadius).toBe(regularStyles.borderRadius)
  expect(tailwindStyles.padding).toBe(regularStyles.padding)
})

test('tailwind visual media - matches regular tamagui syntax', async ({ page }) => {
  const tailwind = page.locator('#tailwind-visual-media').first()
  const regular = page.locator('#regular-visual-media').first()

  const tailwindStyles = await getStyles(tailwind)
  const regularStyles = await getStyles(regular)

  expect(tailwindStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test('visual screenshot - tailwind token comparison', async ({ page }) => {
  const comparison = page.locator('#tailwind-token-comparison').first()
  await expect(comparison).toHaveScreenshot('tailwind-token-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})

test('visual screenshot - tailwind media comparison', async ({ page }) => {
  const comparison = page.locator('#tailwind-media-comparison').first()
  await expect(comparison).toHaveScreenshot('tailwind-media-comparison.png', {
    maxDiffPixelRatio: 0.01,
  })
})
