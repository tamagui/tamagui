import { expect, test } from '@playwright/test'

// stub algolia so the result list is the same on every run
const hit = {
  objectID: 'docs-search-popover',
  url: 'https://tamagui.dev/ui/popover',
  type: 'lvl1',
  content: null,
  hierarchy: {
    lvl0: 'Components',
    lvl1: 'Popover',
    lvl2: null,
    lvl3: null,
    lvl4: null,
    lvl5: null,
    lvl6: null,
  },
  _highlightResult: {
    hierarchy: {
      lvl0: { value: 'Components', matchLevel: 'none', matchedWords: [] },
      lvl1: {
        value: '<mark>Popover</mark>',
        matchLevel: 'full',
        matchedWords: ['popover'],
      },
    },
  },
  _snippetResult: {},
}

test('clicking a docs search result navigates to it', async ({ page }) => {
  await page.route(/algolia/, (route) =>
    route.fulfill({
      contentType: 'application/json',
      body: JSON.stringify({
        results: [
          {
            hits: [hit],
            nbHits: 1,
            page: 0,
            nbPages: 1,
            hitsPerPage: 20,
            query: 'popover',
            params: '',
          },
        ],
      }),
    })
  )

  await page.goto('/docs/intro/introduction')
  // the shortcut is bound after hydration, so retry until the modal opens
  const input = page.locator('.DocSearch-Input')
  await expect(async () => {
    await page.keyboard.press('Control+k')
    await expect(input).toBeVisible({ timeout: 5000 })
  }).toPass()
  await input.fill('popover')

  const result = page.locator('.DocSearch-Hit').first()
  await expect(result).toContainText('Popover')
  await result.click()

  await expect(page).toHaveURL(/\/ui\/popover/)
})
