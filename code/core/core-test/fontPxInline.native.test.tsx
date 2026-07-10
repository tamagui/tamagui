process.env.TAMAGUI_TARGET = 'native'
import { expect, test } from 'vitest'
import { normalizeValueWithProperty } from '../web/src/helpers/normalizeValueWithProperty'

test('native parses "Npx" font size to a number', () => {
  expect(normalizeValueWithProperty('17px', 'fontSize')).toBe(17)
  expect(normalizeValueWithProperty('24.5px', 'lineHeight')).toBe(24.5)
  // non-px strings (e.g. percentages) pass through untouched
  expect(normalizeValueWithProperty('50%', 'width')).toBe('50%')
  expect(normalizeValueWithProperty(17, 'fontSize')).toBe(17)
})
