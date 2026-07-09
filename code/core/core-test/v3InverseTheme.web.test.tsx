process.env.TAMAGUI_TARGET = 'web'

import { TamaguiProvider, Theme, View, createTamagui } from '@tamagui/core'
import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { act } from 'react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, beforeAll, describe, expect, test, vi } from 'vitest'
import { themes as generatedV3Themes } from '../themes/src/generated-v3'
import { themes as v3Themes, tokens as v3Tokens } from '../themes/src/v3-themes'

const config = createTamagui({
  ...getDefaultTamaguiConfig('web'),
  themes: generatedV3Themes,
  tokens: v3Tokens,
})

const inverseTree = (
  <TamaguiProvider config={config} defaultTheme="light">
    <Theme name="inverse">
      <View backgroundColor="$background" />
    </Theme>
  </TamaguiProvider>
)

beforeAll(() => {
  ;(globalThis as any).IS_REACT_ACT_ENVIRONMENT = true
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('v3 inverse sub-themes', () => {
  test('generate concrete inverse themes from the opposite scheme palette', () => {
    expect(v3Themes.light_inverse.background).toBe(v3Themes.dark.background)
    expect(v3Themes.dark_inverse.background).toBe(v3Themes.light.background)
    expect(generatedV3Themes.light_inverse.background).toBe(v3Themes.dark.background)
    expect(generatedV3Themes.dark_inverse.background).toBe(v3Themes.light.background)
  })

  test('render inverse as a server HTML theme class', () => {
    const html = renderToString(inverseTree)

    expect(html).toContain('t_inverse')
  })

  test('hydrate inverse server HTML without a mismatch', async () => {
    const html = renderToString(inverseTree)
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    let root: ReturnType<typeof hydrateRoot>

    await act(async () => {
      root = hydrateRoot(container, inverseTree)
      await Promise.resolve()
    })

    expect(consoleError).not.toHaveBeenCalled()
    expect(container.innerHTML).toContain('t_inverse')

    await act(async () => {
      root.unmount()
    })

    container.remove()
  })
})
