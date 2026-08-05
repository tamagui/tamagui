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
  return attrs.frame as { x: number; y: number; width: number; height: number }
}

async function pollHeight(
  id: string,
  predicate: (height: number) => boolean,
  label: string,
  timeoutMs = 8000
) {
  const startedAt = Date.now()
  let last = await frame(id)
  while (!predicate(last.height)) {
    assert.ok(
      Date.now() - startedAt < timeoutMs,
      `timed out polling for ${label}, last height ${last.height}`
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    last = await frame(id)
  }
  return last.height
}

async function pollLabel(id: string, predicate: (label: string) => boolean) {
  const startedAt = Date.now()
  let attrs: any = await element(by.id(id)).getAttributes()
  while (!predicate(attrs.label ?? '')) {
    assert.ok(Date.now() - startedAt < 4000, `timed out polling label for ${id}`)
    await new Promise((resolve) => setTimeout(resolve, 50))
    attrs = await element(by.id(id)).getAttributes()
  }
  return attrs.label as string
}

describe('Accordion (auto-height, native)', () => {
  beforeEach(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'AccordionDefaultOpenCase' },
    })
    await waitFor(element(by.id('accordion-default-root')))
      .toExist()
      .withTimeout(30000)
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
    await expect(element(by.id('def-content-text'))).toBeVisible()
    const closing = await pollHeight(
      'def-height',
      (height) => height > 1 && height < open.height - 1,
      'default-open close intermediate'
    )
    assert.ok(closing > 0, 'default-open close should stay above 0 mid-flight')
    const frameSamples = (
      await pollLabel(
        'default-close-frame-samples',
        (label) => label !== 'idle' && label !== 'recording'
      )
    )
      .split(',')
      .map(Number)
    assert.ok(frameSamples.length > 5, `expected native frame samples: ${frameSamples}`)
    assert.ok(
      frameSamples.every((height) => height > open.height * 0.5),
      `close must not paint a collapsed frame before animating: ${frameSamples}`
    )
    await expect(element(by.id('def-content-text'))).toExist()
    await waitFor(element(by.id('def-content-text')))
      .not.toBeVisible()
      .withTimeout(4000)
    const closed = await pollHeight(
      'def-height',
      (height) => height <= 1,
      'default-open close settle'
    )
    assert.ok(closed <= 1, `default-open height ${closed} should settle at 0`)
    await device.takeScreenshot('accordion-after-close')
  })

  it('opens, reverses, and closes through intermediate numeric heights', async () => {
    await element(by.id('def-trigger2')).tap()
    await waitFor(element(by.id('def-content2')))
      .toExist()
      .withTimeout(4000)
    const natural = await frame('def-content2')
    const opening = await pollHeight(
      'def-height2',
      (height) => height > 1 && height < natural.height - 1,
      'open intermediate'
    )
    const initialOpen = await pollHeight(
      'def-height2',
      (height) => Math.abs(height - natural.height) <= 1,
      'open settle'
    )
    assert.ok(opening < initialOpen, `opening ${opening} should be below ${initialOpen}`)

    await element(by.id('grow-content')).tap()
    // at rest the wrapper is auto height by design, so content growth applies
    // fluidly (no pinned pixel to animate from) — assert the growth lands,
    // not an intermediate frame
    const open = await pollHeight(
      'def-height2',
      (height) => height > initialOpen + 10,
      'content growth'
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
    const closingBeforeReverse = await pollHeight(
      'def-height2',
      (height) => height > 1 && height < open - 5,
      'close intermediate'
    )
    await expect(element(by.id('def-content2-text'))).toExist()

    await element(by.id('def-trigger2')).tap()
    const reopening = await pollHeight(
      'def-height2',
      (height) => height > closingBeforeReverse + 2,
      'reversal rising'
    )
    assert.ok(
      reopening <= open + 2,
      `reversal height ${reopening} should stay at or below the open endpoint ${open}`
    )
    const reopened = await pollHeight(
      'def-height2',
      (height) => Math.abs(height - open) <= 2,
      'reopen settle'
    )
    assert.ok(
      Math.abs(reopened - open) <= 2,
      `reopened height ${reopened} should settle at ${open}`
    )

    await element(by.id('def-trigger2')).tap()
    const closing = await pollHeight(
      'def-height2',
      (height) => height > 1 && height < open - 5,
      'final close intermediate'
    )
    assert.ok(closing > 0, 'final close should have an intermediate height')
    await expect(element(by.id('def-content2-text'))).toExist()

    await pollHeight('def-height2', (height) => height <= 1, 'final close settle')
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
