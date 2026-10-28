import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

/**
 * Accessible naming for the route-sheet composition: a modal Dialog that
 * adapts to a modal Sheet below the max-md breakpoint, with no Title or
 * Description rendered. The visible dialog must carry its aria-label, must
 * not reference a title or description that is not rendered, and must be
 * the only non-ignored dialog in the accessibility tree.
 */
test.describe('Sheet dialog naming', () => {
  test('narrow viewport names the sheet dialog', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await setupPage(page, { name: 'SheetDialogNamingCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')

    await page.getByTestId('open-dialog').click()

    const dialog = page.getByRole('dialog', { name: 'Trip settings sheet' })
    await expect(dialog.getByTestId('close-dialog')).toBeVisible({ timeout: 10_000 })
    await expectNoDanglingReferences(page)
    await expectSingleNamedDialog(page, 'Trip settings sheet')
  })

  test('wide viewport names the dialog card', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 900 })
    await setupPage(page, { name: 'SheetDialogNamingCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')

    await page.getByTestId('open-dialog').click()

    const dialog = page.getByRole('dialog', { name: 'Trip settings dialog' })
    await expect(dialog.getByTestId('close-dialog')).toBeVisible({ timeout: 10_000 })
    await expectNoDanglingReferences(page)
    await expectSingleNamedDialog(page, 'Trip settings dialog')
  })
})

async function expectNoDanglingReferences(page: Page) {
  const dangling = await page.evaluate(() => {
    const missing: string[] = []
    for (const attr of ['aria-labelledby', 'aria-describedby']) {
      for (const el of document.querySelectorAll(`[${attr}]`)) {
        for (const id of (el.getAttribute(attr) || '').split(/\s+/).filter(Boolean)) {
          if (!document.getElementById(id)) {
            missing.push(`${attr}="${id}"`)
          }
        }
      }
    }
    return missing
  })
  expect(dangling).toEqual([])
}

async function expectSingleNamedDialog(page: Page, name: string) {
  const cdp = await page.context().newCDPSession(page)
  await cdp.send('Accessibility.enable')
  const { nodes } = await cdp.send('Accessibility.getFullAXTree')
  const dialogs = nodes.filter(
    (node) =>
      (node.role?.value === 'dialog' || node.role?.value === 'alertdialog') &&
      !node.ignored
  )
  expect(dialogs.map((node) => node.name?.value ?? '')).toEqual([name])
}
