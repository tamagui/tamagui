import { expect, test } from 'vitest'

// `withStaticProperties` does `Object.assign(component, staticProps)` — it mutates
// the component it is given. Composing a skin's styled parts directly onto a
// component imported from @tamagui/ui therefore rewrites the UNSTYLED package's own
// exports for every consumer, collapsing the three-layer contract that @tamagui/ui
// is the unstyled home.
//
// This has bitten three separate times: the Toast skin (self-recursion that broke
// native toast rendering entirely), these four skins (a silent leak), and bento's
// radio skin (infinite recursion that killed the browser renderer). Hence a test
// rather than a comment.
import {
  Accordion as UiAccordion,
  Dialog as UiDialog,
  Slider as UiSlider,
  ToggleGroup as UiToggleGroup,
} from '@tamagui/ui'
import { Accordion, Dialog, Slider, ToggleGroup } from 'tamagui'

test('styled skins do not replace the unstyled parts on @tamagui/ui', () => {
  expect(Dialog.Overlay).not.toBe(UiDialog.Overlay)
  expect(Dialog.Content).not.toBe(UiDialog.Content)

  expect(Accordion.Trigger).not.toBe(UiAccordion.Trigger)
  expect(Accordion.Content).not.toBe(UiAccordion.Content)

  expect(Slider.Track).not.toBe(UiSlider.Track)
  expect(Slider.TrackActive).not.toBe(UiSlider.TrackActive)
  expect(Slider.Thumb).not.toBe(UiSlider.Thumb)

  expect(ToggleGroup.Item).not.toBe(UiToggleGroup.Item)
})

test('skins still expose the behavior parts they do not restyle', () => {
  // carried through from the behavior root, so `<Dialog.Trigger />` keeps working
  expect(Dialog.Trigger).toBe(UiDialog.Trigger)
  expect(Dialog.Portal).toBe(UiDialog.Portal)
  expect(Dialog.Title).toBe(UiDialog.Title)
  expect(Dialog.Description).toBe(UiDialog.Description)
  expect(Dialog.Close).toBe(UiDialog.Close)

  expect(Accordion.Item).toBe(UiAccordion.Item)
  expect(Accordion.Header).toBe(UiAccordion.Header)
  expect(Accordion.HeightAnimator).toBe(UiAccordion.HeightAnimator)
})

// Composing onto a fresh root means every static the behavior root exposed has to
// be re-listed by hand, and `Dialog.Adapt` was dropped exactly that way — it only
// surfaced as a typecheck failure in downstream apps. Derive the expectation from
// the behavior component so a part can't silently go missing from a skin again.
test.each([
  ['Dialog', Dialog, UiDialog],
  ['Accordion', Accordion, UiAccordion],
  ['Slider', Slider, UiSlider],
  ['ToggleGroup', ToggleGroup, UiToggleGroup],
] as const)('the %s skin carries every part of the behavior root', (_n, skin, behavior) => {
  const parts = Object.keys(behavior).filter((key) => /^[A-Z]/.test(key))
  expect(parts.length).toBeGreaterThan(0)
  expect(Object.keys(skin)).toEqual(expect.arrayContaining(parts))
})

test('the skin root is a distinct component from the behavior root', () => {
  expect(Dialog).not.toBe(UiDialog)
  expect(Accordion).not.toBe(UiAccordion)
  expect(Slider).not.toBe(UiSlider)
  expect(ToggleGroup).not.toBe(UiToggleGroup)
})
