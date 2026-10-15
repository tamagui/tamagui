import * as assert from 'assert'
import { readFileSync } from 'node:fs'
import { by, element, expect, waitFor } from 'detox'
import { PNG } from 'pngjs'
import { safeLaunchApp } from './utils/detox'
import { getDominantColor, isBlueish, isGreenish, isReddish } from './utils/colors'

jest.retryTimes(0)

describe('NativeRegistryRuntimeClones', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'NativeRegistryRuntimeClonesCase' },
    })
    await waitFor(element(by.id('runtime-ancestor')))
      .toBeVisible()
      .withTimeout(300000)
  }, 360000)

  it('keeps runtime updates through scroll and React clones without sticky props', async () => {
    const color = async (name: string) =>
      getDominantColor(await element(by.id('runtime-ancestor')).takeScreenshot(name))

    assert.ok(isReddish(await color('runtime-mounted')))
    await element(by.id('runtime-green')).tap()
    assert.ok(isGreenish(await color('runtime-green')))
    await element(by.id('runtime-scroll')).scroll(240, 'right')
    assert.ok(isGreenish(await color('runtime-scrolled')))
    await element(by.id('runtime-react')).tap()
    assert.ok(isGreenish(await color('runtime-react-clone')))

    // reproduce a fresh native update after React has absorbed the prior one.
    await element(by.id('runtime-red')).tap()
    await element(by.id('runtime-react')).tap()
    assert.ok(isReddish(await color('runtime-returned')))
    await element(by.id('runtime-green')).tap()
    await element(by.id('runtime-react')).tap()
    assert.ok(isGreenish(await color('runtime-repeated')))

    await element(by.id('runtime-reset')).tap()
    const reset = PNG.sync.read(
      readFileSync(
        await element(by.id('runtime-ancestor')).takeScreenshot('runtime-reset')
      )
    )
    const center =
      (Math.floor(reset.height / 2) * reset.width + Math.floor(reset.width / 2)) * 4
    assert.equal(reset.data[center + 3], 0, 'a null background must be transparent')
    await element(by.id('runtime-style')).tap()
    assert.ok(isBlueish(await color('runtime-react-style')))

    // family props cause RN to parse fresh props on every state/children clone,
    // even when every retained value is unchanged. registry tables suffice.
    await expect(element(by.id('runtime-native-props'))).toHaveText('null')
  })

  it('preserves the runtime theme controller parity checks', async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'NativeRegistryParityCase' },
    })
    await waitFor(element(by.id('runParity')))
      .toBeVisible()
      .withTimeout(10000)
    await element(by.id('runParity')).tap()
    await waitFor(element(by.id('parityResult')))
      .toHaveLabel('PARITY PASS')
      .withTimeout(10000)
  })
})
