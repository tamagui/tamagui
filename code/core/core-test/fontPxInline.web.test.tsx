process.env.TAMAGUI_TARGET = 'web'
import { expect, test } from 'vitest'
import { normalizeValueWithProperty } from '../web/src/helpers/normalizeValueWithProperty'

test('web keeps "Npx" font size as a css string', () => {
  expect(normalizeValueWithProperty('17px', 'fontSize')).toBe('17px')
  expect(normalizeValueWithProperty(17, 'fontSize')).toBe('17px')
})
