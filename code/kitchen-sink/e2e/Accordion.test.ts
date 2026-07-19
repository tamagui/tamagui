/**
 * Native (Detox) verification for the accordion auto-height change.
 *
 * The wrapper caches its child's numeric layout and the collapse is driven by the
 * reanimated driver (native default). This test confirms on a real iOS simulator that:
 *  - a default-open item shows its content (open works),
 *  - a default-closed sibling sits BELOW that content (no content-below-last-item /
 *    no overlap regression),
 *  - opening, closing, and reversing have intermediate numeric heights.
 * Screenshots are captured as evidence.
 */

import * as assert from 'assert'
import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp } from './utils/detox'

async function frame(id: string) {
  const attrs: any = await element(by.id(id)).getAttributes()
  // single element -> attrs.frame; if a collection, take first
  const f = attrs.frame ?? attrs.elements?.[0]?.frame
  return f as { x: number; y: number; width: number; height: number }
}

describe('Accordion (auto-height, native)', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'AccordionDefaultOpenCase' },
    })
    await waitFor(element(by.id('accordion-default-root')))
      .toExist()
      .withTimeout(10000)
  })

  it('default-open item shows content, closed sibling sits below it (no overlap)', async () => {
    await expect(element(by.id('def-content-text'))).toBeVisible()
    await device.takeScreenshot('accordion-default-open')

    const content = await frame('def-content')
    const trigger2 = await frame('def-trigger2')
    const marker = await frame('after-accordion-marker')
    assert.ok(content.height > 10, `open content height ${content.height} should be > 10`)
    // the second (closed) item's trigger must sit at or below the open content's bottom
    assert.ok(
      trigger2.y >= content.y + content.height - 2,
      `trigger2.y ${trigger2.y} should be >= content bottom ${content.y + content.height}`
    )
    assert.ok(
      marker.y >= trigger2.y + trigger2.height - 2,
      `marker.y ${marker.y} should be below trigger2 bottom ${trigger2.y + trigger2.height}`
    )
  })

  it('closes the default-open item through an intermediate height', async () => {
    const open = await frame('def-height')
    await element(by.id('def-trigger')).tap()
    await new Promise((resolve) => setTimeout(resolve, 90))
    const closing = await frame('def-height')
    assert.ok(closing.height > 0, 'default-open close should stay above 0 mid-flight')
    assert.ok(
      closing.height < open.height,
      `default-open close ${closing.height} should be below ${open.height}`
    )
    await waitFor(element(by.id('def-content-text')))
      .not.toBeVisible()
      .withTimeout(4000)
    await new Promise((resolve) => setTimeout(resolve, 300))
    const closed = await frame('def-height')
    assert.ok(
      closed.height <= 1,
      `default-open height ${closed.height} should settle at 0`
    )
    await device.takeScreenshot('accordion-after-close')
  })

  it('opens, reverses, and closes through intermediate numeric heights', async () => {
    // poll instead of fixed offsets: animation start and settle timing vary
    // with simulator/js-thread speed, so sample against observed motion
    const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))
    const pollHeight = async (
      predicate: (height: number) => boolean,
      label: string,
      timeoutMs = 5000
    ) => {
      const startedAt = Date.now()
      let last = await frame('def-height2')
      while (!predicate(last.height)) {
        assert.ok(
          Date.now() - startedAt < timeoutMs,
          `timed out polling for ${label}, last height ${last.height}`
        )
        await sleep(50)
        last = await frame('def-height2')
      }
      return last.height
    }
    const pollSettled = async (label: string) => {
      let previous = await frame('def-height2')
      for (let i = 0; i < 100; i++) {
        await sleep(250)
        const next = await frame('def-height2')
        if (Math.abs(next.height - previous.height) < 1) {
          return next.height
        }
        previous = next
      }
      assert.fail(`height never settled for ${label}`)
      return 0
    }

    await element(by.id('def-trigger2')).tap()
    const opening = await pollHeight((h) => h > 0, 'open start')
    const initialOpen = await pollSettled('open settle')
    assert.ok(
      opening < initialOpen,
      `opening height ${opening} should be an intermediate below settled ${initialOpen}`
    )

    await element(by.id('grow-content')).tap()
    // at rest the wrapper is auto height by design, so content growth applies
    // fluidly (no pinned pixel to animate from) — assert the growth lands,
    // not an intermediate frame
    await pollHeight((h) => h > initialOpen + 10, 'content growth')
    const open = await pollSettled('grown settle')

    const trigger2 = await frame('def-trigger2')
    const content2 = await frame('def-content2')
    const openMarker = await frame('after-accordion-marker')
    assert.ok(content2.height > 10, `content2 height ${content2.height} should be > 10`)
    assert.ok(
      content2.y >= trigger2.y + trigger2.height - 2,
      `content2 should render below its own trigger, not above/overlapping`
    )
    assert.ok(
      openMarker.y >= content2.y + content2.height - 2,
      `marker should render below the final item's content`
    )

    await element(by.id('def-trigger2')).tap()
    const closingBeforeReverse = await pollHeight(
      (h) => h > 1 && h < open - 5,
      'close intermediate'
    )

    await element(by.id('def-trigger2')).tap()
    const reopening = await pollHeight(
      (h) => h > closingBeforeReverse + 2,
      'reversal rising'
    )
    assert.ok(
      reopening <= open + 2,
      `reversal height ${reopening} should stay at or below the open endpoint ${open}`
    )
    const reopened = await pollSettled('reopen settle')
    assert.ok(
      Math.abs(reopened - open) <= 2,
      `reopened height ${reopened} should settle at ${open}`
    )

    await element(by.id('def-trigger2')).tap()
    const closing = await pollHeight(
      (h) => h > 1 && h < open - 5,
      'final close intermediate'
    )
    assert.ok(closing > 0, 'final close should have an intermediate height')

    await pollHeight((h) => h <= 1, 'final close settle')
    const closed = await frame('def-height2')
    const closedMarker = await frame('after-accordion-marker')
    assert.ok(closed.height <= 1, `closed height ${closed.height} should settle at 0`)
    assert.ok(
      closedMarker.y < openMarker.y,
      `marker.y ${closedMarker.y} should move above its open position ${openMarker.y}`
    )
    await expect(element(by.id('def-content2-text'))).not.toBeVisible()
    await device.takeScreenshot('accordion-second-closed')
  })
})
