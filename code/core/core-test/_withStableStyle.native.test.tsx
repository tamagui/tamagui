process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  _withStableStyle,
  createTamagui,
  getMedia,
  setMediaState,
  updateMediaListeners,
} from '@tamagui/core'
import { act, render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, test, vi } from 'vitest'

const defaultConfig = getDefaultTamaguiConfig('native')
const config = createTamagui(defaultConfig)

describe('_withStableStyle', () => {
  test('renders correctly with TamaguiProvider', () => {
    const Wrapped = _withStableStyle(
      View,
      (theme) => [
        { width: 100, height: 100, backgroundColor: theme.background?.get?.() ?? 'red' },
      ],
      true
    )

    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toBeTruthy()
  })

  test('does not crash without TamaguiProvider (graceful fallback)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapped = _withStableStyle(View, () => [{ width: 50, height: 50 }], true)

    expect(() => {
      render(<Wrapped />)
    }).not.toThrow()

    warnSpy.mockRestore()
  })

  test('theme values resolve correctly under TamaguiProvider', () => {
    let resolvedBg: any = null

    const Wrapped = _withStableStyle(
      View,
      (theme) => {
        resolvedBg = theme.background?.get?.()
        return [{ backgroundColor: resolvedBg }]
      },
      true
    )

    render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </TamaguiProvider>
    )

    expect(resolvedBg).toBeTruthy()
  })

  test('expressions are passed through correctly', () => {
    let receivedExpressions: any[] = []

    const Wrapped = _withStableStyle(View, (_theme, expressions) => {
      receivedExpressions = expressions
      return [expressions[0] ? { backgroundColor: 'red' } : { backgroundColor: 'blue' }]
    })

    render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Wrapped _expressions={[true, false, 42]} />
      </TamaguiProvider>
    )

    expect(receivedExpressions).toEqual([true, false, 42])
  })

  test('initial-render theme mode updates through context', () => {
    const optimizedConfig = createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        themeOptimize: 'initial-render',
        mediaOptimize: 'initial-render',
      },
    })
    const resolved: any[] = []

    const Wrapped = _withStableStyle(
      View,
      (theme) => {
        const background = theme.background?.get?.()
        resolved.push(background)
        return [{ backgroundColor: background }]
      },
      true
    )

    const tree = render(
      <TamaguiProvider defaultTheme="light" config={optimizedConfig}>
        <Wrapped />
      </TamaguiProvider>
    )

    const light = resolved.at(-1)

    tree.rerender(
      <TamaguiProvider defaultTheme="dark" config={optimizedConfig}>
        <Wrapped />
      </TamaguiProvider>
    )

    expect(resolved.at(-1)).toBeTruthy()
    expect(resolved.at(-1)).not.toBe(light)
  })

  test('initial-render media mode updates through context', () => {
    const optimizedConfig = createTamagui({
      ...defaultConfig,
      settings: {
        ...defaultConfig.settings,
        themeOptimize: 'initial-render',
        mediaOptimize: 'initial-render',
      },
    })
    const resolved: any[] = []
    const initial = { ...getMedia(), sm: false }

    setMediaState(initial as any)

    const Wrapped = _withStableStyle(
      View,
      (_theme, expressions) => {
        resolved.push(expressions[0])
        return [{ opacity: expressions[0] ? 1 : 0.5 }]
      },
      false,
      true
    )

    render(
      <TamaguiProvider defaultTheme="light" config={optimizedConfig}>
        <Wrapped _expressions={['sm']} />
      </TamaguiProvider>
    )

    expect(resolved.at(-1)).toBe(false)

    act(() => {
      setMediaState({ ...getMedia(), sm: true } as any)
      updateMediaListeners()
    })

    expect(resolved.at(-1)).toBe(true)
  })
})
