import React from 'react'
import { XStack, YStack, ZStack } from 'tamagui'

export function StacksDemo() {
  return (
    <XStack maxW={250} p="$2" self="center" gap="$2">
      <YStack flex={1} borderWidth={2} borderColor="$color" rounded="$4" gap="$2" p="$2">
        <YStack bg="$color" rounded="$3" p="$2" />
        <YStack bg="$color" rounded="$3" p="$2" />
        <YStack bg="$color" rounded="$3" p="$2" />
      </YStack>

      <XStack flex={1} borderWidth={2} borderColor="$color" rounded="$4" gap="$2" p="$2">
        <YStack bg="$color" rounded="$3" p="$2" />
        <YStack bg="$color" rounded="$3" p="$2" />
        <YStack bg="$color" rounded="$3" p="$2" />
      </XStack>

      <ZStack maxW={50} maxH={85} width={100} flex={1}>
        <YStack fullscreen rounded="$4" p="$2" borderColor="$color" borderWidth={2} />
        <YStack
          borderColor="$color"
          fullscreen
          y={10}
          x={10}
          borderWidth={2}
          rounded="$4"
          p="$2"
        />
        <YStack
          borderColor="$color"
          fullscreen
          y={20}
          x={20}
          borderWidth={2}
          rounded="$4"
          p="$2"
        />
      </ZStack>
    </XStack>
  )
}
