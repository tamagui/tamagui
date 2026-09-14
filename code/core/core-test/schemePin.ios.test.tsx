import { TamaguiProvider, Theme, View, createTamagui } from '@tamagui/core'
import { render } from '@testing-library/react-native'
import { createRequire } from 'node:module'
import { describe, expect, test, vi } from 'vitest'
import { defaultConfig as v6 } from '../config/src/v6'

const { Appearance } = createRequire(import.meta.url)('react-native')

// fastSchemeChange is what lets ios hand back a DynamicColorIOS pair instead of a
// concrete color, so it has to be on for any of this to be observable.
const config = createTamagui({
  ...v6,
  settings: { ...v6.settings, fastSchemeChange: true },
})

const LIGHT_BG = '#faf9fb'
const DARK_BG = '#1c1b1e'

function backgroundOf(
  name: string,
  osScheme: 'light' | 'dark',
  rootTheme: 'light' | 'dark'
) {
  const appearance = vi.spyOn(Appearance, 'getColorScheme').mockReturnValue(osScheme)
  try {
    const tree = render(
      <TamaguiProvider defaultTheme={rootTheme} config={config}>
        <Theme name={name as any}>
          <View testID="probe" backgroundColor="background" />
        </Theme>
      </TamaguiProvider>
    )
    const style = (tree.toJSON() as any).props.style
    tree.unmount()
    return style.backgroundColor
  } finally {
    appearance.mockRestore()
  }
}

// DynamicColorIOS resolves by the OS appearance, never by the theme the element
// sits in. When a subtree still follows the OS, tamagui hands ios that pair so a
// scheme change costs no re-render. The pair is built by swapping the scheme in
// the theme name, so what lands in the opposite half is what decides whether a
// forced scheme survives the user changing their phone's appearance.
describe('scheme pinning on ios', () => {
  // `dark` names the scheme, so its opposite half is the light theme. a subtree
  // forced to `dark` on a dark phone therefore turns white the moment the OS
  // flips, with no re-render to correct it.
  test('light and dark follow the OS when the root already matches it', () => {
    expect(backgroundOf('dark', 'dark', 'dark')).toEqual({
      dynamic: { dark: DARK_BG, light: LIGHT_BG },
    })
    expect(backgroundOf('light', 'light', 'light')).toEqual({
      dynamic: { light: LIGHT_BG, dark: DARK_BG },
    })
  })

  // black and white dedupe onto a single theme, so swapping the scheme in the
  // name lands back on that same theme: `light_black` IS `dark`. Both halves of
  // the pair come out equal, which is what makes them immune to the OS.
  test('black and white pin their scheme in both halves of the pair', () => {
    for (const osScheme of ['light', 'dark'] as const) {
      for (const rootTheme of ['light', 'dark'] as const) {
        const black = backgroundOf('black', osScheme, rootTheme)
        const white = backgroundOf('white', osScheme, rootTheme)
        // either a concrete string or a pair whose halves agree, never a pair
        // that would repaint when the phone's appearance changes
        for (const half of Object.values((black as any).dynamic ?? { only: black })) {
          expect(half).toBe(DARK_BG)
        }
        for (const half of Object.values((white as any).dynamic ?? { only: white })) {
          expect(half).toBe(LIGHT_BG)
        }
      }
    }
  })
})
