process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

const host = (screen: ReturnType<typeof render>, testID: string) =>
  screen.root.findAll((node) => node.props.testID === testID).at(-1)!

const backgroundColor = (view: any) => {
  const styles = Array.isArray(view.props.style) ? view.props.style : [view.props.style]
  let value: unknown
  for (const style of styles.flat(Number.POSITIVE_INFINITY)) {
    if (style?.backgroundColor !== undefined) value = style.backgroundColor
  }
  return value
}

test('native rendering resolves legacy token sigils in both program positions', async () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View>
        <View testID="prefixed-base" backgroundColor="$white press:black" />
        <View testID="prefixed-clause" backgroundColor="white press:$black" />
      </View>
    </TamaguiProvider>
  )

  const base = host(screen, 'prefixed-base')
  const clause = host(screen, 'prefixed-clause')
  expect(backgroundColor(base)).toBe('#fff')
  expect(backgroundColor(clause)).toBe('#fff')

  fireEvent(base, 'responderGrant', { nativeEvent: {} })
  fireEvent(clause, 'responderGrant', { nativeEvent: {} })

  await waitFor(() => {
    expect(backgroundColor(host(screen, 'prefixed-base'))).toBe('#000')
    expect(backgroundColor(host(screen, 'prefixed-clause'))).toBe('#000')
  })
})
