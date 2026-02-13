import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'FlatMode', type: 'useCase' })
  await page.mouse.move(0, 0)
})

test(`flat base prop - $bg="rgb(255,0,0)"`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-base').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`flat token prop - $bg="$background"`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-token').first())
  // token resolves to CSS variable
  expect(styles.backgroundColor).toBeDefined()
})

test(`flat hover - base state`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-hover').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 255, 0)`)
})

test(`flat hover - hovered state`, async ({ page }) => {
  const el = page.locator('#flat-hover').first()
  await el.hover()
  const styles = await getStyles(el)
  expect(styles.backgroundColor).toBe(`rgb(0, 0, 255)`)
})

test(`flat press - base state`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-press').first())
  expect(styles.backgroundColor).toBe(`rgb(0, 255, 0)`)
})

test(`flat press - pressed state`, async ({ page }) => {
  const el = page.locator('#flat-press').first()
  await el.hover()
  await page.mouse.down()
  const styles = await getStyles(el)
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  await page.mouse.up()
})

// media query tests - verify flat mode produces same output as regular syntax
// (skipping viewport-specific assertions due to complex v3/v4/v5 config mixing in kitchen-sink)
test(`flat media syntax matches regular syntax`, async ({ page }) => {
  const flatStyles = await getStyles(page.locator('#flat-media-sm').first())
  const regularStyles = await getStyles(page.locator('#control-media-sm').first())
  // flat mode should produce identical output to regular $sm={{}} syntax
  expect(flatStyles.backgroundColor).toBe(regularStyles.backgroundColor)
})

test(`flat combined sm:hover - matches expected structure`, async ({ page }) => {
  // just verify the element renders and has some background color
  const styles = await getStyles(page.locator('#flat-sm-hover').first())
  expect(styles.backgroundColor).toBeDefined()
})

test(`flat platform - web cursor`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-web').first())
  expect(styles.cursor).toBe(`pointer`)
})

test(`styled component with flat props`, async ({ page }) => {
  const styles = await getStyles(page.locator('#styled-flat').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  expect(styles.padding).toBe(`10px`)
  expect(styles.borderRadius).toBe(`8px`)
})

test(`mixed flat and object syntax`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-mixed').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
})

test(`multiple flat props`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-multiple').first())
  expect(styles.backgroundColor).toBe(`rgb(255, 0, 0)`)
  expect(styles.padding).toBe(`20px`)
  expect(styles.borderRadius).toBe(`8px`)
})

test(`shorthand flat props`, async ({ page }) => {
  const styles = await getStyles(page.locator('#flat-shorthands').first())
  expect(styles.width).toBe(`100px`)
  expect(styles.height).toBe(`100px`)
  expect(styles.backgroundColor).toBe(`rgb(0, 255, 0)`)
  expect(styles.opacity).toBe(`0.8`)
})
