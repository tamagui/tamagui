import * as assert from 'assert'
import { by, element, waitFor } from 'detox'

import { safeLaunchApp } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

async function layout() {
  const attributes: any = await element(by.id('native-mixed-driver-node')).getAttributes()
  const frame = attributes.frame as { width: number; height: number }
  return {
    height: frame.height / (frame.width / 120),
    opacity: attributes.alpha as number,
  }
}

async function waitForLayout(height: number, opacity: number) {
  const startedAt = Date.now()
  let current = await layout()
  while (Math.abs(current.height - height) > 1 || current.opacity !== opacity) {
    assert.ok(
      Date.now() - startedAt < 4000,
      `timed out waiting for height ${height} and opacity ${opacity}, last layout ${JSON.stringify(current)}`
    )
    await new Promise((resolve) => setTimeout(resolve, 50))
    current = await layout()
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
    const collapsed = await layout()
    assert.ok(Math.abs(collapsed.height - 40) <= 1)
    assert.equal(collapsed.opacity, 1)

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForLayout(160, 0)

    await element(by.id('native-mixed-driver-toggle')).tap()
    await waitForLayout(40, 1)
  })
})
