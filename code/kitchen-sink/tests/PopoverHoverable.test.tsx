import { expect, test, type Page } from '@playwright/test'
import { getBoundingRect, setupPage } from './test-utils'

// helper: get opacity of element by id
async function getOpacity(page: any, id: string) {
  return page.evaluate(
    (sel: string) => parseFloat(getComputedStyle(document.getElementById(sel)!).opacity),
    id
  )
}

async function hoverAndMeasureOpen(
  page: Page,
  triggerSelector: string,
  contentSelector: string
) {
  await page.evaluate(
    ({ triggerSelector, contentSelector }) => {
      const timing = { enteredAt: 0, openedAt: 0 }
      globalThis['__popoverHoverOpenTiming'] = timing
      const trigger = document.querySelector(triggerSelector)
      if (!trigger) throw new Error(`missing hover trigger: ${triggerSelector}`)

      trigger.addEventListener(
        'mouseenter',
        () => {
          timing.enteredAt = performance.now()
        },
        { once: true }
      )

      const recordOpen = () => {
        const content = document.querySelector(contentSelector)
        if (timing.enteredAt && content?.getAttribute('data-state') === 'open') {
          timing.openedAt = performance.now()
          observer.disconnect()
        }
      }
      const observer = new MutationObserver(recordOpen)
      observer.observe(document.body, {
        attributes: true,
        childList: true,
        subtree: true,
        attributeFilter: ['data-state'],
      })
      recordOpen()
    },
    { triggerSelector, contentSelector }
  )

  await page.locator(triggerSelector).hover()
  await expect(page.locator(contentSelector)).toBeVisible({ timeout: 3000 })

  return page.evaluate(() => {
    const timing = globalThis['__popoverHoverOpenTiming']
    if (!timing?.enteredAt || !timing.openedAt) {
      throw new Error(`missing hover-open timing: ${JSON.stringify(timing)}`)
    }
    return timing.openedAt - timing.enteredAt
  })
}

async function leaveAndMeasureClose(
  page: Page,
  triggerSelector: string,
  contentSelector: string
) {
  await page.evaluate(
    ({ triggerSelector, contentSelector }) => {
      const timing = {
        leftAt: 0,
        closedAt: 0,
        opacitySamples: [] as number[],
      }
      globalThis['__popoverHoverCloseTiming'] = timing
      const trigger = document.querySelector(triggerSelector)
      if (!trigger) throw new Error(`missing hover trigger: ${triggerSelector}`)

      trigger.addEventListener(
        'mouseleave',
        () => {
          timing.leftAt = performance.now()
          const sample = () => {
            const content = document.querySelector(contentSelector)
            if (!content) {
              timing.closedAt = performance.now()
              return
            }
            const opacity = Number.parseFloat(getComputedStyle(content).opacity)
            if (Number.isFinite(opacity)) timing.opacitySamples.push(opacity)
            requestAnimationFrame(sample)
          }
          requestAnimationFrame(sample)
        },
        { once: true }
      )
    },
    { triggerSelector, contentSelector }
  )

  await page.mouse.move(10, 10)
  await page.waitForFunction(
    () => {
      const timing = globalThis['__popoverHoverCloseTiming']
      return timing?.leftAt > 0 && timing.closedAt > 0
    },
    { timeout: 3000 }
  )

  return page.evaluate(() => {
    const timing = globalThis['__popoverHoverCloseTiming']
    return {
      delay: timing.closedAt - timing.leftAt,
      minPositiveOpacity:
        timing.opacitySamples.filter((opacity) => opacity > 0).sort((a, b) => a - b)[0] ??
        Number.NaN,
    }
  })
}

// Bug 1: delay should apply to both enter AND exit
test.describe('Popover hoverable delay', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableDelayCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('delay applies to enter: popover should not open before delay elapses', async ({
    page,
  }) => {
    const content = page.locator('#delay-content')

    await expect(content).not.toBeVisible()

    const openDelay = await hoverAndMeasureOpen(page, '#delay-trigger', '#delay-content')
    expect(openDelay).toBeGreaterThanOrEqual(350)
  })

  test('delay applies to exit: popover should not close before delay elapses', async ({
    page,
  }) => {
    const trigger = page.locator('#delay-trigger')
    const content = page.locator('#delay-content')

    // hover to open (wait for delay)
    await trigger.hover()
    await page.waitForTimeout(800)
    await expect(content).toBeVisible({ timeout: 3000 })

    const close = await leaveAndMeasureClose(page, '#delay-trigger', '#delay-content')
    expect(close.delay).toBeGreaterThanOrEqual(350)
    await expect(content).not.toBeVisible({ timeout: 3000 })
  })
})

