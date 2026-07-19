import * as assert from 'assert'
import { execFileSync } from 'node:child_process'
import { by, device, element, expect as detoxExpect, waitFor } from 'detox'
import { safeLaunchApp, withSync } from './utils/detox'
import { remountDirectUseCase } from './utils/navigation'

const testElement = (id: string) => element(by.id(id)).atIndex(0)

async function getText(id: string) {
  const attributes = (await testElement(id).getAttributes()) as any
  return attributes.text as string
}

async function openDialog() {
  await withSync(() => testElement('dialog-adapt-open').tap())
  await waitFor(testElement('dialog-adapt-content')).toExist().withTimeout(10000)
}

function setAndroidAnimationScale(scale: 0 | 1) {
  if (device.getPlatform() !== 'android') return

  for (const setting of [
    'window_animation_scale',
    'transition_animation_scale',
    'animator_duration_scale',
  ]) {
    execFileSync('adb', [
      '-s',
      device.id,
      'shell',
      'settings',
      'put',
      'global',
      setting,
      String(scale),
    ])
  }
}

describe('DialogSheetAdaptHandoff', () => {
  beforeAll(async () => {
    // this case must have a real exit window to interrupt. the Android CI
    // runner disables system animations globally, so opt this file back in.
    setAndroidAnimationScale(1)
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'DialogSheetAdaptHandoffCase' },
    })
    await waitFor(testElement('dialog-adapt-open')).toExist().withTimeout(180000)
  })

  afterAll(() => {
    setAndroidAnimationScale(0)
  })

  beforeEach(async () => {
    await remountDirectUseCase('dialog-adapt-open', { skipEnableSync: true })
  })

  afterEach(async () => {
    await device.disableSynchronization()
  })

  it('live-publishes adapted Dialog prop updates without remounting content', async () => {
    await openDialog()

    await detoxExpect(testElement('dialog-adapt-revision')).toHaveText('revision: 0')
    const instanceBefore = await getText('dialog-adapt-instance')

    await withSync(() => testElement('dialog-adapt-update').tap())
    await detoxExpect(testElement('dialog-adapt-revision')).toHaveText('revision: 1')
    // note: the global `expect` is Detox's matcher expect (exposeGlobals), so
    // plain value assertions must use node assert
    assert.strictEqual(await getText('dialog-adapt-instance'), instanceBefore)

    await withSync(() => testElement('dialog-adapt-close').tap())
    await waitFor(testElement('dialog-adapt-content'))
      .not.toBeVisible()
      .withTimeout(10000)
  })

  it('keeps the adapted Dialog content instance alive when close is interrupted by reopen', async () => {
    await openDialog()

    const instanceBefore = await getText('dialog-adapt-instance')
    await withSync(() => testElement('dialog-adapt-reopen-during-exit').tap())

    await waitFor(testElement('dialog-adapt-content')).toExist().withTimeout(10000)
    assert.strictEqual(await getText('dialog-adapt-instance'), instanceBefore)
    await detoxExpect(testElement('dialog-adapt-revision')).toHaveText('revision: 0')
  })

  it('releases adapted Dialog content after close during media handoff', async () => {
    await openDialog()

    await withSync(() => testElement('dialog-adapt-close-during-flip').tap())
    await waitFor(testElement('dialog-adapt-content'))
      .not.toBeVisible()
      .withTimeout(10000)
  })
})
