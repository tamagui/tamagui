// `unset` inside a clause means the platform default while that clause is
// active. native has no `unset` keyword, so the key drops out of the merged
// style entirely while the clause is active; resting values are untouched.
import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, styled } from '../web/src'
import { simplifiedGetSplitStyles } from './utils'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const Frame = styled(View, {
  variants: {
    pressable: {
      on: { opacity: '0.9 press:0.5' },
    },
    hoverable: {
      on: { opacity: '0.9 hover:0.5' },
    },
    focusable: {
      on: { opacity: '0.9 focus:0.5' },
    },
    smallable: {
      on: { opacity: '0.9 sm:0.5' },
    },
    nested: {
      on: { opacity: '0.9 sm:hover:0.5' },
    },
    bare: {
      on: { opacity: 'press:0.5' },
    },
  } as const,
})

const split = (
  props: Record<string, any>,
  options: {
    componentState?: Record<string, any>
    mediaState?: Record<string, any>
  } = {}
) =>
  simplifiedGetSplitStyles(Frame, props, {
    componentState: options.componentState,
    mediaState: options.mediaState,
    mergeDefaultProps: true,
  })

const expectNoKey = (result: { style?: Record<string, any> }, key: string) => {
  expect(key in (result.style ?? {})).toBe(false)
}

test('press:unset retracts the key while pressed, resting keeps the base', () => {
  const pressed = split(
    { pressable: 'on', opacity: 'press:unset' },
    { componentState: { press: true } }
  )
  expectNoKey(pressed, 'opacity')

  const resting = split({ pressable: 'on', opacity: 'press:unset' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('press:unset with no base leaves the key out in both states', () => {
  const pressed = split(
    { bare: 'on', opacity: 'press:unset' },
    { componentState: { press: true } }
  )
  expectNoKey(pressed, 'opacity')

  const resting = split({ bare: 'on', opacity: 'press:unset' })
  expectNoKey(resting, 'opacity')
})

test('press:unset retracts even with no variant clause at all', () => {
  const pressed = split(
    { opacity: '0.9 press:unset' },
    { componentState: { press: true } }
  )
  expectNoKey(pressed, 'opacity')

  const resting = split({ opacity: '0.9 press:unset' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('an ordinary press clause still overrides the variant while pressed', () => {
  const pressed = split(
    { pressable: 'on', opacity: 'press:0.7' },
    { componentState: { press: true } }
  )
  expect(pressed.style?.opacity).toBe(0.7)

  const resting = split({ pressable: 'on', opacity: 'press:0.7' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('unset before the variant prop loses to the later variant clause', () => {
  const pressed = split(
    { opacity: 'press:unset', pressable: 'on' },
    { componentState: { press: true } }
  )
  expect(pressed.style?.opacity).toBe(0.5)

  const resting = split({ opacity: 'press:unset', pressable: 'on' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('hover:unset retracts the key while hovered', () => {
  const hovered = split(
    { hoverable: 'on', opacity: 'hover:unset' },
    { componentState: { hover: true } }
  )
  expectNoKey(hovered, 'opacity')

  const resting = split({ hoverable: 'on', opacity: 'hover:unset' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('focus:unset retracts the key while focused', () => {
  const focused = split(
    { focusable: 'on', opacity: 'focus:unset' },
    { componentState: { focus: true } }
  )
  expectNoKey(focused, 'opacity')

  const resting = split({ focusable: 'on', opacity: 'focus:unset' })
  expect(resting.style?.opacity).toBe(0.9)
})

test('sm:unset retracts the key while the media matches', () => {
  const matched = split(
    { smallable: 'on', opacity: 'sm:unset' },
    { mediaState: { sm: true } }
  )
  expectNoKey(matched, 'opacity')

  const resting = split(
    { smallable: 'on', opacity: 'sm:unset' },
    { mediaState: { sm: false } }
  )
  expect(resting.style?.opacity).toBe(0.9)
})

test('a nested sm:hover:unset retracts the key while both match', () => {
  const matched = split(
    { nested: 'on', opacity: 'sm:hover:unset' },
    { componentState: { hover: true }, mediaState: { sm: true } }
  )
  expectNoKey(matched, 'opacity')

  const resting = split(
    { nested: 'on', opacity: 'sm:hover:unset' },
    { componentState: { hover: false }, mediaState: { sm: false } }
  )
  expect(resting.style?.opacity).toBe(0.9)
})

test('whole-prop unset still clears the key including variant values', () => {
  const pressed = split(
    { pressable: 'on', opacity: 'unset' },
    { componentState: { press: true } }
  )
  expectNoKey(pressed, 'opacity')

  const resting = split({ pressable: 'on', opacity: 'unset' })
  expectNoKey(resting, 'opacity')
})
