import assert from 'node:assert/strict'
import { by, device, element, waitFor } from 'detox'

jest.retryTimes(0)

describe('native line-height metrics', () => {
  beforeAll(async () => {
    await device.launchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'StyleCompatCase', disableKeyboardController: true },
    })
    await waitFor(element(by.id('native-leading-state')))
      .toHaveText('ready')
      .withTimeout(120000)
  })

  it('matches raw native lengths for text, inputs, nesting and font scaling', async () => {
    const attributes = (await element(
      by.id('native-leading-measurements')
    ).getAttributes()) as { text: string }
    const heights = JSON.parse(attributes.text) as Record<string, number>
    assert.equal(Object.keys(heights).length, 34)
    for (const name of [
      'ratio',
      'pixels',
      'font',
      'large',
      'ratio-fixed',
      'pixels-fixed',
      'font-fixed',
      'large-fixed',
      'ratio-capped',
      'pixels-capped',
      'font-capped',
      'large-capped',
      'input',
      'nested',
    ]) {
      assert.ok(heights[name] > 0, `${name} must have laid out`)
      assert.equal(
        heights[name],
        heights[`${name}-raw`],
        `${name} must match the raw native control`
      )
    }
    assert.ok(heights.large > heights.pixels * 10, 'numeric 24 must remain a ratio')
    for (const name of ['ratio', 'ratio-capped', 'ratio-fixed']) {
      assert.ok(heights[`${name}-width`] > 0)
      assert.equal(heights[`${name}-width`], heights[`${name}-raw-width`])
    }
    if (process.env.TEST_LARGE_FONT === '1') {
      const scale = (await element(
        by.id('native-leading-font-scale')
      ).getAttributes()) as {
        text: string
      }
      assert.ok(Number(scale.text) > 1.2, 'the device must use enlarged system text')
      assert.ok(
        heights['ratio-width'] > heights['ratio-fixed-width'],
        JSON.stringify(heights)
      )
      assert.ok(
        heights['ratio-capped-width'] > heights['ratio-fixed-width'],
        JSON.stringify(heights)
      )
    }
    await device.takeScreenshot('native-leading')
  })

  it.each(['native', 'reanimated'])(
    'paints intermediate inherited ratios with the %s driver',
    async (driver) => {
      await waitFor(element(by.id(`native-leading-${driver}-animation-state`)))
        .toHaveText('ready')
        .withTimeout(10000)
      await element(by.id(`native-leading-${driver}-animate`)).tap()
      await waitFor(element(by.id(`native-leading-${driver}-animation-state`)))
        .toHaveText('finished')
        .withTimeout(10000)
      const attributes = (await element(
        by.id(`native-leading-${driver}-animation`)
      ).getAttributes()) as { text: string }
      const { frames, target } = JSON.parse(attributes.text) as {
        frames: number[]
        target: number
      }
      assert.ok(target > 0)
      assert.equal(frames.at(-1), target)
      assert.ok(
        frames.some((height) => height > frames[0] && height < target),
        attributes.text
      )
    }
  )
})
