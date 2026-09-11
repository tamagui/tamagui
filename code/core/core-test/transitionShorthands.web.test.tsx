import { beforeAll, expect, test } from 'vitest'
import config from '../config-default'
import { View, createTamagui, getSplitStyles } from '../web/src'

beforeAll(() => {
  createTamagui(config.getDefaultTamaguiConfig() as any)
})

const split = (transition: string) =>
  getSplitStyles(
    { transition },
    View.staticConfig,
    undefined as any,
    'light',
    { unmounted: false } as any,
    { isAnimated: false, noClass: false, resolveValues: 'auto' } as any
  )

const emittedTransition = (transition: string): string => {
  const result = split(transition)
  const className = result.classNames?.transition
  const rules = (result.rulesToInsert?.[className]?.[4] ?? []).join('')
  return rules || String(result.style?.transition ?? '')
}

test.each([
  ['bg', 'backgroundColor'],
  ['p', 'padding'],
  ['w', 'width'],
  ['br', 'borderRadius'],
])('transition target %s resolves identically to %s', (shorthand, longhand) => {
  expect(emittedTransition(`${shorthand} 200ms`)).toBe(
    emittedTransition(`${longhand} 200ms`)
  )
})
