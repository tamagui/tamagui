import React from 'react'
import { XStack, YStack, ZStack } from 'tamagui'

export function StacksDemo() {
  return (
    <XStack als="center" space>
      <YStack flex={1} space="$2" bw={2} borderColor="$color" br="$4" p="$2">
        <YStack bc="$color" br="$3" p="$2" />
        <YStack bc="$color" br="$3" p="$2" />
        <YStack bc="$color" br="$3" p="$2" />
      </YStack>

      <XStack flex={1} space="$2" bw={2} borderColor="$color" br="$4" p="$2">
        <YStack bc="$color" br="$3" p="$2" />
        <YStack bc="$color" br="$3" p="$2" />
        <YStack bc="$color" br="$3" p="$2" />
      </XStack>

      <ZStack mw={50} mh={85} w={100} flex={1}>
        <YStack fullscreen bw={2} br="$4" p="$2" />
        <YStack fullscreen y={10} x={10} bw={2} br="$4" p="$2" />
        <YStack fullscreen y={20} x={20} bw={2} bc="$color" br="$4" p="$2" />
      </ZStack>
    </XStack>
  )
}
