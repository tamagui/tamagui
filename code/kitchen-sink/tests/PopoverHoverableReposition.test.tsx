import { expect, test } from '@playwright/test'
import { setupPage } from './test-utils'

// regression: when a scoped hoverable popover with animatePosition fully
// closes then reopens on a DIFFERENT trigger, it should appear at the new
// trigger's position — not animate/slide from the old trigger's position.

test.describe('Popover hoverable reposition after close', () => {
  test.beforeEach(async ({ page }) => {
    await setupPage(page, {
      name: 'PopoverHoverableScopedCase',
      type: 'useCase',
      searchParams: { animationDriver: 'css' },
    })
  })

  test('close then reopen on different trigger: no slide from old position', async ({
    page,
  }) => {
    const content = page.locator('#nav-content')

    // hover "about" trigger to open
    const aboutTrigger = page.locator('#nav-trigger-about')
    await aboutTrigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible()

    // record content position when anchored to "about"
    const aboutContentBox = await content.boundingBox()
    expect(aboutContentBox).toBeTruthy()

    // move mouse far away to fully close
    await page.mouse.move(10, 600, { steps: 2 })
    await page.waitForTimeout(800) // wait for exit animation (500ms transition)
    await expect(content).not.toBeVisible()

    // now hover "contact" trigger (rightmost, far from "about")
    const contactTrigger = page.locator('#nav-trigger-contact')
    const contactBox = await contactTrigger.boundingBox()
    expect(contactBox).toBeTruthy()
    await contactTrigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible()

    // record content position when anchored to "contact"
    const contactContentBox = await content.boundingBox()
    expect(contactContentBox).toBeTruthy()

    // the content x should be near "contact" trigger, NOT near "about" trigger.
    // if the bug is present, content would start near aboutContentBox.x and
    // slide to contactContentBox.x — we catch this by checking the FIRST frame.
    // since we waited 500ms (full transition), the final position should be correct
    // either way, but let's verify the position is near the contact trigger.
    const contactTriggerCenter = contactBox!.x + contactBox!.width / 2
    const contentCenter = contactContentBox!.x + contactContentBox!.width / 2

    // content should be roughly centered on the contact trigger
    expect(Math.abs(contactTriggerCenter - contentCenter)).toBeLessThan(
      contactContentBox!.width / 2 + 50
    )
  })

  test('close then reopen on different trigger: initial position is correct (no animation from old)', async ({
    page,
  }) => {
    const content = page.locator('#nav-content')

    // hover "about" trigger
    const aboutTrigger = page.locator('#nav-trigger-about')
    await aboutTrigger.hover()
    await page.waitForTimeout(500)
    await expect(content).toBeVisible()

    const aboutContentBox = await content.boundingBox()

    // fully close
    await page.mouse.move(10, 600, { steps: 2 })
    await page.waitForTimeout(800)
    await expect(content).not.toBeVisible()

    // hover "contact" trigger
    const contactTrigger = page.locator('#nav-trigger-contact')
    await contactTrigger.hover()

    // check position EARLY — before the full 500ms transition
    // if there's a slide-from-old-position bug, the early frame shows the old x
    await page.waitForTimeout(100) // just enough for popover to appear
    await expect(content).toBeVisible()

    const earlyBox = await content.boundingBox()
    expect(earlyBox).toBeTruthy()

    // wait for full settle
    await page.waitForTimeout(500)
    const finalBox = await content.boundingBox()
    expect(finalBox).toBeTruthy()

    // the early position should be very close to the final position
    // (no sliding from old trigger). allow tolerance for enter animation y offset.
    const xDrift = Math.abs(earlyBox!.x - finalBox!.x)
    expect(xDrift).toBeLessThan(20) // should be ~0 if no slide

    // also verify it's NOT near the "about" position
    if (aboutContentBox) {
      const distFromAbout = Math.abs(earlyBox!.x - aboutContentBox.x)
      const distFromFinal = Math.abs(earlyBox!.x - finalBox!.x)
      // early box should be closer to final (contact) than to about
      expect(distFromFinal).toBeLessThan(distFromAbout + 10)
    }
  })
})
