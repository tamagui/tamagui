import { Stack } from '@tamagui/core'
import { StackProps } from '@tamagui/core'
import { LinearGradient as LinearGradientNative, LinearGradientProps } from 'expo-linear-gradient'
import { StyleSheet } from 'react-native'

export const LinearGradient = Stack.extractable(
  ({ start, end, colors, ...props }: StackProps & LinearGradientProps) => {
    return (
      <Stack {...props}>
        <LinearGradientNative
          start={start}
          end={end}
          colors={colors}
          style={[StyleSheet.absoluteFill]}
        />
      </Stack>
    )
  }
)
