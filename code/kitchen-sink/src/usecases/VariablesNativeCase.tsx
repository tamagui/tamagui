import React from 'react'
import { Appearance } from 'react-native'
import { Text, useTheme, useThemeName, Variables, View, YStack } from 'tamagui'

// unwrapped by any <Theme> so the subtree follows the OS scheme — required to
// exercise the DynamicColorIOS fast path (inverses must be 0). detox asserts
// the text values across patch toggles and simulator appearance flips.
const ReadValues = () => {
  const theme = useTheme()
  const themeName = useThemeName()
  const accentDynamic = theme.caseAccent?.get?.()
  const surfaceDynamic = theme.caseSurface?.get?.()
  const isDynamic = (value: unknown) =>
    !!(value && typeof value === 'object' && 'dynamic' in (value as object))
  return (
    <YStack gap="$2">
      <Text testID="vars-native-env">{`env:${themeName}/${String(Appearance.getColorScheme())}`}</Text>
      <Text testID="vars-native-val">{`val:${String(theme.caseAccent?.val)}`}</Text>
      <Text testID="vars-native-dynamic">{`dynamic:${isDynamic(accentDynamic)}`}</Text>
      <Text testID="vars-native-ref-val">{`ref:${String(theme.caseSurface?.val)}`}</Text>
      <Text testID="vars-native-ref-dynamic">{`refDynamic:${isDynamic(surfaceDynamic)}`}</Text>
      <View
        testID="vars-native-square"
        width={80}
        height={40}
        backgroundColor="$caseAccent"
      />
    </YStack>
  )
}

export function VariablesNativeCase() {
  const [patched, setPatched] = React.useState(false)
  return (
    <YStack gap="$4" padding="$4">
      <View
        testID="vars-native-toggle"
        onPress={() => setPatched(!patched)}
        padding="$3"
        backgroundColor="#ddd"
      >
        <Text color="#000">toggle patch</Text>
      </View>
      <Variables
        values={
          patched ? { caseAccent: 'rgb(200, 0, 0)', caseSurface: '$color' } : undefined
        }
        dark={patched ? { caseAccent: 'rgb(200, 100, 100)' } : undefined}
      >
        <ReadValues />
      </Variables>
    </YStack>
  )
}
