import { expect, test } from 'vitest'
import { getThemeNameFromSelector } from './insertStyleRule'
import { normalizeThemeValue } from './themes'

test('reads theme class names without specificity qualifiers', () => {
  expect(getThemeNameFromSelector(':root.t_light_blue:not(#t_theme_full_name)')).toBe(
    'light_blue'
  )
  expect(getThemeNameFromSelector(':root.t_dark .t_blue')).toBe('dark_blue')
  expect(getThemeNameFromSelector(':root.t_light .t_dark')).toBeUndefined()
})

test('normalizes equivalent CSS theme colors to identical bytes', () => {
  expect(normalizeThemeValue('hsla(0, 0%, 45%, 1)')).toBe(
    normalizeThemeValue('rgb(115, 115, 115)')
  )
})
