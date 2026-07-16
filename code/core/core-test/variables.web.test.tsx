process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react'
import { describe, expect, test } from 'vitest'

import {
  createTamagui,
  getVariablesCSSRules,
  TamaguiProvider,
  Variables,
  View,
} from '@tamagui/core'

const conf = createTamagui({
  ...getDefaultTamaguiConfig(),
  variables: {
    surfaceBorder: '$color',
    disabledOpacity: 0.5,
    focusRingWidth: 2,
    radius: 9,
    accent: { light: '#001', dark: '#ffe' },
    chained: '$surfaceBorder',
  },
})

describe('createTamagui variables', () => {
  test('merges variables into base themes with per-theme reference resolution', () => {
    expect(conf.themes.light.surfaceBorder.val).toBe(conf.themes.light.color.val)
    expect(conf.themes.dark.surfaceBorder.val).toBe(conf.themes.dark.color.val)
    expect(conf.themes.light.surfaceBorder.val).not.toBe(conf.themes.dark.surfaceBorder.val)
  })

  test('scheme-scoped config values pick per base theme scheme', () => {
    expect(conf.themes.light.accent.val).toBe('#001')
    expect(conf.themes.dark.accent.val).toBe('#ffe')
  })

  test('chained variable references resolve', () => {
    expect(conf.themes.light.chained.val).toBe(conf.themes.light.color.val)
  })

  test('numbers keep px on web except unitless keys', () => {
    expect(conf.themes.light.focusRingWidth.needsPx).toBe(true)
    expect(conf.themes.light.radius.needsPx).toBe(true)
    expect(conf.themes.light.disabledOpacity.needsPx).toBeFalsy()
    // theme CSS emits the px unit through the auto variable
    const css = conf.getCSS()
    expect(css).toMatch(/--t\d+:9px/)
    expect(css).toMatch(/--t\d+:0\.5[;}]/)
    // theme rules point the key at the auto variable
    expect(css).toMatch(/--radius:var\(--t\d+\)/)
  })

  test('sub-themes inherit variables through parent proxy, not own keys', () => {
    // dark_blue does not define surfaceBorder itself so the CSS rules for it
    // must not include it (inherit via cascade on web)...
    const darkBlueRules = conf.themeConfig
      .getThemeRulesSets()
      .filter((rule: string) => rule.includes('.t_blue'))
    expect(darkBlueRules.some((rule: string) => rule.includes('--surfaceBorder'))).toBe(
      false
    )
    // ...but the runtime theme object still resolves it via proxyThemesToParents
    expect(conf.themes.dark_blue.surfaceBorder?.val).toBe(conf.themes.dark.color.val)
  })
})

describe('getVariablesCSSRules', () => {
  test('emits var() references for theme keys and stable identifiers', () => {
    const a = getVariablesCSSRules({ values: { surfaceBorder: '$background' } }, conf)!
    const b = getVariablesCSSRules({ values: { surfaceBorder: '$background' } }, conf)!
    expect(a.identifier).toBe(b.identifier)
    expect(a.identifier).toMatch(/^tvar_\d+$/)
    expect(a.rules[0]).toContain(`:root .${a.identifier} {`)
    expect(a.rules[0]).toContain('--surfaceBorder:var(--background);')
  })

  test('literal numbers follow the unit rule', () => {
    const res = getVariablesCSSRules(
      { values: { radius: 20, disabledOpacity: 0.25 } },
      conf
    )!
    expect(res.rules[0]).toContain('--radius:20px;')
    expect(res.rules[0]).toContain('--disabledOpacity:0.25;')
  })

  test('qualified token references resolve through specificTokens', () => {
    const res = getVariablesCSSRules({ values: { surfaceBorder: '$color.white' } }, conf)!
    expect(res.rules[0]).toContain('--surfaceBorder:var(--c-white);')
  })

  test('dark values emit scheme-scoped selectors and media rules', () => {
    const res = getVariablesCSSRules(
      { values: { accent: '#111' }, dark: { accent: '#eee' } },
      conf
    )!
    const cls = `.${res.identifier}`
    expect(res.rules[0]).toBe(`:root ${cls} {--accent:#111;}`)
    const darkRule = res.rules.find((rule) => rule.includes('.t_dark'))!
    expect(darkRule).toContain(`:root .t_dark ${cls}`)
    expect(darkRule).toContain(`:root.t_dark ${cls}`)
    expect(darkRule).toContain(`:root .t_light .t_dark ${cls}`)
    expect(darkRule).toContain('--accent:#eee;')
    // shouldAddPrefersColorThemes is on in the default test config
    expect(
      res.rules.some((rule) => rule.startsWith('@media (prefers-color-scheme:dark)'))
    ).toBe(true)
  })

  test('unknown keys drop, empty output is null', () => {
    expect(getVariablesCSSRules({ values: { notAKey: 'red' } as any }, conf)).toBe(null)
  })
})

describe('<Variables>', () => {
  test('renders display:contents span with identifier class and registers SSR rules', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Variables values={{ surfaceBorder: 'red' }}>
          <View testID="child" borderColor="$surfaceBorder" />
        </Variables>
      </TamaguiProvider>
    )
    const span = container.querySelector('.is_Variables') as HTMLElement
    expect(span).toBeTruthy()
    const identifier = [...span.classList].find((c) => c.startsWith('tvar_'))!
    expect(identifier).toBeTruthy()
    expect(span.className).toContain('_dsp_contents')
    // registered for SSR collection
    expect(conf.getCSS()).toContain(`:root .${identifier} {--surfaceBorder:red;}`)
    // inserted into the runtime sheet exactly once
    const sheet = document.getElementById('_tamagui-styles') as HTMLStyleElement
    const inserted = [...(sheet.sheet?.cssRules ?? [])].filter((rule) =>
      rule.cssText.includes(identifier)
    )
    expect(inserted.length).toBe(1)
  })

  test('re-mounting the same values does not duplicate rules', () => {
    const el = (
      <TamaguiProvider config={conf} defaultTheme="light">
        <Variables values={{ surfaceBorder: 'rebeccapurple' }}>
          <View />
        </Variables>
      </TamaguiProvider>
    )
    const first = render(el)
    const span = first.container.querySelector('.is_Variables') as HTMLElement
    const identifier = [...span.classList].find((c) => c.startsWith('tvar_'))!
    first.unmount()
    render(el)
    const sheet = document.getElementById('_tamagui-styles') as HTMLStyleElement
    const inserted = [...(sheet.sheet?.cssRules ?? [])].filter((rule) =>
      rule.cssText.includes(identifier)
    )
    expect(inserted.length).toBe(1)
  })
})
