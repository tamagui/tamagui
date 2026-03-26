import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, getHoverStyle, getPressStyle } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyleValidation', type: 'useCase' })
  await page.mouse.move(0, 0)
})

// ── layout ───────────────────────────────────────────

test('layout: position absolute with insets', async ({ page }) => {
  const parent = await getStyles(page.locator('#sv-layout-relative'))
  expect(parent.position).toBe('relative')

  const child = await getStyles(page.locator('#sv-layout-absolute'))
  expect(child.position).toBe('absolute')
  expect(child.top).toBe('5px')
  expect(child.left).toBe('5px')
  expect(child.right).toBe('5px')
  expect(child.bottom).toBe('5px')
  expect(child.zIndex).toBe('10')
})

test('layout: overflow hidden clips content', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-overflow'))
  expect(s.overflow).toBe('hidden')
  expect(s.width).toBe('60px')
  expect(s.height).toBe('60px')
})

// ── flexbox ──────────────────────────────────────────

test('flexbox: row with gap, align, justify', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-flex-row'))
  expect(s.flexDirection).toBe('row')
  expect(s.alignItems).toBe('center')
  expect(s.justifyContent).toBe('space-between')
  expect(s.gap).toBe('8px')
  expect(s.padding).toBe('8px')
})

test('flexbox: child flexGrow', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-flex-child-2'))
  expect(s.flexGrow).toBe('1')
})

test('flexbox: column with stretch', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-flex-col'))
  expect(s.flexDirection).toBe('column')
  expect(s.alignItems).toBe('stretch')
  expect(s.gap).toBe('4px')

  const child = await getStyles(page.locator('#sv-flex-col-child'))
  // stretch means child fills parent width
  const childBox = await page.locator('#sv-flex-col-child').boundingBox()
  const parentBox = await page.locator('#sv-flex-col').boundingBox()
  expect(childBox!.width).toBeGreaterThan(parentBox!.width - 20) // accounting for padding
})

// ── spacing ──────────────────────────────────────────

test('spacing: margin and padding', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-spacing'))
  expect(s.marginTop).toBe('12px')
  expect(s.marginRight).toBe('12px')
  expect(s.marginBottom).toBe('12px')
  expect(s.marginLeft).toBe('12px')
  expect(s.paddingTop).toBe('16px')
  expect(s.paddingRight).toBe('24px')
  expect(s.paddingBottom).toBe('16px')
  expect(s.paddingLeft).toBe('24px')
})

// ── sizing ───────────────────────────────────────────

test('sizing: percentage width with min/max constraints', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-sizing'))
  // 50% of 200 = 100, clamped by minWidth 60 and maxWidth 150
  const box = await page.locator('#sv-sizing').boundingBox()
  expect(box!.width).toBe(100) // 50% of 200
  expect(box!.height).toBe(100) // 100% of 100
  expect(s.minWidth).toBe('60px')
  expect(s.maxWidth).toBe('150px')
})

// ── typography ───────────────────────────────────────

test('typography: font properties', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-text-basic'))
  expect(s.fontSize).toBe('18px')
  expect(s.fontWeight).toBe('700')
  expect(s.color).toBe('rgb(17, 24, 39)')
  expect(s.lineHeight).toBe('24px')
  expect(s.letterSpacing).toBe('1.5px')
})

test('typography: text-transform and decoration', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-text-transform'))
  expect(s.textTransform).toBe('uppercase')
  expect(s.textDecorationLine).toBe('underline')
  expect(s.textAlign).toBe('center')
})

// ── backgrounds ──────────────────────────────────────

test('backgrounds: solid color', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-bg-color'))
  expect(s.backgroundColor).toBe('rgb(99, 102, 241)')
})

test('backgrounds: gradient', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-bg-gradient'))
  expect(s.backgroundImage).toContain('linear-gradient')
})

// ── borders ──────────────────────────────────────────

test('borders: uniform border', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-border-basic'))
  expect(s.borderTopWidth).toBe('2px')
  expect(s.borderTopColor).toBe('rgb(220, 38, 38)')
  expect(s.borderTopStyle).toBe('solid')
  expect(s.borderRadius).toBe('8px')
})

