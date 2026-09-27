import { expect, test, type Page } from '@playwright/test'
import { setupPage } from './test-utils'

// switching light -> dark while a Dialog is open must re-theme its content, both
// as a portaled dialog and when adapted into a Sheet. the adapted content used to
// keep the light theme on the now-dark sheet.

const viewports = {
  dialog: { width: 1024, height: 768 },
  sheet: { width: 400, height: 800 },
}

async function openAndRead(page: Page) {
  await page.getByTestId('open-dialog').click({ force: true })
  const content = page.getByTestId('dialog-content')
  await expect(content).toBeVisible({ timeout: 5000 })
  return readTheme(page)
}

function readTheme(page: Page) {
  return page.getByTestId('dialog-content').evaluate((el) => ({
    color: getComputedStyle(el).color,
    scheme: el.closest('.t_light, .t_dark')?.classList.contains('t_dark')
      ? 'dark'
      : 'light',
  }))
}

for (const [mode, viewport] of Object.entries(viewports)) {
  test(`${mode}: open content follows a live light -> dark switch`, async ({ page }) => {
    await page.setViewportSize(viewport)

    await setupPage(page, {
      name: 'DialogSheetAdaptResizeCase',
      type: 'useCase',
      theme: 'dark',
    })
    const freshDark = await openAndRead(page)
    expect(freshDark.scheme).toBe('dark')

    await setupPage(page, { name: 'DialogSheetAdaptResizeCase', type: 'useCase' })
    const light = await openAndRead(page)
    expect(light.scheme).toBe('light')
    expect(light.color).not.toBe(freshDark.color)
    if (mode === 'sheet') {
      await expect(page.getByTestId('dialog-sheet-frame')).toBeVisible()
    }

    // the sandbox theme switch sits under the modal overlay, so click it directly
    await page.getByText('🌗').evaluate((el: HTMLElement) => el.click())

    await expect.poll(() => readTheme(page)).toEqual(freshDark)
  })
}

// dialog content inside a nameless <Theme forceClassName> emits its own theme class
// span; that span used to keep the light class after the switch
test('dialog: nameless forceClassName Theme follows a live light -> dark switch', async ({
  page,
}) => {
  await page.setViewportSize(viewports.dialog)

  await setupPage(page, {
    name: 'DialogForceClassNameThemeCase',
    type: 'useCase',
    theme: 'dark',
  })
  const freshDark = await openAndRead(page)
  expect(freshDark.scheme).toBe('dark')

  await setupPage(page, { name: 'DialogForceClassNameThemeCase', type: 'useCase' })
  const light = await openAndRead(page)
  expect(light.scheme).toBe('light')
  expect(light.color).not.toBe(freshDark.color)

  await page.getByText('🌗').evaluate((el: HTMLElement) => el.click())

  await expect.poll(() => readTheme(page)).toEqual(freshDark)
})
