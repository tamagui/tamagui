process.env.TAMAGUI_TARGET = 'web'
import { expect, test } from 'vitest'
import { normalizeValueWithProperty } from '../web/src/helpers/normalizeValueWithProperty'

test('web keeps "Npx" font size as a css string', () => {
  expect(normalizeValueWithProperty('17px', 'fontSize')).toBe('17px')
  expect(normalizeValueWithProperty(17, 'fontSize')).toBe('17px')
})

test.each(['maxWidth', 'maxHeight', 'maxInlineSize', 'maxBlockSize'])(
  'web lowers auto %s to the CSS reset value',
  (property) => {
    expect(normalizeValueWithProperty('auto', property)).toBe('none')
  }
)

test('web preserves auto for dimensions that accept it', () => {
  expect(normalizeValueWithProperty('auto', 'width')).toBe('auto')
  expect(normalizeValueWithProperty('auto', 'height')).toBe('auto')
})
