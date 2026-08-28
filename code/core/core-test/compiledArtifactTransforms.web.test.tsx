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
      { isAnimated: true, noClass: false, resolveValues: 'auto' } as any,
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
