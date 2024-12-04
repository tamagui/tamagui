import { TamaguiProvider, Theme, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { describe, expect, test } from 'vitest'
import { getDefaultTamaguiConfig } from '../config-default'

const defaultConfig = getDefaultTamaguiConfig('native')

const config = createTamagui({
  ...defaultConfig,
  settings: {
    ...defaultConfig.settings,
    fastSchemeChange: true,
  },
})

describe('useTheme', () => {
  test(`nested non-changing scheme with fast scheme change doesn't de-opt`, () => {
    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <View backgroundColor="$background" />
        </Theme>
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "backgroundColor": {
              "dynamic": {
                "dark": "#000",
                "light": "#fff",
              },
            },
          }
        }
      />
    `)
  })

  test(`nested fast scheme change de-opts`, () => {
    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Theme name="dark">
          <View backgroundColor="$background" />
        </Theme>
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        style={
          {
            "backgroundColor": "#000",
          }
        }
      />
    `)
  })
})