// Bug 2: restMs should only apply to enter (not exit)
test.describe('Popover hoverable restMs', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableRestMsCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('restMs delays enter: popover should open after mouse rests', async ({ page }) => {
    const content = page.locator('#restms-content')

    await expect(content).not.toBeVisible()

    const openDelay = await hoverAndMeasureOpen(
      page,
      '#restms-trigger',
      '#restms-content'
    )
    expect(openDelay).toBeGreaterThanOrEqual(350)
  })

  test('exit without restMs: popover should close quickly after mouse leaves', async ({
    page,
  }) => {
    const trigger = page.locator('#restms-trigger')
    const content = page.locator('#restms-content')

    // open it
    await trigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 2000 })

    // move mouse away - with restMs but no delay, exit should be handled by safePolygon (quick)
    await page.mouse.move(10, 10)

    // exit should happen quickly (no restMs delay on exit, only animation duration ~200ms)
    await expect(content).not.toBeVisible({ timeout: 1000 })
  })
})

// Bug 3: exit animation should play when hoverable closes popover
test.describe('Popover hoverable exit animation', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableExitAnimCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('exit animation plays: content should still be visible briefly after mouse leaves', async ({
    page,
  }) => {
    const trigger = page.locator('#exitanim-trigger')
    const content = page.locator('#exitanim-content')

    // hover to open
    await trigger.hover()
    await expect(content).toBeVisible({ timeout: 3000 })

    // wait for enter animation to complete (500ms transition + buffer)
    await page.waitForTimeout(700)

    // confirm fully visible now
    const opacityBefore = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(opacityBefore).toBeGreaterThan(0.9)

    const close = await leaveAndMeasureClose(
      page,
      '#exitanim-trigger',
      '#exitanim-content'
    )
    expect(close.minPositiveOpacity).toBeGreaterThan(0)
    expect(close.minPositiveOpacity).toBeLessThan(1)
    await expect(content).not.toBeVisible({ timeout: 2000 })
  })
})

// Bug: safePolygon should allow hovering from trigger to content through the gap
test.describe('Popover hoverable safePolygon', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, { name: 'PopoverHoverableSafePolygonCase', type: 'useCase' })
    await page.waitForLoadState('networkidle')
  })

  test('can hover from trigger to content through the gap', async ({ page }) => {
    const trigger = page.locator('#safepoly-trigger')
    const content = page.locator('#safepoly-content')

    // hover trigger to open (restMs is 260ms)
    await trigger.hover()
    await page.waitForTimeout(350)
    await expect(content).toBeVisible({ timeout: 200 })
    // wait for enter animation to settle
    await page.waitForTimeout(100)

    // slowly move from trigger down to content (through the 80px offset gap)
    const triggerBox = await trigger.boundingBox()
    const contentBox = await content.boundingBox()
    if (triggerBox && contentBox) {
      const startY = triggerBox.y + triggerBox.height
      const endY = contentBox.y + 10
      const x = triggerBox.x + triggerBox.width / 2
      for (let y = startY; y <= endY; y += 4) {
        await page.mouse.move(x, y)
        await page.waitForTimeout(10)
      }
    }

    // wait well past any grace period or animation - if the popover closed
    // during the gap crossing, it won't be visible after this
    await page.waitForTimeout(500)
    await expect(content).toBeVisible({ timeout: 1000 })

    // verify content is fully opaque (not mid-exit-animation)
    const opacity = await content.evaluate((el) =>
      parseFloat(getComputedStyle(el).opacity)
    )
    expect(opacity).toBeGreaterThan(0.9)
  })

  test('restMs applies on re-hover (not just first hover)', async ({ page }) => {
    const content = page.locator('#safepoly-content')

    const firstOpenDelay = await hoverAndMeasureOpen(
      page,
      '#safepoly-trigger',
      '#safepoly-content'
    )
    expect(firstOpenDelay).toBeGreaterThanOrEqual(220)

    // move far away to close
    await page.mouse.move(10, 10)
    await page.waitForTimeout(500)
    await expect(content).not.toBeVisible({ timeout: 2000 })

    const secondOpenDelay = await hoverAndMeasureOpen(
      page,
      '#safepoly-trigger',
      '#safepoly-content'
    )
    expect(secondOpenDelay).toBeGreaterThanOrEqual(220)
  })
})

