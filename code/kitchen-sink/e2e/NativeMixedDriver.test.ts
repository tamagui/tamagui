import * as assert from 'assert'
import { by, element, waitFor } from 'detox'

import { safeLaunchApp } from './utils/detox'
import { formatRGB, getDominantColor, isBlueish } from './utils/colors'
import { remountDirectUseCase } from './utils/navigation'

async function height() {
  const attributes: any = await element(by.id('native-mixed-driver-node')).getAttributes()
  return attributes.frame.height as number
}

async function waitForHeight(target: number) {
  const startedAt = Date.now()
  let current = await height()
  while (Math.abs(current - target) > 1) {
    assert.ok(
      Date.now() - startedAt < 4000,
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

  it('animates height and opacity to both targets without a Fabric driver error', async () => {
    assert.ok(Math.abs((await height()) - 40) <= 1)
    const collapsedColor = getDominantColor(
      await element(by.id('native-mixed-driver-node')).takeScreenshot(
        'native-mixed-driver-collapsed'
      )
    )
    assert.ok(
      isBlueish(collapsedColor),
      `collapsed node should be opaque blue, got ${formatRGB(collapsedColor)}`
    )

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForHeight(160)
    const expandedColor = getDominantColor(
      await element(by.id('native-mixed-driver-node')).takeScreenshot(
        'native-mixed-driver-expanded'
      )
    )
    assert.ok(
      !isBlueish(expandedColor),
      `opacity 0 node should expose the background, got ${formatRGB(expandedColor)}`
    )

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForHeight(40)
    const restoredColor = getDominantColor(
      await element(by.id('native-mixed-driver-node')).takeScreenshot(
        'native-mixed-driver-restored'
      )
    )
    assert.ok(
      isBlueish(restoredColor),
      `restored node should be opaque blue, got ${formatRGB(restoredColor)}`
    )
  })
})
