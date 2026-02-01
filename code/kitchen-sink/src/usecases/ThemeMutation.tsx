import React from 'react'
import { addTheme, updateTheme } from '@tamagui/theme'
import { Button, Square, Text, Theme, YStack, useIsomorphicLayoutEffect } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

/**
 * Test case for theme mutation with DynamicColorIOS optimization.
 *
 * This tests that when updateTheme() is called, components correctly
 * re-render to show the new theme values - even when using DynamicColorIOS
 * optimization on iOS (which normally avoids tracking theme keys).
 *
 * The fix ensures forceUpdateThemes() properly triggers re-renders
 * regardless of whether theme keys were tracked.
 */
export function ThemeMutation() {
  const [themeName, setThemeName] = React.useState<string | null>(null)
  const [currentColor, setCurrentColor] = React.useState('red')

  // Create the custom theme on mount
  useIsomorphicLayoutEffect(() => {
    addTheme({
      name: 'mutation-test',
      insertCSS: true,
      theme: {
        background: 'red',
      },
    })
    setThemeName('mutation-test')
  }, [])

  const colors = ['red', 'blue', 'green', 'purple', 'orange'] as const

  const cycleColor = () => {
    const currentIndex = colors.indexOf(currentColor as (typeof colors)[number])
    const nextIndex = (currentIndex + 1) % colors.length
    const nextColor = colors[nextIndex]

    updateTheme({
      name: 'mutation-test',
      theme: {
        background: nextColor,
      },
    })

    // Update state to track what color we expect
    // Note: We do NOT call useForceUpdate() here - the fix should make
    // forceUpdateThemes() (called internally by updateTheme) work properly
    setCurrentColor(nextColor)
  }

  if (!themeName) {
    return (
      <YStack padding="$4" alignItems="center" gap="$4">
        <Text>Loading theme...</Text>
      </YStack>
    )
  }

  return (
    <YStack padding="$4" alignItems="center" gap="$4">
      <Text testID={TEST_IDS.themeMutationColorText}>Expected color: {currentColor}</Text>

      <Theme name={themeName as any}>
        <Square
          testID={TEST_IDS.themeMutationSquare}
          size={100}
          backgroundColor="$background"
          borderRadius="$4"
        />
      </Theme>

      <Button testID={TEST_IDS.themeMutationButton} onPress={cycleColor}>
        Change Theme Color
      </Button>
    </YStack>
  )
}
