import { TamaguiProvider, Text, Theme, View, createTamagui, styled } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { createRequire } from 'node:module'
import { describe, expect, test, vi } from 'vitest'
import { getDefaultTamaguiConfig } from '../config-default'

// the native test bundle loads react-native through commonjs.
const { Appearance } = createRequire(import.meta.url)('react-native')
const defaultConfig = getDefaultTamaguiConfig('native')

const config = createTamagui({
  ...defaultConfig,
  themes: {
    ...defaultConfig.themes,
    light: { ...defaultConfig.themes.light, canvas: '#ededed', raised: '#e5e5e5' },
    dark: { ...defaultConfig.themes.dark, canvas: '#111111', raised: '#171717' },
  },
  settings: {
    ...defaultConfig.settings,
    fastSchemeChange: true,
  },
})

const ConditionalBackground = styled(View, {
  backgroundColor: 'canvas dark:raised',
})

describe('useTheme', () => {
  test.each(['light', 'dark'] as const)(
    'scheme override preserves the base and resolves token colors in %s appearance',
    (scheme) => {
      const appearance = vi.spyOn(Appearance, 'getColorScheme').mockReturnValue(scheme)
      const tree = render(
        <TamaguiProvider defaultTheme={scheme} config={config}>
          <ConditionalBackground testID="conditional-background" />
        </TamaguiProvider>
      )

      try {
        expect(tree.toJSON()).toMatchObject({
          type: 'View',
          props: {
            testID: 'conditional-background',
            style: {
              backgroundColor: { dynamic: { light: '#ededed', dark: '#171717' } },
            },
          },
        })
      } finally {
        tree.unmount()
        appearance.mockRestore()
      }
    }
  )

  test.each(['light', 'dark'] as const)(
    'compound styles preserve dynamic theme colors in %s appearance',
    (scheme) => {
      const appearance = vi.spyOn(Appearance, 'getColorScheme').mockReturnValue(scheme)
      const tree = render(
        <TamaguiProvider defaultTheme={scheme} config={config}>
          <Text
            backgroundImage="linear-gradient(to bottom, canvas, raised)"
            boxShadow="0px 2px 4px canvas"
            textShadow="0px 1px 2px raised"
          />
        </TamaguiProvider>
      )

      try {
        expect(tree.toJSON()).toMatchObject({
          props: {
            style: {
              experimental_backgroundImage: [
                {
                  type: 'linear-gradient',
                  direction: 'to bottom',
                  colorStops: [
                    { color: { dynamic: { light: '#ededed', dark: '#111111' } } },
                    { color: { dynamic: { light: '#e5e5e5', dark: '#171717' } } },
                  ],
                },
              ],
              boxShadow: [
                {
                  offsetX: 0,
                  offsetY: 2,
                  blurRadius: 4,
                  color: { dynamic: { light: '#ededed', dark: '#111111' } },
                },
              ],
              textShadowColor: { dynamic: { light: '#e5e5e5', dark: '#171717' } },
            },
          },
        })
      } finally {
        tree.unmount()
        appearance.mockRestore()
      }
    }
  )

  test(`nested non-changing scheme with fast scheme change doesn't de-opt`, () => {
    const tree = render(
      <TamaguiProvider defaultTheme="light" config={config}>
        <Theme name="light">
          <View backgroundColor="background" />
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
          <View backgroundColor="background" />
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
            <View backgroundColor="background" />
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
            <View backgroundColor="background" />
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
