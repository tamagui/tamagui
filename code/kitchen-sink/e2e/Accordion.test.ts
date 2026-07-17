/**
 * Native (Detox) verification for the accordion auto-height change.
 *
 * The wrapper height is now `open ? 'auto' : 0` and the collapse is driven by the
 * reanimated driver (native default). This test confirms on a real iOS simulator that:
 *  - a default-open item shows its content (open works),
 *  - a default-closed sibling sits BELOW that content (no content-below-last-item /
 *    no overlap regression),
 *  - toggling opens/closes correctly.
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
    assert.ok(content.height > 10, `open content height ${content.height} should be > 10`)
    // the second (closed) item's trigger must sit at or below the open content's bottom
    assert.ok(
      trigger2.y >= content.y + content.height - 2,
      `trigger2.y ${trigger2.y} should be >= content bottom ${content.y + content.height}`
    )
  })

  it('closes the open item on tap (content hidden)', async () => {
    await element(by.id('def-trigger')).tap()
    await waitFor(element(by.id('def-content-text')))
      .not.toBeVisible()
      .withTimeout(4000)
    await device.takeScreenshot('accordion-after-close')
  })

  it('opens the closed item on tap (content visible, below its trigger)', async () => {
    await element(by.id('def-trigger2')).tap()
    await waitFor(element(by.id('def-content2-text')))
      .toBeVisible()
      .withTimeout(4000)
    await device.takeScreenshot('accordion-second-open')

    const trigger2 = await frame('def-trigger2')
    const content2 = await frame('def-content2')
    assert.ok(content2.height > 10, `content2 height ${content2.height} should be > 10`)
    assert.ok(
      content2.y >= trigger2.y + trigger2.height - 2,
      `content2 should render below its own trigger, not above/overlapping`
    )
  })
})
