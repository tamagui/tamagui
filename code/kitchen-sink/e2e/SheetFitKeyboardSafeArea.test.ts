/**
 * Detox E2E regression test: a fit-mode modal Sheet with moveOnKeyboardChange
 * and a consumer maxHeight must NOT slide above the top safe-area inset when the
 * keyboard opens.
 *
 * Regression: the keyboard shift floored the sheet at getSafeArea().getInsets().top,
 * which returns 0 unless @tamagui/native's safe-area abstraction is enabled against
 * the same module instance the sheet reads (it isn't, when @tamagui/native is
 * duplicated or setup-safe-area didn't run for that instance). The sheet then slid
 * under the notch. The fix reads the LIVE inset from react-native-safe-area-context.
 *
 * The usecase (SheetFit3pcNativeRepro) mirrors 3PunchConvo's create-thread sheet:
 * it auto-opens and focuses an input, which raises the keyboard.
 */
import { by, device, element, expect, waitFor } from 'detox'
import { safeLaunchApp } from './utils/detox'

const isAndroid = () => device.getPlatform() === 'android'
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

describe('SheetFitKeyboardSafeArea', () => {
  beforeAll(async () => {
    if (isAndroid()) return
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'SheetFit3pcNativeRepro' },
    })
    await waitFor(element(by.id('repro-3pc-native-safearea-marker')))
      .toExist()
      .withTimeout(180000)
  })

  it('keeps the fit sheet at/below the top safe area when the keyboard opens', async () => {
    if (isAndroid()) return

    // the sheet auto-opens (~400ms) and focuses the input on open, raising the
    // keyboard; the sheet then shifts up to its keyboard-adjusted position.
    await waitFor(element(by.id('repro-3pc-native-frame')))
      .toBeVisible()
      .withTimeout(10000)
    // let the open + keyboard + shift animations settle
    await device.disableSynchronization()
    await sleep(2000)

    const safeAreaTop = await readFrameTop('repro-3pc-native-safearea-marker')
    const sheetTop = await readFrameTop('repro-3pc-native-frame')

    // the sheet top must be at or below the safe-area marker. allow 1px rounding.
    if (sheetTop < safeAreaTop - 1) {
      throw new Error(
        `fit sheet rose above the top safe area when the keyboard opened: ` +
          `sheet top=${sheetTop}, safe-area top=${safeAreaTop}`
      )
    }
    // sanity: the safe-area inset is non-trivial on a notched device, so this
    // guards against the marker itself being at 0 (which would make the test pass
    // vacuously).
    if (safeAreaTop < 20) {
      throw new Error(
        `expected a non-trivial top safe-area inset, got ${safeAreaTop} — ` +
          `is this running on a notched simulator?`
      )
    }

    await device.enableSynchronization()
  })

  it('returns the fit sheet to a bottom-anchored fit position after the keyboard dismisses', async () => {
    if (isAndroid()) return

    await device.disableSynchronization()

    // dismiss the keyboard: with keyboardShouldPersistTaps="handled", tapping a
    // non-responder inside the scrollview resigns the first responder.
    await element(by.id('repro-3pc-native-item-0')).tap()
    await sleep(2000)

    const safeAreaTop = await readFrameTop('repro-3pc-native-safearea-marker')
    const sheetFrame = await readFrame('repro-3pc-native-frame')
    console.info(
      `post-dismiss sheet frame: y=${sheetFrame.y} height=${sheetFrame.height}, safe-area top=${safeAreaTop}`
    )

    // the 3pc regression: after keyboard dismiss the sheet stayed measured at
    // full viewport height and snapped back to y=0, putting the header under the
    // notch. post-dismiss the fit sheet must sit at/below the safe-area line.
    if (sheetFrame.y < safeAreaTop - 1) {
      throw new Error(
        `fit sheet sits above the top safe area after keyboard dismiss: ` +
          `sheet top=${sheetFrame.y}, safe-area top=${safeAreaTop}`
      )
    }

    await device.enableSynchronization()
  })
})

async function readFrameTop(id: string) {
  return (await readFrame(id)).y
}

async function readFrame(id: string) {
  const attributes = await element(by.id(id)).getAttributes()
  const frame = (attributes as any).frame || (attributes as any).elementFrame
  const y = frame?.y
  const height = frame?.height
  if (typeof y !== 'number' || typeof height !== 'number') {
    throw new Error(`expected ${id} to expose a frame, got ${JSON.stringify(attributes)}`)
  }
  return { y: Math.round(y), height: Math.round(height) }
}
