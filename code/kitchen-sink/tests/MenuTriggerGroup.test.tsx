import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

test.beforeEach(async ({ page }) => {
  await setupPage(page, { name: 'MenuTriggerGroupCase', type: 'useCase' })
})

test('hover switches the open menu at its own trigger without opening idle groups', async ({
  page,
}) => {
  const file = page.getByTestId('trigger-File')
  const edit = page.getByTestId('trigger-Edit')
  await edit.hover()
  await expect(edit).toHaveAttribute('aria-expanded', 'false')
  await file.click()
  await expect(page.getByTestId('content-File')).toBeVisible()
  // physical pointer movement proves modal layers allow sibling hits
  const box = await edit.boundingBox()
  await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2)
  await expect(page.getByTestId('content-Edit')).toBeVisible()
  await expect(file).toHaveAttribute('aria-expanded', 'false')
  await expect(edit).toHaveAttribute('aria-expanded', 'true')
  await expect
    .poll(async () => {
      const content = await page.getByTestId('content-Edit').boundingBox()
      return content ? Math.abs(content.x - box!.x) : Infinity
    })
    .toBeLessThan(2)
  const other = await page.getByTestId('trigger-Other').boundingBox()
  await page.mouse.move(other!.x + other!.width / 2, other!.y + other!.height / 2)
  await expect(page.getByTestId('trigger-Other')).toHaveAttribute(
    'aria-expanded',
    'false'
  )
  await expect(edit).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('Escape')
  await expect(edit).toBeFocused()
  await file.hover()
  await expect(file).toHaveAttribute('aria-expanded', 'false')
})

test('left and right switch menus, skip disabled triggers and wrap', async ({ page }) => {
  await page.getByTestId('trigger-File').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('item-File')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('item-Edit')).toBeFocused()
  await expect(page.getByTestId('trigger-File')).toHaveAttribute('aria-expanded', 'false')
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByTestId('item-File')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByTestId('item-View')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('trigger-View')).toBeFocused()
})

test('submenu arrow navigation stays within the submenu', async ({ page }) => {
  await page.getByTestId('trigger-File').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('item-File')).toBeFocused()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('sub-File')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('sub-content-File')).toBeVisible()
  await expect(page.getByTestId('trigger-File')).toHaveAttribute('aria-expanded', 'true')
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByTestId('sub-File')).toBeFocused()
})

test('shared controlled content switches descriptors and rejects another group', async ({
  page,
}) => {
  await page.getByTestId('shared-Alpha').click()
  await expect(page.getByTestId('shared-content')).toBeVisible()
  await page.getByTestId('shared-Beta').hover()
  await expect(page.getByTestId('shared-item')).toHaveText('Beta')
  await expect(page.getByTestId('shared-Alpha')).toHaveAttribute('aria-expanded', 'false')
  await expect(page.getByTestId('shared-Beta')).toHaveAttribute('aria-expanded', 'true')
  const anchor = await page.getByTestId('shared-Beta').boundingBox()
  await expect
    .poll(async () => {
      const content = await page.getByTestId('shared-content').boundingBox()
      return content ? Math.abs(content.x - anchor!.x) : Infinity
    })
    .toBeLessThan(2)
  await page.getByTestId('shared-Separate').hover()
  await expect(page.getByTestId('shared-item')).toHaveText('Beta')
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('shared-item')).toHaveText('Gamma')
  await expect(page.getByTestId('shared-item')).toBeFocused()
  await page.keyboard.press('Escape')
  await expect(page.getByTestId('shared-Gamma')).toBeFocused()
})

test('shared root keeps its grouped anchor when other or disabled triggers are hovered', async ({
  page,
}) => {
  await page.getByTestId('isolation-Alpha').click()
  await expect(page.getByTestId('isolation-content')).toBeVisible()
  const sibling = await page.getByTestId('isolation-Beta').boundingBox()
  await page.mouse.move(sibling!.x + sibling!.width / 2, sibling!.y + sibling!.height / 2)
  await expect(page.getByTestId('isolation-item')).toHaveText('Beta')
  await expect
    .poll(async () => {
      const content = await page.getByTestId('isolation-content').boundingBox()
      return content ? Math.abs(content.x - sibling!.x) : Infinity
    })
    .toBeLessThan(2)
  const activePosition = await page.getByTestId('isolation-content').boundingBox()
  // physical hover must preserve both the descriptor and the active anchor.
  for (const name of ['Separate', 'Ungrouped', 'Disabled', 'UngroupedDisabled']) {
    const target = await page.getByTestId(`isolation-${name}`).boundingBox()
    await page.mouse.move(target!.x + target!.width / 2, target!.y + target!.height / 2)
    await expect(page.getByTestId('isolation-item')).toHaveText('Beta')
    await expect(page.getByTestId(`isolation-${name}`)).toHaveAttribute(
      'aria-expanded',
      'false'
    )
    // let floating-ui process the pointer before checking its settled position.
    await page.evaluate(
      () =>
        new Promise<void>((resolve) => {
          requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
        })
    )
    const content = await page.getByTestId('isolation-content').boundingBox()
    expect(Math.abs(content!.x - activePosition!.x)).toBeLessThan(2)
    expect(Math.abs(content!.y - activePosition!.y)).toBeLessThan(2)
  }
})

