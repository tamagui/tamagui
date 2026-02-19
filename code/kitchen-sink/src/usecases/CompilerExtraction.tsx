// debug
/**
 * Tests compiler extraction with various scenarios:
 * - Simple extraction (static values)
 * - Advanced extraction ($color tokens)
 * - Light/dark mode switching
 * - Sub-theme changes
 *
 * The "// debug" comment above enables extraction debug output during build.
 * If extraction is working, the build output will show optimized styles.
 */

import { useState } from 'react'
import { Button, Text, Theme, XStack, YStack, useThemeName } from 'tamagui'

// simple extracted component - static values only
function SimpleBox() {
  return (
    <YStack
      testID="compiler-simple-box"
      width={100}
      height={100}
      padding="$4"
      borderRadius={8}
      backgroundColor="$background"
    />
  )
}

// advanced extracted component - uses $colorN tokens
function AdvancedBox() {
  return (
    <YStack
      testID="compiler-advanced-box"
      width={100}
      height={100}
      padding="$4"
      borderRadius={8}
      backgroundColor="$color4"
      borderColor="$color8"
      borderWidth={2}
    >
      <Text testID="compiler-advanced-text" color="$color12" fontSize="$3">
        Token
      </Text>
    </YStack>
  )
}

// sub-themed component
function SubThemedBox({ themeName }: { themeName: string }) {
  return (
    <Theme name={themeName as any}>
      <YStack
        testID="compiler-subtheme-box"
        width={100}
        height={100}
        padding="$4"
        borderRadius={8}
        backgroundColor="$color4"
      >
        <Text testID="compiler-subtheme-text" color="$color12" fontSize="$2">
          {themeName}
        </Text>
      </YStack>
    </Theme>
  )
}

// displays current theme info
function ThemeInfo() {
  const themeName = useThemeName()
  return (
    <Text testID="compiler-theme-name" fontSize="$4">
      Theme: {themeName}
    </Text>
  )
}

export function CompilerExtraction() {
  const [isDark, setIsDark] = useState(false)
  const [subTheme, setSubTheme] = useState<'red' | 'blue' | 'green'>('red')

  const toggleTheme = () => setIsDark((d) => !d)
  const cycleSubTheme = () => {
    setSubTheme((t) => {
      if (t === 'red') return 'blue'
      if (t === 'blue') return 'green'
      return 'red'
    })
  }

  return (
    <Theme name={isDark ? 'dark' : 'light'}>
      <YStack
        testID="compiler-extraction-root"
        flex={1}
        padding="$4"
        gap="$4"
        backgroundColor="$background"
      >
        <ThemeInfo />

        <Text testID="compiler-mode-label" fontSize="$3">
          Mode: {isDark ? 'dark' : 'light'}
        </Text>

        <XStack gap="$4" flexWrap="wrap">
          <Button testID="compiler-toggle-mode" onPress={toggleTheme}>
            Toggle Light/Dark
          </Button>
          <Button testID="compiler-cycle-subtheme" onPress={cycleSubTheme}>
            Cycle Sub-Theme
          </Button>
        </XStack>

        <Text fontSize="$3" marginTop="$2">
          Simple extraction (static):
        </Text>
        <SimpleBox />

        <Text fontSize="$3" marginTop="$2">
          Advanced extraction ($colorN):
        </Text>
        <AdvancedBox />

        <Text testID="compiler-subtheme-label" fontSize="$3" marginTop="$2">
          Sub-theme ({subTheme}):
        </Text>
        <SubThemedBox themeName={subTheme} />
      </YStack>
    </Theme>
  )
}
