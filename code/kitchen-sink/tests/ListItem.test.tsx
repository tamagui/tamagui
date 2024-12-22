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
  expect(styles.backgroundColor).toBe('rgb(248, 248, 248)')
})

test('ListItem renders correctly with light theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-light')
  const title = listItem.getByText('<Theme ="light"/>', { exact: true })
  const subTitle = listItem.getByText('Forcing light theme', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(248, 248, 248)')
})

test('ListItem renders correctly with dark theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-dark')
  const title = listItem.getByText('<Theme ="dark"/>', { exact: true })
  const subTitle = listItem.getByText('Forcing dark theme', { exact: true })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(21, 21, 21)')
})

test('ListItem with themeInverse renders correctly in light theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-light-inverse')
  const title = listItem.getByText('<ListItem themeInverse/>', { exact: true })
  const subTitle = listItem.getByText('Forcing dark theme - light + inverse', {
    exact: true,
  })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(21, 21, 21)')
})

test('ListItem with themeInverse renders correctly in dark theme', async ({ page }) => {
  const listItem = page.locator('#themed-list-item-dark-inverse')
  const title = listItem.getByText('<ListItem themeInverse/>', { exact: true })
  const subTitle = listItem.getByText('Forcing light theme - dark + inverse', {
    exact: true,
  })

  await expect(listItem).toBeVisible()
  await expect(title).toBeVisible()
  await expect(subTitle).toBeVisible()

  const styles = await getStyles(listItem)
  expect(styles.backgroundColor).toBe('rgb(248, 248, 248)')
})
