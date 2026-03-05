import { expect, test, type Page } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

// shared multi-trigger tests for both Popover and Menu
// validates render isolation, position re-anchoring, state tracking,
// focus return, and rapid cycling — the same infra backs both components

function parseRenderCount(text: string | null): number {
  if (!text) return 0
  const match = text.match(/renders:\s*(\d+)/)
  return match ? Number(match[1]) : 0
}

// abstracts the common interaction + assertion pattern for any floating element
// with multiple triggers, regardless of whether it's Popover or Menu
type MultiTriggerHarness = {
  prefix: string // "pop" | "menu"
  contentTestId: string
  triggerCount: number
  open: (page: Page, idx: number) => Promise<void>
  close: (page: Page) => Promise<void>
}

const popoverHarness: MultiTriggerHarness = {
  prefix: 'pop',
  contentTestId: 'pop-content',
  triggerCount: 3,
  open: async (page, idx) => {
    await page.getByTestId(`pop-trigger-${idx}`).click()
    await page.waitForTimeout(300)
  },
  close: async (page) => {
    // use Escape (same as Menu) so focus returns to trigger
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  },
}

const menuHarness: MultiTriggerHarness = {
  prefix: 'menu',
  contentTestId: 'menu-content',
  triggerCount: 3,
  open: async (page, idx) => {
    await page.getByTestId(`menu-trigger-${idx}`).click()
    await page.waitForTimeout(300)
  },
  close: async (page) => {
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
  },
}

function multiTriggerSuite(h: MultiTriggerHarness) {
  const triggerTestId = (idx: number) => `${h.prefix}-trigger-${idx}`

  test(`[${h.prefix}] only the active trigger re-renders`, async ({ page }) => {
    const getRenderCounts = async () => {
      const counts: number[] = []
      for (let i = 1; i <= h.triggerCount; i++) {
        counts.push(
          parseRenderCount(
            await page.getByTestId(`${triggerTestId(i)}-render-count`).textContent()
          )
        )
      }
      return counts
    }

    const initial = await getRenderCounts()

    // open via trigger 1
    await h.open(page, 1)
    await expect(page.getByTestId(h.contentTestId)).toBeVisible()

    const afterOpen = await getRenderCounts()
    // trigger 2 and 3 should NOT re-render
    expect(afterOpen[1]).toBe(initial[1])
    expect(afterOpen[2]).toBe(initial[2])

    // close
    await h.close(page)
    await expect(page.getByTestId(h.contentTestId)).not.toBeVisible()

    const afterClose = await getRenderCounts()
    expect(afterClose[1]).toBe(initial[1])
    expect(afterClose[2]).toBe(initial[2])
  })

  test(`[${h.prefix}] content re-anchors when switching triggers`, async ({ page }) => {
    // open via trigger 1
    await h.open(page, 1)
    await expect(page.getByTestId(h.contentTestId)).toBeVisible()

    const trigger1Box = await getBoundingRect(page, `[data-testid="${triggerTestId(1)}"]`)
    const contentBox1 = await getBoundingRect(page, `[data-testid="${h.contentTestId}"]`)
    expect(trigger1Box).not.toBeNull()
    expect(contentBox1).not.toBeNull()
    expect(Math.abs(contentBox1!.x - trigger1Box!.x)).toBeLessThan(50)

    // close then open via trigger 3
    await h.close(page)
    await h.open(page, 3)
    await expect(page.getByTestId(h.contentTestId)).toBeVisible()

    const trigger3Box = await getBoundingRect(page, `[data-testid="${triggerTestId(3)}"]`)
    const contentBox3 = await getBoundingRect(page, `[data-testid="${h.contentTestId}"]`)
    expect(trigger3Box).not.toBeNull()
    expect(contentBox3).not.toBeNull()
    expect(Math.abs(contentBox3!.x - trigger3Box!.x)).toBeLessThan(50)

    // content should have moved — trigger 3 is rightward of trigger 1
    expect(contentBox3!.x).toBeGreaterThan(contentBox1!.x + 20)
  })

  test(`[${h.prefix}] only the active trigger has data-state=open`, async ({ page }) => {
    await h.open(page, 2)
    await expect(page.getByTestId(h.contentTestId)).toBeVisible()

    await expect(page.getByTestId(triggerTestId(1))).toHaveAttribute(
      'data-state',
      'closed'
    )
    await expect(page.getByTestId(triggerTestId(2))).toHaveAttribute('data-state', 'open')
    await expect(page.getByTestId(triggerTestId(3))).toHaveAttribute(
      'data-state',
      'closed'
    )
  })

  test(`[${h.prefix}] close returns focus to active trigger`, async ({ page }) => {
    const trigger = page.getByTestId(triggerTestId(2))
    await trigger.click()
    await page.waitForTimeout(300)
    await expect(page.getByTestId(h.contentTestId)).toBeVisible()

    await h.close(page)
    await page.waitForTimeout(300)
    await expect(trigger).toBeFocused()
  })

  test(`[${h.prefix}] rapid open/close cycles work reliably`, async ({ page }) => {
    for (let cycle = 0; cycle < 4; cycle++) {
      const idx = (cycle % h.triggerCount) + 1
      await h.open(page, idx)
      await expect(page.getByTestId(h.contentTestId)).toBeVisible()
      await h.close(page)
      await expect(page.getByTestId(h.contentTestId)).not.toBeVisible()
    }
  })

  test(`[${h.prefix}] rapid trigger switching re-anchors each time`, async ({ page }) => {
    for (let idx = 1; idx <= h.triggerCount; idx++) {
      await h.open(page, idx)
      await expect(page.getByTestId(h.contentTestId)).toBeVisible()

      const triggerBox = await getBoundingRect(
        page,
        `[data-testid="${triggerTestId(idx)}"]`
      )
      const contentBox = await getBoundingRect(page, `[data-testid="${h.contentTestId}"]`)
      expect(Math.abs(contentBox!.x - triggerBox!.x)).toBeLessThan(50)

      await h.close(page)
    }
  })
}

test.describe('Popover & Menu Multi-Trigger', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverAndMenuMultiTriggerCase',
      type: 'useCase',
      waitExtra: true,
    })
  })

  test.describe('Popover', () => {
    multiTriggerSuite(popoverHarness)
  })

  test.describe('Menu', () => {
    multiTriggerSuite(menuHarness)
  })
})
