// @vitest-environment node

import { expect, test, vi } from 'vitest'

test('compiled artifacts finalize animated transforms inline', async () => {
  const previousTarget = process.env.TAMAGUI_TARGET
  const previousDidOutputCSS = process.env.TAMAGUI_DID_OUTPUT_CSS
  process.env.TAMAGUI_TARGET = 'web'
  process.env.TAMAGUI_DID_OUTPUT_CSS = '1'
  vi.resetModules()

  try {
    const [{ createTamagui, getSplitStyles, View }, config] = await Promise.all([
      import('../web/src'),
      import('../config-default'),
    ])
    const conf = createTamagui(config.default.getDefaultTamaguiConfig() as any)
    const result = getSplitStyles(
      {
        transition: 'quick',
        x: 50,
        y: 20,
        scale: 1.1,
        rotate: '5deg',
      },
      View.staticConfig,
      conf.themes.light,
      'light',
      { unmounted: false } as any,
      // useComponentState selects inline output for hydrated inline animation drivers.
      { isAnimated: true, noClass: true, resolveValues: 'auto' } as any,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      undefined,
      {
        animations: { quick: '150ms ease' },
        inputStyle: 'css',
        outputStyle: 'inline',
      } as any
    )

    expect(result?.rulesToInsert).toEqual({})
    expect(result?.classNames.transform).toBeUndefined()
    expect(result?.viewProps.style).toMatchObject({
      transform: 'translateX(50px) translateY(20px) scale(1.1) rotate(5deg)',
    })
  } finally {
    if (previousTarget === undefined) delete process.env.TAMAGUI_TARGET
    else process.env.TAMAGUI_TARGET = previousTarget
    if (previousDidOutputCSS === undefined) delete process.env.TAMAGUI_DID_OUTPUT_CSS
    else process.env.TAMAGUI_DID_OUTPUT_CSS = previousDidOutputCSS
    vi.resetModules()
  }
})

test('outputCSS retains responsive runtime styles during SSR', async () => {
  vi.stubEnv('TAMAGUI_TARGET', 'web')
  vi.stubEnv('TAMAGUI_DID_OUTPUT_CSS', '1')
  vi.resetModules()

  try {
    const [{ createTamagui, styled, View, TamaguiProvider }, config, React, server] =
      await Promise.all([
        import('../web/src'),
        import('../config-default'),
        import('react'),
        import('react-dom/server'),
      ])
    const conf = createTamagui(config.default.getDefaultTamaguiConfig() as any)
    const Container = styled(View, {
      marginHorizontal: 'auto',
      paddingHorizontal: '18px lg:7px xl:0',
      width: '100% lg:95% xl:95%',
      maxWidth: 'xl:1300px',
    })
    const html = server.renderToString(
      React.createElement(
        TamaguiProvider,
        { config: conf, defaultTheme: 'light', disableInjectCSS: true },
        React.createElement(Container, { className: 'hr-below' })
      )
    )
    expect(html).toContain('max-width:1300px')
    expect(html).toContain('width:95%')
    expect(html).toContain('padding-inline:7px')
    expect(html).toContain('@media')
    const container = html.match(/<div class="([^"]*hr-below)"[^>]*>/)!
    expect(container).not.toBeNull()
    for (const className of container[1].split(' ')) {
      if (className.startsWith('_')) expect(html).toContain(`.${className}`)
    }
    expect(container[0]).not.toContain('style=')
    expect(html).not.toContain('data-href="tamagui-css"')
  } finally {
    vi.unstubAllEnvs()
    vi.resetModules()
  }
})
