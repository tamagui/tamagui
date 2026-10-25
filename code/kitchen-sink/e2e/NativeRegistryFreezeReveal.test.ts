import { by, element, waitFor } from 'detox'
import { safeLaunchApp } from './utils/detox'
import {
  formatRGB,
  getDominantColor,
  isGreenish,
  isReddish,
  type RGB,
} from './utils/colors'

jest.retryTimes(0)

describe('NativeRegistryFreezeReveal', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'NativeRegistryFreezeRevealCase' },
    })
    await waitFor(element(by.id('freeze-swatch')))
      .toBeVisible()
      .withTimeout(300000)
  }, 360000)

  it('repaints a view revealed after a theme switch made while it was frozen', async () => {
    // the engine commits theme changes to the native tree outside react, and
    // detox's idle sync can return before ios mounts that commit, so a read
    // right after a tap awaits the paint
    const paints = async (name: string, matches: (color: RGB) => boolean) => {
      const deadline = Date.now() + 5000
      for (;;) {
        const color = getDominantColor(
          await element(by.id('freeze-swatch')).takeScreenshot(name)
        )
        if (matches(color)) return
        if (Date.now() > deadline) {
          throw new Error(`${name}: swatch stayed ${formatRGB(color)}`)
        }
      }
    }

    await paints('freeze-mounted', isReddish)
    // visible: the engine paints green natively while react's props stay red
    await element(by.id('freeze-theme')).tap()
    await paints('freeze-native-green', isGreenish)

    // frozen: switching back to red reaches no linked view
    await element(by.id('freeze-toggle')).tap()
    await element(by.id('freeze-theme')).tap()

    // revealed: the view must show the live red theme, not the green push
    await element(by.id('freeze-toggle')).tap()
    await waitFor(element(by.id('freeze-swatch')))
      .toBeVisible()
      .withTimeout(10000)
    await paints('freeze-revealed', isReddish)
  })
})
