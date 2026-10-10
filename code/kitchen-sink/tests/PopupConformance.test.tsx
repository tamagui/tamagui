import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

type PopupAdapter = {
  id: 'dialog' | 'popover'
  name: string
}

const popupAdapters: PopupAdapter[] = [
  { id: 'dialog', name: 'Dialog' },
  { id: 'popover', name: 'Popover' },
]

for (const popup of popupAdapters) {
  test.describe(`${popup.name} popup conformance`, () => {
    test.beforeEach(async ({ page }) => {
      await setupPage(page, { name: 'PopupConformanceCase', type: 'useCase' })
    })

    test('dismisses on Escape and restores focus', async ({ page }) => {
      const trigger = page.getByTestId(`${popup.id}-trigger`)
      const content = page.getByTestId(`${popup.id}-content`)

      await trigger.click()
      await expect(content).toBeVisible()
      await page.keyboard.press('Escape')

      await expect(content).not.toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'escape:escape-key:event:false:true'
      )
      await expect(trigger).toBeFocused()
    })

    test('dismisses on pointer outside with shared interaction details', async ({
      page,
    }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      await page.getByTestId(`${popup.id}-outside`).click({ force: true })

      await expect(content).not.toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'pointer:outside-press:event:false:true|interact:outside-press:event:false:true'
      )
    })

    test('dismisses on focus outside with shared interaction details', async ({
      page,
    }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      await page.getByTestId(`${popup.id}-outside`).focus()

      await expect(content).not.toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'focus:focus-out:event:false:true|interact:focus-out:event:false:true'
      )
    })

    test('keeps the popup open when Escape details are canceled', async ({ page }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-cancel-escape`).click()
      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      await page.keyboard.press('Escape')

      await expect(content).toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'escape:escape-key:event:true:true'
      )
    })

    test('keeps the popup open when pointer-outside details are canceled', async ({
      page,
    }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-cancel-pointer`).click()
      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      // click a non-focusable target: canceling outside-press vetoes the
      // pointer dismissal only. focus moving to a focusable outside element
      // still dismisses via focus-out (Radix semantics) — the interact-all
      // test below covers keeping it open against focusable targets
      await page.getByTestId(`${popup.id}-outside-plain`).click({ force: true })

      await expect(content).toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'pointer:outside-press:event:true:true|interact:outside-press:event:true:true'
      )
    })

    test('keeps the popup open against focusable outside clicks when interact details are canceled', async ({
      page,
    }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-cancel-interact`).click()
      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      await page.getByTestId(`${popup.id}-outside`).click({ force: true })

      await expect(content).toBeVisible()
    })

    test('keeps the popup open when focus-outside details are canceled', async ({
      page,
    }) => {
      const content = page.getByTestId(`${popup.id}-content`)

      await page.getByTestId(`${popup.id}-cancel-focus`).click()
      await page.getByTestId(`${popup.id}-trigger`).click()
      await expect(content).toBeVisible()
      await page.getByTestId(`${popup.id}-outside`).focus()

      await expect(content).toBeVisible()
      await expect(page.getByTestId(`${popup.id}-last-event`)).toContainText(
        'focus:focus-out:event:true:true|interact:focus-out:event:true:true'
      )
    })
  })
}
