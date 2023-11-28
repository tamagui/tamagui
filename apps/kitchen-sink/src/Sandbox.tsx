// debug
// import './wdyr'

import { Text } from '@tamagui/core'
import { View } from 'react-native'
import { XStack, YStack } from 'tamagui'

export const Sandbox = () => {
  return (
    <View style={{ width: '100%', height: '100%', padding: 50 }}>
      <>
        <Text color="unset">test me</Text>
        <YStack pos="relative">
          {/* @ts-expect-error */}
          <XStack pos="absolute" margin="$8" inset={5}></XStack>
        </YStack>
      </>
    </View>
  )
}
