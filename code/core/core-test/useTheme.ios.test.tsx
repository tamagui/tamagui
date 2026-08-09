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
        ref={[Function]}
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
        ref={[Function]}
        style={
          {
            "backgroundColor": "#000",
          }
        }
      />
    `)
  })

  // a forced sub-scheme deeper than one level: dark_blue keeps its immediate
  // parent's (dark) scheme, so isInverse=false, but the whole subtree is still
  // inverted vs the light root/OS. it must resolve to the concrete forced value,
  // NOT a DynamicColorIOS pair (which iOS resolves by OS appearance = light, and
  // would show the wrong value — here light_blue doesn't exist, so an empty color).
  test(`forced sub-scheme keeping parent scheme still de-opts (dark_blue under light root)`, () => {
    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Theme name="dark">
          <Theme name="blue">
            <View backgroundColor="$background" />
          </Theme>
        </Theme>
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        ref={[Function]}
        style={
          {
            "backgroundColor": "blue",
          }
        }
      />
    `)
  })

  // double-nesting the same scheme (dark under dark) also has isInverse=false on
  // the inner theme, yet is inverted vs the light root — must de-opt to concrete.
  test(`re-forcing the same inverted scheme still de-opts (dark under dark under light root)`, () => {
    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Theme name="dark">
          <Theme name="dark">
            <View backgroundColor="$background" />
          </Theme>
        </Theme>
      </TamaguiProvider>
    )

    expect(tree.toJSON()).toMatchInlineSnapshot(`
      <View
        ref={[Function]}
        style={
          {
            "backgroundColor": "#000",
          }
        }
      />
    `)
  })
})
