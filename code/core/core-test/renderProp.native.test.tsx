process.env.TAMAGUI_TARGET = 'native'

import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import {
  TamaguiProvider,
  Text,
  View,
  createTamagui,
  hooks,
  setupHooks,
} from '@tamagui/core'
import { render } from '@testing-library/react-native'
import React, { forwardRef } from 'react'
import { View as NativeView } from 'react-native'
import { afterAll, beforeAll, expect, test } from 'vitest'

const config = createTamagui(getDefaultTamaguiConfig('native'))
const originalUseChildren = hooks.useChildren

const CustomHost = forwardRef<any, React.ComponentProps<typeof NativeView>>(
  (props, ref) => (
    <NativeView {...props} ref={ref} accessibilityLabel="custom-render-host" />
  )
)

beforeAll(() => {
  setupHooks({
    useChildren(elementType, children, viewProps) {
      return React.createElement(elementType, viewProps, children)
    },
  })
})

afterAll(() => {
  setupHooks({ useChildren: originalUseChildren })
})

test('native view optimization uses the custom render host', () => {
  const screen = render(
    <TamaguiProvider config={config} defaultTheme="light">
      <View render={<CustomHost />}>
        <Text>Custom host child</Text>
      </View>
    </TamaguiProvider>
  )

  expect(screen.toJSON()).toMatchObject({
    props: {
      'aria-label': 'custom-render-host',
    },
  })
})
