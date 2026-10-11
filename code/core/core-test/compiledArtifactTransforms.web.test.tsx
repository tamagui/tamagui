// @vitest-environment node

import { afterEach, beforeEach, expect, test, vi } from 'vitest'

let runtime: typeof import('../web/src')
let config: typeof import('../config-default')
let React: typeof import('react')
let server: typeof import('react-dom/server')

beforeEach(async () => {
  vi.stubEnv('TAMAGUI_TARGET', 'web')
  vi.stubEnv('TAMAGUI_DID_OUTPUT_CSS', '1')
  vi.resetModules()
  ;[runtime, config, React, server] = await Promise.all([
    import('../web/src'),
    import('../config-default'),
    import('react'),
    import('react-dom/server'),
  ])
  expect(runtime.View.staticConfig).toBeDefined()
})

afterEach(() => {
  vi.unstubAllEnvs()
  vi.resetModules()
})

test('compiled artifacts finalize animated transforms inline', () => {
  const { createTamagui, getSplitStyles, View } = runtime
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
})

test('outputCSS retains responsive runtime styles during SSR', () => {
  const { createTamagui, styled, View, TamaguiProvider } = runtime
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
})