// Bug: scoped multi-trigger hoverable - mimics WebsiteHeader.tsx pattern
// uses CSS driver since animatePosition needs a driver that supports classNames
test.describe('Popover hoverable scoped multi-trigger', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
    await page.waitForLoadState('networkidle')
  })

  test('scoped: delay applies to enter - should not open immediately', async ({
    page,
  }) => {
    const openDelay = await hoverAndMeasureOpen(
      page,
      '#nav-trigger-about',
      '#nav-content'
    )
    expect(openDelay).toBeGreaterThanOrEqual(250)
  })

  test('scoped: exit animation plays when hovering away', async ({ page }) => {
    const trigger = page.locator('#nav-trigger-about')
    const content = page.locator('#nav-content')

    // open it
    await trigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })

    // wait for enter animation to finish (500ms transition)
    await page.waitForTimeout(700)

    // verify content is correctly positioned below trigger (not stuck at y=0)
    const triggerRect = await getBoundingRect(page, '#nav-trigger-about')
    const contentRect = await getBoundingRect(page, '#nav-content')

    expect(contentRect!.y).toBeGreaterThan(triggerRect!.y)

    const opacityBefore = await getOpacity(page, 'nav-content')
    expect(opacityBefore).toBeGreaterThan(0.9)

    const close = await leaveAndMeasureClose(page, '#nav-trigger-about', '#nav-content')
    expect(close.minPositiveOpacity).toBeGreaterThan(0)
    expect(close.minPositiveOpacity).toBeLessThan(1)
    await expect(content).not.toBeVisible({ timeout: 2000 })
  })

  test('scoped: switching between triggers keeps popover open', async ({ page }) => {
    const aboutTrigger = page.locator('#nav-trigger-about')
    const blogTrigger = page.locator('#nav-trigger-blog')
    const content = page.locator('#nav-content')

    // open about
    await aboutTrigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })

    // switch to blog trigger - popover should stay open
    await blogTrigger.hover()
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()
  })

  test('scoped: content → different trigger repositions popover', async ({ page }) => {
    const aboutTrigger = page.locator('#nav-trigger-about')
    const contactTrigger = page.locator('#nav-trigger-contact')
    const content = page.locator('#nav-content')

    // open at about
    await aboutTrigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })
    await page.waitForTimeout(300)

    const contentRectAtAbout = await getBoundingRect(page, '#nav-content')

    // move into the popover content
    await content.hover()
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()

    // move from content to "contact" trigger (rightmost)
    await contactTrigger.hover()
    await page.waitForTimeout(600)

    // popover should still be visible and repositioned
    await expect(content).toBeVisible()
    const contentRectAtContact = await getBoundingRect(page, '#nav-content')

    // contact is to the right of about, so content x should shift right
    expect(contentRectAtContact!.x).toBeGreaterThan(contentRectAtAbout!.x + 20)
  })

  test('scoped: content → gap → different trigger repositions popover', async ({
    page,
  }) => {
    const aboutTrigger = page.locator('#nav-trigger-about')
    const contactTrigger = page.locator('#nav-trigger-contact')
    const content = page.locator('#nav-content')

    // open at about
    await aboutTrigger.hover()
    await page.waitForTimeout(450)
    await expect(content).toBeVisible({ timeout: 2000 })
    await page.waitForTimeout(300)

    const contentRectAtAbout = await getBoundingRect(page, '#nav-content')

    // move into the popover content
    await content.hover()
    await page.waitForTimeout(100)
    await expect(content).toBeVisible()

    // move mouse to empty space BELOW the content (not to a trigger)
    // this simulates the recording where mouse exits content into the page gap
    const contentBox = await content.boundingBox()
    if (contentBox) {
      await page.mouse.move(
        contentBox.x + contentBox.width / 2,
        contentBox.y + contentBox.height + 50
      )
    }

    // wait a bit for the popover to close (safePolygon should eventually close it)
    await page.waitForTimeout(300)

    // now move to a different trigger (contact)
    await contactTrigger.hover()
    // wait for restMs (300ms) + buffer
    await page.waitForTimeout(500)

    // popover should be visible and repositioned at the new trigger
    await expect(content).toBeVisible({ timeout: 2000 })
    const contentRectAtContact = await getBoundingRect(page, '#nav-content')

    // contact is to the right of about, so content x should shift right
    expect(contentRectAtContact!.x).toBeGreaterThan(contentRectAtAbout!.x + 20)
  })
})
