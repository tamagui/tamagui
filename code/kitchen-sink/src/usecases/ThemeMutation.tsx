import React from 'react'
import { Linking, Pressable } from 'react-native'
import { addTheme, updateTheme } from '@tamagui/theme'
import { Square, Text, Theme, YStack, useIsomorphicLayoutEffect } from 'tamagui'

import { TEST_IDS } from '../constants/test-ids'

const colors = ['red', 'blue', 'green', 'purple', 'orange'] as const

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
  const currentColorRef = React.useRef<(typeof colors)[number]>('red')

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

  const cycleColor = React.useCallback(() => {
    const currentIndex = colors.indexOf(currentColorRef.current)
    const nextIndex = (currentIndex + 1) % colors.length
    const nextColor = colors[nextIndex]

    currentColorRef.current = nextColor

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
  }, [])

  React.useEffect(() => {
    const sub = Linking.addEventListener('url', ({ url }) => {
      if (url.includes('theme-mutation-next')) {
        cycleColor()
      }
    })
    return () => sub.remove()
  }, [cycleColor])

  if (!themeName) {
    return (
      <YStack flex={1} width="100%" padding="$4" alignItems="center" justifyContent="center" gap="$4">
        <Text>Loading theme...</Text>
      </YStack>
    )
  }

  return (
    <YStack flex={1} width="100%" padding="$4" alignItems="center" justifyContent="center" gap="$4">
      <Text testID={TEST_IDS.themeMutationColorText}>Expected color: {currentColor}</Text>

      <Theme name={themeName as any}>
        <Square
          testID={TEST_IDS.themeMutationSquare}
          size={100}
          backgroundColor="$background"
          borderRadius="$4"
        />
      </Theme>

      <Pressable
        key={currentColor}
        testID={TEST_IDS.themeMutationButton}
        accessibilityRole="button"
        onPress={cycleColor}
        style={({ pressed }) => ({
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: 48,
          minWidth: 220,
          borderRadius: 12,
          paddingHorizontal: 16,
          backgroundColor: pressed ? '#d4d4d4' : '#e9e9e9',
        })}
      >
        <Text>Change Theme Color</Text>
      </Pressable>
    </YStack>
  )
}
