import { expect, test } from '@playwright/test'

import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'RovingFocusCase', type: 'useCase' })
})

const focused = (page) =>
  page.evaluate(
    () =>
      document.activeElement?.getAttribute('data-testid') ??
      document.activeElement?.getAttribute('role') ??
      null
  )

test('each roving group is a single stop in the tab order', async ({ page }) => {
  await page.getByTestId('before').focus()

  const seen: (string | null)[] = []
  for (let i = 0; i < 4; i++) {
    await page.keyboard.press('Tab')
    seen.push(await focused(page))
  }

  // one stop per group, in document order. the tabpanel is its own stop, which
  // is the WAI-ARIA tabs pattern, but neither the disabled tab nor the second
  // item of any group is reachable by Tab
  expect(seen).toEqual(['tab-a', 'tabpanel', 'toggle-left', 'radio-one'])
})

test('shift-tab leaves a group without walking its items', async ({ page }) => {
  await page.getByTestId('after').focus()

  const seen: (string | null)[] = []
  for (let i = 0; i < 3; i++) {
    await page.keyboard.press('Shift+Tab')
    seen.push(await focused(page))
  }

  expect(seen).toEqual(['radio-one', 'toggle-left', 'tabpanel'])
})

test('arrow keys move within a group and skip a disabled item', async ({ page }) => {
  await page.getByTestId('tab-a').focus()
  await expect(page.getByTestId('tab-a')).toHaveAttribute('tabindex', '0')

  // tab-b is disabled, so ArrowRight lands on tab-c
  await page.keyboard.press('ArrowRight')
  expect(await focused(page)).toBe('tab-c')

  await page.keyboard.press('ArrowLeft')
  expect(await focused(page)).toBe('tab-a')
})

test('only the current item carries the tab stop', async ({ page }) => {
  await page.getByTestId('tab-a').focus()

  await expect(page.getByTestId('tab-a')).toHaveAttribute('tabindex', '0')
  await expect(page.getByTestId('tab-c')).toHaveAttribute('tabindex', '-1')
  // disabled is never eligible, whatever the current tab stop is
  await expect(page.getByTestId('tab-b')).toHaveAttribute('tabindex', '-1')

  await page.keyboard.press('ArrowRight')

  await expect(page.getByTestId('tab-c')).toHaveAttribute('tabindex', '0')
  await expect(page.getByTestId('tab-a')).toHaveAttribute('tabindex', '-1')
})

test('the group carries the tab stop until an item takes it', async ({ page }) => {
  // items register from an effect, so a count of 0 before mount means "unknown",
  // not "empty". the group stays a tab stop there, which is what makes the list
  // reachable by keyboard pre-hydration
  await expect(page.getByTestId('tabs-list')).toHaveAttribute('tabindex', '0')

  // and no item claims it before focus enters the group
  for (const id of ['tab-a', 'tab-b', 'tab-c']) {
    await expect(page.getByTestId(id)).toHaveAttribute('tabindex', '-1')
  }
})
