import React from 'react'
import { XStack, YStack } from 'tamagui'

export function StacksDemo() {
  return (
    <XStack als="center" space>
      <YStack
        elevation={2}
        w={140}
        flex={1}
        space="$2"
        borderWidth={2}
        borderColor="$color"
        br="$2"
        p="$3"
      >
        <YStack bc="$color" br="$2" p="$3" />
        <YStack bc="$color" br="$2" p="$3" />
        <YStack bc="$color" br="$2" p="$3" />
      </YStack>

      <XStack flex={1} space="$2" borderWidth={2} borderColor="$color" br="$2" p="$3">
        <YStack bc="$color" br="$2" p="$3" />
        <YStack bc="$color" br="$2" p="$3" />
        <YStack bc="$color" br="$2" p="$3" />
      </XStack>
    </XStack>
  )
}
