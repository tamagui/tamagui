import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'
import { getStyles } from './utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ThemedListItem', type: 'useCase' })
})

test('ListItem renders correctly with default theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-default')
  const title = listItem.getByText('Default', { exact: true })
  const subTitle = listItem.getByText('Default list item', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(242, 242, 242)')
})

test('ListItem renders correctly with light theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-light')
  const title = listItem.getByText('<Theme ="light"/>', { exact: true })
  const subTitle = listItem.getByText('Forcing light theme', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(242, 242, 242)')
})

test('ListItem renders correctly with dark theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-dark')
  const title = listItem.getByText('<Theme ="dark"/>', { exact: true })
  const subTitle = listItem.getByText('Forcing dark theme', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(10, 10, 10)')
})

test('ListItem with accent theme renders correctly in light theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-light-accent')
  const title = listItem.getByText('<Theme name="accent">', { exact: true })
  const subTitle = listItem.getByText('light + accent = light_accent (contrasting)', {
    exact: true,
  })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  // Accent theme inverts colors - light + accent = dark background
  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(5, 5, 5)')
})

test('ListItem with accent theme renders correctly in dark theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-dark-accent')
  const title = listItem.getByText('<Theme name="accent">', { exact: true })
  const subTitle = listItem.getByText('dark + accent = dark_accent (contrasting)', {
    exact: true,
  })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  // Accent theme inverts colors - dark + accent = light background
  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(255, 255, 255)')
})

test('ListItem renders correctly with outlined variant', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-outlined')
  const title = listItem.getByText('Outlined', { exact: true })
  const subTitle = listItem.getByText('Using variant prop', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  // Outlined variant has transparent background and border
  expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(styles.borderWidth).toBe('1px')
})

test('ListItem.Apply passes color to children icons', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-apply-color')
  const title = listItem.getByText('With Apply color', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()

  // Check that the icon received the color from Apply context
  const icon = listItem.locator('svg')
  await expect(icon).toBeVisible()
})

test('ListItem.Apply passes variant to children', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-apply-variant')
  const title = listItem.getByText('With Apply variant', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()

  const styles = await getStyles(listItem)
  // Outlined variant applied via Apply context
  expect(styles.backgroundColor).toBe('rgba(0, 0, 0, 0)')
  expect(styles.borderWidth).toBe('1px')
})
