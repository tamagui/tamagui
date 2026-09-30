import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'Tabs', type: 'demo' })
})

test('tabs automatically activate when a tab receives focus', async ({ page }) => {
  const connections = page.getByRole('tab', { name: 'Connections' })

  await connections.focus()

  await expect(connections).toHaveAttribute('aria-selected', 'true')
  await expect(page.getByText('Connections', { exact: true }).last()).toBeVisible()
})

test('tab button bottom edges are flat while top edges are rounded', async ({
  page,
}) => {
  const tabs = page.getByRole('tab')
  const count = await tabs.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i++) {
    const tab = tabs.nth(i)
    const styles = await tab.evaluate((el) => {
      const cs = getComputedStyle(el)
      return {
        bblr: cs.borderBottomLeftRadius,
        bbrr: cs.borderBottomRightRadius,
        btlr: cs.borderTopLeftRadius,
        btrr: cs.borderTopRightRadius,
      }
    })
    // All tab button bottom edges must be flat
    expect(styles.bblr).toBe('0px')
    expect(styles.bbrr).toBe('0px')
  }

  // Outer top corners are rounded in the tab group
  const firstTab = await tabs.first().evaluate((el) => getComputedStyle(el).borderTopLeftRadius)
  expect(firstTab).not.toBe('0px')

  const lastTab = await tabs.last().evaluate((el) => getComputedStyle(el).borderTopRightRadius)
  expect(lastTab).not.toBe('0px')
})
