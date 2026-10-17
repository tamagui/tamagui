import { expect, test, type Page } from '@playwright/test'

const destination = '/ui/popover#installation'

async function search(page: Page) {
  // serve a fixed result without depending on the live index or network.
  await page.route(/\/1\/indexes\/.*\/queries/, (route) =>
    route.fulfill({
      json: {
        results: [
          {
            hits: [
              {
                objectID: 'docs-search-popover',
                url: `https://tamagui.dev${destination}`,
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
              },
            ],
            nbHits: 1,
            page: 0,
            nbPages: 1,
            hitsPerPage: 20,
            query: 'popover',
            params: '',
          },
        ],
      },
    })
  )
  await page.goto('/docs/intro/introduction', { waitUntil: 'networkidle' })
  await page.waitForFunction(() => {
    const button = document.querySelector('[aria-label="Search docs"]')
    return button && Object.keys(button).some((key) => key.startsWith('__reactProps'))
  })
  await page.getByRole('button', { name: 'Search docs', exact: true }).click()
  await page.getByPlaceholder('Search docs...').fill('popover')
  const result = page.locator('.DocSearch-Hit').first()
  await expect(result).toContainText('Popover')
  return result
}

test('clicking a search result navigates to its page and hash', async ({ page }) => {
  const result = await search(page)
  await result.click()
  await expect(page).toHaveURL(new RegExp(`${destination}$`))
  await expect(page.locator('.DocSearch-Modal')).toBeHidden()
  await expect(page.locator('#installation')).toBeInViewport()
})

test('Enter still navigates to the selected result', async ({ page }) => {
  await search(page)
  await page.getByPlaceholder('Search docs...').press('ArrowDown')
  await page.getByPlaceholder('Search docs...').press('Enter')
  await expect(page).toHaveURL(new RegExp(`${destination}$`))
  await expect(page.locator('.DocSearch-Modal')).toBeHidden()
})

test('modified click opens the result in another tab', async ({ page, context }) => {
  const result = await search(page)
  const popupPromise = context.waitForEvent('page')
  await result.getByRole('link').click({ modifiers: ['ControlOrMeta'] })
  const popup = await popupPromise
  await expect(popup).toHaveURL(new RegExp(`${destination}$`))
  await expect(page).toHaveURL(/\/docs\/intro\/introduction$/)
  await popup.close()
})
