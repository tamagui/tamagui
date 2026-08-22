import React from 'react'
import { Button, Text, Theme, View, YStack } from 'tamagui'

// module-level so the memoized child can prove it never re-renders while
// inline theme values and scheme flips restyle it via CSS custom properties
const counts = { child: 0 }

const PatchedChild = React.memo(() => {
  counts.child++
  return (
    <YStack gap="2">
      <Text testID="vars-render-count">{counts.child}</Text>
      <View testID="vars-square" width={80} height={40} backgroundColor="caseAccent" />
      <View
        testID="vars-inherit-square"
        width={80}
        height={40}
        backgroundColor="background"
      />
      <Theme caseAccent="rgb(1, 2, 3)">
        <View
          testID="vars-nested-square"
          width={80}
          height={40}
          backgroundColor="caseAccent"
        />
      </Theme>
      <Theme name="dark">
        <View
          testID="vars-reset-square"
          width={80}
          height={40}
          backgroundColor="background"
        />
      </Theme>
      <Theme name="blue">
        <Theme caseAccent="blue:rgb(7, 7, 77)">
          <View
            testID="vars-themed-square"
            width={80}
            height={40}
            backgroundColor="caseAccent"
          />
        </Theme>
      </Theme>
    </YStack>
  )
})

export function ThemeUpdateCase() {
  const [patched, setPatched] = React.useState(false)
  const [scheme, setScheme] = React.useState<'light' | 'dark'>('light')

  return (
    <YStack gap="4" padding="4">
      <Button testID="vars-toggle-patch" onPress={() => setPatched(!patched)}>
        toggle patch
      </Button>
      <Button
        testID="vars-toggle-scheme"
        onPress={() => setScheme(scheme === 'light' ? 'dark' : 'light')}
      >
        toggle scheme
      </Button>
      <Theme name={scheme}>
        <Theme
          caseAccent={patched ? 'rgb(200, 0, 0) dark:rgb(200, 100, 100)' : undefined}
        >
          <PatchedChild />
        </Theme>
      </Theme>
    </YStack>
  )
}
