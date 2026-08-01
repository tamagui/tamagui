process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, View, createTamagui } from '@tamagui/core'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { expect, test } from 'vitest'
import { preprocessTailwindClassName } from '../tailwind/src/candidate'

const config = createTamagui(getDefaultTamaguiConfig('native'))

const backgroundColor = (view: any) => {
  const styles = Array.isArray(view.props.style) ? view.props.style : [view.props.style]
  let value: unknown
  for (const style of styles.flat(Number.POSITIVE_INFINITY)) {
    if (style?.backgroundColor !== undefined) value = style.backgroundColor
  }
  return value
}
const host = (screen: ReturnType<typeof render>, testID: string) =>
  screen.root.findAllByProps({ testID }).at(-1)!

test('a group parent marker creates the native context its descendant consumes', async () => {
  const parentProps = preprocessTailwindClassName(
    { testID: 'parent', className: 'group/card' },
    config
  )
  expect(parentProps).toMatchObject({ group: 'card' })
  expect(parentProps).not.toHaveProperty('className')
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View {...parentProps}>
        <View testID="child" backgroundColor="group-press/card:black" />
      </View>
    </TamaguiProvider>
  )

  expect(backgroundColor(host(screen, 'child'))).not.toBe('#000')
  fireEvent(host(screen, 'parent'), 'responderGrant', { nativeEvent: {} })
  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).toBe('#000')
  })
})

test('a container parent marker creates the native context its descendant consumes', async () => {
  const parentProps = preprocessTailwindClassName(
    { testID: 'parent', className: '@container/layout' },
    config
  )
  expect(parentProps).toMatchObject({
    containerName: 'layout',
    containerType: 'inline-size',
  })
  expect(parentProps).not.toHaveProperty('className')
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View {...parentProps}>
        <View testID="child" backgroundColor="@sm/layout:black" />
      </View>
    </TamaguiProvider>
  )

  expect(backgroundColor(host(screen, 'child'))).not.toBe('#000')
  fireEvent(host(screen, 'parent'), 'layout', {
    nativeEvent: {
      layout: { width: 100, height: 100, x: 0, y: 0 },
    },
  })
  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).toBe('#000')
  })
})
