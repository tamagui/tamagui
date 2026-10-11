import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

const measuredV2StateBaseline = {
  before: 'v2 instance: 1',
  adapted: 'v2 instance: 3',
  countAfterAdapt: 'v2 count: 0',
  countAfterReturn: 'v2 count: 0',
} as const

const toSlotCount = (value: string) => value.replace(/^v2 /, 'slot ')

test.describe('Adapt live-publish slot PR-A spike', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'AdaptLiveSlotSpikeCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test('candidate slot renders once in target position with context, a11y, and focus', async ({
    page,
  }) => {
    const content = page.getByTestId('live-slot-content')
    await expect(content).toBeVisible()
    await expect(content).toHaveCount(1)

    const targetOwnsContent = await page.evaluate(() => {
      const content = document.querySelector('[data-testid="live-slot-content"]')
      return Boolean(content?.closest('[data-slot-target="true"]'))
    })
    expect(targetOwnsContent).toBe(true)

    const sourceOwnsContent = await page.evaluate(() => {
      const content = document.querySelector('[data-testid="live-slot-content"]')
      return Boolean(content?.closest('[data-slot-source="true"]'))
    })
    expect(sourceOwnsContent).toBe(false)

    await expect(page.getByTestId('live-slot-context')).toContainText(
      'dialog-context: dialog-parent-ok'
    )
    await expect(page.getByTestId('live-slot-context')).toContainText(
      'portal-context: portal-wrapper-ok'
    )
    await expect(page.getByTestId('live-slot-context')).toContainText(
      'target-context: target-context-ok'
    )

    const dialog = page.getByRole('dialog', { name: 'Live slot spike panel' })
    await expect(dialog).toBeVisible()
    await expect(dialog).toHaveAttribute('aria-modal', 'true')
    await expect(dialog).toHaveAttribute('aria-labelledby', 'adapt-live-slot-title')
    await expect(dialog).toHaveAttribute(
      'aria-describedby',
      'adapt-live-slot-description'
    )

    const input = page.getByTestId('live-slot-focus-input')
    const next = page.getByTestId('live-slot-focus-next')
    await expect(input).toBeFocused({ timeout: 5000 })

    await page.keyboard.press('Tab')
    await expect(next).toBeFocused()
    await page.keyboard.press('Tab')
    await expect(input).toBeFocused()
    await page.keyboard.press('Shift+Tab')
    await expect(next).toBeFocused()
  })

  test('candidate live-publish updates props while active without remounting', async ({
    page,
  }) => {
    const context = page.getByTestId('live-slot-context')
    await expect(context).toContainText('revision: 0')

    const before = await page.getByTestId('live-slot-instance').textContent()
    const instanceBefore = before?.match(/instance:\s*(\d+)/)?.[1]
    expect(instanceBefore).toBeTruthy()

    await page.getByTestId('live-slot-update-prop').click()
    await expect(context).toContainText('revision: 1')

    const after = await page.getByTestId('live-slot-instance').textContent()
    const instanceAfter = after?.match(/instance:\s*(\d+)/)?.[1]
    expect(instanceAfter).toBe(instanceBefore)
  })

  test('state preservation characterization: candidate matches measured v2 baseline', async ({
    page,
  }) => {
    await expect(page.getByTestId('v2-measured-before')).toHaveText(
      measuredV2StateBaseline.before
    )
    await expect(page.getByTestId('v2-measured-adapted')).toHaveText(
      measuredV2StateBaseline.adapted
    )
    await expect(page.getByTestId('v2-measured-count-after-adapt')).toHaveText(
      measuredV2StateBaseline.countAfterAdapt
    )
    await expect(page.getByTestId('v2-measured-count-after-return')).toHaveText(
      measuredV2StateBaseline.countAfterReturn
    )

    const slotIncrement = page.getByTestId('slot-state-increment')

    await slotIncrement.click()
    await expect(page.getByTestId('slot-state-count')).toHaveText('slot count: 1')

    const slotInstanceBefore = await page.getByTestId('slot-state-instance').textContent()

    await page.getByTestId('slot-state-toggle').click()

    await expect(page.getByTestId('slot-state-content')).toBeVisible()

    const slotCountAfterAdapt = await page.getByTestId('slot-state-count').textContent()
    const slotInstanceAfterAdapt = await page
      .getByTestId('slot-state-instance')
      .textContent()

    await page.getByTestId('slot-state-toggle').click()

    await expect(page.getByTestId('slot-state-content')).toBeVisible()

    const slotCountAfterReturn = await page.getByTestId('slot-state-count').textContent()

    const observation = {
      measuredV2: measuredV2StateBaseline,
      slot: {
        before: slotInstanceBefore,
        adapted: slotInstanceAfterAdapt,
        countAfterAdapt: slotCountAfterAdapt,
        countAfterReturn: slotCountAfterReturn,
      },
    }

    console.log('AdaptLiveSlotSpike state observation', JSON.stringify(observation))

    expect(slotInstanceAfterAdapt).not.toBe(slotInstanceBefore)
    expect(slotCountAfterAdapt).toBe(toSlotCount(measuredV2StateBaseline.countAfterAdapt))
    expect(slotCountAfterReturn).toBe(
      toSlotCount(measuredV2StateBaseline.countAfterReturn)
    )
  })
})
