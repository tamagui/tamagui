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
      .withTimeout(180000)
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

  it('closes the open item on tap (content hidden)', async () => {
    await element(by.id('def-trigger')).tap()
    await waitFor(element(by.id('def-content-text')))
      .not.toBeVisible()
      .withTimeout(4000)
    await device.takeScreenshot('accordion-after-close')
  })

  it('opens, reverses, and closes through intermediate numeric heights', async () => {
    await element(by.id('def-trigger2')).tap()
    await new Promise((resolve) => setTimeout(resolve, 90))

    const opening = await frame('def-height2')
    assert.ok(opening.height > 0, `opening height ${opening.height} should be above 0`)

    await new Promise((resolve) => setTimeout(resolve, 300))
    const initialOpen = await frame('def-height2')
    assert.ok(
      opening.height < initialOpen.height,
      `opening height ${opening.height} should be below settled height ${initialOpen.height}`
    )

    await element(by.id('grow-content')).tap()
    await new Promise((resolve) => setTimeout(resolve, 90))
    const resizing = await frame('def-height2')
    await new Promise((resolve) => setTimeout(resolve, 300))
    const open = await frame('def-height2')
    assert.ok(
      resizing.height > initialOpen.height && resizing.height < open.height,
      `resizing height ${resizing.height} should be between ${initialOpen.height} and ${open.height}`
    )

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
    await new Promise((resolve) => setTimeout(resolve, 90))
    const closingBeforeReverse = await frame('def-height2')
    assert.ok(closingBeforeReverse.height > 0, 'close should have an intermediate height')
    assert.ok(
      closingBeforeReverse.height < open.height,
      'close should move below open height'
    )

    await element(by.id('def-trigger2')).tap()
    await new Promise((resolve) => setTimeout(resolve, 90))
    const reopening = await frame('def-height2')
    assert.ok(reopening.height > 0, 'reversal should stay above the closed endpoint')
    assert.ok(
      reopening.height < open.height,
      'reversal should stay below the open endpoint'
    )

    await new Promise((resolve) => setTimeout(resolve, 300))
    const reopened = await frame('def-height2')
    assert.ok(
      Math.abs(reopened.height - open.height) <= 2,
      `reopened height ${reopened.height} should settle at ${open.height}`
    )

    await element(by.id('def-trigger2')).tap()
    await new Promise((resolve) => setTimeout(resolve, 90))
    const closing = await frame('def-height2')
    assert.ok(closing.height > 0, 'final close should have an intermediate height')
    assert.ok(closing.height < open.height, 'final close should move below open height')

    await new Promise((resolve) => setTimeout(resolve, 300))
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
