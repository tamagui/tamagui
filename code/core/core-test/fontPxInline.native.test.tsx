process.env.TAMAGUI_TARGET = 'native'
import { expect, test } from 'vitest'
import { normalizeValueWithProperty } from '../web/src/helpers/normalizeValueWithProperty'
import { resolveTextMetrics } from '../web/src/helpers/nativeTextMetrics'

test('native parses "Npx" font size to a number', () => {
  expect(normalizeValueWithProperty('17px', 'fontSize')).toBe(17)
  const lineHeight = normalizeValueWithProperty('24.5px', 'lineHeight')
  expect(lineHeight).toBe('24.5px')
  const style = { fontSize: 20, lineHeight }
  expect(resolveTextMetrics(style, lineHeight)).toEqual({
    fontSize: 20,
    lineHeight: '24.5px',
  })
  expect(style.lineHeight).toBe(24.5)
  // non-px strings (e.g. percentages) pass through untouched
  expect(normalizeValueWithProperty('50%', 'width')).toBe('50%')
  expect(normalizeValueWithProperty(17, 'fontSize')).toBe(17)
})
