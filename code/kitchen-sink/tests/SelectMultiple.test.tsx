import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.describe('Select multiple floating web', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'SelectMultipleCase', type: 'useCase' })
  })

  test('toggles ordered members, indicators, labels, and listbox state without closing', async ({
    page,
  }) => {
    const trigger = page.getByTestId('multiple-floating-trigger')
    await trigger.click()

    const listbox = page.getByTestId('multiple-floating-viewport')
    await expect(listbox).toHaveAttribute('role', 'listbox')
    await expect(listbox).toHaveAttribute('aria-multiselectable', 'true')

    const red = page.getByTestId('multiple-floating-red-delicious')
    const pear = page.getByTestId('multiple-floating-green-pear')
    await red.click()
    await expect(page.getByTestId('multiple-floating-value-reason')).toHaveText(
      'item-press'
    )
    await expect(listbox).toBeVisible()
    await expect(red).toBeFocused()
    await pear.click()
    await expect(listbox).toBeVisible()
    await expect(pear).toBeFocused()

    await expect(red).toHaveAttribute('aria-selected', 'true')
    await expect(pear).toHaveAttribute('aria-selected', 'true')
    await expect(
      page.getByTestId('multiple-floating-red-delicious-indicator')
    ).toBeVisible()
    await expect(page.getByTestId('multiple-floating-green-pear-indicator')).toBeVisible()
    await expect(page.getByTestId('multiple-floating-value')).toHaveText(
      '["red-delicious","green-pear"]'
    )
    await expect(trigger).toContainText('Red Delicious, Green Pear')
  })

  test('arrows and typeahead move focus while Space and Enter toggle', async ({
    page,
  }) => {
    const trigger = page.getByTestId('multiple-floating-trigger')
    await trigger.click()

    const red = page.getByTestId('multiple-floating-red-delicious')
    const blueberry = page.getByTestId('multiple-floating-blueberry')
    const pear = page.getByTestId('multiple-floating-green-pear')
    await expect(red).toBeFocused()

    await page.keyboard.press('ArrowDown')
    await expect(blueberry).toBeFocused()
    await expect(page.getByTestId('multiple-floating-active-reason')).toHaveText(
      'keyboard:1'
    )
    await expect(page.getByTestId('multiple-floating-value')).toHaveText('[]')

    await page.keyboard.press('g')
    await expect(pear).toBeFocused()
    await expect(page.getByTestId('multiple-floating-value')).toHaveText('[]')

    await page.keyboard.press('Space')
    await expect(page.getByTestId('multiple-floating-value-reason')).toHaveText(
      'keyboard'
    )
    await expect(page.getByTestId('multiple-floating-value')).toHaveText('["green-pear"]')
    await expect(page.getByTestId('multiple-floating-viewport')).toBeVisible()

    await page.keyboard.press('ArrowUp')
    await expect(blueberry).toBeFocused()
    await page.keyboard.press('Enter')
    await expect(page.getByTestId('multiple-floating-value')).toHaveText(
      '["green-pear","blueberry"]'
    )
    await expect(page.getByTestId('multiple-floating-viewport')).toBeVisible()
  })

  test('Escape, outside press, and trigger press close without rolling values back', async ({
    page,
  }) => {
    const trigger = page.getByTestId('multiple-floating-trigger')
    const viewport = page.getByTestId('multiple-floating-viewport')

    await trigger.click()
    await page.getByTestId('multiple-floating-red-delicious').click()
    await page.keyboard.press('Escape')
    await expect(viewport).not.toBeVisible()
    await expect(trigger).toBeFocused()
    await expect(page.getByTestId('multiple-floating-open-reason')).toHaveText(
      'escape-key'
    )
    await expect(page.getByTestId('multiple-floating-value')).toHaveText(
      '["red-delicious"]'
    )

    await trigger.click()
    await page.mouse.click(1900, 1000)
    await expect(viewport).not.toBeVisible()
    await expect(page.getByTestId('multiple-floating-value')).toHaveText(
      '["red-delicious"]'
    )

    await trigger.click()
    await trigger.click({ force: true })
    await expect(viewport).not.toBeVisible()
  })

  test('serializes repeated ordered form entries without duplicates', async ({
    page,
  }) => {
    await page.getByTestId('multiple-floating-trigger').click()
    await page.getByTestId('multiple-floating-red-delicious').click()
    await page.getByTestId('multiple-floating-green-pear').click()
    await page.getByTestId('multiple-floating-red-delicious').click()
    await page.getByTestId('multiple-floating-red-delicious').click()

    await page.keyboard.press('Escape')
    await page.getByTestId('multiple-floating-submit').click()
    await expect(page.getByTestId('multiple-floating-form-data')).toHaveText(
      '["green-pear","red-delicious"]'
    )
    await expect(page.locator('input[type="hidden"][name="floating-fruit"]')).toHaveCount(
      2
    )
    await expect(page.locator('input[type="hidden"][name="single-fruit"]')).toHaveValue(
      'blueberry'
    )
    expect(
      await page.evaluate(() =>
        String(
          new FormData(
            document.querySelector('#multiple-floating-form') as HTMLFormElement
          ).get('single-fruit')
        )
      )
    ).toBe('blueberry')
  })

  test('click-hold release toggles one item and leaves the list open', async ({
    page,
  }) => {
    const trigger = page.getByTestId('multiple-floating-trigger')
    const triggerBox = await trigger.boundingBox()
    expect(triggerBox).toBeTruthy()

    await trigger.click()
    await page.waitForTimeout(400)
    const blueberry = page.getByTestId('multiple-floating-blueberry')
    const blueberryBox = await blueberry.boundingBox()
    expect(blueberryBox).toBeTruthy()
    await page.keyboard.press('Escape')

    await page.mouse.move(
      triggerBox!.x + triggerBox!.width / 2,
      triggerBox!.y + triggerBox!.height / 2
    )
    await page.mouse.down()
    await page.waitForTimeout(400)
    await page.mouse.move(
      blueberryBox!.x + blueberryBox!.width / 2,
      blueberryBox!.y + blueberryBox!.height / 2
    )
    await page.mouse.up()

    await expect(page.getByTestId('multiple-floating-value')).toHaveText('["blueberry"]')
    await expect(page.getByTestId('multiple-floating-viewport')).toBeVisible()
  })
})