test('closed group uses one tab stop and arrows move focus without opening', async ({
  page,
}) => {
  const file = page.getByTestId('trigger-File')
  const edit = page.getByTestId('trigger-Edit')
  await expect(file).toHaveAttribute('tabindex', '0')
  await expect(edit).toHaveAttribute('tabindex', '-1')
  await file.focus()
  await page.keyboard.press('ArrowRight')
  await expect(edit).toBeFocused()
  await expect(edit).toHaveAttribute('aria-expanded', 'false')
  await expect(edit).toHaveAttribute('tabindex', '0')
  await expect(file).toHaveAttribute('tabindex', '-1')
})

test('RTL arrows follow the menubar direction', async ({ page }) => {
  await expect(page.getByTestId('group-rtl')).toHaveAttribute('dir', 'rtl')
  const first = await page.getByTestId('trigger-First').boundingBox()
  const second = await page.getByTestId('trigger-Second').boundingBox()
  expect(first!.x).toBeGreaterThan(second!.x)
  await page.getByTestId('trigger-First').focus()
  await page.keyboard.press('ArrowDown')
  await expect(page.getByTestId('item-First')).toBeFocused()
  await page.keyboard.press('ArrowLeft')
  await expect(page.getByTestId('item-Second')).toBeFocused()
  await page.keyboard.press('ArrowRight')
  await expect(page.getByTestId('item-First')).toBeFocused()
})

test('outside dismissal ends hover switching', async ({ page }) => {
  await page.getByTestId('trigger-File').click()
  await expect(page.getByTestId('content-File')).toBeVisible()
  await page.getByTestId('outside').click()
  await expect(page.getByTestId('trigger-File')).toHaveAttribute('aria-expanded', 'false')
  await page.getByTestId('trigger-Edit').hover()
  await expect(page.getByTestId('trigger-Edit')).toHaveAttribute('aria-expanded', 'false')
})

test('ungrouped menu in a mixed root keeps its checkbox under the physical pointer', async ({
  page,
}) => {
  await page.getByTestId('mixed-Second').hover()
  await page.getByTestId('mixed-First').click()
  const content = page.getByTestId('mixed-content')
  const checkbox = page.getByTestId('mixed-check')
  await expect(checkbox).toHaveText('First check')
  // match the downstream probe: entry has mounted and all animations have finished.
  await page.waitForFunction(() => {
    const menu = document.querySelector('[data-testid="mixed-content"]')
    return (
      menu &&
      !menu.closest('.t_unmounted') &&
      document.getAnimations().every((animation) => animation.playState !== 'running') &&
      menu.getBoundingClientRect().width === 195
    )
  })
  const position = await content.boundingBox()
  const check = await checkbox.getByText('First check', { exact: true }).boundingBox()
  const x = check!.x + check!.width / 2
  const y = check!.y + check!.height / 2
  await page.mouse.move(x, y)
  await page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })
  )
  const after = await content.boundingBox()
  expect(Math.abs(after!.y - position!.y)).toBeLessThan(2)
  expect(Math.abs(after!.x - position!.x)).toBeLessThan(2)
  await expect(checkbox).toHaveText('First check')
  expect(
    await page.evaluate(
      ({ x, y }) =>
        document
          .elementFromPoint(x, y)
          ?.closest('[role="menuitemcheckbox"]')
          ?.getAttribute('data-testid'),
      { x, y }
    )
  ).toBe('mixed-check')
  await page.mouse.click(x, y)
  await expect(checkbox).toHaveAttribute('aria-checked', 'true')
  await expect(content).toBeVisible()
})
