import React from 'react'
import { XStack, YStack } from 'tamagui'

export function StacksDemo() {
  return (
    <XStack als="center" spacing>
      <YStack w={140} flex={1} spacing="$2" borderWidth={2} borderColor="#fff" br="$2" p="$3">
        <YStack bc="#fff" br="$2" p="$3" />
        <YStack bc="#fff" br="$2" p="$3" />
        <YStack bc="#fff" br="$2" p="$3" />
      </YStack>

      <XStack flex={1} spacing="$2" borderWidth={2} borderColor="#fff" br="$2" p="$3">
        <YStack bc="#fff" br="$2" p="$3" />
        <YStack bc="#fff" br="$2" p="$3" />
        <YStack bc="#fff" br="$2" p="$3" />
      </XStack>
    </XStack>
  )
}
