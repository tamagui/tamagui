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

// the case is taller than a phone screen, so native tests must scroll before they
// can touch anything (the web tests get this free via Playwright auto-scroll).
// four rules, each one paid for by a red CI run on PR #4140:
//
// 1. never scrollTo('top'/'bottom') on adapt-live-slot-scroll. the iOS app
//    answered every Detox request up to `scrollTo top`, then never answered
//    another one - all four tests here timed out at 180s and the iOS job failed.
//    bounded scroll(250,'down') swipes are fine. inferred, not proven: scrollTo
//    loops until it finds the content edge, and LiveSlotPublisher republishes on
//    every render + notifies from a layout effect, so a scroll keeps scheduling
//    more layout and the edge never settles. this was the suite's only scrollTo,
//    so "broken on iOS" vs "broken against this case" is untested - assume
//    nothing if you reach for it elsewhere.
//
// 2. never put .atIndex() inside a whileElement search - use bare by.id, not the
//    testElement() helper. both searches here returned "was null" for views the
//    failure screenshots show were on screen the whole time. inferred, not proven
//    (native java): the at-index matcher counts matches as espresso walks the tree
//    and never resets, so it is single-use and a search re-evaluates it. atIndex
//    is fine everywhere else in this file.
//
// 3. don't anchor the search on the element you're about to tap. whileElement
//    stops the instant its target crosses 75% visibility, parking it against the
//    bottom edge - and this app draws edge-to-edge, so "visible" to espresso
//    includes the strip behind the navigation bar, where taps are swallowed
//    ("Couldn't click at: 798.0,2187.0" on a 2280px screen). anchor below what
//    you tap so the tap target ends up well inside the viewport.
//
//    the anchor has to differ per platform. this is not a hedge - each branch is
//    a separately proven green CI run, and no single anchor satisfied both:
//
//    - android anchors on sheet-live-slot-source (green: run 29687908034, all
//      four tests [OK]). anchoring on press-count instead failed with "view was
//      <0> percent visible" even though the failure screenshot plainly shows that
//      text on screen at ~2018 of 2280. that contradiction is unexplained - do
//      not "fix" it from first principles without an artifact in hand.
//    - iOS anchors on sheet-live-slot-press-count (green: run 29689674422, all
//      five iOS jobs including auto-discovered). source is the last node in the
//      react tree but at maximum scroll it is still clipped by the screen bottom
//      and never reaches 75%, so the search exhausts: "Unable to scroll down ...
//      does not pass visibility percent threshold (75)". Detox's own
//      DETOX_VISIBILITY_*.png artifact draws that clipped region.
//
//    the tests and every assertion are identical on both platforms. only which
//    element the scroll stops at differs.
//
// 4. match buttons by testID, never by rendered label. Button runs children
//    through wrapChildrenInText, which wraps EACH string child in its own Text,
//    so `<Button>increment {name}</Button>` is two sibling Text nodes - two
//    android TextViews ("increment " and "slot"). espresso's withText never sees
//    a joined "increment slot".
async function scrollToEnd() {
  const anchor =
    device.getPlatform() === 'android'
      ? 'sheet-live-slot-source'
      : 'sheet-live-slot-press-count'
  await waitFor(element(by.id(anchor)))
    .toBeVisible()
    .whileElement(by.id('adapt-live-slot-scroll'))
    .scroll(250, 'down')
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
    // no scroll reset needed: remountDirectUseCase bumps the host's React key
    // (see DirectUseCaseHost in App.native.tsx), so the ScrollView is a fresh
    // instance sitting at offset 0. an explicit scrollTo('top') here is not just
    // redundant, it wedges the iOS app - see the scrollToEnd note above.
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
    // waitFor for the same reason as the sheet's typed-value below: withSync
    // disables synchronization again before returning, so a bare expect can read
    // the node before React commits onChangeText. Same string, just polled.
    await waitFor(testElement('live-slot-typed-value'))
      .toHaveText('typed: ios-focus')
      .withTimeout(10000)
  })

  it('renders slot content as plain children inside a no-portal Sheet target with working touch coordinates', async () => {
    await waitFor(testElement('sheet-live-slot-content')).toExist().withTimeout(10000)
    await detoxExpect(testElement('sheet-live-slot-context')).toHaveText(
      'dialog-context: sheet-dialog-parent-ok; portal-context: sheet-portal-wrapper-ok; target-context: sheet-target-ok; target: no-portal-inline-sheet'
    )
    await detoxExpect(element(by.label('No portal sheet live slot panel'))).toExist()

    await scrollToEnd()
    const sheetButton = element(by.label('No portal sheet button'))
    await waitFor(sheetButton).toBeVisible().withTimeout(10000)
    await withSync(() => sheetButton.tap())
    await detoxExpect(testElement('sheet-live-slot-press-count')).toHaveText(
      'sheet press-count: 1'
    )

    await withSync(() => testElement('sheet-live-slot-input').replaceText('sheet-ios'))
    // waitFor, not a bare expect: withSync turns synchronization back off before
    // returning, so nothing makes Detox wait for React to commit the onChangeText
    // update before the assertion reads the node. This asserts the same text, it
    // just tolerates the commit landing a beat late. Observed (PR #4140, run on
    // de55fe697a): the bare expect read "sheet typed: empty" while the failure
    // screenshot taken moments later showed "sheet typed: sheet-ios".
    await waitFor(testElement('sheet-live-slot-typed-value'))
      .toHaveText('sheet typed: sheet-ios')
      .withTimeout(10000)
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

    await scrollToEnd()
    await withSync(() => testElement('slot-state-increment').tap())
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
