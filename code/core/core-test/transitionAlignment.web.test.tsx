// web transition values are emitted in authored order inside one atomic block.
// the browser applies shorthand resets, list cycling, validation, and defaults.

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
  const emitted = emittedTransition(result)
  expect(emitted).toContain('{transition:opacity 200ms}')
  expect(emitted).toContain('{transition-delay:50ms}')
  expect(emitted.indexOf('transition:')).toBeLessThan(
    emitted.indexOf('transition-delay:')
  )
})

test('a later shorthand resets an earlier longhand', () => {
  const result = split({
    transitionDelay: '50ms',
    transition: 'opacity 200ms',
  })
  const emitted = emittedTransition(result)
  expect(emitted).toContain('{transition-delay:50ms}')
  expect(emitted).toContain('{transition:opacity 200ms}')
  expect(emitted.indexOf('transition-delay:')).toBeLessThan(
    emitted.indexOf('transition:')
  )
})

test('longhands alone assemble with CSS defaults and cycling', () => {
  const result = split({
    transitionProperty: 'opacity, transform',
    transitionDuration: '150ms',
  })
  const emitted = emittedTransition(result)
  expect(emitted).toContain('{transition-property:opacity, transform}')
  expect(emitted).toContain('{transition-duration:150ms}')
})

test('longhands never leak to the DOM as attributes', () => {
  const result = split({ transitionDuration: '150ms' })
  expect(result.viewProps.transitionDuration).toBeUndefined()
})

test('transition validation stays with the browser', () => {
  const warnings: string[] = []
  const original = console.warn
  const previousNodeEnv = process.env.NODE_ENV
  process.env.NODE_ENV = 'development'
  console.warn = (message: string) => warnings.push(String(message))
  try {
    const cases = [
      { transition: 'opacity 200ms', transitionDuration: '-314159ms' },
      {
        transition: 'opacity 200ms',
        transitionTimingFunction: 'not-a-timing-function',
      },
    ]
    for (const props of cases) {
      split(props)
      split(props)
    }
    expect(warnings).toEqual([])
    expect(emittedTransition(split(cases[0]))).toContain('transition-duration:-314159ms')
    expect(emittedTransition(split(cases[1]))).toContain(
      'transition-timing-function:not-a-timing-function'
    )
  } finally {
    console.warn = original
    process.env.NODE_ENV = previousNodeEnv
  }
})

test('an invalid longhand does not erase the shorthand', () => {
  const result = split({
    transition: 'opacity 200ms',
    transitionDuration: '-100ms',
  })
  const emitted = emittedTransition(result)
  expect(emitted).toContain('transition:opacity 200ms')
  expect(emitted).toContain('transition-duration:-100ms')
})

test('conditional transition clauses stay in the direct block', () => {
  const result = split({ transition: '200ms hover:400ms' })
  const className = result.classNames?.transition
  expect(className).toBeTruthy()
  const rules = (result.rulesToInsert?.[className]?.[4] ?? []).join('')
  expect(rules).toContain('transition:200ms')
  expect(rules).toContain(':where(:hover){transition:400ms}')
  expect(result.style?.transition).toBeUndefined()
})

test('a conditional transition and a later longhand share one ordered block', () => {
  const result = split({
    transition: '200ms hover:400ms',
    transitionDelay: '50ms',
  })
  const className = result.classNames?.transition
  expect(className).toBeTruthy()
  expect(emittedTransition(result)).toContain('transition-delay:50ms')
  expect(result.style?.transition).toBeUndefined()
})

test('a clause-bearing longhand emits base and conditional declarations', () => {
  const result = split({ transitionDelay: '50ms hover:100ms' })
  const emitted = emittedTransition(result)
  expect(emitted).toContain('transition-delay:50ms')
  expect(emitted).toContain(':where(:hover){transition-delay:100ms}')
  expect(result.style?.transition).toBeUndefined()
  expect(result.viewProps.transitionDelay).toBeUndefined()
})

test('Tamagui property spellings normalize to CSS names in the aligned output', () => {
  // y composes through the translate axis variables, so its transition
  // target is `translate`; camelCase names hyphenate — otherwise the CSS
  // names a property it does not know and silently never fires
  const y = split({ transition: 'y 200ms' })
  expect(emittedTransition(y)).toContain('transition:translate 200ms')
  const camel = split({ transition: 'backgroundColor 300ms' })
  expect(emittedTransition(camel)).toContain('transition:background-color 300ms')

  const custom = split({ transitionProperty: 'var(--x), x' })
  expect(emittedTransition(custom)).toContain('transition-property:var(--x), translate')

  // the drivers file entries under canonicalTransitionProperty, so a raw css
  // string has to reach the same names or the two disagree about what animates
  const parts = split({ transition: 'translateX 200ms, rotateX 100ms' })
  expect(emittedTransition(parts)).toContain(
    'transition:translate 200ms, transform 100ms'
  )
})
