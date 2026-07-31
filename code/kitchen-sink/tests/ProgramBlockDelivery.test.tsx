import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Program block delivery under code splitting, in a real browser.
 *
 * The encoding claims cross-program order is irrelevant, so appending a block
 * at the end of the sheet is safe and interleaving code-split bundles is safe.
 * Rule text cannot check that — the claim is about what the browser resolves.
 * So this reads computed styles before and after a genuine dynamic import
 * brings in one program the page already had and one it has never seen.
 */

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'ProgramBlockDeliveryCase', type: 'useCase' })
})

const hoverAndSettle = async (page: any, testid: string) => {
  await page.getByTestId(testid).hover()
  await page.waitForTimeout(100)
}

test('a late code-split chunk does not disturb what the page already resolved', async ({
  page,
}) => {
  const early = page.getByTestId('early-shared')
  const earlyOnly = page.getByTestId('early-only')

  await expect(early).toHaveCSS('background-color', 'rgb(10, 20, 30)')
  await expect(earlyOnly).toHaveCSS('color', 'rgb(70, 80, 90)')

  await page.getByTestId('load-late').click()
  await expect(page.getByTestId('late-shared')).toBeVisible()

  // the blocks the chunk brought were appended after these elements rendered;
  // if append-at-end were not safe, this is where it would show
  await expect(early).toHaveCSS('background-color', 'rgb(10, 20, 30)')
  await expect(earlyOnly).toHaveCSS('color', 'rgb(70, 80, 90)')

  await hoverAndSettle(page, 'early-shared')
  await expect(early).toHaveCSS('background-color', 'rgb(40, 50, 60)')
})

test('a program arriving late resolves the same as one that arrived with the page', async ({
  page,
}) => {
  await page.getByTestId('load-late').click()
  const late = page.getByTestId('late-shared')
  await expect(late).toBeVisible()

  // same program as early-shared, so same hashed class and same resolution,
  // base and hover
  await expect(late).toHaveCSS('background-color', 'rgb(10, 20, 30)')
  await hoverAndSettle(page, 'late-shared')
  await expect(late).toHaveCSS('background-color', 'rgb(40, 50, 60)')
})

test('a program the page had never seen resolves correctly when inserted late', async ({
  page,
}) => {
  await page.getByTestId('load-late').click()
  const lateOnly = page.getByTestId('late-only')
  await expect(lateOnly).toBeVisible()

  await expect(lateOnly).toHaveCSS('opacity', '0.25')
  await hoverAndSettle(page, 'late-only')
  await expect(lateOnly).toHaveCSS('opacity', '0.75')
})

test('the shared program is one class, carrying one block, after both arrivals', async ({
  page,
}) => {
  await page.getByTestId('load-late').click()
  await expect(page.getByTestId('late-shared')).toBeVisible()

  const shared = await page.evaluate(() => {
    const early = document.querySelector('[data-testid="early-shared"]')!
    const late = document.querySelector('[data-testid="late-shared"]')!
    const classOf = (element: Element) =>
      [...element.classList].filter((name) => name.startsWith('_bc-'))
    const background = classOf(early)
    // count how many rules in the document target that class, across every
    // sheet, so a re-inserted duplicate block would show up as extra rules
    const ruleCount = [...document.styleSheets]
      .flatMap((sheet) => {
        try {
          return [...sheet.cssRules]
        } catch {
          return []
        }
      })
      .filter((rule) =>
        background.some((name) => rule.cssText.includes(`.${name}`))
      ).length
    return { background, lateBackground: classOf(late), ruleCount }
  })

  expect(shared.background.length).toBe(1)
  // the two elements resolve through the very same program class
  expect(shared.lateBackground).toEqual(shared.background)
  // one base clause and one hover clause, not two of each
  expect(shared.ruleCount).toBe(2)
})
