import * as assert from 'assert'
import { by, device, element, expect as detoxExpect, waitFor } from 'detox'
import { remountDirectUseCase } from './utils/navigation'
import { safeLaunchApp, withSync } from './utils/detox'

const testElement = (id: string) => element(by.id(id)).atIndex(0)
const measuredV2StateBaseline = {
  before: 'v2 instance: 1',
  adapted: 'v2 instance: 3',
  countAfterAdapt: 'v2 count: 0',
  countAfterReturn: 'v2 count: 0',
} as const

const toSlotCount = (value: string) => value.replace(/^v2 /, 'slot ')

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
    await testElement('adapt-live-slot-scroll').scrollTo('top')
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

    await testElement('adapt-live-slot-scroll').scrollTo('bottom')
    const sheetButton = element(by.label('No portal sheet button'))
    await waitFor(sheetButton).toBeVisible().withTimeout(10000)
    await withSync(() => sheetButton.tap())
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
    // note: the global `expect` is Detox's matcher expect (exposeGlobals), so
    // plain value assertions must use node assert
    assert.strictEqual(await getText('live-slot-instance'), instanceBefore)
  })

  it('state preservation characterization matches the measured v2 baseline', async () => {
    await detoxExpect(testElement('v2-measured-before')).toHaveText(
      measuredV2StateBaseline.before
    )
    await detoxExpect(testElement('v2-measured-adapted')).toHaveText(
      measuredV2StateBaseline.adapted
    )
    await detoxExpect(testElement('v2-measured-count-after-adapt')).toHaveText(
      measuredV2StateBaseline.countAfterAdapt
    )
    await detoxExpect(testElement('v2-measured-count-after-return')).toHaveText(
      measuredV2StateBaseline.countAfterReturn
    )

    // android exposes both the Pressable container and its Text child for the
    // shallow label matcher; select the unique visible Text node directly
    const incrementButton = element(by.text('increment slot'))
    await waitFor(incrementButton)
      .toBeVisible()
      .whileElement(by.id('adapt-live-slot-scroll'))
      .scroll(250, 'down')
    await withSync(() => incrementButton.tap())
    await detoxExpect(testElement('slot-state-count')).toHaveText('slot count: 1')
    const slotInstanceBefore = await getText('slot-state-instance')

    // the toggle sits just above the panels and stays co-visible with the
    // increment button once the panels are scrolled into view
    await waitFor(testElement('slot-state-toggle')).toBeVisible().withTimeout(5000)
    await withSync(() => testElement('slot-state-toggle').tap())
    await waitFor(testElement('slot-state-content')).toExist().withTimeout(10000)
    const slotCountAfterAdapt = await getText('slot-state-count')
    const slotInstanceAfterAdapt = await getText('slot-state-instance')

    await waitFor(testElement('slot-state-toggle')).toBeVisible().withTimeout(5000)
    await withSync(() => testElement('slot-state-toggle').tap())
    await waitFor(testElement('slot-state-content')).toExist().withTimeout(10000)
    const slotCountAfterReturn = await getText('slot-state-count')

    console.log(
      'AdaptLiveSlotSpike native state observation',
      JSON.stringify({
        measuredV2: measuredV2StateBaseline,
        slot: {
          before: slotInstanceBefore,
          adapted: slotInstanceAfterAdapt,
          countAfterAdapt: slotCountAfterAdapt,
          countAfterReturn: slotCountAfterReturn,
        },
      })
    )

    assert.notStrictEqual(slotInstanceAfterAdapt, slotInstanceBefore)
    assert.strictEqual(
      slotCountAfterAdapt,
      toSlotCount(measuredV2StateBaseline.countAfterAdapt)
    )
    assert.strictEqual(
      slotCountAfterReturn,
      toSlotCount(measuredV2StateBaseline.countAfterReturn)
    )
  })
})
