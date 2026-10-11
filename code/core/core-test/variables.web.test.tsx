process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render, waitFor } from '@testing-library/react'
import { describe, expect, test, vi } from 'vitest'

import { createTamagui, TamaguiProvider, Theme, useTheme, View } from '@tamagui/core'
import { getConfig, updateConfig } from '../web/src'
import {
  getConfigRevisionState,
  prepareConfigRevision,
} from '../web/src/helpers/grammarConfig'
import {
  createThemeUpdateState,
  getInlineValuesFromProps,
  getMergedInlineTheme,
  getVariablesCSSRules,
  ThemeUpdate,
  type InlineValueIssue,
} from '@tamagui/web/theme-update'

const conf = createTamagui({
  ...getDefaultTamaguiConfig(),
  variables: {
    surfaceBorder: 'color',
    disabledOpacity: 0.5,
    focusRingWidth: 2,
    radius: 9,
    accent: { light: '#001', dark: '#ffe' },
    chained: 'surfaceBorder',
  },
})
const inlineSelector = (identifier: string) => `.${identifier}:not(#t_theme_full_name)`

describe('createTamagui variables', () => {
  test('merges variables into base themes with per-theme reference resolution', () => {
    expect(conf.themes.light.surfaceBorder.val).toBe(conf.themes.light.color.val)
    expect(conf.themes.dark.surfaceBorder.val).toBe(conf.themes.dark.color.val)
    expect(conf.themes.light.surfaceBorder.val).not.toBe(
      conf.themes.dark.surfaceBorder.val
    )
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
    const a = getVariablesCSSRules({ values: { surfaceBorder: 'background' } }, conf)!
    const b = getVariablesCSSRules({ values: { surfaceBorder: 'background' } }, conf)!
    expect(a.identifier).toBe(b.identifier)
    expect(a.identifier).toMatch(/^tvar_\d+$/)
    expect(a.rules[0]).toContain(`:root ${inlineSelector(a.identifier)} {`)
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

  test('bare token references resolve through the configured token namespace', () => {
    const res = getVariablesCSSRules({ values: { surfaceBorder: 'white' } }, conf)!
    expect(res.rules[0]).toContain('--surfaceBorder:var(--white);')
  })

  test('dark values emit scheme-scoped selectors and media rules', () => {
    const res = getVariablesCSSRules(
      { values: { accent: '#111' }, themes: { dark: { accent: '#eee' } } },
      conf
    )!
    const cls = inlineSelector(res.identifier)
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

  test('non-scheme theme buckets emit plain theme-class-scoped rules', () => {
    const res = getVariablesCSSRules(
      {
        values: { accent: '#111' },
        themes: { blue: { accent: '#00f' }, dark: { accent: '#eee' } },
      },
      conf
    )!
    const cls = inlineSelector(res.identifier)
    expect(res.rules[0]).toBe(`:root ${cls} {--accent:#111;}`)
    const blueIndex = res.rules.findIndex((rule) => rule.includes('.t_blue'))
    expect(res.rules[blueIndex]).toBe(
      `:root .t_blue ${cls}, :root.t_blue ${cls} {--accent:#00f;}`
    )
    // no inversion selectors or media duplication for non-scheme names
    expect(res.rules.filter((rule) => rule.includes('.t_blue')).length).toBe(1)
    // scheme rules come after non-scheme rules so schemes win overlap ties,
    // consistent with the dark inversion selector outranking them anyway
    const darkIndex = res.rules.findIndex((rule) => rule.includes('.t_dark'))
    expect(blueIndex).toBeLessThan(darkIndex)
  })

  test('prefix-chain buckets emit least-specific first so the deeper name wins', () => {
    const res = getVariablesCSSRules(
      {
        themes: {
          red_alt1: { accent: '#b00' },
          red: { accent: '#a00' },
        },
      },
      conf
    )!
    const redIndex = res.rules.findIndex((rule) => rule.includes('.t_red '))
    const altIndex = res.rules.findIndex((rule) => rule.includes('.t_red_alt1'))
    expect(redIndex).toBeGreaterThanOrEqual(0)
    expect(redIndex).toBeLessThan(altIndex)
  })

  test('cycle-involved keys drop in all modes', () => {
    // direct cycle: both keys dropped
    expect(
      getVariablesCSSRules(
        { values: { surfaceBorder: 'chained', chained: 'surfaceBorder' } },
        conf
      )
    ).toBe(null)

    // a chain leading into a cycle drops too
    expect(
      getVariablesCSSRules(
        {
          values: {
            accent: 'surfaceBorder',
            surfaceBorder: 'chained',
            chained: 'surfaceBorder',
          },
        },
        conf
      )
    ).toBe(null)

    // cycle in one scheme-effective map drops the keys everywhere
    // (deterministic scheme-independent contract, see plans/variables.md)
    expect(
      getVariablesCSSRules(
        {
          values: { surfaceBorder: 'chained', chained: 'surfaceBorder' },
          themes: { dark: { chained: 'red' } },
        },
        conf
      )
    ).toBe(null)

    // a cycle only reachable by combining a non-scheme bucket with a scheme
    // bucket (both can apply at once under a matching theme) drops everywhere
    expect(
      getVariablesCSSRules(
        {
          themes: {
            blue: { surfaceBorder: 'chained' },
            dark: { chained: 'surfaceBorder' },
          },
        },
        conf
      )
    ).toBe(null)

    // unaffected sibling keys survive a dropped cycle
    const res = getVariablesCSSRules(
      {
        values: {
          accent: '#123',
          surfaceBorder: 'chained',
          chained: 'surfaceBorder',
        },
      },
      conf
    )!
    expect(res.rules[0]).toContain('--accent:#123;')
    expect(res.rules[0]).not.toContain('--surfaceBorder')
    expect(res.rules[0]).not.toContain('--chained')
  })
})

describe('getInlineValuesFromProps', () => {
  test('a syntax error refuses the whole raw value and reports the parser diagnosis', () => {
    const issues: InlineValueIssue[] = []
    const inline = getInlineValuesFromProps(
      { surfaceBorder: 'red dark:blue;' },
      conf,
      (issue) => issues.push(issue)
    )

    expect(inline).toEqual({ values: {}, themes: undefined })
    expect(issues).toEqual([
      {
        key: 'surfaceBorder',
        raw: 'red dark:blue;',
        message:
          '<ThemeUpdate surfaceBorder="red dark:blue;">: ";" cannot appear in a value: it would end the declaration or rule',
      },
    ])
  })

  test('unsupported and unknown modifiers drop only their clauses', () => {
    const issues: InlineValueIssue[] = []
    const raw = 'red hover:blue mystery:green web:orange'
    const inline = getInlineValuesFromProps({ surfaceBorder: raw }, conf, (issue) =>
      issues.push(issue)
    )

    expect(inline).toEqual({ values: { surfaceBorder: 'orange' }, themes: undefined })
    expect(issues.map((issue) => issue.message)).toEqual([
      `<ThemeUpdate surfaceBorder="${raw}">: "hover:" isn't supported here. Theme values apply to a whole subtree, so only theme (dark:) and platform (ios:) modifiers work`,
      `<ThemeUpdate surfaceBorder="${raw}">: "mystery:" isn't supported here. Theme values apply to a whole subtree, so only theme (dark:) and platform (ios:) modifiers work`,
    ])
  })

  test('a clause naming two themes is refused without losing the base', () => {
    const issues: InlineValueIssue[] = []
    const raw = 'red dark:blue:green'
    const inline = getInlineValuesFromProps({ surfaceBorder: raw }, conf, (issue) =>
      issues.push(issue)
    )

    expect(inline).toEqual({ values: { surfaceBorder: 'red' }, themes: undefined })
    expect(issues.map((issue) => issue.message)).toEqual([
      `<ThemeUpdate surfaceBorder="${raw}">: "dark:blue:" targets two themes at once, which a subtree value can't express. Name the composed theme instead`,
    ])
  })

  test('keeps ThemeUpdate collision priority over the shared direct-style order', () => {
    const collisionConf = {
      ...conf,
      media: { ...conf.media, web: { maxWidth: 1 } },
      themes: {
        ...conf.themes,
        hover: conf.themes.light,
        web: conf.themes.light,
      },
    } as typeof conf
    prepareConfigRevision(collisionConf)
    const issues: InlineValueIssue[] = []

    const inline = getInlineValuesFromProps(
      { surfaceBorder: 'red hover:blue web:orange' },
      collisionConf,
      (issue) => issues.push(issue)
    )

    expect(inline).toEqual({
      values: { surfaceBorder: 'orange' },
      themes: { hover: { surfaceBorder: 'blue' } },
    })
    expect(issues).toEqual([])
  })
})

describe('<ThemeUpdate> values', () => {
  // the provider renders its own root .is_Theme span, so find the one actually
  // carrying an inline layer
  const layerSpan = (container: HTMLElement) =>
    container.querySelector('[class*="tvar_"]') as HTMLElement | null

  const identifierOf = (container: HTMLElement) => {
    const span = layerSpan(container)
    return span ? [...span.classList].find((c) => c.startsWith('tvar_')) : undefined
  }

  test('reuses the opaque update state while values are unchanged', () => {
    const values = { values: { surfaceBorder: 'red' } }
    expect(createThemeUpdateState(values)).toBe(createThemeUpdateState(values))
    expect(createThemeUpdateState({ values: { surfaceBorder: 'red' } })).not.toBe(
      createThemeUpdateState(values)
    )
  })

  test('a plain <Theme> emits no inline layer', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Theme name="dark">
          <View />
        </Theme>
      </TamaguiProvider>
    )
    expect(identifierOf(container)).toBeUndefined()
  })

  test('the removed Theme spelling warns and does not apply', () => {
    const previousNodeEnv = process.env.NODE_ENV
    process.env.NODE_ENV = 'development'
    const warn = vi.spyOn(console, 'warn').mockImplementation(() => {})
    try {
      const LegacyTheme = Theme as any
      const { container } = render(
        <TamaguiProvider config={conf} defaultTheme="light">
          <LegacyTheme surfaceBorder="red">
            <View borderColor="surfaceBorder" />
          </LegacyTheme>
        </TamaguiProvider>
      )
      expect(identifierOf(container)).toBeUndefined()
      expect(warn).toHaveBeenCalledWith(
        expect.stringContaining('Wrap the subtree in <ThemeUpdate surfaceBorder=...>')
      )
    } finally {
      warn.mockRestore()
      process.env.NODE_ENV = previousNodeEnv
    }
  })

  test('theme-key props emit custom properties on the theme span', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder="red">
          <View borderColor="surfaceBorder" />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const identifier = identifierOf(container)!
    expect(identifier).toBeTruthy()
    expect(conf.getCSS()).toContain(
      `:root ${inlineSelector(identifier)} {--surfaceBorder:red;}`
    )
  })

  test('cache keys preserve the value type', async () => {
    const ReadType = () => {
      const theme = useTheme()
      return (
        <span data-testid="inline-value-type">{typeof theme.surfaceBorder?.val}</span>
      )
    }
    const make = (surfaceBorder: string | number) => (
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder={surfaceBorder}>
          <ReadType />
          <View borderColor="surfaceBorder" />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const view = render(make(123.456))
    const numericIdentifier = identifierOf(view.container)!
    expect(view.getByTestId('inline-value-type').textContent).toBe('number')
    expect(conf.getCSS()).toContain(
      `:root ${inlineSelector(numericIdentifier)} {--surfaceBorder:123.456px;}`
    )

    view.rerender(make('123.456'))
    const stringIdentifier = identifierOf(view.container)!
    expect(stringIdentifier).not.toBe(numericIdentifier)
    await waitFor(() => {
      expect(view.getByTestId('inline-value-type').textContent).toBe('string')
    })
  })

  test('a named theme and update use nested spans', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <Theme name="dark">
          <ThemeUpdate surfaceBorder="red">
            <View />
          </ThemeUpdate>
        </Theme>
      </TamaguiProvider>
    )
    const updateSpan = layerSpan(container)!
    expect(updateSpan.className).toContain('is_Theme')
    expect(updateSpan.parentElement?.className).toContain('t_dark')
  })

  test('an inline value overrides the named theme on their shared span', () => {
    const { container } = render(
      <>
        <style>{conf.getCSS()}</style>
        <TamaguiProvider config={conf} defaultTheme="light">
          <Theme name="dark">
            <ThemeUpdate background="#0b2545">
              <View />
            </ThemeUpdate>
          </Theme>
        </TamaguiProvider>
      </>
    )
    const span = layerSpan(container)!
    expect(getComputedStyle(span).getPropertyValue('--background').trim()).toBe('#0b2545')
  })

  test('a theme modifier scopes the value to that theme', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder="red dark:blue blue:green">
          <View />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const identifier = identifierOf(container)!
    const css = conf.getCSS()
    expect(css).toContain(`:root ${inlineSelector(identifier)} {--surfaceBorder:red;}`)
    expect(css).toMatch(
      new RegExp(
        `:root \\.t_dark \\.${identifier}:not\\(#t_theme_full_name\\)[^{]*\\{--surfaceBorder:blue;\\}`
      )
    )
    expect(css).toMatch(
      new RegExp(
        `:root \\.t_blue \\.${identifier}:not\\(#t_theme_full_name\\)[^{]*\\{--surfaceBorder:green;\\}`
      )
    )
  })

  test('platform modifiers resolve for the running platform', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder="red web:orange ios:purple">
          <View />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const identifier = identifierOf(container)!
    const own = conf
      .getCSS()
      .split('\n')
      .filter((rule) => rule.includes(identifier))
      .join('\n')
    expect(own).toContain(`:root ${inlineSelector(identifier)} {--surfaceBorder:orange;}`)
    // the ios: clause contributes nothing on web
    expect(own).not.toContain('purple')
  })

  test('inline values reach JS theme readers', () => {
    const ReadVal = () => {
      const theme = useTheme()
      return <span data-testid="read-flat">{String(theme.surfaceBorder?.val)}</span>
    }
    const make = (value: string) => (
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder={value}>
          <ReadVal />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const view = render(make('rgb(5, 5, 5)'))
    expect(view.getByTestId('read-flat').textContent).toBe('rgb(5, 5, 5)')

    view.rerender(make('rgb(6, 6, 6)'))
    expect(view.getByTestId('read-flat').textContent).toBe('rgb(6, 6, 6)')
    view.unmount()
  })

  test('a scheme modifier follows the resolved scheme for JS readers', () => {
    const ReadVal = () => {
      const theme = useTheme()
      return <span data-testid="read-scheme">{String(theme.surfaceBorder?.val)}</span>
    }
    const make = (scheme: 'light' | 'dark') => (
      <TamaguiProvider config={conf} defaultTheme={scheme}>
        <ThemeUpdate surfaceBorder="rgb(1, 1, 1) dark:rgb(2, 2, 2)">
          <ReadVal />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const light = render(make('light'))
    expect(light.getByTestId('read-scheme').textContent).toBe('rgb(1, 1, 1)')
    light.unmount()

    const dark = render(make('dark'))
    expect(dark.getByTestId('read-scheme').textContent).toBe('rgb(2, 2, 2)')
    dark.unmount()
  })

  test('modifiers a subtree cannot honor are dropped', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder="red hover:blue">
          <View />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const identifier = identifierOf(container)!
    const own = conf
      .getCSS()
      .split('\n')
      .filter((rule) => rule.includes(identifier))
      .join('\n')
    expect(own).toContain(`:root ${inlineSelector(identifier)} {--surfaceBorder:red;}`)
    expect(own).not.toContain('blue')
  })

  test('a colon inside a function is value content, not a modifier', () => {
    const { container } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <ThemeUpdate surfaceBorder="url(http://x/y.png)">
          <View />
        </ThemeUpdate>
      </TamaguiProvider>
    )
    const identifier = identifierOf(container)!
    expect(conf.getCSS()).toContain(
      `:root ${inlineSelector(identifier)} {--surfaceBorder:url(http://x/y.png);}`
    )
  })

  test('warmed caches see theme names and keys added to the same config', () => {
    const current = getConfig()
    const themes = current.themes
    const light = themes.light
    const bucketName = 'themeUpdateGeneration'
    const keyName = '__themeUpdateKey'
    const props = { surfaceBorder: `${bucketName}:blue` }
    const inline = { values: { surfaceBorder: 'red' } }
    const parentTheme = current.themes.light
    const generationBefore = getConfigRevisionState(current)
    const mergedBefore = getMergedInlineTheme(parentTheme, inline, 'light', current)

    expect(getInlineValuesFromProps(props, current)?.themes).toBeUndefined()
    expect(getMergedInlineTheme(parentTheme, inline, 'light', current)).toBe(mergedBefore)
    expect(getMergedInlineTheme(mergedBefore, inline, 'light', current)).toBe(
      mergedBefore
    )

    try {
      updateConfig('themes', {
        [bucketName]: { surfaceBorder: light.surfaceBorder },
      })

      expect(getConfig()).toBe(current)
      expect(current.themes).toBe(themes)
      expect(themes[bucketName]).toBeTruthy()
      expect(getConfigRevisionState(current)).not.toBe(generationBefore)
      expect(getInlineValuesFromProps(props, current)?.themes?.[bucketName]).toEqual({
        surfaceBorder: 'blue',
      })

      const mergedAfter = getMergedInlineTheme(parentTheme, inline, 'light', current)
      expect(mergedAfter).not.toBe(mergedBefore)
      expect(getMergedInlineTheme(mergedAfter, inline, 'light', current)).toBe(
        mergedAfter
      )

      updateConfig('themes', {
        light: { ...light, [keyName]: light.background },
      })

      expect(getConfig()).toBe(current)
      expect(current.themes).toBe(themes)
      expect(
        getMergedInlineTheme(
          parentTheme,
          { values: { [keyName]: '#123' } },
          'light',
          current
        )[keyName]?.val
      ).toBe('#123')
    } finally {
      delete themes[bucketName]
      updateConfig('themes', { light })
    }
  })
})
