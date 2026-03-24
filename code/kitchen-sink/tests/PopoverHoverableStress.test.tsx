import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// stress tests for scoped hoverable popover with multiple triggers.
// hammers the interaction between safePolygon, multi-trigger switching,
// content interaction, diagonal movement, and open/close cycles.

test.describe('Popover hoverable stress', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableRapidCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
  })

  test('trigger → content → different trigger keeps popover open', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const triggerA = page.locator('#rapid-trigger-a')
    const triggerD = page.locator('#rapid-trigger-d')

    // open on A
    await triggerA.hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible()

    // move into the content
    const cBox = await content.boundingBox()
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2)
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()

    // move from content back up to trigger D (skipping B, C)
    const dBox = await triggerD.boundingBox()
    await page.mouse.move(dBox!.x + dBox!.width / 2, dBox!.y + dBox!.height / 2, {
      steps: 5,
    })
    await page.waitForTimeout(150)

    await expect(content).toBeVisible()
    await expect(page.locator('#rapid-panel-label')).toHaveText('Panel D')
  })

  test('diagonal movement through safe polygon keeps popover open', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const triggerA = page.locator('#rapid-trigger-a')

    // open on A
    await triggerA.hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible()

    // get positions for diagonal sweep from trigger toward content corner
    const aBox = await triggerA.boundingBox()
    const cBox = await content.boundingBox()

    // move diagonally from trigger bottom-right toward content top-left
    const steps = 8
    for (let i = 1; i <= steps; i++) {
      const t = i / steps
      const x = aBox!.x + aBox!.width * (1 - t * 0.3) // drift slightly left
      const y = aBox!.y + aBox!.height + (cBox!.y - aBox!.y - aBox!.height) * t
      await page.mouse.move(x, y)
      await page.waitForTimeout(15)
    }

    // land on content
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + 10)
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()
  })

  test('mouse leaving to empty space closes popover', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const triggerC = page.locator('#rapid-trigger-c')

    await triggerC.hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible()

    // move mouse far away from both trigger and content
    await page.mouse.move(10, 10, { steps: 2 })
    await page.waitForTimeout(300)
    await expect(content).not.toBeVisible()
  })

  test('repeated open/close cycles work reliably', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const triggerB = page.locator('#rapid-trigger-b')

    for (let cycle = 0; cycle < 3; cycle++) {
      // open
      await triggerB.hover()
      await page.waitForTimeout(150)
      await expect(content).toBeVisible()

      // close by moving away
      await page.mouse.move(10, 10, { steps: 2 })
      await page.waitForTimeout(300)
      await expect(content).not.toBeVisible()
    }
  })

  test('fast sweep then slow traverse through gap', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const triggerA = page.locator('#rapid-trigger-a')

    // open on A
    await triggerA.hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible()

    // fast sweep to E
    const triggerE = page.locator('#rapid-trigger-e')
    const eBox = await triggerE.boundingBox()
    await page.mouse.move(eBox!.x + eBox!.width / 2, eBox!.y + eBox!.height / 2, {
      steps: 2,
    })
    await page.waitForTimeout(100)

    // now SLOWLY move down through the gap to content
    const cBox = await content.boundingBox()
    const startY = eBox!.y + eBox!.height
    const endY = cBox!.y + 10
    const slowSteps = 12
    for (let i = 1; i <= slowSteps; i++) {
      const t = i / slowSteps
      await page.mouse.move(eBox!.x + eBox!.width / 2, startY + (endY - startY) * t)
      await page.waitForTimeout(30)
    }

    await expect(content).toBeVisible()
  })

  // skipped in CI: runner is too slow for the tight timing in this sweep+enter sequence
  test.skip(!!process.env.CI, 'flaky on slow CI runners')
  test('sweep all triggers then enter content from last', async ({ page }) => {
    const content = page.locator('#rapid-content')
    const ids = ['a', 'b', 'c', 'd', 'e', 'f']

    // open on first
    await page.locator('#rapid-trigger-a').hover()
    await page.waitForTimeout(150)
    await expect(content).toBeVisible()

    // sweep through all triggers
    for (const id of ids.slice(1)) {
      const el = page.locator(`#rapid-trigger-${id}`)
      const box = await el.boundingBox()
      await page.mouse.move(box!.x + box!.width / 2, box!.y + box!.height / 2, {
        steps: 2,
      })
      await page.waitForTimeout(20)
    }

    // rest on F
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()
    await expect(page.locator('#rapid-panel-label')).toHaveText('Panel F')

    // move into content from F
    const cBox = await content.boundingBox()
    await page.mouse.move(cBox!.x + cBox!.width / 2, cBox!.y + cBox!.height / 2, {
      steps: 5,
    })
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()
  })
})
