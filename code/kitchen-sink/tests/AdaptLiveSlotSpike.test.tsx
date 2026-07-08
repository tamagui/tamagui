import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

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

  test('state preservation characterization: candidate is no worse than current v2', async ({
    page,
  }) => {
    const v2Increment = page.getByTestId('v2-state-increment')
    const slotIncrement = page.getByTestId('slot-state-increment')

    await v2Increment.click()
    await slotIncrement.click()
    await expect(page.getByTestId('v2-state-count')).toHaveText('v2 count: 1')
    await expect(page.getByTestId('slot-state-count')).toHaveText('slot count: 1')

    const v2InstanceBefore = await page.getByTestId('v2-state-instance').textContent()
    const slotInstanceBefore = await page.getByTestId('slot-state-instance').textContent()

    await page.getByTestId('v2-state-toggle').click()
    await page.getByTestId('slot-state-toggle').click()

    await expect(page.getByTestId('v2-state-content')).toBeVisible()
    await expect(page.getByTestId('slot-state-content')).toBeVisible()

    const v2CountAfterAdapt = await page.getByTestId('v2-state-count').textContent()
    const slotCountAfterAdapt = await page.getByTestId('slot-state-count').textContent()
    const v2InstanceAfterAdapt = await page.getByTestId('v2-state-instance').textContent()
    const slotInstanceAfterAdapt = await page
      .getByTestId('slot-state-instance')
      .textContent()

    await page.getByTestId('v2-state-toggle').click()
    await page.getByTestId('slot-state-toggle').click()

    await expect(page.getByTestId('v2-state-content')).toBeVisible()
    await expect(page.getByTestId('slot-state-content')).toBeVisible()

    const v2CountAfterReturn = await page.getByTestId('v2-state-count').textContent()
    const slotCountAfterReturn = await page.getByTestId('slot-state-count').textContent()

    const observation = {
      v2: {
        before: v2InstanceBefore,
        adapted: v2InstanceAfterAdapt,
        countAfterAdapt: v2CountAfterAdapt,
        countAfterReturn: v2CountAfterReturn,
      },
      slot: {
        before: slotInstanceBefore,
        adapted: slotInstanceAfterAdapt,
        countAfterAdapt: slotCountAfterAdapt,
        countAfterReturn: slotCountAfterReturn,
      },
    }

    console.log('AdaptLiveSlotSpike state observation', JSON.stringify(observation))

    if (v2CountAfterAdapt === 'v2 count: 1') {
      expect(slotCountAfterAdapt).toBe('slot count: 1')
    }
    if (v2CountAfterReturn === 'v2 count: 1') {
      expect(slotCountAfterReturn).toBe('slot count: 1')
    }
  })
})
