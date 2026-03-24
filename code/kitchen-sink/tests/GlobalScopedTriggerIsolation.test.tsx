import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

function parseRenderCount(text: string | null): number {
  const match = text?.match(/(\d+)/)
  if (!match) {
    throw new Error(`Unable to parse render count from: ${text}`)
  }
  return Number(match[1])
}

async function getRenderCount(page: Parameters<typeof setupPage>[0], testId: string) {
  const text = await page.getByTestId(testId).textContent()
  return parseRenderCount(text)
}

test.describe('Global Scoped Trigger Isolation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'GlobalScopedTriggerIsolationCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('memoized shared popover and menu triggers keep unrelated render counts stable', async ({
    page,
  }) => {
    const popInitial = {
      one: await getRenderCount(page, 'global-popover-trigger-1-renders'),
      two: await getRenderCount(page, 'global-popover-trigger-2-renders'),
      three: await getRenderCount(page, 'global-popover-trigger-3-renders'),
    }

    await page.getByTestId('global-popover-trigger-1').hover()
    await expect(page.getByTestId('global-popover-content')).toBeVisible()

    const popAfterOpen = {
      one: await getRenderCount(page, 'global-popover-trigger-1-renders'),
      two: await getRenderCount(page, 'global-popover-trigger-2-renders'),
      three: await getRenderCount(page, 'global-popover-trigger-3-renders'),
    }

    expect
      .soft(popAfterOpen.two, 'popover trigger 2 should stay stable on trigger 1 open')
      .toBe(popInitial.two)
    expect
      .soft(popAfterOpen.three, 'popover trigger 3 should stay stable on trigger 1 open')
      .toBe(popInitial.three)

    await page.getByTestId('global-popover-trigger-2').hover()
    await expect(page.getByTestId('global-popover-content')).toBeVisible()

    const popAfterSwitch = {
      one: await getRenderCount(page, 'global-popover-trigger-1-renders'),
      two: await getRenderCount(page, 'global-popover-trigger-2-renders'),
      three: await getRenderCount(page, 'global-popover-trigger-3-renders'),
    }

    expect
      .soft(
        popAfterSwitch.three,
        'popover trigger 3 should stay stable while switching 1 -> 2'
      )
      .toBe(popInitial.three)

    const menuInitial = {
      one: await getRenderCount(page, 'global-menu-trigger-1-renders'),
      two: await getRenderCount(page, 'global-menu-trigger-2-renders'),
      three: await getRenderCount(page, 'global-menu-trigger-3-renders'),
    }

    await page.getByTestId('global-menu-trigger-1').click()
    await expect(page.getByTestId('global-menu-content')).toBeVisible()

    const menuAfterOpen = {
      one: await getRenderCount(page, 'global-menu-trigger-1-renders'),
      two: await getRenderCount(page, 'global-menu-trigger-2-renders'),
      three: await getRenderCount(page, 'global-menu-trigger-3-renders'),
    }

    expect
      .soft(menuAfterOpen.two, 'menu trigger 2 should stay stable on trigger 1 open')
      .toBe(menuInitial.two)
    expect
      .soft(menuAfterOpen.three, 'menu trigger 3 should stay stable on trigger 1 open')
      .toBe(menuInitial.three)
  })
})
