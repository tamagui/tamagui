import React from 'react'
import { Button, Text, Theme, Variables, View, YStack } from 'tamagui'

// module-level so the memoized child can prove it never re-renders while
// Variables patches and scheme flips restyle it via CSS custom properties
const counts = { child: 0 }

const PatchedChild = React.memo(() => {
  counts.child++
  return (
    <YStack gap="$2">
      <Text testID="vars-render-count">{counts.child}</Text>
      <View testID="vars-square" width={80} height={40} backgroundColor="$caseAccent" />
      <View
        testID="vars-inherit-square"
        width={80}
        height={40}
        backgroundColor="$background"
      />
      <Variables values={{ caseAccent: 'rgb(1, 2, 3)' }}>
        <View
          testID="vars-nested-square"
          width={80}
          height={40}
          backgroundColor="$caseAccent"
        />
      </Variables>
      <Theme name="dark">
        <View
          testID="vars-reset-square"
          width={80}
          height={40}
          backgroundColor="$background"
        />
      </Theme>
    </YStack>
  )
})

export function VariablesCase() {
  const [patched, setPatched] = React.useState(false)
  const [scheme, setScheme] = React.useState<'light' | 'dark'>('light')

  return (
    <YStack gap="$4" padding="$4">
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
        <Variables
          values={patched ? { caseAccent: 'rgb(200, 0, 0)' } : undefined}
          dark={patched ? { caseAccent: 'rgb(200, 100, 100)' } : undefined}
        >
          <PatchedChild />
        </Variables>
      </Theme>
    </YStack>
  )
}
