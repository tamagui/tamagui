// @vitest-environment happy-dom
import { afterEach, expect, test } from 'vitest'
import { createTamagui } from '../createTamagui'
import { getAuthoredThemeScheme } from './themes'

const schemeKey = Symbol.for('tamagui.theme.scheme')

function authored<T extends object>(values: T, scheme: 'light' | 'dark'): T {
  return Object.defineProperty({ ...values }, schemeKey, { value: scheme })
}

const originalEnv = process.env.NODE_ENV
const originalTarget = process.env.TAMAGUI_TARGET

afterEach(() => {
  process.env.NODE_ENV = originalEnv
  process.env.TAMAGUI_TARGET = originalTarget
  document.head.innerHTML = ''
})

test('themes rebuilt from the generated css keep the scheme each theme was authored with', () => {
  process.env.TAMAGUI_TARGET = 'web'
  const lightValues = { background: '#ffffff', color: '#000000' }
  const darkValues = { background: '#000000', color: '#ffffff' }
  const themes = {
    light: authored(lightValues, 'light'),
    dark: authored(darkValues, 'dark'),
    // inverse is authored as the opposite scheme and dedupes into that base
    light_inverse: authored(darkValues, 'dark'),
    dark_inverse: authored(lightValues, 'light'),
    // an unauthored theme keeps the scheme its name implies, even when its
    // values match a base of the other scheme
    light_shade: { ...darkValues },
  }
  const config = { tokens: { color: {} }, themes }

  const server = createTamagui(config)
  const style = document.createElement('style')
  style.textContent = server.getCSS()
  document.head.append(style)

  // a production client ships no theme values and rebuilds them from the css
  process.env.NODE_ENV = 'production'
  const client = createTamagui({ ...config, themes: {} })

  const schemes = (parsed: { themes: Record<string, object> }) =>
    Object.fromEntries(
      Object.keys(themes).map((name) => [
        name,
        parsed.themes[name] ? (getAuthoredThemeScheme(parsed.themes[name]) ?? null) : 'missing',
      ])
    )
  expect(schemes(server)).toEqual({
    light: 'light',
    dark: 'dark',
    light_inverse: 'dark',
    dark_inverse: 'light',
    light_shade: null,
  })
  expect(schemes(client)).toEqual(schemes(server))
})
