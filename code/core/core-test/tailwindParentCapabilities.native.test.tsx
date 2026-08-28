process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { matchMedia as matchNativeMedia } from '@tamagui/react-native-media-driver'
import {
  TamaguiProvider as CoreTamaguiProvider,
  View as CoreView,
  configureMedia as configureCoreMedia,
  createTamagui as createCoreTamagui,
  setupMatchMedia as setupCoreMatchMedia,
} from '@tamagui/core'
import { TamaguiProvider, createTamagui } from '@tamagui/web/internal-runtime'
import { fireEvent, render, waitFor } from '@testing-library/react-native'
import { Dimensions } from 'react-native'
import { expect, test, vi } from 'vitest'
import { View as TailwindView } from '../tailwind/src'
import { splitTailwindStyles } from '../tailwind/src/__tests__/utils'

const RuntimeView = TailwindView as any

vi.spyOn(Dimensions, 'get').mockReturnValue({
  width: 390,
  height: 844,
  scale: 3,
  fontScale: 1,
})

const config = createTamagui(getDefaultTamaguiConfig('native'))
const coreConfig = createCoreTamagui(getDefaultTamaguiConfig('native'))

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
  expect(
    TailwindView.staticConfig.styleFrontend.getClassPlan('group/card', config)
  ).toEqual({
    entries: [['group', 'card']],
    preserveRawClass: false,
  })
  expect(splitTailwindStyles(TailwindView, { className: 'group/card' })).toMatchObject({
    frontendGroup: 'card',
  })
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <RuntimeView testID="parent" className="group/card">
        <RuntimeView testID="child" backgroundColor="group-press/card:black" />
      </RuntimeView>
    </TamaguiProvider>
  )

  expect(host(screen, 'parent').props.onLayout).toBeUndefined()
  expect(backgroundColor(host(screen, 'child'))).not.toBe('#000')
  await waitFor(() => {
    expect(host(screen, 'parent').props.onResponderGrant).toBeTypeOf('function')
  })
  fireEvent(host(screen, 'parent'), 'responderGrant', { nativeEvent: {} })
  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).toBe('#000')
  })
})

test('a container parent marker re-evaluates its descendant after layout changes', async () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <RuntimeView testID="parent" className="@container/layout">
        <RuntimeView testID="child" backgroundColor="@sm/layout:black" />
      </RuntimeView>
    </TamaguiProvider>
  )

  expect(backgroundColor(host(screen, 'child'))).not.toBe('#000')
  fireEvent(host(screen, 'parent'), 'layout', {
    nativeEvent: {
      layout: { width: 1000, height: 100, x: 0, y: 0 },
    },
  })
  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).not.toBe('#000')
  })

  fireEvent(host(screen, 'parent'), 'layout', {
    nativeEvent: {
      layout: { width: 100, height: 100, x: 0, y: 0 },
    },
  })
  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).toBe('#000')
  })
})

test('a media clause resolves against native window dimensions', async () => {
  setupCoreMatchMedia(matchNativeMedia)
  configureCoreMedia(coreConfig)

  const screen = render(
    <CoreTamaguiProvider config={coreConfig} defaultTheme="light">
      <CoreView testID="child" backgroundColor="red sm:black" />
    </CoreTamaguiProvider>
  )

  await waitFor(() => {
    expect(backgroundColor(host(screen, 'child'))).toBe('#000')
  })
})
