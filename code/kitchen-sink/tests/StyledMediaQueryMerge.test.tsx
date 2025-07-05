import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles, getHoverStyle } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'StyledMediaQueryMerge', type: 'useCase' })
  await page.setViewportSize({ width: 700, height: 600 })
})

test(`styled component media query merge works correctly`, async ({ page }) => {
  // Test 1: $sm media query merge
  const test1 = page.locator('#test1')
  const styles1 = await getStyles(test1)

  // Test 2: $md media query merge
  const test2 = page.locator('#test2')
  const styles2 = await getStyles(test2)

  // Test 3: Both media queries
  const test3 = page.locator('#test3')
  const styles3 = await getStyles(test3)

  // Test 4: Pseudo selector merge
  const test4 = page.locator('#test4')
  const styles4 = await getStyles(test4)

  // Test 5: Direct component
  const test5 = page.locator('#test5')
  const styles5 = await getStyles(test5)

  // Test 1: $sm should have styled definition + runtime override
  expect(styles1.paddingTop).toBe('100px')
  expect(styles1.marginLeft).toBe('100px')
  expect(styles1.marginRight).toBe('100px')
  expect(styles1.height).toBe('100px')
  expect(styles1.width).toBe('100px')
  expect(styles1.backgroundColor).toBe('rgb(0, 0, 255)') // blue (runtime override)

  // Test 2: $sm should have styled definition + runtime override
  expect(styles2.paddingTop).toBe('100px')
  expect(styles2.marginLeft).toBe('100px')
  expect(styles2.marginRight).toBe('100px')
  expect(styles2.height).toBe('100px')
  expect(styles2.width).toBe('100px')
  expect(styles2.backgroundColor).toBe('rgb(128, 0, 128)') // purple (runtime override)

  // Test 3: $sm media query should be merged with runtime override
  expect(styles3.paddingTop).toBe('100px') // from $sm
  expect(styles3.marginLeft).toBe('100px') // from $sm
  expect(styles3.marginRight).toBe('100px') // from $sm
  expect(styles3.height).toBe('100px') // from $sm
  expect(styles3.width).toBe('100px') // from $sm
  expect(styles3.backgroundColor).toBe('rgb(0, 0, 255)') // blue (from $sm runtime override)

  // Test 4: Pseudo selectors should be merged (runtime override)
  // Test hover state - runtime override should take precedence
  const hoverStyles4 = await getHoverStyle(test4)
  expect(hoverStyles4.backgroundColor).toBe('rgb(0, 255, 255)') // cyan (runtime override)

  // Test 5: Direct component should work as expected
  expect(styles5.paddingTop).toBe('50px')
  expect(styles5.marginLeft).toBe('50px')
  expect(styles5.marginRight).toBe('50px')
  expect(styles5.backgroundColor).toBe('rgb(165, 42, 42)') // brown
})