test('borders: mixed per-side', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-border-mixed'))
  expect(s.borderTopWidth).toBe('4px')
  expect(s.borderTopColor).toBe('rgb(0, 0, 255)')
  expect(s.borderBottomWidth).toBe('1px')
  expect(s.borderLeftWidth).toBe('0px')
  expect(s.borderTopLeftRadius).toBe('12px')
  expect(s.borderTopRightRadius).toBe('12px')
})

test('borders: outline', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-outline'))
  expect(s.outlineWidth).toBe('2px')
  expect(s.outlineColor).toBe('rgb(34, 197, 94)')
  expect(s.outlineStyle).toBe('solid')
  expect(s.outlineOffset).toBe('4px')
})

// ── effects ──────────────────────────────────────────

test('effects: opacity', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-opacity'))
  expect(s.opacity).toBe('0.5')
})

test('effects: box-shadow', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-shadow'))
  expect(s.boxShadow).toContain('0px 4px 12px')
})

test('effects: cursor and pointer-events', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-cursor'))
  expect(s.cursor).toBe('pointer')
  expect(s.pointerEvents).toBe('auto')
  expect(s.userSelect).toBe('none')
})

// ── transforms ───────────────────────────────────────

test('transforms: rotate', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-rotate'))
  // transform matrix contains rotation
  expect(s.transform).not.toBe('none')
})

test('transforms: scale', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-scale'))
  expect(s.transform).not.toBe('none')
  // scale(0.75) → matrix contains 0.75
  expect(s.transform).toContain('0.75')
})

test('transforms: translate x/y', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-translate'))
  expect(s.transform).not.toBe('none')
})

// ── interactive states ───────────────────────────────

test('hover: changes background and scale', async ({ page }) => {
  const base = await getStyles(page.locator('#sv-hover'))
  expect(base.backgroundColor).toBe('rgb(34, 197, 94)')

  const hovered = await getHoverStyle(page.locator('#sv-hover'))
  expect(hovered.backgroundColor).toBe('rgb(22, 163, 74)')
})

test('press: changes background and opacity', async ({ page }) => {
  const base = await getStyles(page.locator('#sv-press'))
  expect(base.backgroundColor).toBe('rgb(59, 130, 246)')

  const el = page.locator('#sv-press')
  await el.hover()
  await page.mouse.down()
  await page.waitForTimeout(300)
  const pressed = await getStyles(el)
  expect(pressed.backgroundColor).toBe('rgb(29, 78, 216)')
  expect(pressed.opacity).toBe('0.8')
  await page.mouse.up()
})

// ── media queries ────────────────────────────────────

test('media: base color at wide viewport', async ({ page }) => {
  await page.setViewportSize({ width: 1200, height: 800 })
  await page.waitForTimeout(100)
  const s = await getStyles(page.locator('#sv-media'))
  expect(s.backgroundColor).toBe('rgb(255, 0, 0)')
})

test('media: $sm override at narrow viewport', async ({ page }) => {
  await page.setViewportSize({ width: 700, height: 800 })
  await page.waitForTimeout(100)
  const s = await getStyles(page.locator('#sv-media'))
  expect(s.backgroundColor).toBe('rgb(0, 255, 0)')
})

// ── styled variants ──────────────────────────────────

test('styled: default props', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-styled-default'))
  expect(s.backgroundColor).toBe('rgb(255, 255, 255)')
  expect(s.borderRadius).toBe('12px')
  expect(s.padding).toBe('12px')
  expect(s.width).toBe('120px')
})

test('styled: primary variant', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-styled-primary'))
  expect(s.backgroundColor).toBe('rgb(99, 102, 241)')
})

test('styled: danger variant', async ({ page }) => {
  const s = await getStyles(page.locator('#sv-styled-danger'))
  expect(s.backgroundColor).toBe('rgb(239, 68, 68)')
})

// ── visual screenshot ────────────────────────────────

test('screenshot: full validation page', async ({ page }) => {
  await page.mouse.move(0, 0)
  await expect(page).toHaveScreenshot('style-validation-full.png', {
    fullPage: true,
    maxDiffPixelRatio: 0.02,
  })
})
