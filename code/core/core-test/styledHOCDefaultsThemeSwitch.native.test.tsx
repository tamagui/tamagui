process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { render } from '@testing-library/react-native'
import { expect, test } from 'vitest'
import { TamaguiProvider, View, createStyledHOC, createTamagui, styled } from '../web/src'

// a styled HOC's own styles (styled(Input, { backgroundColor: 'background' }))
// resolve to values in the wrapper on native, so the wrapper has to follow a
// theme switch itself; memoized, nothing else re-renders it.

const config = createTamagui(getDefaultTamaguiConfig('native'))

const Frame = styled(View, {})
const Wrapped = createStyledHOC(Frame, (props, ref) => <Frame ref={ref} {...props} />)
const Skin = styled(Wrapped, { backgroundColor: 'background' })
const Plain = styled(View, { backgroundColor: 'background' })

const findByTestID = (node: any, id: string): any => {
  if (!node || typeof node !== 'object') return undefined
  if (node.props?.testID === id) return node
  for (const child of node.children || []) {
    const found = findByTestID(child, id)
    if (found) return found
  }
}

test('a styled HOC re-resolves its own theme styles when the theme switches (native)', () => {
  const ui = (theme: string) => (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <View>
        <Plain testID="plain" />
        <Skin testID="skin" />
      </View>
    </TamaguiProvider>
  )
  const { rerender, toJSON } = render(ui('light'))
  const bg = (id: string) => findByTestID(toJSON(), id).props.style.backgroundColor
  expect(bg('skin')).toBe(bg('plain'))
  rerender(ui('dark'))
  expect(bg('plain')).not.toBe(undefined)
  expect(bg('skin')).toBe(bg('plain'))
})
