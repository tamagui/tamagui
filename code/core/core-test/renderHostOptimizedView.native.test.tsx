process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { TamaguiProvider, Text, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import React, { forwardRef } from 'react'
import { View as NativeView } from 'react-native'
import { afterAll, beforeAll, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))

const CustomHost = forwardRef<any, any>((props, ref) => (
  <NativeView {...props} ref={ref} accessibilityLabel="custom-render-host" />
))

// the real native useChildren early-returns under NODE_ENV=test and reads the
// env at call time, so flip it for this file to exercise the optimized view
const originalNodeEnv = process.env.NODE_ENV
beforeAll(() => {
  process.env.NODE_ENV = 'development'
})
afterAll(() => {
  process.env.NODE_ENV = originalNodeEnv
})

test('precondition: the native view optimization is live', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View />
    </TamaguiProvider>
  )
  // createOptimizedView renders the raw RCTView host; the plain path renders View
  expect(screen.toJSON()).toMatchObject({ type: 'RCTView' })
})

test('a render element wins over the native view optimization', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View render={<CustomHost />}>
        <Text>child</Text>
      </View>
    </TamaguiProvider>
  )
  expect(screen.toJSON()).toMatchObject({
    props: { accessibilityLabel: 'custom-render-host' },
  })
})

test('a render function wins over the native view optimization', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View render={(props: any) => <CustomHost {...props} />}>
        <Text>child</Text>
      </View>
    </TamaguiProvider>
  )
  expect(screen.toJSON()).toMatchObject({
    props: { accessibilityLabel: 'custom-render-host' },
  })
})
