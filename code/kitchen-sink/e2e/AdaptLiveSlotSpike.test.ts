import { by, device, element, expect as detoxExpect, waitFor } from 'detox'
import { remountDirectUseCase } from './utils/navigation'
import { safeLaunchApp, withSync } from './utils/detox'

const testElement = (id: string) => element(by.id(id)).atIndex(0)

async function getText(id: string) {
  const attributes = (await testElement(id).getAttributes()) as any
  return attributes.text as string
}

describe('AdaptLiveSlotSpike', () => {
  beforeAll(async () => {
    await safeLaunchApp({
      newInstance: true,
      launchArgs: { directUseCase: 'AdaptLiveSlotSpikeCase' },
    })
    await waitFor(testElement('live-slot-content')).toExist().withTimeout(180000)
  })

  beforeEach(async () => {
    await remountDirectUseCase('live-slot-content', { skipEnableSync: true })
  })

  afterEach(async () => {
    await device.disableSynchronization()
  })

  it('candidate slot exposes target context, accessibility label, and native input/press focus path', async () => {
    await detoxExpect(testElement('live-slot-context')).toHaveText(
      'dialog-context: dialog-parent-ok; portal-context: portal-wrapper-ok; target-context: target-context-ok; revision: 0'
    )
    await detoxExpect(element(by.label('Live slot spike panel'))).toExist()

    await withSync(() => testElement('live-slot-focus-next').tap())
    await detoxExpect(testElement('live-slot-press-count')).toHaveText('press-count: 1')

    await withSync(() => testElement('live-slot-focus-input').replaceText('ios-focus'))
    await detoxExpect(testElement('live-slot-typed-value')).toHaveText('typed: ios-focus')
  })

  it('renders slot content as plain children inside a no-portal Sheet target with working touch coordinates', async () => {
    await waitFor(testElement('sheet-live-slot-content')).toExist().withTimeout(10000)
    await detoxExpect(testElement('sheet-live-slot-context')).toHaveText(
      'dialog-context: sheet-dialog-parent-ok; portal-context: sheet-portal-wrapper-ok; target-context: sheet-target-ok; target: no-portal-inline-sheet'
    )
    await detoxExpect(element(by.label('No portal sheet live slot panel'))).toExist()

    await withSync(() => testElement('sheet-live-slot-button').tap())
    await detoxExpect(testElement('sheet-live-slot-press-count')).toHaveText(
      'sheet press-count: 1'
    )

    await withSync(() => testElement('sheet-live-slot-input').replaceText('sheet-ios'))
    await detoxExpect(testElement('sheet-live-slot-typed-value')).toHaveText(
      'sheet typed: sheet-ios'
    )
  })

  it('candidate live-publish updates props while active without remounting', async () => {
    await detoxExpect(testElement('live-slot-context')).toHaveText(
      'dialog-context: dialog-parent-ok; portal-context: portal-wrapper-ok; target-context: target-context-ok; revision: 0'
    )
    const instanceBefore = await getText('live-slot-instance')

    await withSync(() => testElement('live-slot-update-prop').tap())
    await detoxExpect(testElement('live-slot-context')).toHaveText(
      'dialog-context: dialog-parent-ok; portal-context: portal-wrapper-ok; target-context: target-context-ok; revision: 1'
    )
    expect(await getText('live-slot-instance')).toBe(instanceBefore)
  })

  it('state preservation characterization is no worse than current v2', async () => {
    await withSync(() => testElement('v2-state-increment').tap())
    await withSync(() => testElement('slot-state-increment').tap())
    await detoxExpect(testElement('v2-state-count')).toHaveText('v2 count: 1')
    await detoxExpect(testElement('slot-state-count')).toHaveText('slot count: 1')

    await withSync(() => testElement('v2-state-toggle').tap())
    await withSync(() => testElement('slot-state-toggle').tap())
    await waitFor(testElement('v2-state-content')).toExist().withTimeout(10000)
    await waitFor(testElement('slot-state-content')).toExist().withTimeout(10000)
    const v2CountAfterAdapt = await getText('v2-state-count')
    const slotCountAfterAdapt = await getText('slot-state-count')

    await withSync(() => testElement('v2-state-toggle').tap())
    await withSync(() => testElement('slot-state-toggle').tap())
    await waitFor(testElement('v2-state-content')).toExist().withTimeout(10000)
    await waitFor(testElement('slot-state-content')).toExist().withTimeout(10000)
    const v2CountAfterReturn = await getText('v2-state-count')
    const slotCountAfterReturn = await getText('slot-state-count')

    console.log(
      'AdaptLiveSlotSpike native state observation',
      JSON.stringify({
        v2: {
          countAfterAdapt: v2CountAfterAdapt,
          countAfterReturn: v2CountAfterReturn,
        },
        slot: {
          countAfterAdapt: slotCountAfterAdapt,
          countAfterReturn: slotCountAfterReturn,
        },
      })
    )

    if (v2CountAfterAdapt === 'v2 count: 1') {
      expect(slotCountAfterAdapt).toBe('slot count: 1')
    }
    if (v2CountAfterReturn === 'v2 count: 1') {
      expect(slotCountAfterReturn).toBe('slot count: 1')
    }
  })
})
