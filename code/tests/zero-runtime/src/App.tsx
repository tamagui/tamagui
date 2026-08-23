import { useState } from 'react'
import { styled, Text, Theme, View } from 'tamagui'
import { ThemeUpdate } from 'tamagui/theme-update'
import SheetIsland from '../.tamagui/zero/SheetIsland.loader'

// app-local styled definition in a module with another live export: the styled
// scoping probe. `Card` is used only in lowered JSX.
const Card = styled(View, {
  name: 'ZeroCard',
  backgroundColor: '#1d4ed8',
  padding: 16,
  borderRadius: 8,
})

export const appTitle = 'zero-runtime fixture'

export function App() {
  // ordinary React state. The zero graph has no theme runtime, so switching
  // themes is a condition the compiler enumerates, not a subscription.
  const [dark, setDark] = useState(false)

  return (
    <View data-testid="zero-root" padding={24} gap={12}>
      <Text data-testid="zero-text" color="#111827" fontSize={20}>
        {appTitle}
      </Text>
      <Card data-testid="zero-card" />

      {/* static light/dark switching: one conditional over literal theme names */}
      <button data-testid="theme-toggle" onClick={() => setDark((on) => !on)}>
        toggle
      </button>
      <Theme name={dark ? 'dark' : 'light'}>
        <View
          data-testid="switch-child"
          backgroundColor="$background"
          width={16}
          height={16}
        />
      </Theme>

      {/* nested static themes: level2 composes against the scheme above it */}
      <Theme name="dark">
        <View
          data-testid="nested-outer"
          backgroundColor="$background"
          width={16}
          height={16}
        />
        <Theme name="level2">
          <View
            data-testid="nested-inner"
            backgroundColor="$background"
            width={16}
            height={16}
          />
        </Theme>
      </Theme>

      {/* one authored theme value with a theme modifier, placed under both
          schemes: same class, two static rules, no runtime theme read */}
      <Theme name="light">
        <ThemeUpdate background="#112233 dark:#445566">
          <View
            data-testid="modifier-light"
            backgroundColor="$background"
            width={16}
            height={16}
          />
        </ThemeUpdate>
      </Theme>
      <Theme name="dark">
        <ThemeUpdate background="#112233 dark:#445566">
          <View
            data-testid="modifier-dark"
            backgroundColor="$background"
            width={16}
            height={16}
          />
        </ThemeUpdate>
      </Theme>

      <Theme name="dark">
        <ThemeUpdate background="#0b2545">
          <View data-testid="zero-theme-child" padding={8}>
            <SheetIsland data-testid="island-mount" />
          </View>
        </ThemeUpdate>
      </Theme>
    </View>
  )
}
