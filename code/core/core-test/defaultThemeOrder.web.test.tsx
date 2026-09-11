process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import { TamaguiProvider, View, createTamagui, useThemeName } from '@tamagui/core'

/**
 * Regression for GitHub issue #3764.
 *
 * `TamaguiProvider` falls back to `Object.keys(config.themes)[0]` when no
 * `defaultTheme` is passed, so the runtime themes object has to keep the order the
 * config declared. `getThemesDeduped` used to sort theme names alphabetically for
 * deterministic CSS output, which put `dark` ahead of `light` and silently made
 * dark the default for every app that doesn't pass `defaultTheme`.
 */

describe('default theme order', () => {
  test('runtime themes keep config declaration order', () => {
    const raw = getDefaultTamaguiConfig()
    const rawFirst = Object.keys(raw.themes)[0]
    expect(rawFirst).toBe('light')

    const conf = createTamagui(raw)
    expect(Object.keys(conf.themes)[0]).toBe(rawFirst)
  })

  test('a provider with no defaultTheme uses the first declared theme', () => {
    const conf = createTamagui(getDefaultTamaguiConfig())
    let seen: string | undefined

    function Probe() {
      seen = useThemeName()
      return <View />
    }

    render(
      <TamaguiProvider config={conf}>
        <Probe />
      </TamaguiProvider>
    )

    expect(seen).toBe('light')
  })

  test('an explicit defaultTheme still wins', () => {
    const conf = createTamagui(getDefaultTamaguiConfig())
    let seen: string | undefined

    function Probe() {
      seen = useThemeName()
      return <View />
    }

    render(
      <TamaguiProvider config={conf} defaultTheme="dark">
        <Probe />
      </TamaguiProvider>
    )

    expect(seen).toBe('dark')
  })

  test('deduped inverse themes keep the scheme of each alias', () => {
    const conf = createTamagui({
      ...getDefaultTamaguiConfig(),
      themes: {
        light: { background: '#fff', color: '#000' },
        dark: { background: '#000', color: '#fff' },
        light_inverse: { background: '#000', color: '#fff' },
        dark_inverse: { background: '#fff', color: '#000' },
      },
    })
    const css = conf.getCSS()
    const rules = css.split('\n')
    const lightInverseRule = rules.find((rule) =>
      /:root(?:\.t_light| \.t_light) \.t_inverse(?:,| \{)/.test(rule)
    )
    const darkInverseRule = rules.find((rule) =>
      /:root(?:\.t_dark| \.t_dark) \.t_inverse(?:,| \{)/.test(rule)
    )

    expect(lightInverseRule).toContain('--background:var(--c-black)')
    expect(darkInverseRule).toContain('--background:var(--c-white)')
  })
})
