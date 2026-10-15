import * as assert from 'assert'
import { by, element, waitFor } from 'detox'
import { safeLaunchApp } from './utils/detox'
import { getDominantColor, isGreenish, isReddish } from './utils/colors'

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
    const color = async (name: string) =>
      getDominantColor(await element(by.id('freeze-swatch')).takeScreenshot(name))

    assert.ok(isReddish(await color('freeze-mounted')))
    // visible: the engine paints green natively while react's props stay red
    await element(by.id('freeze-theme')).tap()
    assert.ok(isGreenish(await color('freeze-native-green')))

    // frozen: switching back to red reaches no linked view
    await element(by.id('freeze-toggle')).tap()
    await element(by.id('freeze-theme')).tap()

    // revealed: the view must show the live red theme, not the green push
    await element(by.id('freeze-toggle')).tap()
    await waitFor(element(by.id('freeze-swatch')))
      .toBeVisible()
      .withTimeout(10000)
    assert.ok(isReddish(await color('freeze-revealed')))
  })
})
