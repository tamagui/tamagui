// Phase 6 item 4 runtime wiring, web: the six transition props merge per the
// alignment model (five-list substrate, last-wins per longhand, shorthand
// resets) and emit one CSS transition declaration. no driver in this harness,
// so every string here takes CSS semantics — the preset invariants are
// demonstrated at the driver suites.

import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (props: Record<string, any>) =>
  getSplitStyles(
    props,
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

const emittedTransition = (result: any): string => {
  const className = result.classNames?.transition
  const rules = (result.rulesToInsert?.[className]?.[4] ?? []).join('')
  return rules || String(result.style?.transition ?? '')
}

test('a longhand after the shorthand overrides only its component', () => {
  const result = split({
    transition: 'opacity 200ms',
    transitionDelay: '50ms',
  })
  expect(emittedTransition(result)).toContain('opacity 200ms ease 50ms normal')
})

test('a later shorthand resets an earlier longhand', () => {
  const result = split({
    transitionDelay: '50ms',
    transition: 'opacity 200ms',
  })
  expect(emittedTransition(result)).toContain('opacity 200ms ease 0s normal')
})

test('longhands alone assemble with CSS defaults and cycling', () => {
  const result = split({
    transitionProperty: 'opacity, transform',
    transitionDuration: '150ms',
  })
  const emitted = emittedTransition(result)
  expect(emitted).toContain('opacity 150ms ease 0s normal')
  expect(emitted).toContain('transform 150ms ease 0s normal')
})

test('longhands never leak to the DOM as attributes', () => {
  const result = split({ transitionDuration: '150ms' })
  expect(result.viewProps.transitionDuration).toBeUndefined()
})

test('an aligned diagnostic drops the value instead of emitting invalid CSS', () => {
  const result = split({
    transition: 'opacity 200ms',
    transitionDuration: '-100ms',
  })
  expect(emittedTransition(result)).toBe('')
})

test('REGRESSION GUARD: conditional transition clauses keep the shipped program path', () => {
  // `transition="200ms hover:400ms"` works at HEAD through the program
  // engine; the alignment wiring must never swallow it
  const result = split({ transition: '200ms hover:400ms' })
  const className = result.classNames?.transition
  expect(className).toBeTruthy()
  const rules = (result.rulesToInsert?.[className]?.[4] ?? []).join('')
  expect(rules).toContain('transition:200ms')
  expect(rules).toContain(':where(:hover){transition:400ms}')
  expect(result.style?.transition).toBeUndefined()
})

test('a conditional transition owns the property over longhand contributions', () => {
  const result = split({
    transition: '200ms hover:400ms',
    transitionDelay: '50ms',
  })
  const className = result.classNames?.transition
  expect(className).toBeTruthy()
  // the aligned lists yield: no second style.transition beside the program
  expect(result.style?.transition).toBeUndefined()
})

test('a clause-bearing longhand drops instead of leaking', () => {
  const result = split({ transitionDelay: '50ms hover:100ms' })
  expect(result.style?.transition).toBeUndefined()
  expect(result.viewProps.transitionDelay).toBeUndefined()
})

test('Tamagui property spellings normalize to CSS names in the aligned output', () => {
  // y composes through the translate axis variables, so its transition
  // target is `translate`; camelCase names hyphenate — otherwise the CSS
  // names a property it does not know and silently never fires
  const y = split({ transition: 'y 200ms' })
  expect(emittedTransition(y)).toContain('translate 200ms ease 0s normal')
  const camel = split({ transition: 'backgroundColor 300ms' })
  expect(emittedTransition(camel)).toContain('background-color 300ms ease 0s normal')
})
