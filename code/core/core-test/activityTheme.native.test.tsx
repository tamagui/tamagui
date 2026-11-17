process.env.TAMAGUI_TARGET = 'native'

import React, { Activity } from 'react'
import { Text } from 'react-native'
import { act, render, screen } from '@testing-library/react-native'
import { TamaguiProvider, createTamagui, useTheme } from '../web/src'
import { expect, test } from 'vitest'

const LIGHT = '#111111'
const DARK = '#eeeeee'
const config = createTamagui({
  tokens: { color: {}, space: {}, size: {}, radius: {}, zIndex: {} },
  themes: { light: { color: LIGHT }, dark: { color: DARK } },
})

const Leaf = React.memo(function Leaf() {
  const theme = useTheme()
  return (
    <Text testID="leaf" style={{ color: theme.color.get() }}>
      leaf
    </Text>
  )
})

function Scene({ theme, mode }: { theme: string; mode: 'visible' | 'hidden' }) {
  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Activity mode={mode}>
        <Leaf />
      </Activity>
    </TamaguiProvider>
  )
}

function colorAfter(steps: React.ComponentProps<typeof Scene>[]) {
  const [first, ...rest] = steps
  const view = render(<Scene {...first} />)
  for (const step of rest) view.rerender(<Scene {...step} />)
  act(() => undefined)
  return screen.getByTestId('leaf', { includeHiddenElements: true }).props.style.color
}

test('a visible memoised theme consumer updates', () => {
  expect(
    colorAfter([
      { theme: 'light', mode: 'visible' },
      { theme: 'dark', mode: 'visible' },
    ])
  ).toBe(DARK)
})

test('a memoised theme consumer catches changes while its Activity is hidden', () => {
  expect(
    colorAfter([
      { theme: 'light', mode: 'visible' },
      { theme: 'light', mode: 'hidden' },
      { theme: 'dark', mode: 'hidden' },
      { theme: 'dark', mode: 'visible' },
    ])
  ).toBe(DARK)
})
