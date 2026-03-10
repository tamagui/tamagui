process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, _withStableStyle, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { View } from 'react-native'
import { describe, expect, test, vi } from 'vitest'

const defaultConfig = getDefaultTamaguiConfig('native')
const config = createTamagui(defaultConfig)

describe('_withStableStyle', () => {
  test('renders correctly with TamaguiProvider', () => {
    const Wrapped = _withStableStyle(View, (theme) => [
      { width: 100, height: 100, backgroundColor: theme.background?.get?.() ?? 'red' },
    ])

    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Wrapped />
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toBeTruthy()
  })

  test('does not crash without TamaguiProvider (graceful fallback)', () => {
    const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})

    const Wrapped = _withStableStyle(View, () => [{ width: 50, height: 50 }])

    expect(() => {
      render(<Wrapped />)
    }).not.toThrow()

    warnSpy.mockRestore()
  })

  test('theme values resolve correctly under TamaguiProvider', () => {
    let resolvedBg: any = null

    const Wrapped = _withStableStyle(View, (theme) => {
      resolvedBg = theme.background?.get?.()
      return [{ backgroundColor: resolvedBg }]
    })

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
})
