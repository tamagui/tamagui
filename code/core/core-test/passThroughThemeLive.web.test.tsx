// a passThrough <Theme> (Dialog renders one while adapted to a Sheet) must keep
// following its parent. before this was fixed it froze on its first state, so a
// live light -> dark switch left everything below it reading 'light', and the
// adapted sheet content re-established that stale name inside the portal.
process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, Theme, createTamagui, useThemeName } from '@tamagui/core'
import { act, render } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

// mirrors Dialog's PassthroughTheme while adapted
function PassthroughTheme({ children }: { children: any }) {
  const themeName = useThemeName()
  return (
    <Theme passThrough name={themeName} forceClassName>
      {children}
    </Theme>
  )
}

function NameReader() {
  return <span data-testid="name">{useThemeName()}</span>
}

describe('passThrough Theme follows a live scheme switch', () => {
  test('descendants of a passThrough Theme see the new scheme', () => {
    let setScheme: (n: 'light' | 'dark') => void = () => {}

    function App() {
      const [scheme, set] = useState<'light' | 'dark'>('light')
      setScheme = set
      return (
        <Theme name={scheme}>
          <PassthroughTheme>
            <NameReader />
          </PassthroughTheme>
        </Theme>
      )
    }

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <App />
      </TamaguiProvider>
    )
    expect(getByTestId('name').textContent).toBe('light')

    act(() => setScheme('dark'))
    expect(getByTestId('name').textContent).toBe('dark')

    act(() => setScheme('light'))
    expect(getByTestId('name').textContent).toBe('light')
  })
})
