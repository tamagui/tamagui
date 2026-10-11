// a nameless <Theme forceClassName> adds no theme of its own, it only emits the
// parent's classes. it must keep following its parent: it used to freeze on the
// scheme it first resolved, so a live light -> dark switch left its subtree (and
// its t_light class span) light inside an otherwise dark dialog.
process.env.TAMAGUI_TARGET = 'web'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, Theme, createTamagui, useThemeName } from '@tamagui/core'
import { act, render } from '@testing-library/react'
import { useState } from 'react'
import { describe, expect, test } from 'vitest'

const conf = createTamagui(getDefaultTamaguiConfig())

function NameReader() {
  return <span data-testid="name">{useThemeName()}</span>
}

describe('nameless forceClassName Theme follows a live scheme switch', () => {
  test('descendants and class names see the new scheme', () => {
    let setScheme: (n: 'light' | 'dark') => void = () => {}

    // the children element keeps its identity across the switch, like dialog
    // content handed through a portal, so only the theme listener can update it
    function App({ children }: { children: any }) {
      const [scheme, set] = useState<'light' | 'dark'>('light')
      setScheme = set
      return (
        <Theme name={scheme} forceClassName>
          {children}
        </Theme>
      )
    }

    const { getByTestId } = render(
      <TamaguiProvider config={conf} defaultTheme="light">
        <App>
          <Theme forceClassName>
            <NameReader />
          </Theme>
        </App>
      </TamaguiProvider>
    )
    const schemeOf = () =>
      getByTestId('name')
        .parentElement!.closest('.t_light, .t_dark')!
        .classList.contains('t_dark')
        ? 'dark'
        : 'light'

    expect(getByTestId('name').textContent).toBe('light')
    expect(schemeOf()).toBe('light')

    act(() => setScheme('dark'))
    expect(getByTestId('name').textContent).toBe('dark')
    expect(schemeOf()).toBe('dark')

    act(() => setScheme('light'))
    expect(getByTestId('name').textContent).toBe('light')
    expect(schemeOf()).toBe('light')
  })
})
