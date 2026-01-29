import { useState } from 'react'
import { Button, Text, Theme, YStack } from 'tamagui'

/**
 * Basic theme change test - no animations involved.
 * Tests that <Theme name="X"> correctly updates child styling when X changes.
 *
 * This is the simplest possible theme change scenario:
 * 1. View with bg="$color4" inside Theme
 * 2. Button to toggle theme between "red" and "blue"
 * 3. View color should change accordingly
 *
 * Bug report: with react-native and reanimated animation drivers,
 * the theme change does not visually update. The verbose log shows:
 * useTheme(«id») getNextState => null needsUpdate false shouldRerender false
 */
export function ThemeChangeBasic() {
  const [themeName, setThemeName] = useState<'red' | 'blue'>('red')

  return (
    <YStack padding="$4" gap="$4" alignItems="center" testID="theme-change-basic-root">
      <Text testID="theme-change-basic-label">Current theme: {themeName}</Text>

      <Button
        testID="theme-change-basic-toggle"
        onPress={() => setThemeName((t) => (t === 'red' ? 'blue' : 'red'))}
      >
        Toggle Theme
      </Button>

      <Theme name={themeName}>
        {/*
          This exact pattern was reported as broken with native/reanimated drivers.
          The YStack's bg="$color4" should change color when theme changes.
        */}
        <YStack
          testID="theme-change-basic-square"
          width={200}
          height={200}
          alignItems="center"
          justifyContent="center"
          backgroundColor="$color4"
          borderRadius={14}
        >
          <Text color="$color12" fontWeight="bold">
            {themeName.toUpperCase()}
          </Text>
        </YStack>
      </Theme>
    </YStack>
  )
}
