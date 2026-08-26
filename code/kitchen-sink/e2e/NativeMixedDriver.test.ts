import * as assert from 'assert'
import { by, element, waitFor } from 'detox'

import { safeLaunchApp } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

// detox reports iOS frames in points but android frames in raw pixels
// (GetAttributesAction.kt writes view.width/height straight into frame).
// the node's width is a constant 120dp that never animates, so frame.width/120
// IS the device pixel ratio (1 on iOS, density on android) with no platform
// branch. the 120 must match NativeMixedDriverCase's width prop; change both
// together or every height here silently scales wrong.
async function height() {
  const attributes: any = await element(by.id('native-mixed-driver-node')).getAttributes()
  const frame = attributes.frame as { width: number; height: number }
  return frame.height / (frame.width / 120)
}

// deadline sized just under jest's 180s testTimeout: this is a condition
// wait, and a tight inner wall-clock cap (this shipped at 4s) re-times the
// condition against machine speed — a loaded CI simulator runs these suites
// at several times normal wall-clock (see Accordion.test.ts). the assert
// exists so a genuinely unreached height still fails with a named target
const POLL_DEADLINE_MS = 150_000

async function waitForHeight(target: number) {
  const startedAt = Date.now()
  let current = await height()
  while (Math.abs(current - target) > 1) {
    assert.ok(
      Date.now() - startedAt < POLL_DEADLINE_MS,
      `timed out waiting for height ${target}, last height ${current}`
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    current = await height()
  }
}

describe('animations-react-native mixed driver node', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'NativeMixedDriverCase' },
    })
    await waitFor(element(by.id('native-mixed-driver-status')))
      .toExist()
      .withTimeout(30000)
  })

  beforeEach(async () => {
    await remountDirectUseCase('native-mixed-driver-status')
  })

  // this used to also assert opacity by colour-sampling element screenshots.
  // opacity is not observable per-element on both platforms, so those assertions
  // were dropped rather than platform-forked:
  //   - android: Detox's element screenshot is `view.draw(Canvas(bitmap))`
  //     (ViewScreenshot.kt), a direct draw that never applies View#alpha, since
  //     alpha is composited by the parent RenderNode. an opacity-0 view always
  //     paints fully opaque, so all three colour assertions passed regardless of
  //     what opacity did. they could not fail, so they were not checks.
  //   - iOS: getAttributes() exposes no `alpha` at all, and `visible` stays true
  //     at opacity 0, so neither substitutes.
  // cropping a full-device screenshot would composite correctly on both, but
  // needs a point-to-pixel scale Detox does not report. height stays the signal:
  // it is numeric, cross-platform, and driven by the same mixed-driver path.
  it('animates height to both targets without a Fabric driver error', async () => {
    assert.ok(Math.abs((await height()) - 40) <= 1)

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForHeight(160)

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForHeight(40)
  })
})
