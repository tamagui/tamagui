// @vitest-environment jsdom
import { afterEach, expect, test, vi } from 'vitest'
import { createTamagui } from '../createTamagui'
import type { ThemeParsed } from '../types'
import { getAuthoredThemeScheme } from './themes'

const schemeKey = Symbol.for('tamagui.theme.scheme')

function authored<T extends object>(values: T, scheme: 'light' | 'dark'): T {
  return Object.defineProperty({ ...values }, schemeKey, { value: scheme })
}

const originalEnv = process.env.NODE_ENV
const originalTarget = process.env.TAMAGUI_TARGET

afterEach(() => {
  vi.restoreAllMocks()
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
        parsed.themes[name]
          ? (getAuthoredThemeScheme(parsed.themes[name]) ?? null)
          : 'missing',
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

test('css hydration preserves complete custom property values', () => {
  process.env.TAMAGUI_TARGET = 'web'
  process.env.NODE_ENV = 'production'
  const style = document.createElement('style')
  style.textContent = `:root.t_light, .tm_xxt {
    --background: #ffffff;
    --image: url("data:image/svg+xml;utf8,<svg></svg>");
    --label: "first; second: third";
    --size: 12px;
  }`
  document.head.append(style)

  const client = createTamagui({ tokens: { color: {} }, themes: {} })
  const theme = (client.themes as Record<string, ThemeParsed>).light
  expect(theme.background.val).toBe('#ffffff')
  expect(theme.image.val).toBe('url("data:image/svg+xml;utf8,<svg></svg>")')
  expect(theme.label.val).toBe('"first; second: third"')
  expect(theme.size.val).toBe(12)
  expect(theme.size.needsPx).toBe(true)
})

test('hydrates only accessed themes and snapshots their declarations and parents', () => {
  process.env.TAMAGUI_TARGET = 'web'
  process.env.NODE_ENV = 'production'
  const style = document.createElement('style')
  style.textContent = `
    body { --shared: #123456; }
    :root.t_light, .tm_xxt { --background: #ffffff; --color: #111111; }
    :root.t_light_Button, :root.t_light_alias, .tm_xxt { --color: #ff0000; --shadow: var(--shared); }
    :root.t_dark, .tm_xxt { --background: #000000; --color: #ffffff; }
  `
  document.head.append(style)
  const createElement = vi.spyOn(document, 'createElement')
  const parses = () => createElement.mock.calls.filter(([tag]) => tag === 'span').length
  const client = createTamagui({ tokens: { color: {} }, themes: {} })
  const themes = client.themes as Record<string, ThemeParsed>
  expect(Object.keys(themes)).toEqual(['light', 'light_Button', 'light_alias', 'dark'])
  expect(parses()).toBe(0)

  // neither an edit nor a later config changes the first config's values.
  ;(style.sheet!.cssRules[1] as CSSStyleRule).style.setProperty('--background', '#222222')
  document.body.style.setProperty('--shared', '#654321')
  const later = document.createElement('style')
  later.textContent = ':root.t_light, .tm_xxt { --background: #333333; }'
  document.head.append(later)
  const next = createTamagui({ tokens: { color: {} }, themes: {} })
  expect(parses()).toBe(0)
  const button = themes.light_Button
  expect(button.background.val).toBe('#ffffff')
  expect(button.color.val).toBe('#ff0000')
  expect(button.shadow.val).toBe('#123456')
  expect(themes.light_Button).toBe(button)
  expect(parses()).toBe(2)
  expect(themes.light_alias).toEqual(button)
  expect(themes.light_alias).not.toBe(button)
  expect(parses()).toBe(2)
  expect((next.themes as Record<string, ThemeParsed>).light.background.val).toBe(
    '#333333'
  )
  expect(parses()).toBe(3)

  // theme updates can replace a theme before its first read.
  themes.dark = button
  expect(themes.dark).toBe(button)
  expect(parses()).toBe(3)
})
